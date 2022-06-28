import request from 'supertest';

import app from '../../src/app';
import prisma from '../../lib/prisma';
import { Reservation } from '@prisma/client';

describe('Reservation routes', () => {
	// **********************
	// CREATE a Reservation *
	// **********************
	test('POST a new reservation', async () => {
		// Set up test reservation
		const testReservation = {
			startDate: new Date(2022, 6, 22),
			endDate: new Date(2022, 6, 29),
			account: {
				id: 'fbff890e-fefc-4cc2-b0e2-d6afffa78c1f',
			},
			invoice: {
				standardRate: 34.99,
			},
			vehicle: {
				id: '31891b0d-070d-49d5-bc30-aa27c15efcb0',
			},
		};

		// Send a POST request through the app
		const appResponse = await request(app)
			.post('/api/reservation')
			.set('Content-Type', 'application/json')
			.send(testReservation);

		const newId = appResponse.body.id;

		// Check the db for the new entry using the returned id
		const dbResponse = await prisma.reservation.findUnique({
			where: {
				id: newId,
			},
			include: {
				insurance: true,
				invoice: true,
				account: true,
				vehicle: true,
			},
		});
		const dbResponseJson = JSON.parse(
			JSON.stringify(dbResponse, (key: string, value: any): any =>
				typeof value === 'bigint' ? value.toString() : value
			)
		);

		// Expect a valid server code
		expect(appResponse.statusCode).toEqual(201);

		// Expect the appResponse start and end dates to agree with original data
		expect(appResponse.body.startDate).toEqual(testReservation.startDate.toJSON());
		expect(appResponse.body.endDate).toEqual(testReservation.endDate.toJSON());

		// Expect the dbResponse to equal the original data
		expect(dbResponse?.startDate).toEqual(testReservation.startDate);
		expect(dbResponse?.endDate).toEqual(testReservation.endDate);

		// Expect the app and the db to agree
		expect(appResponse.body).toEqual(dbResponseJson);
	});

	// ***********************
	// READ All Reservations *
	// ***********************
	test('GET all reservations', async () => {
		// Send a get all request through the application
		const appResponse = await request(app).get('/api/reservation');

		// Get the db response
		const dbResponse = await prisma.reservation.findMany();
		const dbResponseJson = JSON.parse(
			JSON.stringify(dbResponse, (key: string, value: any): any =>
				typeof value === 'bigint' ? value.toString() : value
			)
		);

		// Expect a valid success code
		expect(appResponse.statusCode).toEqual(200);

		// Expect the app and the db to agree
		expect(appResponse.body).toEqual(dbResponseJson);
	});

	// ************************
	// READ Reservation by Id *
	// ************************
	test('GET reservation by id', async () => {
		const randReservation: Reservation | null = await prisma.reservation.findFirst();
		const testReservationId = randReservation?.id;

		// Send GET request through the app
		const appResponse = await request(app).get(`/api/reservation/${testReservationId}`);

		// Get db response
		const dbResponse = await prisma.reservation.findUnique({
			where: {
				id: testReservationId,
			},
		});
		const dbResponseJson = JSON.parse(JSON.stringify(dbResponse));

		// Expect a valid success code
		expect(appResponse.statusCode).toEqual(200);

		// Expect the app and db agree
		expect(appResponse.body).toEqual(dbResponseJson);

		// Expect the app result to contain the original user id
		expect(appResponse.body.id).toEqual(testReservationId);
	});

	// **********************
	// UPDATE a Reservation *
	// **********************
	test('PUT a reservation', async () => {
		const newDate = new Date(2022, 8, 11);
		const randReservation: Reservation | null = await prisma.reservation.findFirst();
		const testReservationId = randReservation!.id;

		// Test modification
		const mod = {
			endDate: newDate,
		};
		// Send a PUT request through the app
		const appResponse = await request(app)
			.put(`/api/reservation/${testReservationId}`)
			.set('Content-Type', 'application/json')
			.send(mod);

		// Get the db response
		const dbResponse = await prisma.reservation.findUnique({
			where: {
				id: testReservationId,
			},
			include: {
				insurance: true,
				invoice: true,
				account: true,
				vehicle: true,
			},
		});
		const dbResponseJson = JSON.parse(JSON.stringify(dbResponse));

		// Expect a valid success status code
		expect(appResponse.statusCode).toEqual(200);

		// Expect the app response to agree with the original modification
		expect(appResponse.body.endDate).toEqual(newDate.toJSON());

		// Expect the db response o agree with the original modification
		expect(dbResponse?.endDate).toEqual(newDate);

		// Expect the app to agree with the db
		expect(appResponse.body).toEqual(dbResponseJson);
	});

	// **********************
	// DELETE a Reservation *
	// **********************
	test('DELETE a reservation', async () => {
		const randReservation: Reservation | null = await prisma.reservation.findFirst();
		const testReservationId = randReservation?.id;
		// Get reservation before deletion
		const dbBefore = await prisma.reservation.findUnique({
			where: {
				id: testReservationId!,
			},
		});
		const dbBeforeJson = JSON.parse(
			JSON.stringify(dbBefore, (key: string, value: any): any => (typeof value === 'bigint' ? value.toString() : value))
		);
		const vehicleId = dbBeforeJson.vehicleId;
		const accountId = dbBeforeJson.accountId;
		const invoiceId = dbBeforeJson.invoiceId;

		// Send DELETE request through the app
		const appResponse = await request(app).del(`/api/reservation/${testReservationId}`);

		// Check reservation deletion occurred
		const dbAfter = await prisma.reservation.findUnique({
			where: {
				id: testReservationId,
			},
		});

		// Check invoice deletion cascaded
		const dbInvoiceAfter = await prisma.invoice.findUnique({
			where: {
				id: invoiceId,
			},
		});

		// Check vehicle remains valid
		const dbVehcileAfter = await prisma.vehicle.findUnique({
			where: {
				id: vehicleId,
			},
			include: {
				reservations: true,
			},
		});

		// Check user remains valid after
		const dbAccountAfter = await prisma.account.findUnique({
			where: {
				id: accountId,
			},
			include: {
				user: true,
				reservation: true,
			},
		});

		// Expect a valid status code
		expect(appResponse.statusCode).toEqual(200);

		// Expect the app response to match the before deletion db record
		expect(appResponse.body).toEqual(dbBeforeJson);

		// Expect the db response after deletion to be empty
		expect(dbAfter).toBeNull;

		// Expect the associated invoice to be deleted
		expect(dbInvoiceAfter).toBeNull;

		// Expect user to exist after deletion
		expect(dbAccountAfter).not.toBeNull;

		// Expect vehicle to exist after deletion
		expect(dbVehcileAfter).not.toBeNull;
	});
});
