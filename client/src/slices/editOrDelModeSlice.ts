import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// Define a type for the slice state
interface EditOrDelModeState {
	type: 'edit' | 'del'
	isOpen: boolean
}

// Define the initial state using that type
const initialState: EditOrDelModeState = {
	type: 'edit',
	isOpen: false,
}

export const editOrDelModeSlice = createSlice({
	name: 'editOrDelMode',
	// `createSlice` will infer the state type from the `initialState` argument
	initialState,
	reducers: {
		openMode: (state, action: PayloadAction<'edit' | 'del'>) => {
			state.isOpen = true
			state.type = action.payload
		},

		closeMode: (state) => {
			state.isOpen = false
		},
	},
})

export const { openMode, closeMode } = editOrDelModeSlice.actions

export default editOrDelModeSlice.reducer
