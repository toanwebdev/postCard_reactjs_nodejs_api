import { User } from './'

export interface Auth {
	user?: User
	accessToken: string
}
