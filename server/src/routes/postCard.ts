import express from 'express'
import postCardController from '../controllers/postCardController'

const router = express.Router()

router.get('/:page/:limit', postCardController.getPostCardByPagination)
router.get(
	'/:userId/:page/:limit',
	postCardController.getPostCardByIdByPagination,
)
router.get('/:userId', postCardController.getCount)
router.post('/', postCardController.updatePostCard)
router.put('/', postCardController.updatePostCard)
router.delete('/:id', postCardController.delPostCard)

export default router
