import { Invoice, Insurance, Reservation, Vehicle } from '@prisma/client';
import { Router, Request, Response, request } from 'express';
import { isTypeQueryNode } from 'typescript';
import prisma from '../../lib/prisma';

const reservationRoute = Router();

/**
 * RESERVATION ROUTES
 *
 * Reservation is the creator for invoice and insurance classes
 * Reservation is the information expert for all (1) of its vehicles,
 * all (1) of its invoices and all (1) of its policies (insurance)
 */

// ********************
// POST a Reservation *
// ********************//
reservationRoute.post('/', async (req: Request, res: Response): Promise<void> => {
	const pickup = req.body.startDate;
	const dropoff = req.body.endDate;
	// Insurance variables
	const selected = req.body.insurance?.selected;
	const validStart = req.body.insurance?.validStart;
	const validEnd = req.body.insurance?.validEnd;
	const provider = req.body.insurance?.provider;
	const dmgFee = req.body.invoice?.damageFee;
	const fuelFee = req.body.invoice?.fuelFee;
	const adminFee = req.body.invoice?.administrativeFee;
	const stdRate = req.body.invoice?.standardRate;
	const subtotal = parseFloat(dmgFee) + parseFloat(fuelFee) + parseFloat(adminFee) + parseFloat(stdRate);
	const taxRate = req.body.invoice?.taxRate || 0.0115;
	const total = subtotal * (1 + parseFloat(taxRate));
	try {
		let newReservation: Reservation & { insurance?: Insurance | null; vehicle?: Vehicle; invoice?: Invoice | null };

		if (validStart != null && validEnd != null && provider != null) {
			newReservation = await prisma.reservation.create({
				data: {
					startDate: pickup != null ? pickup : undefined,
					endDate: dropoff != null ? dropoff : undefined,
					user: {
						connect: {
							id: req.body.user.id != null ? req.body.user.id : undefined,
						},
					},
					invoice: {
						create: {
							damageFee: dmgFee != null ? dmgFee : undefined,
							fuelFee: fuelFee != null ? fuelFee : undefined,
							administrativeFee: adminFee != null ? adminFee : undefined,
							standardRate: stdRate != null ? stdRate : undefined,
							subtotal: subtotal != null ? subtotal : undefined,
							taxRate: taxRate != null ? taxRate : undefined,
							total: total != null ? total : undefined,
							payment: req.body.invoice?.payment != null ? req.body.invoice.payment : undefined,
						},
					},
					insurance: {
						create: {
							selected: selected,
							validStart: validStart != null ? validStart : undefined,
							validEnd: validEnd != null ? validEnd : undefined,
							provider: provider != null ? provider : undefined,
						},
					},
					vehicle: {
						connect: {
							id: req.body.vehicle.id != null ? req.body.vehicle.id : undefined,
						},
					},
				},
				include: {
					insurance: true,
					vehicle: true,
					invoice: true,
					user: true,
				},
			});
		} else {
			newReservation = await prisma.reservation.create({
				data: {
					startDate: req.body.startDate != null ? req.body.startDate : undefined,
					endDate: req.body.endDate != null ? req.body.endDate : undefined,
					user: {
						connect: {
							id: req.body.user.id != null ? req.body.user.id : undefined,
						},
					},
					invoice: {
						create: {
							damageFee: dmgFee != null ? dmgFee : undefined,
							fuelFee: fuelFee != null ? fuelFee : undefined,
							administrativeFee: adminFee != null ? adminFee : undefined,
							standardRate: stdRate != null ? stdRate : undefined,
							subtotal: subtotal != null ? subtotal : undefined,
							taxRate: taxRate != null ? taxRate : undefined,
							total: total != null ? total : undefined,
							payment: req.body.invoice?.payment != null ? req.body.invoice.payment : undefined,
						},
					},
					vehicle: {
						connect: {
							id: req.body.vehicle.id != null ? req.body.vehicle.id : undefined,
						},
					},
				},
				include: {
					insurance: true,
					vehicle: true,
					invoice: true,
					user: true,
				},
			});
		}

		res.status(201).json(newReservation);
	} catch (error) {
		res.status(500).send({ message: error });
	}
});

// **********************
// GET all Reservations *
// **********************
reservationRoute.get('/', async (req: Request, res: Response): Promise<void> => {
	try {
		const allReservations = await prisma.reservation.findMany();

		res.status(200).json(allReservations);
	} catch (error) {
		res.status(500).send({ message: error });
	}
});

// ***********************
// GET Reservation by ID *
// ***********************
reservationRoute.get('/:id', async (req: Request, res: Response): Promise<void> => {
	try {
		const reservation = await prisma.reservation.findUnique({
			where: {
				id: req.params.id,
			},
		});

		res.status(200).json(reservation);
	} catch (error) {
		res.status(500).send({ message: error });
	}
});

// **********************
// UPDATE a Reservation *
// **********************
reservationRoute.put('/:id', async (req: Request, res: Response): Promise<void> => {
	const selected = req.body.insurance?.selected;
	const validStart = req.body.insurance?.validStart;
	const validEnd = req.body.insurance?.validEnd;
	const provider = req.body.insurance?.provider;
	const dmgFee = req.body.invoice?.damageFee;
	const fuelFee = req.body.invoice?.fuelFee;
	const adminFee = req.body.invoice?.administrativeFee;
	const stdRate = req.body.invoice?.standardRate;
	const subtotal = parseFloat(dmgFee) + parseFloat(fuelFee) + parseFloat(adminFee) + parseFloat(stdRate);
	const taxRate = 0.0115;
	const total = subtotal * (1 + taxRate);
	try {
		const updatedReservation = await prisma.reservation.update({
			data: {
				startDate: req.body.startDate != null ? req.body.startDate : undefined,
				endDate: req.body.endDate != null ? req.body.endDate : undefined,
				insurance: {
					upsert: {
						update: {
							selected: selected != null ? selected : undefined,
							validEnd: validEnd != null ? validEnd : undefined,
						},
						create: {
							selected: selected != null ? selected : false,
							validStart: validStart != null ? validStart : undefined,
							validEnd: validEnd != null ? validEnd : undefined,
							provider: provider != null ? provider : undefined,
						},
					},
				},
				invoice: {
					upsert: {
						update: {
							damageFee: dmgFee != null ? dmgFee : undefined,
							fuelFee: fuelFee != null ? fuelFee : undefined,
							administrativeFee: adminFee != null ? adminFee : undefined,
							standardRate: stdRate != null ? stdRate : undefined,
							subtotal: subtotal != null ? subtotal : undefined,
							taxRate: taxRate != null ? taxRate : undefined,
							total: total != null ? total : undefined,
							payment: req.body.invoice?.payment != null ? req.body.invoice.payment : undefined,
						},
						create: {
							damageFee: dmgFee != null ? dmgFee : undefined,
							fuelFee: fuelFee != null ? fuelFee : undefined,
							administrativeFee: adminFee != null ? adminFee : undefined,
							standardRate: stdRate != null ? stdRate : undefined,
							subtotal: subtotal != null ? subtotal : undefined,
							taxRate: taxRate != null ? taxRate : undefined,
							total: total != null ? total : undefined,
							payment: req.body.invoice?.payment != null ? req.body.invoice.payment : undefined,
						},
					},
				},
				vehicle: {
					update: {
						mileage: req.body.vehicle?.mileage != null ? req.body.vehicle.mileage : undefined,
					},
				},
			},
			where: {
				id: req.params.id,
			},
			include: {
				insurance: true,
				invoice: true,
				user: true,
				vehicle: true,
			},
		});

		res.status(200).json(updatedReservation);
	} catch (error) {
		res.status(500).send({ message: error });
	}
});

reservationRoute.delete('/:id', async (req: Request, res: Response): Promise<void> => {
	try {
		const deletedReservation = await prisma.reservation.delete({
			where: {
				id: req.params.id,
			},
		});

		res.status(200).json(deletedReservation);
	} catch (error) {
		res.status(500).send({ message: error });
	}
});

export { reservationRoute };
