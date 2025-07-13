import express from 'express'
import { login,register,logout, getCurrentUser, registerGoogleUser } from '../controller/AuthController.js'
import upload from '../middleware/upload.js'
import { verifyToken } from '../middleware/AuthMiddleware.js'
import { googleLogin } from '../controller/AuthController.js'
import { verifyGoogleToken } from '../middleware/GoogleAuth.js'

const router = express.Router()

router.post("/googlelogin", googleLogin);
router.post("/googleregister", registerGoogleUser);
router.post('/register',upload.single('image'), register)
router.post('/login',login)
router.post('/logout',logout)
router.get('/me',verifyToken,getCurrentUser)

export default router