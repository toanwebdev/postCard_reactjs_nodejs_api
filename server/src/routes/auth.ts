import express from 'express'
import authController from '../controllers/authController'

const router = express.Router()

router.post('/register', authController.registerUser)
router.post('/login', authController.loginUser)
router.get('/logout/:id', authController.logoutUser)
router.post('/refresh_token', authController.refreshToken)

export default router
