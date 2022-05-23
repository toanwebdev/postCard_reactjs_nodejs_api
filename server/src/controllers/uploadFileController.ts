import { Request, Response } from 'express'

const uploadFileController = {
	uploadFile: (req: Request, res: Response) => {
		const files: Express.Multer.File[] = req.files as Express.Multer.File[]

		let uploadNames: string[] = []
		for (let i = 0; i < files.length; i++) {
			uploadNames.push(files[i].filename)
		}

		res.status(200).json(uploadNames)
	},
}

export default uploadFileController
