import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// Define a type for the slice state
interface ModalState {
	isOpen: boolean
	type: 'add' | 'edit' | 'del'
	data: any
	dataUpdated: any
}

// Define the initial state using that type
const initialState: ModalState = {
	isOpen: false,
	type: 'add',
	data: null,
	dataUpdated: null,
}

export const modalSlice = createSlice({
	name: 'modal',
	// `createSlice` will infer the state type from the `initialState` argument
	initialState,
	reducers: {
		openModal: (
			state,
			action: PayloadAction<{
				type: 'add' | 'edit' | 'del'
				data: any
			}>,
		) => {
			state.isOpen = true
			state.type = action.payload.type
			state.data = action.payload.data
		},
		closeModal: (state, action: PayloadAction<any>) => {
			state.isOpen = false
			state.dataUpdated = action.payload
		},
	},
})

export const { openModal, closeModal } = modalSlice.actions

export default modalSlice.reducer
