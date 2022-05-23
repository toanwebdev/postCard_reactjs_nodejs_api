import { LoadingButton } from '@mui/lab'
import { Avatar, Box, Grid, Input, Typography } from '@mui/material'
import { Form, Formik } from 'formik'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import * as Yup from 'yup'
import authApi from '../../../api/authApi'
import uploadFileApi from '../../../api/uploadFileApi'
import { useAppDispatch } from '../../../app/hook'
import { User } from '../../../interfaces'
import {
	registerFailed,
	registerStart,
	registerSuccess,
} from '../../../slices/authSlice'
import JWTManager from '../../../utils/jwt'
import InputField from '../../common/InputField'
import './RegisterForm.scss'

const RegisterForm = () => {
	const dispatch = useAppDispatch()
	const navigate = useNavigate()

	const [file, setFile] = useState('')
	const [image, setImage] = useState('')

	const handleUploadFile = (e: any) => {
		const fileItem = e.target.files[0]

		if (fileItem) {
			setFile(fileItem)

			const reader = new FileReader()
			reader.readAsDataURL(fileItem)
			reader.onload = () => {
				if (reader.readyState === 2) {
					setImage(reader.result as string)
				}
			}
		}
	}

	const initialValues: User = {
		firstName: '',
		lastName: '',
		username: '',
		password: '',
	}

	const RegisterSchema = Yup.object().shape({
		firstName: Yup.string()
			.min(2, 'Họ phải có ít nhất 2 ký tự!')
			.max(100, 'Họ chỉ có thể dài 100 ký tự!')
			.required('Họ không thể để trống!'),
		lastName: Yup.string()
			.min(2, 'Tên phải có ít nhất 2 ký tự!')
			.max(100, 'Tên chỉ có thể dài 100 ký tự!')
			.required('Tên không thể để trống!'),
		username: Yup.string()
			.min(5, 'Tài khoản phải có ít nhất 5 ký tự!')
			.max(50, 'Tài khoản chỉ có thể dài 50 ký tự!')
			.required('Tài khoản không thể để trống!'),
		password: Yup.string()
			.min(5, 'Mật khẩu phải có ít nhất 5 ký tự!')
			.max(50, 'Mật khẩu chỉ có thể dài 50 ký tự!')
			.required('Mật khẩu không thể để trống!'),
		confirmPassword: Yup.string().oneOf(
			[Yup.ref('password'), null],
			'Mật khẩu không trùng khớp',
		),
	})

	const onRegisterSubmit = async (values: User) => {
		dispatch(registerStart())
		try {
			const formData = new FormData()
			formData.append('uploadFile', file)
			const nameImages: string[] = await uploadFileApi.uploadFile(formData)

			const data = await authApi.registerUser({
				...values,
				avatar: '/images/' + nameImages[0],
			})
			dispatch(registerSuccess(data.user as User))
			JWTManager.setToken(data.accessToken)
			navigate('/')

			toast.success('Đăng ký thành công', {
				position: 'top-right',
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
			})
		} catch (error) {
			toast.error('Đăng ký thất bại', {
				position: 'top-right',
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
			})
			dispatch(registerFailed())
		}
	}

	return (
		<Box className='registerForm'>
			<Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
				<i className='bx bx-lock-alt'></i>
			</Avatar>
			<Typography component='h1' variant='h5'>
				Đăng ký
			</Typography>
			<Formik
				initialValues={initialValues}
				validationSchema={RegisterSchema}
				onSubmit={onRegisterSubmit}>
				{({ isSubmitting }: { isSubmitting: boolean }) => (
					<Form className='registerForm__form'>
						<Box className='registerForm__form__avatar'>
							<span className='registerForm__form__avatar__title'>
								Ảnh đại diện:
							</span>

							<Box>
								{image ? (
									<Box className='registerForm__form__avatar__image'>
										<img src={image} alt='avatar' />
										<Box>
											<i
												className='bx bx-trash-alt'
												onClick={() => setImage('')}></i>
										</Box>
									</Box>
								) : (
									<label htmlFor='icon-button-file'>
										<Input
											id='icon-button-file'
											type='file'
											style={{ display: 'none' }}
											onChange={handleUploadFile}
										/>
										<Box className='registerForm__form__avatar__uploadFile'>
											<i className='bx bx-camera'></i>
										</Box>
									</label>
								)}
							</Box>
						</Box>
						<Grid container spacing={2}>
							<Grid item xs={12} sm={6}>
								<InputField
									name='firstName'
									required
									fullWidth
									label='Họ'
									type='text'
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<InputField
									required
									fullWidth
									label='Tên'
									name='lastName'
									type='text'
								/>
							</Grid>
							<Grid item xs={12}>
								<InputField
									required
									fullWidth
									label='Tài khoản'
									name='username'
									type='text'
								/>
							</Grid>
							<Grid item xs={12}>
								<InputField
									required
									fullWidth
									name='password'
									label='Mật khẩu'
									type='password'
								/>
							</Grid>
							<Grid item xs={12}>
								<InputField
									required
									fullWidth
									name='confirmPassword'
									label='Xác nhận mật khẩu'
									type='password'
								/>
							</Grid>
						</Grid>
						<LoadingButton
							loading={isSubmitting}
							type='submit'
							fullWidth
							variant='contained'
							className='registerForm__form__btn'>
							Đăng ký
						</LoadingButton>
					</Form>
				)}
			</Formik>

			<Box className='registerForm__login'>
				<span>Bạn đã có tài khoản ?</span>
				<Link to='/dang-nhap' className='registerForm__login__link'>
					Đăng nhập tại đây.
				</Link>
			</Box>
		</Box>
	)
}

export default RegisterForm
