import { User } from '../interfaces'
import axiosClient from './axiosClient'

const userApi = {
	getAllUser(): Promise<User[]> {
		const url = '/user'
		return axiosClient.get(url)
	},

	getUserById(id: number): Promise<User> {
		const url = `/user/${id}`
		return axiosClient.get(url)
	},

	getUserByUsername(username: string): Promise<User> {
		const url = `/user/as/${username}`
		return axiosClient.get(url)
	},
}

export default userApi
