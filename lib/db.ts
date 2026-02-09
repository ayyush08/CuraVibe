//To avoid multiple instances of Prisma Client 
import { PrismaClient } from '@prisma/client';
// import { PrismaClient } from './generated/prisma/client';

const globalFormPrisma = globalThis as unknown as {
    prisma: PrismaClient
}

export const db = globalFormPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalFormPrisma.prisma = db;