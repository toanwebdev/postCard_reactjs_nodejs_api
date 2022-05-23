import axiosClient from './axiosClient'

const uploadFileApi = {
	uploadFile(data: FormData): Promise<string[]> {
		const url = '/upload-file'
		return axiosClient.post(url, data, {
			headers: { 'Content-Type': 'multipart/form-data' },
		})
	},
}

export default uploadFileApi
