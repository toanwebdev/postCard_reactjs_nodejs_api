import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { User } from '../interfaces'

// Define a type for the slice state
interface AuthState {
	isLoading: boolean
	isAuthenticated: boolean
	user: User | null
	isError: boolean
}

// Define the initial state using that type
const initialState: AuthState = {
	isLoading: false,
	isAuthenticated: false,
	user: null,
	isError: false,
}

export const authSlice = createSlice({
	name: 'auth',
	// `createSlice` will infer the state type from the `initialState` argument
	initialState,
	reducers: {
		registerStart: (state) => {
			state.isLoading = true
		},
		registerSuccess: (state, action: PayloadAction<User>) => {
			state.isLoading = false
			state.isAuthenticated = true
			state.user = action.payload
			state.isError = false
		},
		registerFailed: (state) => {
			state.isLoading = false
			state.isAuthenticated = false
			state.isError = true
		},

		loginStart: (state) => {
			state.isLoading = true
		},
		loginSuccess: (state, action: PayloadAction<User>) => {
			state.isLoading = false
			state.isAuthenticated = true
			state.user = action.payload
			state.isError = false
		},
		loginFailed: (state) => {
			state.isLoading = false
			state.isAuthenticated = false
			state.isError = true
		},

		logoutStart: (state) => {
			state.isLoading = true
		},
		logoutSuccess: (state) => {
			state.isLoading = false
			state.isAuthenticated = false
			state.user = null
			state.isError = false
		},
		logoutFailed: (state) => {
			state.isLoading = false
			state.isError = true
		},
	},
})

export const {
	registerStart,
	registerSuccess,
	registerFailed,
	loginStart,
	loginSuccess,
	loginFailed,
	logoutStart,
	logoutSuccess,
	logoutFailed,
} = authSlice.actions

export default authSlice.reducer
