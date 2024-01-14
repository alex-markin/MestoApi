import { Router } from 'express';
import { getUsers, getUser, postUser } from '../controllers/users';

const router = Router();

router.get('/users', getUsers); // return all users
router.get('/users/:userId', getUser); // return user by id
router.post('/users', postUser); // create user

export default router;
