import request from 'supertest';
import app from '../../src/app';
import { PrismaClient } from '@prisma/client';

// Test GET ALL VEHICLES route
describe('Vehicle routes', () => {
	// Get a reusable db client
	let prisma: PrismaClient;
	beforeAll(() => {
		prisma = new PrismaClient();
	});

	// ************
	// Create One *
	// ************
	test('Create a new vehicle', async () => {
		const testVehicle = {
			make: 'Toyota',
			model: 'Corolla',
			mileage: 144567,
			year: new Date(2012, 4, 18),
		};

		// Send a POST request through the application.
		const appResponse = await request(app)
			.post('/api/vehicles')
			.set('Content-Type', 'application/json')
			.send(testVehicle);

		// Check for the new entry in the database
		const dbResponse = await prisma.vehicle.findUnique({
			where: {
				id: appResponse.body.id,
			},
		});

		// Expect a valid response code
		expect(appResponse.statusCode).toEqual(201);

		// Expect that the application and the database respond with the same data
		expect(appResponse.body).toEqual(JSON.parse(JSON.stringify(dbResponse)));
	});

	// **********
	// Read ALL *
	// **********
	test('Get all vehicles', async () => {
		// Send a GET all request through the application
		const applicationResponse = await request(app).get('/api/vehicles');

		// Request all vehicle entries from the database.
		const databaseResponse = await prisma.vehicle.findMany();

		// Expect that the response from the application is the same as the response from the database
		expect(applicationResponse.body).toEqual(JSON.parse(JSON.stringify(databaseResponse)));
	});

	// **********
	// Read One *
	// **********
	test('Get a vehicle by id', async () => {
		// Create a test case vehicle
		const testVehcileId = '567ade16-155d-48db-9bb4-7b3be408baa9';

		// Send a GET request through the application.
		const applicationResponse = await request(app).get(`/api/vehicles/${testVehcileId}`);

		// Obtain the database record matching the id predicate
		const databaseResponse = await prisma.vehicle.findUnique({
			where: {
				id: testVehcileId,
			},
		});

		// Expect the response from the application matches the response from the database.
		expect(applicationResponse.body).toEqual(JSON.parse(JSON.stringify(databaseResponse)));
	});

	// ************
	// Update One *
	// ************
	test('Update a vehcile by id', async () => {
		// Create a test case vehicle
		const testVehicleId = '567ade16-155d-48db-9bb4-7b3be408baa9';

		// The modification we will perform
		const inputMileage = 65000;

		// Send the PUT request through the application.
		const appResponse = await request(app)
			.put(`/api/vehicles/${testVehicleId}`)
			.set('Content-Type', 'application/json')
			.send({
				mileage: inputMileage,
			});

		// Check the database for the record.
		const dbResponse = await prisma.vehicle.findUnique({
			where: {
				id: testVehicleId,
			},
		});

		// Expect a successful status code.
		expect(appResponse.statusCode).toEqual(201);

		// Expect that the database and application agree.
		expect(appResponse.body.mileage).toEqual(dbResponse?.mileage);

		// Expect that the application's response agrees with the original input.
		expect(appResponse.body.mileage).toEqual(inputMileage);

		// Expect that the database record agrees with the original input.
		expect(dbResponse?.mileage).toEqual(inputMileage);
	});

	// ************
	// Delete One *
	// ************
	test('Delete a vehicle by id', async () => {
		const vehicleId = 'ab8a241b-99e5-4740-95bf-c3803427f02d';

		// Database record before deletion
		const dbResponseBefore = await prisma.vehicle.findUnique({
			where: {
				id: vehicleId,
			},
		});

		// Send DEL request through the application.
		const appResponse = await request(app).del(`/api/vehicles/${vehicleId}`);

		// Database record after deletion
		const dbResponseAfter = await prisma.vehicle.findUnique({
			where: {
				id: vehicleId,
			},
		});

		// Expect that a valid success code has been received
		expect(appResponse.statusCode).toEqual(200);

		// Expect that the application response matches the database record from before the deletion.
		expect(appResponse.body).toEqual(JSON.parse(JSON.stringify(dbResponseBefore)));

		// Expect that the dbResponse after deletion is an empty record.
		expect(dbResponseAfter).toEqual(null);
	});
});