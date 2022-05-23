import { Box, Button } from '@mui/material'
import { useEffect, useState } from 'react'
import postCardApi from '../../../api/postCardApi'
import { useAppDispatch, useAppSelector } from '../../../app/hook'
import { PostCard } from '../../../interfaces'
import { pageChange } from '../../../slices/paginationSlice'
import PostCardItem from '../PostCardItem/PostCardItem'
import './PostCardList.scss'

interface IPostCardListProps {
	postCards: PostCard[]
	userId: number
}

const PostCardList = ({ postCards, userId }: IPostCardListProps) => {
	const dispatch = useAppDispatch()
	const dataUpdated = useAppSelector((state) => state.modal.dataUpdated)
	const [total, setTotal] = useState(0)

	useEffect(() => {
		const getCount = async () => {
			const data = await postCardApi.getCount(userId)
			setTotal(data)
		}

		getCount()
	}, [userId, dataUpdated])

	return (
		<Box className='postCardList'>
			<Box className='postCardList__list'>
				{postCards.map((postCard) => (
					<PostCardItem key={`postCard-${postCard.id}`} item={postCard} />
				))}
			</Box>

			{postCards.length !== total && (
				<Button
					variant='outlined'
					className='postCardList__moreBtn'
					onClick={() => dispatch(pageChange())}>
					Xem thêm
				</Button>
			)}
		</Box>
	)
}

export default PostCardList
