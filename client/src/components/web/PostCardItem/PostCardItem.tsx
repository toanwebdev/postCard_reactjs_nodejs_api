import { Avatar, Box, Modal } from '@mui/material'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import userApi from '../../../api/userApi'
import voteApi from '../../../api/voteApi'
import { useAppDispatch, useAppSelector } from '../../../app/hook'
import { PostCard, User } from '../../../interfaces'
import { openModal } from '../../../slices/modalSlice'
import './PostCardItem.scss'

interface IPostCardItemProps {
	item: PostCard
}

const PostCardItem = ({ item }: IPostCardItemProps) => {
	const dispatch = useAppDispatch()
	const user = useAppSelector((state) => state.auth.user)
	const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)

	const isOpenModal = useAppSelector((state) => state.modal.isOpen)
	const isOpenMode = useAppSelector((state) => state.editOrDelMode.isOpen)
	const type = useAppSelector((state) => state.editOrDelMode.type)

	const [like, setLike] = useState(false)
	const [dislike, setDislike] = useState(false)
	const [likeCount, setLikeCount] = useState(item.like as number)
	const [dislikeCount, setDislikeCount] = useState(item.dislike as number)

	const [open, setOpen] = useState(false)
	const [author, setAuthor] = useState<User | null>(null)

	const handleOpen = () => setOpen(true)
	const handleClose = () => setOpen(false)
	const handleMode = () => {
		if (type === 'edit') {
			dispatch(openModal({ data: item, type: 'edit' }))
		} else {
			dispatch(openModal({ data: item, type: 'del' }))
		}
	}

	useEffect(() => {
		if (isAuthenticated) {
			const getVotes = async () => {
				const votes = await voteApi.getVotes({
					postCardId: parseInt(item.id as string),
					userId: parseInt(user?.id as string),
				})

				for (let i = 0; i < votes.length; i++) {
					if (
						votes[i].postCardId === parseInt(item.id as string) &&
						votes[i].userId === parseInt(user?.id as string)
					) {
						if (votes[i].value === 1) {
							setLike(true)
						} else {
							setDislike(true)
						}
					}
				}
			}

			getVotes()
		} else {
			setLike(false)
			setDislike(false)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [item.id, user?.id])

	useEffect(() => {
		const getAuthor = async () => {
			const data = await userApi.getUserById(item.userId)
			setAuthor(data)
		}

		getAuthor()
	}, [item.userId])

	const handleLike = async () => {
		if (isAuthenticated) {
			if (!like) {
				await voteApi.addVote({
					postCardId: parseInt(item.id as string),
					userId: parseInt(user?.id as string),
					value: 1,
				})
				setLikeCount(likeCount + 1)
			} else {
				await voteApi.delVote({
					postCardId: parseInt(item.id as string),
					userId: parseInt(user?.id as string),
				})
				setLikeCount(likeCount - 1)
			}

			if (dislike) {
				setDislike(false)
				setDislikeCount(dislikeCount - 1)
			}

			setLike(!like)
		}
	}

	const handleDislike = async () => {
		if (isAuthenticated) {
			if (!dislike) {
				await voteApi.addVote({
					postCardId: parseInt(item.id as string),
					userId: parseInt(user?.id as string),
					value: -1,
				})
				setDislikeCount(dislikeCount + 1)
			} else {
				await voteApi.delVote({
					postCardId: parseInt(item.id as string),
					userId: parseInt(user?.id as string),
				})
				setDislikeCount(dislikeCount - 1)
			}

			if (like) {
				setLike(false)
				setLikeCount(likeCount - 1)
			}

			setDislike(!dislike)
		}
	}

	return (
		<Box className='postCardItem'>
			<img
				className='postCardItem__image'
				src={item.image}
				alt={author?.lastName}
				onClick={handleOpen}
			/>

			<Box className='postCardItem__content'>{item.content}</Box>

			<Box className='postCardItem__footer'>
				<Box className='postCardItem__footer__vote'>
					<Box className='postCardItem__footer__vote__item'>
						<i
							className={`${
								like
									? 'bx bxs-like postCardItem__footer__vote__item__icon__like'
									: 'bx bx-like'
							} postCardItem__footer__vote__item__icon`}
							onClick={handleLike}></i>
						<span>{likeCount}</span>
					</Box>
					<Box className='postCardItem__footer__vote__item'>
						<i
							className={`${
								dislike
									? 'bx bxs-dislike postCardItem__footer__vote__item__icon__dislike'
									: 'bx bx-dislike'
							} postCardItem__footer__vote__item__icon`}
							onClick={handleDislike}></i>
						<span>{dislikeCount}</span>
					</Box>
				</Box>

				<Link to={`/${author?.username}`} className='postCardItem__link'>
					<Box className='postCardItem__footer__author'>
						<Avatar sx={{ width: 30, height: 30 }} src={author?.avatar} />
						<span>
							{
								((author?.firstName as string) +
									' ' +
									author?.lastName) as string
							}
						</span>
					</Box>
				</Link>
			</Box>

			{window.innerWidth > 600 && (
				<Modal
					open={open}
					onClose={handleClose}
					aria-labelledby='modal-modal-title'
					aria-describedby='modal-modal-description'
					className='postCardItem__image__modal'>
					<img src={item.image} alt={author?.lastName} />
				</Modal>
			)}

			{isOpenMode && !isOpenModal && <span onClick={handleMode}></span>}
		</Box>
	)
}

export default PostCardItem
