import {Router} from 'express'
import { login, register } from '../controller/auth.controller.js';


const authRouter = Router();

//Path:api/v1/auth/login||register(POST)
authRouter.post('/register',register)
authRouter.post('/login',login)


export default authRouter;