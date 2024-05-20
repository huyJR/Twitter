import { Router } from 'express'
import { loginValidator, registerValidator } from '~/middlewares/users.middlewares'
import { LoginController, registerController } from '~/controllers/users.controller'
const UsersRouter = Router()

UsersRouter.post('/login', loginValidator, LoginController)

UsersRouter.post('/register', registerValidator, registerController)

export default UsersRouter
