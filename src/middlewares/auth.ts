// libs
import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// models
import { IUser } from '../models/user';

// constants
import AuthorizationError from '../constants/errors/auth-error';

// types
import { RequestWithUser } from '../@types/requestWithUser';

// я создал файл index.d.ts в папке @types/express, чтобы расширить интерфейс Request, но это не помогает...

const auth = (req: RequestWithUser, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization) {
    throw new AuthorizationError('Необходима авторизация');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key') as IUser;
  } catch (err) {
    throw new AuthorizationError('Необходима авторизация');
  }

  req.user = payload;

  next();
};

export default auth;
