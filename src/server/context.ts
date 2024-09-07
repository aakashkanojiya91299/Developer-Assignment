// src/server/context.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface User {
  userId: number;  
  email?:string;
  iat: number;     
  exp: number;
}

export interface Context {
  req: NextApiRequest;
  res: NextApiResponse;
  prisma: PrismaClient;
  user?: User; 
}

export function createContext({ req, res }: { req: NextApiRequest; res: NextApiResponse }): Context {
  return {
    req,
    res,
    prisma,
  };
}
