import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../slices/authSlice'
import modalReducer from '../slices/modalSlice'
import paginationReducer from '../slices/paginationSlice'
import editOrDelReducer from '../slices/editOrDelModeSlice'
// ...

export const store = configureStore({
	reducer: {
		auth: authReducer,
		modal: modalReducer,
		pagination: paginationReducer,
		editOrDelMode: editOrDelReducer,
	},
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
