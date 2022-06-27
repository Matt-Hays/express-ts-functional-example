import request from 'supertest';
import app from '../../src/app';
import prisma from '../../lib/prisma';

// *******************
// Fleet Route Tests *
// *******************
describe('Fleet routes', () => {
	const vehicleId = '8ded03dd-9e66-4c9b-9586-a729902ec24e';
	// ********************
	// Create new Vehicle *
	// ********************
	test('Create a new vehicle', async () => {
		const testVehicle = {
			make: 'Toyota',
			model: 'Corolla',
			mileage: 144567,
			year: new Date(2012, 4, 18),
		};

		// Send a POST request through the application.
		const appResponse = await request(app).post('/api/fleet').set('Content-Type', 'application/json').send(testVehicle);

		// Check for the new entry in the database
		const dbResponse = await prisma.vehicle.findUnique({
			where: {
				id: appResponse.body.id,
			},
		});
		// We need a custom stringify to handle bigint cases within prisma
		const dbResponseJson = JSON.parse(
			JSON.stringify(dbResponse, (key: string, value: any): any =>
				typeof value == 'bigint' ? value.toString() : value
			)
		);

		// Expect a valid response code
		expect(appResponse.statusCode).toEqual(201);

		// Expect the app and original data to agree
		expect(appResponse.body.make).toEqual(testVehicle.make);
		expect(appResponse.body.model).toEqual(testVehicle.model);
		expect(appResponse.body.mileage).toEqual(testVehicle.mileage);
		expect(appResponse.body.year).toEqual(testVehicle.year.toJSON());

		// Expect the db and original data to agree
		expect(dbResponse?.make).toEqual(testVehicle.make);
		expect(dbResponse?.model).toEqual(testVehicle.model);
		expect(dbResponse?.mileage).toEqual(testVehicle.mileage);
		expect(dbResponse?.year).toEqual(testVehicle.year);

		// Expect that the application and the database to agree
		expect(appResponse.body).toEqual(dbResponseJson);
	});

	// *******************
	// Read all Vehicles *
	// *******************
	test('Get all vehicles', async () => {
		// Send a GET request through the application
		const appResponse = await request(app).get('/api/fleet');

		// Request all vehicle entries from the database.
		const dbResponse = await prisma.vehicle.findMany();
		// We need a custom stringify to handle bigint cases within prisma
		const dbResponseJson = JSON.parse(
			JSON.stringify(dbResponse, (key: string, value: any): any =>
				typeof value == 'bigint' ? value.toString() : value
			)
		);

		// Expect a valid success status code
		expect(appResponse.statusCode).toEqual(200);

		// Expect the application and database agree
		expect(appResponse.body).toEqual(dbResponseJson);
	});

	// ******************
	// Read One Vehicle *
	// ******************
	test('Get a vehicle by id', async () => {
		// Test case vehicle

		// Send a GET request through the application.
		const appResponse = await request(app).get(`/api/fleet/${vehicleId}`);

		// Get the database record for the tested vehicle
		const dbResponse = await prisma.vehicle.findUnique({
			where: {
				id: vehicleId,
			},
		});
		// We need a custom stringify to handle bigint cases within prisma
		const dbResponseJson = JSON.parse(
			JSON.stringify(dbResponse, (key: string, value: any): any =>
				typeof value == 'bigint' ? value.toString() : value
			)
		);

		// Expect valid success status code
		expect(appResponse.statusCode).toEqual(200);

		// Expect the db and app agree
		expect(appResponse.body).toEqual(dbResponseJson);
	});

	// ********************
	// Update One Vehicle *
	// ********************
	test('Update a vehcile by id', async () => {
		// Test case vehicle

		// The modification
		const inputMileage = 65000;

		// Send the PUT request through the application.
		const appResponse = await request(app).put(`/api/fleet/${vehicleId}`).set('Content-Type', 'application/json').send({
			mileage: inputMileage,
		});

		// Check the database for the record.
		const dbResponse = await prisma.vehicle.findUnique({
			where: {
				id: vehicleId,
			},
		});

		// Expect a successful status code.
		expect(appResponse.statusCode).toEqual(200);

		// Expect that the database and application agree on the modification.
		expect(appResponse.body.mileage).toEqual(dbResponse?.mileage);

		// Expect that the application's response agrees with the original input.
		expect(appResponse.body.mileage).toEqual(inputMileage);

		// Expect that the database record agrees with the original input.
		expect(dbResponse?.mileage).toEqual(inputMileage);
	});

	// ********************
	// Delete One Vehicle *
	// ********************
	test('Delete a vehicle by id', async () => {
		// Get a copy of the db record before deletion
		const dbResponseBefore = await prisma.vehicle.findUnique({
			where: {
				id: vehicleId,
			},
		});
		// We need a custom stringify to handle bigint cases within prisma
		const dbResponseBeforeJson = JSON.parse(
			JSON.stringify(dbResponseBefore, (key: string, value: any): any =>
				typeof value == 'bigint' ? value.toString() : value
			)
		);

		// Send DELETE request through the application.
		const appResponse = await request(app).del(`/api/fleet/${vehicleId}`);

		// Get the db record after deletetion
		const dbResponseAfter = await prisma.vehicle.findUnique({
			where: {
				id: vehicleId,
			},
		});

		// Expect that a valid success code has been received
		expect(appResponse.statusCode).toEqual(200);

		// Expect the app and pre-deletion db records agree
		expect(appResponse.body).toEqual(dbResponseBeforeJson);

		// Expect the db record is empty after deletion
		expect(dbResponseAfter).toEqual(null);
	});
});
