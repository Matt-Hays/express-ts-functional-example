import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const vehicleRoutes = Router();
const prisma = new PrismaClient();

vehicleRoutes.get('/', async (req: Request, res: Response): Promise<void> => {
	const cars = await prisma.car.findMany();
	res.status(200).send(cars);
});

export { vehicleRoutes };
