import { Router, Request, Response } from 'express';
import prisma from '../../lib/prisma';
const fleetRoute = Router();

// ******************
// POST new Vehicle *
// ******************
fleetRoute.post('/', async (req: Request, res: Response): Promise<void> => {
	try {
		const newVehicle = await prisma.vehicle.create({
			data: {
				make: req.body.make,
				model: req.body.model,
				mileage: req.body.mileage,
				year: req.body.year,
			},
		});

		res.status(201).json(newVehicle);
	} catch (error) {
		res.status(500).send({ message: error });
	}
});

// ******************
// Get all Vehicles *
// ******************
fleetRoute.get('/', async (req: Request, res: Response): Promise<void> => {
	try {
		const cars = await prisma.vehicle.findMany();

		res.status(200).send(cars);
	} catch (error) {
		res.status(500).send({ message: error });
	}
});

// *****************
// Get one Vehicle *
// *****************
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

// ********************
// UPDATE one Vehicle *
// ********************
fleetRoute.put('/:id', async (req: Request, res: Response): Promise<void> => {
	try {
		const vehicle = await prisma.vehicle.update({
			data: {
				make: req.body.make ? req.body.make : undefined,
				model: req.body.model ? req.body.model : undefined,
				mileage: req.body.mileage ? req.body.mileage : undefined,
				year: req.body.year ? req.body.year : undefined,
			},
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
// Delete a Vehicle *
// ******************
// We want to retain the vehicle record and associated transactions,
// so we will update its active status to false and create a vehicle transfer record.
fleetRoute.delete('/:id', async (req: Request, res: Response): Promise<void> => {
	try {
		// Delete the vehicle
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
