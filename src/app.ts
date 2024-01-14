import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/users';

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

// app.use((req: Request, res: Response, next: NextFunction) => {
//   req.user = {
//     _id: '659ea94c156925d426f8ab2b',
//   };
//   next();
// });

app.use('/', userRouter);

app.listen(PORT, () => {
  console.log('Server started');
});
