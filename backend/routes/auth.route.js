import {Router} from 'express'
import { login, register } from '../controller/auth.controller.js';
import { inviteDoctor, verifyDoctorInvite, completeDoctorRegistration, createFirstAdmin} from '../controller/auth.controller.js';
import { authorize, isAdmin } from '../middleware/auth.middleware.js';


const authRouter = Router();

//Path:api/v1/auth/login||register...
authRouter.post('/register',register)
authRouter.post('/login',login)
authRouter.post('/invite-doctor', authorize, isAdmin, inviteDoctor);
authRouter.get('/verify-doctor-invite/:token', verifyDoctorInvite);
authRouter.post('/complete-doctor-registration', completeDoctorRegistration);
authRouter.post('/create-first-admin', createFirstAdmin);


export default authRouter;