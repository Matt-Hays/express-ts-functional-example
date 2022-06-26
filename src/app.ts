import express, { Application, Request, Response, NextFunction } from 'express';

import { userRoutes } from './routes/user.routes';
import { vehicleRoutes } from './routes/vehicle.routes';

const app: Application = express();

app.use('/users', userRoutes);
app.use('/vehicles', vehicleRoutes);

app.use('/', (req: Request, res: Response, next: NextFunction): void => {
	res.json({ message: 'Hello! Catch-all route.' });
});

export default app;
