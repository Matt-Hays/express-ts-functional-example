import { PrismaClient } from '@prisma/client';

// Global variable for hosting a singleton PrismaClient during development.
declare global {
	var prisma: PrismaClient;
}

export {};
