/*
Run npx prisma studio to mess with the tables.

Need to run ```npx prisma generate``` every time schema is updated.

Creates a PrismaClient instance to be imported to any file that needs to access the database.
*/
import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export default prisma;