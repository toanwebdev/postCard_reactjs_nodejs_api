import { Auth } from './../interfaces/auth'
import { User } from '../interfaces'
import axiosClient from './axiosClient'

const authApi = {
	registerUser(data: User): Promise<Auth> {
		const url = '/auth/register'
		return axiosClient.post(url, data)
	},

	loginUser(data: User): Promise<Auth> {
		const url = '/auth/login'
		return axiosClient.post(url, data)
	},

	logoutUser(id: number): Promise<string> {
		const url = `/auth/logout/${id}`
		return axiosClient.get(url)
	},

	refreshToken(): Promise<Auth> {
		const url = '/auth/refresh_token'
		return axiosClient.post(url)
	},
}

export default authApi
