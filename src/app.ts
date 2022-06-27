import express, { Application, Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';

import { userRoute } from './routes/user.routes';
import { fleetRoute } from './routes/fleet.routes';

const app: Application = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api/user', userRoute);
app.use('/api/fleet', fleetRoute);

app.use('/', (req: Request, res: Response, next: NextFunction): void => {
	res.json({ message: 'Route not found.' });
});

export default app;
