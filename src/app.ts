// libs
import express, { Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { errors } from 'celebrate';

// routers
import { ROUTES } from './constants/routes';
import userRouter from './routes/users';
import login from './routes/signin';
import signup from './routes/signup';
import cardsRouter from './routes/cards';

// middlewares
import auth from './middlewares/auth';
import { requestLogger, errorLogger } from './middlewares/logger';

// types
import ErrorWithStatus from './@types/error-with-status';
import { RequestWithUser } from './@types/requestWithUser';

const { PORT = 3000 } = process.env;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(requestLogger);

// unprotected routes
app.post(ROUTES.signin, login);
app.post(ROUTES.signup, signup);

// protected routes
app.use(auth);
app.use(ROUTES.basicRoute, userRouter);
app.use(ROUTES.basicRoute, cardsRouter);

// error handlers
app.use(errorLogger);
app.use(errors());
app.use((err: ErrorWithStatus, req: RequestWithUser, res: Response, next: NextFunction) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
  });

  next();
});

app.listen(PORT, () => {
  console.log('Server started');
});
