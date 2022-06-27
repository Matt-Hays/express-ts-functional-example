import express, { Application, Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';

import { userRoutes } from './routes/user.routes';
import { vehiclesRoutes } from './routes/vehicle.routes';

const app: Application = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api/users', userRoutes);
app.use('/api/vehicles', vehiclesRoutes);

app.use('/', (req: Request, res: Response, next: NextFunction): void => {
	res.json({ message: 'Hello! Catch-all route.' });
});

export default app;
