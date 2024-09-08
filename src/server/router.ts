import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { router, publicProcedure, authMiddleware, emailVerificationMiddleware } from './trpc';
import { prisma } from '../lib/prisma';
import bcrypt from 'bcrypt';
import { generateToken } from '@/utils/jwt';
import { sendVerificationEmail } from '@/utils/mailer';
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 600 }); //10 min 

interface QueryParams {
  page?: string;
  limit?: string;
}

// Static verification code
const verificationCode = 12345678;

export const appRouter = router({

  register: publicProcedure
    .input(z.object({
      email: z.string().email(),
      name: z.string(),
      password: z.string().min(8),
    }))
    .mutation(async ({ input }) => {
      const { email, password, name } = input;
      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });
      if (existingUser) {
        throw new TRPCError({ code: 'CONFLICT', message: 'User already exists' });
      }
      // Hash password and create user
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: { email, password: hashedPassword, name },
      });
      const token = generateToken({ userId: user.id }, '10m');

      cache.set(`verification_code_${email}`, verificationCode);
      // Send email after user creation with the verification code
      sendVerificationEmail(email, verificationCode);

      return { success: true, message: 'User registered successfully. Verification code sent.', token };
    }),

  login: publicProcedure
    .input(z.object({
      email: z.string().email(),
      password: z.string(),
    }))
    .mutation(async ({ input }) => {
      const { email, password } = input;
      const user = await prisma.user.findUnique({
        where: { email },
      });
      if (!user) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Invalid credentials' });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid credentials' });
      }
      const token = generateToken({ userId: user.id, email }, '1d');

      return { success: true, message: 'Login successful', token };
    }),

  validateEmail: publicProcedure
    .use(authMiddleware)
    .input(z.object({
      email: z.string().email(),
      code: z.number().min(8)
    }))
    .mutation(async ({ input }) => {
      const { email, code } = input;
      // Check if user exists and update verified status
      const cachedCode = cache.get(`verification_code_${email}`);
      if (!cachedCode) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Verification code expired or not found' });
      }

      // Compare the provided code with the cached code
      if (cachedCode != code) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid verification code' });
      }
      const user = await prisma.user.update({
        where: { email },
        data: { verified: true },
      });

      if (!user) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });
      }
      const token = generateToken({ userId: user.id, email }, '1d');
      return { success: true, message: 'Email validated successfully', token };
    }),

  getCategories: publicProcedure
    .use(authMiddleware)
    .use(emailVerificationMiddleware)
    .input(String)  // Input remains string
    .query(async (opts) => {
      const queryParams: QueryParams = opts.ctx.req.query;

      const page = parseInt(queryParams.page ?? '1', 10);  // Default to 1 if not provided or invalid
      let limit = parseInt(queryParams.limit ?? '6', 10);  // Default to 6 if not provided or invalid

      // Ensure limit is at least 6
      if (limit < 6) {
        limit = 6;
      }

      // Calculate offset
      const offset = (page - 1) * limit;

      // Fetch paginated categories
      const [categories, totalCount] = await Promise.all([
        prisma.category.findMany({
          skip: offset,
          take: limit,
        }),
        prisma.category.count(), // Count total categories for pagination info
      ]);

      // Return categories and pagination info
      return {
        success: true,
        message: 'Categories fetched successfully',
        categories,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalCount / limit),
          totalCount,
        },
      };
    }),
    
  updateSelectedCategories: publicProcedure
    .use(authMiddleware)
    .use(emailVerificationMiddleware)
    .input(z.object({
      categoryIds: z.array(z.number().min(1)), // Array of category IDs
    }))
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.user?.userId;

      if (!userId) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User ID not found' });
      }
      // Delete existing user-category relations
      await prisma.userCategory.deleteMany({
        where: { userId },
      });

      // Create new user-category relations
      const userCategories = input.categoryIds.map(categoryId => ({
        userId,
        categoryId,
      }));

      await prisma.userCategory.createMany({
        data: userCategories,
      });

      return {
        success: true,
        message: 'Selected categories updated successfully',
      };
    })


});

export type AppRouter = typeof appRouter;
