import express from 'express';
import {getFeedPosts,getUserPosts,likePost,delPost,commentPost,editPost} from '../controllers/posts.js'
import {verifytoken} from '../middleware/auth.js'

const router = express.Router();

/* READ */
 router.get('/getposts/:id',verifytoken,getFeedPosts)
 router.get('/:userId/posts',verifytoken,getUserPosts)
/* UPDATE */
router.patch('/:id/like',verifytoken,likePost) 
router.patch('/:id/comment',verifytoken,commentPost)
router.patch('/:id/edit',verifytoken,editPost)
/* DELETE */
router.delete('/:id/delete',verifytoken,delPost)
 
export default router;