import { Router, Request, Response } from 'express';
import prisma from '../../lib/prisma';

const userRoute = Router();

// ***************
// POST new User *
// ***************
userRoute.post('/', async (req: Request, res: Response): Promise<void> => {
	try {
		// Create the new user
		const newUser = await prisma.user.create({
			data: {
				email: req.body.email != null ? req.body.email : undefined,
				password: req.body.password != null ? req.body.password : undefined,
				type: req.body.type != null ? req.body.type : undefined,
				profile: {
					create: {
						firstName: req.body.profile.firstName != null ? req.body.profile.firstName : undefined,
						lastName: req.body.profile.lastName != null ? req.body.profile.lastName : undefined,
						addressLine1: req.body.profile.addressLine1 != null ? req.body.profile.addressLine1 : undefined,
						addressLine2: req.body.profile.addressLine2 != null ? req.body.profile.addressLine2 : undefined,
						city: req.body.profile.city != null ? req.body.profile.city : undefined,
						state: req.body.profile.state != null ? req.body.profile.state : undefined,
						zip: req.body.profile.zip != null ? req.body.profile.zip : undefined,
					},
				},
			},
			include: {
				profile: true,
			},
		});

		res.status(201).json(newUser);
	} catch (error) {
		res.status(500).send({ message: error });
	}
});

// ***************
// GET all Users *
// ***************

userRoute.get('/', async (req: Request, res: Response): Promise<void> => {
	try {
		const allUsers = await prisma.user.findMany();

		res.status(200).json(allUsers);
	} catch (error) {
		res.status(500).send({ message: error });
	}
});

// **************
// GET one User *
// **************
userRoute.get('/:id', async (req: Request, res: Response): Promise<void> => {
	try {
		const user = await prisma.user.findUnique({
			where: {
				id: req.params.id,
			},
		});

		res.status(200).json(user);
	} catch (error) {
		res.status(500).send({ message: error });
	}
});

// *****************
// UPDATE one User *
// *****************
userRoute.put('/:id', async (req: Request, res: Response): Promise<void> => {
	try {
		const updatedUser = await prisma.user.update({
			data: {
				email: req.body.email != null ? req.body.email : undefined,
				password: req.body.password != null ? req.body.password : undefined,
				type: req.body.type != null ? req.body.type : undefined,
				profile: {
					update: {
						firstName: req.body.profile?.firstName != null ? req.body.profile.firstName : undefined,
						lastName: req.body.profile?.lastName != null ? req.body.profile.lastName : undefined,
						addressLine1: req.body.profile?.addressLine1 != null ? req.body.profile.addressLine1 : undefined,
						addressLine2: req.body.profile?.addressLine2 != null ? req.body.profile.addressLine2 : undefined,
						city: req.body.profile?.city != null ? req.body.profile.city : undefined,
						state: req.body.profile?.state != null ? req.body.profile.state : undefined,
						zip: req.body.profile?.zip != null ? req.body.profile.zip : undefined,
					},
				},
			},
			where: {
				id: req.params.id,
			},
			include: {
				profile: true,
			},
		});

		res.status(201).json(updatedUser);
	} catch (error) {
		console.log(error);
		res.status(500).send({ message: error });
	}
});

// ***************
// DELETE a User *
// ***************
// Don't allow deletion of a user

export { userRoute };
