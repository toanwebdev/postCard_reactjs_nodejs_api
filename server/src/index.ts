require('dotenv').config()
import 'reflect-metadata'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import { createConnection } from 'typeorm'
import { User } from './entities/User'
import authRoute from './routes/auth'
import userRoute from './routes/user'
import uploadFileRoute from './routes/uploadFile'
import postCardRoute from './routes/postCard'
import { Vote } from './entities/Vote'
import { PostCard } from './entities/PostCard'
import voteRoute from './routes/vote'
import { __prod__ } from './constants'
import path from 'path'

const main = async () => {
	const connection = await createConnection({
		type: 'postgres',
		...(__prod__
			? { url: process.env.DATABASE_URL }
			: {
					database: 'postcard',
					username: process.env.DB_USERNAME,
					password: process.env.DB_PASSWORD,
			  }),

		logging: true,
		...(__prod__
			? {
					extra: {
						ssl: { rejectUnauthorized: false },
					},
					ssl: true,
			  }
			: {}),
		...(__prod__ ? {} : { synchronize: true }),
		entities: [User, PostCard, Vote],
		migrations: [path.join(__dirname, '/migrations/*')],
	})

	if (__prod__) await connection.runMigrations()

	const app = express()

	app.use(
		cors({
			origin: __prod__
				? process.env.CORS_ORIGIN_PROD
				: process.env.CORS_ORIGIN_DEV,
			credentials: true,
		}),
	)
	app.use(cookieParser())
	app.use(express.json())
	app.use(express.urlencoded({ extended: true }))

	// app.set('trust proxy', 1)

	// routes
	app.use('/v1/api/auth', authRoute)
	app.use('/v1/api/user', userRoute)
	app.use('/v1/api/upload-file', uploadFileRoute)
	app.use('/v1/api/post-card', postCardRoute)
	app.use('/v1/api/vote', voteRoute)

	const PORT = process.env.PORT || 4000

	app.listen(PORT, () => {
		console.log(`SERVER STARTING ON http://localhost:${PORT}`)
	})
}

main().catch((error) =>
	console.log('ERROR STARTING SERVER: ', console.error(error)),
)
