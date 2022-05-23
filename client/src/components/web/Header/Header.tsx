import {
	Avatar,
	Box,
	Button,
	IconButton,
	ListItemIcon,
	Menu,
	MenuItem,
	Tooltip,
} from '@mui/material'
import { MouseEvent, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import authApi from '../../../api/authApi'
import { useAppSelector } from '../../../app/hook'
import {
	logoutFailed,
	logoutStart,
	logoutSuccess,
} from '../../../slices/authSlice'
import JWTManager from '../../../utils/jwt'
import './Header.scss'

const Header = () => {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
	const open = Boolean(anchorEl)
	const handleClick = (event: MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget)
	}
	const handleClose = () => {
		setAnchorEl(null)
	}

	const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
	const user = useAppSelector((state) => state.auth.user)
	const dispatch = useDispatch()
	const navigate = useNavigate()

	const handleLogout = async () => {
		dispatch(logoutStart())
		try {
			await authApi.logoutUser(JWTManager.getUserId() as number)
			dispatch(logoutSuccess())
			JWTManager.deleteToken()
			navigate('/')

			toast.success('Đăng xuất thành công', {
				position: 'top-right',
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
			})
		} catch (error) {
			dispatch(logoutFailed())
		}
	}

	return (
		<>
			<ToastContainer />
			<Box className='header'>
				<Link to='/' className='header__link'>
					<h2>Post Card</h2>
				</Link>

				<Box>
					{isAuthenticated ? (
						<Box className='header__user'>
							<span>Xin chào, {user?.lastName}</span>
							<Tooltip title='Cài đặt tài khoản'>
								<IconButton
									onClick={handleClick}
									size='small'
									sx={{ ml: 2 }}
									aria-controls={open ? 'account-menu' : undefined}
									aria-haspopup='true'
									aria-expanded={open ? 'true' : undefined}>
									<Avatar
										sx={{ width: 40, height: 40 }}
										src={user?.avatar}
										alt={
											(user?.firstName as string) + (user?.lastName as string)
										}
									/>
								</IconButton>
							</Tooltip>

							<Menu
								anchorEl={anchorEl}
								id='account-menu'
								open={open}
								onClose={handleClose}
								onClick={handleClose}
								PaperProps={{
									elevation: 0,
									sx: {
										overflow: 'visible',
										filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
										mt: 1.5,
										'& .MuiAvatar-root': {
											width: 40,
											height: 40,
											ml: -0.5,
											mr: 1,
										},
										'&:before': {
											content: '""',
											display: 'block',
											position: 'absolute',
											top: 0,
											right: 14,
											width: 10,
											height: 10,
											bgcolor: 'background.paper',
											transform: 'translateY(-50%) rotate(45deg)',
											zIndex: 0,
										},
									},
								}}
								transformOrigin={{ horizontal: 'right', vertical: 'top' }}
								anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
								<Link to={`/${user?.username}`} className='header__user__link'>
									<MenuItem>
										<ListItemIcon>
											<i className='bx bxs-news header__menu__icon'></i>
										</ListItemIcon>
										Bài viết của tôi
									</MenuItem>
								</Link>

								<MenuItem
									className='header__user__logout'
									onClick={handleLogout}>
									<ListItemIcon>
										<i className='bx bx-log-out-circle header__menu__icon'></i>
									</ListItemIcon>
									Đăng xuất
								</MenuItem>
							</Menu>
						</Box>
					) : (
						<Box className='header__auth'>
							<Link to='/dang-nhap' className='header__auth__link'>
								<Button variant='contained' sx={{ textTransform: 'none' }}>
									Đăng nhập
								</Button>
							</Link>

							<Link to='/dang-ky' className='header__auth__link'>
								<Button variant='contained' sx={{ textTransform: 'none' }}>
									Đăng ký
								</Button>
							</Link>
						</Box>
					)}
				</Box>
			</Box>
		</>
	)
}

export default Header
