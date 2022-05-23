import { PostCard } from './../entities/PostCard'
import { Request, Response } from 'express'

const postCardController = {
	getCount: async (req: Request, res: Response) => {
		try {
			const { userId } = req.params
			let count: number

			if (parseInt(userId) !== -1) {
				count = await PostCard.count({
					where: { userId: parseInt(userId) },
				})
			} else {
				count = await PostCard.count()
			}

			return res.status(200).json(count)
		} catch (error) {
			return res.status(500).json(error)
		}
	},

	getPostCardByPagination: async (req: Request, res: Response) => {
		try {
			const { page, limit } = req.params
			const postCards = await PostCard.find({
				order: {
					createdAt: 'desc',
				},
				skip: (parseInt(page) - 1) * parseInt(limit),
				take: parseInt(limit),
				relations: {
					votes: true,
				},
			})

			let newPostCards = []

			for (let i = 0; i < postCards.length; i++) {
				const { votes, ...others } = postCards[i]
				let like = 0,
					dislike = 0
				for (let j = 0; j < votes.length; j++) {
					if (votes[j].value === -1) {
						dislike++
					} else {
						like++
					}
				}
				newPostCards.push({ ...others, like, dislike })
			}

			return res.status(200).json(newPostCards)
		} catch (error) {
			return res.status(500).json(error)
		}
	},

	getPostCardByIdByPagination: async (req: Request, res: Response) => {
		try {
			const { userId, page, limit } = req.params
			const postCards = await PostCard.find({
				where: { userId: parseInt(userId) },
				order: {
					createdAt: 'desc',
				},
				skip: (parseInt(page) - 1) * parseInt(limit),
				take: parseInt(limit),
				relations: {
					votes: true,
				},
			})

			let newPostCards = []

			for (let i = 0; i < postCards.length; i++) {
				const { votes, ...others } = postCards[i]
				let like = 0,
					dislike = 0
				for (let j = 0; j < votes.length; j++) {
					if (votes[j].value === -1) {
						dislike++
					} else {
						like++
					}
				}
				newPostCards.push({ ...others, like, dislike })
			}

			return res.status(200).json(newPostCards)
		} catch (error) {
			return res.status(500).json(error)
		}
	},

	updatePostCard: async (req: Request, res: Response) => {
		try {
			const { id, image, content, userId } = req.body

			if (!image || !content || !userId) {
				return res.status(404).json('Không thể để trống')
			}

			let newPostCard
			if (!id) {
				const postCard = PostCard.create({
					...req.body,
				})

				newPostCard = await postCard.save()
			} else {
				const postCard = await PostCard.findOne({
					where: { id: parseInt(id as string) },
				})

				if (!postCard) {
					return res.status(404).json('Không tồn tại')
				}

				await PostCard.update(id, { ...req.body })

				newPostCard = { ...req.body }
			}

			return res.status(200).json(newPostCard)
		} catch (error) {
			return res.status(500).json(error)
		}
	},

	delPostCard: async (req: Request, res: Response) => {
		try {
			const { id } = req.params

			const postCard = await PostCard.findOne({
				where: { id: parseInt(id as string) },
			})

			if (!postCard) {
				return res.status(404).json('Không tồn tại')
			}

			await PostCard.delete(id)

			return res.status(200).json(postCard)
		} catch (error) {
			return res.status(500).json(error)
		}
	},
}

export default postCardController
