import {
	Box,
	Button,
	IconButton,
	Input,
	Modal,
	TextareaAutosize,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import postCardApi from '../../../api/postCardApi'
import uploadFileApi from '../../../api/uploadFileApi'
import { useAppDispatch, useAppSelector } from '../../../app/hook'
import { PostCard } from '../../../interfaces'
import { closeModal } from '../../../slices/modalSlice'
import PostCardItem from '../PostCardItem/PostCardItem'
import './PostCardAddOrEditModal.scss'

const PostCardAddOrEditModal = () => {
	const dispatch = useAppDispatch()
	const open = useAppSelector((state) => state.modal.isOpen)
	const user = useAppSelector((state) => state.auth.user)
	const data: PostCard = useAppSelector((state) => state.modal.data)

	const [file, setFile] = useState('')
	const [image, setImage] = useState('')
	const [content, setContent] = useState('')

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

	const handleSubmit = async () => {
		try {
			const formData = new FormData()
			formData.append('uploadFile', file)
			const nameImages: string[] = await uploadFileApi.uploadFile(formData)

			let newData: PostCard

			if (!data) {
				newData = await postCardApi.addPostCard({
					image: '/images/' + nameImages[0],
					content,
					userId: parseInt(user?.id as string),
				})
			} else {
				newData = await postCardApi.editPostCard({
					id: data.id,
					image: file ? '/images/' + nameImages[0] : image,
					content,
					userId: parseInt(user?.id as string),
				})
			}

			toast.success(`${data ? 'Chỉnh sửa' : 'Thêm mới'} bài viết thành công`, {
				position: 'top-right',
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
			})

			dispatch(closeModal(newData))

			setFile('')
			setImage('')
			setContent('')
		} catch (error) {
			toast.error(`${data ? 'Chỉnh sửa' : 'Thêm mới'} bài viết thất bại`, {
				position: 'top-right',
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
			})
		}
	}

	useEffect(() => {
		if (data) {
			setImage(data.image)
			setContent(data.content)
		}
	}, [data])

	return (
		<Modal
			open={open}
			onClose={() => dispatch(closeModal(null))}
			aria-labelledby='modal-modal-title'
			aria-describedby='modal-modal-description'
			className='postCardAddOrEditModal'>
			<Box className='postCardAddOrEditModal__form'>
				<Box className='postCardAddOrEditModal__form__title'>
					<span>{data ? 'Chỉnh sửa bài viết' : 'Thêm bài viết mới'}</span>
					<IconButton onClick={() => dispatch(closeModal(null))}>
						<i className='bx bx-x'></i>
					</IconButton>
				</Box>

				<Box className='postCardAddOrEditModal__form__body'>
					<Box>
						<Box className='postCardAddOrEditModal__form__body__title'>
							Hình ảnh:
						</Box>
						{image ? (
							<Box className='postCardAddOrEditModal__form__body__image'>
								<img src={image} alt='5' />
								<Box>
									<i className='bx bx-x' onClick={() => setImage('')}></i>
								</Box>
							</Box>
						) : (
							<label htmlFor='uploadFile'>
								<Input
									id='uploadFile'
									name='uploadFile'
									type='file'
									style={{ display: 'none' }}
									onChange={handleUploadFile}
								/>
								<Box className='postCardAddOrEditModal__form__body__uploadFile'>
									<i className='bx bx-cloud-upload'></i>
									<span>Tải ảnh lên trình duyệt</span>
								</Box>
							</label>
						)}

						<Box className='postCardAddOrEditModal__form__body__title'>
							Nội dung:
						</Box>
						<TextareaAutosize
							aria-label='minimum height'
							minRows={3}
							defaultValue={content}
							className='postCardAddOrEditModal__form__body__content'
							onChange={(e: any) => setContent(e.target.value)}
						/>

						<Box className='postCardAddOrEditModal__form__body__title'>
							Xem trước:
						</Box>

						<Box className='postCardAddOrEditModal__form__body__preview'>
							<PostCardItem
								item={{
									id: '999',
									image: image
										? image
										: `${process.env.PUBLIC_URL}/images/noimage.jpg`,
									content: content ? content : 'Thêm nội dung',
									like: 0,
									dislike: 0,
									userId: parseInt(user?.id as string),
								}}
							/>
							<span></span>
						</Box>
					</Box>
				</Box>

				<Box className='postCardAddOrEditModal__form__footer'>
					<Button variant='contained' onClick={handleSubmit}>
						{data ? 'Chỉnh sửa' : 'Thêm'}
					</Button>
					<Button
						variant='contained'
						color='error'
						onClick={() => dispatch(closeModal(null))}>
						Hủy
					</Button>
				</Box>
			</Box>
		</Modal>
	)
}

export default PostCardAddOrEditModal
