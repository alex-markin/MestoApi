import { Request, Response } from 'express';
import Card from '../models/card';

export const getCards = () => Card.find({});

export const createCard = (req: Request, res: Response) => {
  Card.create({ ...req.body, owner: req.user._id })
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
        return;
      }
      res.status(500).send({ message: err.message });
    });
};

export const deleteCard = (req: Request, res: Response) => {
  Card.findByIdAndDelete(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Нет карточки с таким id' });
        return;
      }
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

export const likeCard = (req: Request) =>
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  );

export const dislikeCard = (req: Request) =>
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  );
