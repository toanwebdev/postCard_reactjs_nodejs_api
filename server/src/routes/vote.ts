import express from 'express'
import voteController from '../controllers/voteController'

const router = express.Router()

router.get('/:userId/:postCardId', voteController.getVotes)
router.post('/', voteController.addVote)
router.delete('/:userId/:postCardId', voteController.delVote)

export default router
