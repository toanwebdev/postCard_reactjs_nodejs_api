import { UserAuthPayload } from './../types/UserAuthPayload';
import { NextFunction, Response } from 'express'
import { Secret, verify } from 'jsonwebtoken'

export const checkAuth = (req: any, res: Response, next: NextFunction) => {
	try {
		const authHeader = req.headers['Authorization'] as string
		const accessToken = authHeader && authHeader.split(' ')[1]

		if (!accessToken) {
			return res.status(401).json('Không có token')
		}

		const decodedUser = verify(
			accessToken,
			process.env.ACCESS_TOKEN_SECRET as Secret,
		) as UserAuthPayload

		req.user = decodedUser

		return next()
	} catch (error) {
		return res.status(500).json(error)
	}
}
