import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const userRoutes = Router();
const prisma = new PrismaClient();

// Users / Authentication Routes

// Return a user from the database
userRoutes.get('/api/user/:id', async (req: Request, res: Response): Promise<void> => {
	const user = prisma.user.findUnique({
		where: {
			id: req.params.id,
		},
	});
	res.status(200).send(user);
});

export { userRoutes };
