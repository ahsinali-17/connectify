import express from 'express'
import {getUser,getUsers, getUserFriends, addRemoveFriend} from '../controllers/users.js'
import {verifytoken} from '../middleware/auth.js'

const router = express.Router()
/*READ*/
router.get('/get-users', verifytoken, getUsers)
router.get('/:id',verifytoken,getUser)
router.get('/:id/friends',verifytoken,getUserFriends)

/* UPDATE */
router.patch('/:id/:friendid',verifytoken,addRemoveFriend) 

export default router