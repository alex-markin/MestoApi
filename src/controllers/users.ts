// libs
import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// models
import User from '../models/user';

// constants
import { BCRYPT_HASHLENGTH, JWT_TOKEN_LIFE, JWT_SECRET } from '../constants/encryption';
import AuthorizationError from '../constants/errors/auth-error';
import NotFoundError from '../constants/errors/not-found-err';
import BadRequest from '../constants/errors/bad-request';

// types
import { RequestWithUser } from '../@types/requestWithUser';

export const getUsers = (req: Request, res: Response, next: NextFunction) => {
  User.find({}, '_id name avatar about')
    .then((users) => {
      if (!users) {
        throw new NotFoundError('Пользователи не найдены');
      }
      res.status(200).send({
        data: users,
      });
    })
    .catch(next);
};

export const getUser = (req: Request, res: Response, next: NextFunction) => {
  User.findById(req.params.userId, '_id name avatar about')
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.status(200).send({
        data: user,
      });
    })
    .catch(next);
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar, email, password } = req.body;
  let hashedPassword;

  if (!password || !email) {
    throw new BadRequest('Не переданы почта или пароль');
  }

  bcrypt
    .hash(password, BCRYPT_HASHLENGTH)
    .then((hash) => {
      hashedPassword = hash;
      return User.create({
        name: name,
        about: about,
        avatar: avatar,
        email: email,
        password: hashedPassword,
      });
    })
    .then((user) => {
      const userWithoutSensitiveInfo = {
        _id: user._id,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
      };

      res.status(200).send({
        data: userWithoutSensitiveInfo,
      });
    })
    .catch(next);
};

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  if (!password || !email) {
    throw new BadRequest('Не переданы почта или пароль');
  }
  User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        throw new AuthorizationError('Неправильные почта или пароль');
      }

      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: JWT_TOKEN_LIFE });
      res.send({ token });
    })
    .catch(next);
};

export const changeProfile = (req: RequestWithUser, res: Response, next: NextFunction) => {
  if (req.user) {
    const { name, about } = req.body;
    User.findByIdAndUpdate(req.user._id, { name, about }, { new: true })
      .then((user) => {
        if (!user) {
          throw new NotFoundError('Пользователь не найден');
        }

        const userWithoutSensitiveInfo = {
          _id: user._id,
          name: user.name,
          about: user.about,
          avatar: user.avatar,
        };
        res.status(200).send({ data: userWithoutSensitiveInfo });
      })
      .catch(next);
  }
};

export const changeAvatar = (req: RequestWithUser, res: Response, next: NextFunction) => {
  if (req.user) {
    const { avatar } = req.body;
    User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
      .then((user) => {
        if (!user) {
          throw new NotFoundError('Пользователь не найден');
        }
        res.status(200).send({ data: user });
      })
      .catch(next);
  }
};
