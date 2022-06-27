import { Router, Request, Response } from 'express';
import prisma from '../../lib/prisma';
const fleetRoute = Router();

// ******************
// Get All Vehicles *
// ******************
fleetRoute.get('/', async (req: Request, res: Response): Promise<void> => {
	try {
		const cars = await prisma.vehicle.findMany();

		res.status(200).send(cars);
	} catch (error) {
		res.status(500).send({ message: error });
	}
});

// **********************
// Create a New Vehicle *
// **********************
fleetRoute.post('/', async (req: Request, res: Response): Promise<void> => {
	try {
		const newVehicle = await prisma.vehicle.create({
			data: {
				...req.body,
			},
		});

		res.status(201).json(newVehicle);
	} catch (error) {
		res.status(500).send({ message: error });
	}
});

// *********************
// Get a Vehicle by Id *
// *********************
fleetRoute.get('/:id', async (req: Request, res: Response): Promise<void> => {
	try {
		const vehicle = await prisma.vehicle.findUnique({
			where: {
				id: req.params.id,
			},
		});

		res.status(200).json(vehicle);
	} catch (error) {
		res.status(500).send({ message: error });
	}
});

// ******************
// Modify a Vehicle *
// ******************
fleetRoute.put('/:id', async (req: Request, res: Response): Promise<void> => {
	try {
		const vehicle = await prisma.vehicle.update({
			data: {
				mileage: req.body.mileage,
			},
			where: {
				id: req.params.id,
			},
		});

		res.status(201).json(vehicle);
	} catch (error) {
		res.status(500).send({ message: error });
	}
});

// ******************
// Delete a Vehicle *
// ******************
fleetRoute.delete('/:id', async (req: Request, res: Response): Promise<void> => {
	try {
		const deletedVehicle = await prisma.vehicle.delete({
			where: {
				id: req.params.id,
			},
		});

		res.status(200).json(deletedVehicle);
	} catch (error) {
		res.status(500).send({ message: error });
	}
});

export { fleetRoute };