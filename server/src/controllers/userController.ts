import { User } from './../entities/User'
import { Request, Response } from 'express'

const userController = {
	getAllUser: async (_req: Request, res: Response) => {
		try {
			const allUser = await User.find()

			return res.status(200).json(allUser)
		} catch (error) {
			return res.status(500).json(error)
		}
	},

	getUserById: async (req: Request, res: Response) => {
		try {
			const { id } = req.params
			const user = await User.findOne({ where: { id: parseInt(id) } })

			return res.status(200).json(user)
		} catch (error) {
			return res.status(500).json(error)
		}
	},

	getUserByUsername: async (req: Request, res: Response) => {
		try {
			const { username } = req.params
			const user = await User.findOne({ where: { username } })
			console.log(user)

			return res.status(200).json(user)
		} catch (error) {
			return res.status(500).json(error)
		}
	},
}

export default userController
