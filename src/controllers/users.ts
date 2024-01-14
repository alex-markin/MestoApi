import { Request, Response } from 'express';
import User from '../models/user';

export const getUsers = (req: Request, res: Response) => {
  User.find({})
    .then((users) =>
      res.status(200).send({
        data: users,
      }),
    )
    .catch((err) =>
      res.status(500).send({
        message: err.message,
      }),
    );
};

export const getUser = (req: Request, res: Response) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        res.status(404).send({
          message: 'Нет пользователя с таким id',
        });
        return;
      }
      res.status(200).send({
        data: user,
      });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({
          message: 'Невалидный id',
        });
        return;
      }
      res.status(500).send({
        message: err.message,
      });
    });
};

export const postUser = (req: Request, res: Response) => {
  const { name, about, avatar, email, password } = req.body;

  User.create({
    name,
    about,
    avatar,
  })
    .then((user) =>
      res.status(200).send({
        data: user,
      }),
    )
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: 'Переданы некорректные данные',
        });
        return;
      }
      res.status(500).send({
        message: err.message,
      });
    });
};
