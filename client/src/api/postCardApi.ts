import { PostCard } from '../interfaces'
import axiosClient from './axiosClient'

const postCardApi = {
	getCount(userId: number): Promise<number> {
		const url = `/post-card/${userId}`
		return axiosClient.get(url)
	},

	getPostCardByPagination({
		page,
		limit,
	}: {
		page: number
		limit: number
	}): Promise<PostCard[]> {
		const url = `/post-card/${page}/${limit}`
		return axiosClient.get(url)
	},

	getPostCardByIdByPagination({
		userId,
		page,
		limit,
	}: {
		userId: number
		page: number
		limit: number
	}): Promise<PostCard[]> {
		const url = `/post-card/${userId}/${page}/${limit}`
		return axiosClient.get(url)
	},

	addPostCard(data: PostCard): Promise<PostCard> {
		const url = '/post-card'
		return axiosClient.post(url, data)
	},

	editPostCard(data: PostCard): Promise<PostCard> {
		const url = '/post-card'
		return axiosClient.put(url, data)
	},

	delPostCard(id: string): Promise<PostCard> {
		const url = `/post-card/${id}`
		return axiosClient.delete(url)
	},
}

export default postCardApi
