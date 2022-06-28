import { Router, Request, Response } from 'express';
import { User } from '@prisma/client';
import prisma from '../../lib/prisma';

const userRoute = Router();

// User type w/o password
type Partial<User> = {
	[password in keyof User]?: User[password];
};

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
				account: {
					create: {
						type: req.body.account?.type != null ? req.body.account.type : undefined,
						firstName: req.body.account?.firstName != null ? req.body.account.firstName : undefined,
						lastName: req.body.account?.lastName != null ? req.body.account.lastName : undefined,
						addressLine1: req.body.account?.addressLine1 != null ? req.body.account.addressLine1 : undefined,
						addressLine2: req.body.account?.addressLine2 != null ? req.body.account.addressLine2 : undefined,
						city: req.body.account?.city != null ? req.body.account.city : undefined,
						state: req.body.account?.state != null ? req.body.account.state : undefined,
						zip: req.body.account?.zip != null ? req.body.account.zip : undefined,
					},
				},
			},
			include: {
				account: true,
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
		const allUsers: Partial<User>[] = await prisma.user.findMany();
		allUsers.forEach((user) => delete user.password);
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
				account: {
					update: {
						type: req.body.type != null ? req.body.type : undefined,
						firstName: req.body.account?.firstName != null ? req.body.account.firstName : undefined,
						lastName: req.body.account?.lastName != null ? req.body.account.lastName : undefined,
						addressLine1: req.body.account?.addressLine1 != null ? req.body.account.addressLine1 : undefined,
						addressLine2: req.body.account?.addressLine2 != null ? req.body.account.addressLine2 : undefined,
						city: req.body.account?.city != null ? req.body.account.city : undefined,
						state: req.body.account?.state != null ? req.body.account.state : undefined,
						zip: req.body.account?.zip != null ? req.body.account.zip : undefined,
					},
				},
			},
			where: {
				id: req.params.id,
			},
			include: {
				account: true,
			},
		});

		res.status(201).json(updatedUser);
	} catch (error) {
		res.status(500).send({ message: error });
	}
});

// ***************
// DELETE a User *
// ***************
userRoute.delete('/:id', async (req: Request, res: Response): Promise<void> => {
	try {
		// Delete user
		const deletedUser = await prisma.user.delete({
			where: {
				id: req.params.id,
			},
		});

		res.status(200).json(deletedUser);
	} catch (error) {
		res.status(500).send({ message: error });
	}
});

export { userRoute };
