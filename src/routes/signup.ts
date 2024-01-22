import { celebrate, Joi } from 'celebrate';
import { Router } from 'express';
import { createUser } from '../controllers/users';
import { ROUTES } from '../constants/routes';
import {
  NAME_MIN_LENGTH,
  NAME_MAX_LENGTH,
  ABOUT_MIN_LENGTH,
  ABOUT_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from '../constants/models/user-model';

const router = Router();

router.post(
  ROUTES.signup,
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().min(PASSWORD_MIN_LENGTH).required(),
      name: Joi.string().min(NAME_MIN_LENGTH).max(NAME_MAX_LENGTH),
      about: Joi.string().min(ABOUT_MIN_LENGTH).max(ABOUT_MAX_LENGTH),
      avatar: Joi.string().uri(),
    }),
  }),
  createUser,
);

export default router;
