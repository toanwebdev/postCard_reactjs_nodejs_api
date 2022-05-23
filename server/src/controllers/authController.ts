import { User } from './../entities/User'
import { UserAuthPayload } from './../types/UserAuthPayload'
import { createToken, sendRefreshToken } from './../utils/auth'
import { Request, Response } from 'express'
import argon2 from 'argon2'
import { Secret, verify } from 'jsonwebtoken'

const authController = {
	registerUser: async (req: Request, res: Response) => {
		try {
			const { username, password } = req.body
			const existingUser = await User.findOne({ where: { username } })

			if (existingUser) {
				return res.status(400).json('Tài khoản đã tồn tại')
			}

			const hashedPassword = await argon2.hash(password)

			const newUser = User.create({
				...req.body,
				password: hashedPassword,
			})

			await newUser.save()

			const { password: _, ...others } = newUser
			const accessToken = createToken('accessToken', newUser)
			sendRefreshToken(res, newUser)

			return res.status(200).json({ user: others, accessToken })
		} catch (error) {
			return res.status(500).json(error)
		}
	},

	loginUser: async (req: Request, res: Response) => {
		try {
			const { username, password } = req.body
			const existingUser = await User.findOne({ where: { username } })

			if (!existingUser) {
				return res.status(400).json('Tài khoản sai')
			}

			const isPasswordsValid = await argon2.verify(
				existingUser.password,
				password,
			)

			if (!isPasswordsValid) {
				return res.status(400).json('Mật khẩu sai')
			}

			const { password: _, ...others } = existingUser
			const accessToken = createToken('accessToken', existingUser)
			sendRefreshToken(res, existingUser)

			return res.status(200).json({ user: others, accessToken })
		} catch (error) {
			return res.status(500).json(error)
		}
	},
	logoutUser: async (req: Request, res: Response) => {
		try {
			const existingUser = await User.findOne({
				where: { id: parseInt(req.params.id) },
			})

			if (!existingUser) {
				return res.status(400).json('Tài khoản không tài tại')
			}

			existingUser.tokenVersion += 1
			existingUser.save()

			res.clearCookie(process.env.REFRESH_TOKEN_COOKIE_NAME as string, {
				httpOnly: true,
				secure: true,
				sameSite: 'lax',
				path: '/v1/api/auth/refresh_token',
			})

			return res.status(200).json('success')
		} catch (error) {
			return res.status(500).json(error)
		}
	},
	refreshToken: async (req: Request, res: Response) => {
		const refreshToken =
			req.cookies[process.env.REFRESH_TOKEN_COOKIE_NAME as string]

		if (!refreshToken) {
			return res.status(401).json('Không có token')
		}

		try {
			const decodedUser = verify(
				refreshToken,
				process.env.REFRESH_TOKEN_SECRET as Secret,
			) as UserAuthPayload

			const existingUser = await User.findOne({
				where: { id: decodedUser.userId },
			})

			if (!existingUser) {
				return res.status(403).json('Token không hợp lệ')
			}

			const accessToken = createToken('accessToken', existingUser)
			sendRefreshToken(res, existingUser)

			return res.status(200).json({ accessToken })
		} catch (error) {
			return res.status(500).json(error)
		}
	},
}

export default authController
