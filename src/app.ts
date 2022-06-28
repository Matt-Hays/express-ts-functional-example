/**
 * @title RentalReservationSystem
 * @author Matthew Hays mkhays01@gmail.com
 * @brief A Vehicle Rental Reservation System mock design.
 * @created 6/26/2022
 * @modified 6/27/2022
 *
 * This file serves as the entry point for the application.
 */
import express, { Application, Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';

import { userRoute } from './routes/user.routes';
import { fleetRoute } from './routes/fleet.routes';
import { reservationRoute } from './routes/reservation.routes';

const app: Application = express();

// **************************************
// Parse the HTTP Response Body to JSON *
// **************************************
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// ************************
// User Routes Middleware *
// ************************
app.use('/api/user', userRoute);

// *************************
// Fleet Routes Middleware *
// *************************
app.use('/api/fleet', fleetRoute);

// *******************************
// Reservation Routes Middleware *
// *******************************
app.use('/api/reservation', reservationRoute);

// *****************************
// Catch - All (Failure) Route *
// *****************************
app.use('/', (req: Request, res: Response, next: NextFunction): void => {
	res.json({ message: 'Route not found.' });
});

export default app;
