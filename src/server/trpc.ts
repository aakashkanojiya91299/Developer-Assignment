import { initTRPC, TRPCError } from '@trpc/server';
import { Context, User } from './context';
import { verifyToken } from '@/utils/jwt';
import { prisma } from '@/lib/prisma';

const t = initTRPC.context<Context>().create();
 
export const router = t.router;
export const publicProcedure = t.procedure;

export const authMiddleware = t.middleware(async ({ ctx, next }) => {
    const token = ctx.req.headers.authorization?.split(' ')[1]; // Bearer token
  
    if (!token) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'No token provided',
      });
    }
  
    try {
      const decoded = verifyToken(token) as unknown as User;
      if(decoded==null){
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Invalid token',
        });
      }
      ctx.user = decoded; 
    } catch (error) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Invalid token',
      });
    }
  
    return next({
      ctx: {
        ...ctx,
        user: ctx.user,
      },
    });
  });
  
export const emailVerificationMiddleware = t.middleware(async ({ ctx, next }) => {
    // Assuming the email is passed via `ctx.user.email` from the auth middleware
    const email = ctx.user?.email;
  
    if (!email) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Email is missing',
      });
    }
  
    // Check if the user's email is verified
    const user = await prisma.user.findUnique({
      where: { email },
    });
  
    if (!user) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'User not found',
      });
    }
  
    if (!user.verified) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Email not verified',
      });
    }
  
    return next();
  });

