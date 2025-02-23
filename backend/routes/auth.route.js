import {Router} from 'express'


const authRouter = Router();

//Path:api/v1/auth/login||register(POST)
authRouter.post('/login')
authRouter.post('/register')


export default authRouter;