import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// Define a type for the slice state
interface PaginationState {
	page: number
	limit: number
}

// Define the initial state using that type
const initialState: PaginationState = {
	page: 1,
	limit: 4,
}

export const paginationSlice = createSlice({
	name: 'pagination',
	// `createSlice` will infer the state type from the `initialState` argument
	initialState,
	reducers: {
		setPage: (state, action: PayloadAction<number>) => {
			state.page = action.payload
		},
		pageChange: (state) => {
			state.page++
		},
		setLimit: (state, action: PayloadAction<number>) => {
			state.limit = action.payload
		},
	},
})

export const { setPage, pageChange, setLimit } = paginationSlice.actions

export default paginationSlice.reducer
