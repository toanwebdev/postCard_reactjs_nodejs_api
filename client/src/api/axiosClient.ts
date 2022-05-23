import axios, { AxiosResponse } from 'axios'
import queryString from 'query-string'
import JWTManager from '../utils/jwt'

const axiosClient = axios.create({
	baseURL: process.env.SERVER_URL_API,
	headers: {
		'Content-Type': 'application/json',
	},
	withCredentials: true,
	paramsSerializer: (params) => queryString.stringify(params),
})

// Add a request interceptor
axiosClient.interceptors.request.use(
	function (config: any) {
		// Do something before request is sent
		const token = JWTManager.getToken()
		if (token) {
			config.headers.Authorization = token
		}
		return config
	},
	function (error) {
		// Do something with request error
		return Promise.reject(error)
	},
)

// Add a response interceptor
axiosClient.interceptors.response.use(
	function (response: AxiosResponse) {
		// Any status code that lie within the range of 2xx cause this function to trigger
		// Do something with response data
		return response.data
	},
	function (error) {
		// Any status codes that falls outside the range of 2xx cause this function to trigger
		// Do something with response error
		return Promise.reject(error)
	},
)

export default axiosClient
