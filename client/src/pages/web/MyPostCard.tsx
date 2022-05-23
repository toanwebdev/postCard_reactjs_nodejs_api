import { Box, Button } from '@mui/material'
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import postCardApi from '../../api/postCardApi'
import userApi from '../../api/userApi'
import { useAppDispatch, useAppSelector } from '../../app/hook'
import PostCardAddOrEditModal from '../../components/web/PostCardAddOrEditModal/PostCardAddOrEditModal'
import PostCardDelModal from '../../components/web/PostCardDelModal/PostCardDelModal'
import PostCardList from '../../components/web/PostCardList/PostCardList'
import { PostCard } from '../../interfaces'
import { closeMode, openMode } from '../../slices/editOrDelModeSlice'
import { openModal } from '../../slices/modalSlice'
import { setPage } from '../../slices/paginationSlice'

const MyPostCard = () => {
	const dispatch = useAppDispatch()
	const limit = useAppSelector((state) => state.pagination.limit)
	const page = useAppSelector((state) => state.pagination.page)
	const user = useAppSelector((state) => state.auth.user)
	const location = useLocation()

	const [myPostCards, setMyPostCards] = useState<PostCard[]>([])
	const dataUpdated = useAppSelector((state) => state.modal.dataUpdated)
	const isOpenModal = useAppSelector((state) => state.modal.isOpen)
	const typeModal = useAppSelector((state) => state.modal.type)
	const isOpenMode = useAppSelector((state) => state.editOrDelMode.isOpen)
	const typeMode = useAppSelector((state) => state.editOrDelMode.type)
	const [userId, setUserId] = useState(user?.id as string)

	useEffect(() => {
		dispatch(closeMode())
		dispatch(setPage(1))
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		const getUserByUsername = async () => {
			const data = await userApi.getUserByUsername(
				location.pathname.split('/')[1],
			)

			setMyPostCards([])
			setUserId(data?.id as string)
		}

		getUserByUsername()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [location.pathname])

	useEffect(() => {
		if (dataUpdated) {
			const vt = myPostCards.findIndex(
				(postCard) => postCard.id === dataUpdated.id,
			)
			if (typeModal === 'add') {
				myPostCards.push(dataUpdated)
			} else if (typeModal === 'edit') {
				myPostCards[vt] = { ...dataUpdated }
			} else {
				myPostCards.splice(vt, 1)
			}

			setMyPostCards([...myPostCards])
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dataUpdated])

	useEffect(() => {
		const getPostCardByLimit = async () => {
			const data = await postCardApi.getPostCardByIdByPagination({
				userId: parseInt(userId),
				page,
				limit,
			})
			setMyPostCards([...myPostCards, ...data])
		}

		getPostCardByLimit()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [userId, limit, page])

	return (
		<Box sx={{ margin: '30px 0px' }}>
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'flex-end',
					gap: '10px',
					width:
						window.innerWidth > 1200
							? '1200px'
							: window.innerWidth > 600
							? '600px'
							: '320px',
					margin: '0px auto 0px auto',
				}}>
				{(user?.id as string) === userId ? (
					<>
						<Button
							variant='contained'
							startIcon={<i className='bx bx-message-alt-add'></i>}
							sx={{ textTransform: 'none' }}
							disabled={isOpenMode}
							onClick={() =>
								isOpenMode
									? {}
									: dispatch(openModal({ type: 'add', data: null }))
							}>
							Thêm mới
						</Button>

						<Button
							variant='contained'
							startIcon={<i className='bx bx-edit'></i>}
							color='warning'
							sx={{ textTransform: 'none' }}
							disabled={isOpenMode && typeMode === 'del'}
							onClick={() =>
								isOpenMode ? dispatch(closeMode()) : dispatch(openMode('edit'))
							}>
							Sửa
						</Button>

						<Button
							variant='contained'
							startIcon={<i className='bx bx-trash-alt'></i>}
							color='error'
							sx={{ textTransform: 'none' }}
							disabled={isOpenMode && typeMode === 'edit'}
							onClick={() =>
								isOpenMode ? dispatch(closeMode()) : dispatch(openMode('del'))
							}>
							Xóa
						</Button>
					</>
				) : (
					<Link to={`/${user?.username}`}>
						<Button
							variant='contained'
							startIcon={<i className='bx bxs-news'></i>}
							sx={{ textTransform: 'none' }}>
							Bài viết của tôi
						</Button>
					</Link>
				)}
			</Box>

			<PostCardList postCards={myPostCards} userId={parseInt(userId)} />

			{isOpenModal &&
				(typeModal !== 'del' ? (
					<PostCardAddOrEditModal />
				) : (
					<PostCardDelModal />
				))}

			{isOpenMode && (
				<Box
					style={{
						position: 'fixed',
						top: 0,
						left: 0,
						zIndex: -99,
						backgroundColor: 'rgba(0, 0, 0, 0.1)',
						width: '100vw',
						height: '100vh',
					}}></Box>
			)}
		</Box>
	)
}

export default MyPostCard
