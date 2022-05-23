import { useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css'
import userApi from './api/userApi'
import './App.css'
import { useAppDispatch } from './app/hook'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Home from './pages/web/Home'
import Layout from './pages/web/Layout'
import MyPostCard from './pages/web/MyPostCard'
import { loginFailed, loginStart, loginSuccess } from './slices/authSlice'
import JWTManager from './utils/jwt'

function App() {
	const dispatch = useAppDispatch()

	const [usernamePath, setUsernamePath] = useState<string[]>([])

	useEffect(() => {
		const authenticate = async () => {
			dispatch(loginStart())

			const token = JWTManager.getToken()
			if (token) {
				const data = await userApi.getUserById(JWTManager.getUserId() as number)

				dispatch(loginSuccess(data))
			} else {
				const success = await JWTManager.getRefreshToken()
				if (success) {
					const data = await userApi.getUserById(
						JWTManager.getUserId() as number,
					)
					dispatch(loginSuccess(data))
				} else {
					dispatch(loginFailed())
				}
			}
		}

		authenticate()
	}, [dispatch])

	useEffect(() => {
		const getAllUser = async () => {
			const allUser = await userApi.getAllUser()

			let newUsernamePath: string[] = []
			for (let i = 0; i < allUser.length; i++) {
				newUsernamePath.push(allUser[i].username)
			}

			setUsernamePath(newUsernamePath)
		}

		getAllUser()
	}, [])

	return (
		<div className='App'>
			<BrowserRouter>
				<Routes>
					<Route path='/dang-nhap' element={<Login />}></Route>
					<Route path='/dang-ky' element={<Register />}></Route>
					<Route path='/' element={<Layout />}>
						<Route index element={<Home />} />
						{usernamePath.map((username) => (
							<Route
								key={`path-username-${username}`}
								path={`/${username}`}
								element={<MyPostCard />}
							/>
						))}
						<Route path='*' element={<h3>not found</h3>} />
					</Route>
				</Routes>
			</BrowserRouter>
		</div>
	)
}

export default App
