import { Box, Button, IconButton, Modal } from '@mui/material'
import { toast } from 'react-toastify'
import postCardApi from '../../../api/postCardApi'
import { useAppDispatch, useAppSelector } from '../../../app/hook'
import { PostCard } from '../../../interfaces'
import { closeModal } from '../../../slices/modalSlice'
import './PostCardDelModal.scss'

const PostCardDelModal = () => {
	const dispatch = useAppDispatch()
	const open = useAppSelector((state) => state.modal.isOpen)
	const data: PostCard = useAppSelector((state) => state.modal.data)

	const handleSubmit = async () => {
		try {
			const postCardDel = await postCardApi.delPostCard(data?.id as string)

			toast.success('Xóa bài viết thành công', {
				position: 'top-right',
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
			})

			dispatch(closeModal(postCardDel))
		} catch (error) {
			toast.error('Xóa bài viết thất bại', {
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

	return (
		<Modal
			open={open}
			onClose={() => dispatch(closeModal(null))}
			aria-labelledby='modal-modal-title'
			aria-describedby='modal-modal-description'
			className='postCardDelModal'>
			<Box className='postCardDelModal__form'>
				<Box className='postCardDelModal__form__title'>
					<span>Xóa bài viết</span>
					<IconButton onClick={() => dispatch(closeModal(null))}>
						<i className='bx bx-x'></i>
					</IconButton>
				</Box>

				<Box className='postCardDelModal__form__body'>
					Bạn chắc chắn muốn xóa bài viết "<span>{data.content}</span>" ?
				</Box>

				<Box className='postCardDelModal__form__footer'>
					<Button variant='contained' color='warning' onClick={handleSubmit}>
						Xóa
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

export default PostCardDelModal
