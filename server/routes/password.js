import express from 'express'
import {verifytoken} from '../middleware/auth.js'
import {resetPassEmail,resetPass,changePass} from '../controllers/password.js'

const router = express.Router()

router.post('/forgotpass',resetPassEmail)
router.post('/resetpass',resetPass)

router.patch('/changepass',verifytoken,changePass)

export default router