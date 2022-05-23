import { Vote } from './../entities/Vote'
import { Request, Response } from 'express'

const voteController = {
	getVote: async (req: Request, res: Response) => {
		try {
			const { userId, postCardId } = req.params
			const vote = await Vote.findOne({
				where: [
					{
						userId: parseInt(userId),
					},
					{ postCardId: parseInt(postCardId) },
				],
			})

			return res.status(200).json(vote)
		} catch (error) {
			return res.status(500).json(error)
		}
	},

	addVote: async (req: Request, res: Response) => {
		try {
			const vote = Vote.create({
				...req.body,
			})

			const newVote = await vote.save()

			return res.status(200).json(newVote)
		} catch (error) {
			return res.status(500).json(error)
		}
	},

	delVote: async (req: Request, res: Response) => {
		try {
			const { userId, postCardId } = req.params

			const vote = await Vote.find({
				where: [
					{ userId: parseInt(userId) },
					{ postCardId: parseInt(postCardId) },
				],
			})

			if (!vote) {
				return res.status(404).json('not found')
			}

			await Vote.delete({
				userId: parseInt(userId),
				postCardId: parseInt(postCardId),
			})

			return res.status(200).json('success')
		} catch (error) {
			return res.status(500).json(error)
		}
	},
}

export default voteController
