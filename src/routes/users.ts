// libs
import { celebrate, Joi } from 'celebrate';
import { Router } from 'express';

// controllers
import { getUsers, getUser, changeProfile, changeAvatar } from '../controllers/users';

// constants
import { ROUTES } from '../constants/routes';
import {
  NAME_MIN_LENGTH,
  NAME_MAX_LENGTH,
  ABOUT_MIN_LENGTH,
  ABOUT_MAX_LENGTH,
  USER_ID_LENGTH,
} from '../constants/models/user-model';

const router = Router();

router.get(ROUTES.users, getUsers); // returns all users

router.get(
  `${ROUTES.users}/:userId`,
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().hex().length(USER_ID_LENGTH),
    }),
    headers: Joi.object()
      .keys({
        authorization: Joi.string().required(),
      })
      .unknown(true),
  }),
  getUser,
); // returns user by id

router.patch(
  ROUTES.profile,
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(NAME_MIN_LENGTH).max(NAME_MAX_LENGTH),
      about: Joi.string().min(ABOUT_MIN_LENGTH).max(ABOUT_MAX_LENGTH),
    }),
    headers: Joi.object()
      .keys({
        authorization: Joi.string().required(),
      })
      .unknown(true),
  }),
  changeProfile,
); // changes user profile

router.patch(
  ROUTES.avatar,
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().uri(),
    }),
    headers: Joi.object()
      .keys({
        authorization: Joi.string().required(),
      })
      .unknown(true),
  }),
  changeAvatar,
); // changes user avatar

export default router;
