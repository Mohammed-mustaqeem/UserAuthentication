import express from 'express'
import { changePasswordContorller, createUserController, deleteUserConttroller, getOneUserController, getUsersController, loggedUserController, loginUserController, passwordResetEmail, updateUserController, userPasswordReset } from '../controllers/userController.js'
import { verifyToken_Middleware } from '../Middlewares/Jwt.js'
const userRouter = express.Router()

userRouter.post('/createuser',createUserController)
userRouter.post('/login',loginUserController)
userRouter.get('/getoneuser/:id',getOneUserController)
userRouter.get('/getusers',getUsersController)
userRouter.delete('/deleteuser/:id',deleteUserConttroller)
userRouter.put('/updateuser/:id',updateUserController)
userRouter.post('/reset-password-email',passwordResetEmail)
userRouter.post('/reset-password/:id/:token',userPasswordReset)

userRouter.post('/changepassword',verifyToken_Middleware,changePasswordContorller)
userRouter.get('/logout',verifyToken_Middleware,loggedUserController)


export default userRouter;