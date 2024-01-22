import { celebrate, Joi } from 'celebrate';
import { Router } from 'express';
import { login } from '../controllers/users';
import { ROUTES } from '../constants/routes';
import { PASSWORD_MIN_LENGTH } from '../constants/models/user-model';

const router = Router();

router.post(
  ROUTES.signin,
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().min(PASSWORD_MIN_LENGTH).required(),
    }),
  }),
  login,
);

export default router;
