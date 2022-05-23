import { Vote } from '../interfaces'
import axiosClient from './axiosClient'

const voteApi = {
	getVote({ userId, postCardId }: Vote): Promise<Vote> {
		const url = `/vote/${userId}/${postCardId}`
		return axiosClient.get(url)
	},

	addVote(data: Vote): Promise<Vote> {
		const url = '/vote'
		return axiosClient.post(url, data)
	},

	delVote({ userId, postCardId }: Vote): Promise<string> {
		const url = `/vote/${userId}/${postCardId}`
		return axiosClient.delete(url)
	},
}

export default voteApi
