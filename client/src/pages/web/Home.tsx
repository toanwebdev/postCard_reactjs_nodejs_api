import { Box } from '@mui/material'
import { useEffect, useState } from 'react'
import postCardApi from '../../api/postCardApi'
import { useAppDispatch, useAppSelector } from '../../app/hook'
import PostCardList from '../../components/web/PostCardList/PostCardList'
import { PostCard } from '../../interfaces'
import { closeMode } from '../../slices/editOrDelModeSlice'
import { setPage } from '../../slices/paginationSlice'

const Home = () => {
	const limit = useAppSelector((state) => state.pagination.limit)
	const page = useAppSelector((state) => state.pagination.page)
	const dispatch = useAppDispatch()
	const [postCards, setPostCards] = useState<PostCard[]>([])

	useEffect(() => {
		dispatch(closeMode())
		dispatch(setPage(1))
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		const getPostCardByLimit = async () => {
			const data = await postCardApi.getPostCardByPagination({ page, limit })
			setPostCards([...postCards, ...data])
		}

		getPostCardByLimit()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [limit, page])

	return (
		<Box>
			<PostCardList postCards={postCards} userId={-1} />
		</Box>
	)
}

export default Home
