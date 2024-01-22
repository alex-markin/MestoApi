// libs
import { Response, NextFunction } from 'express';

// models
import Card from '../models/card';

// constants
import AuthorizationError from '../constants/errors/auth-error';
import NotFoundError from '../constants/errors/not-found-err';
import ServerError from '../constants/errors/server-error';

// types
import { RequestWithUser } from '../@types/requestWithUser';

export const getCards = (req: RequestWithUser, res: Response, next: NextFunction) => {
  Card.find({})
    .then((cards) => {
      if (!cards) {
        throw new NotFoundError('Карточки не найдены');
      }
      res.status(200).send({ data: cards });
    })
    .catch(next);
};

export const createCard = (req: RequestWithUser, res: Response, next: NextFunction) => {
  if (req.user) {
    Card.create({ ...req.body, owner: req.user._id })
      .then((card) => res.status(200).send({ data: card }))
      .catch(next);
  }
};

export const deleteCard = (req: RequestWithUser, res: Response, next: NextFunction) => {
  const userId = req.user?._id;

  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }

      // check for rights to delete
      if (String(card.owner) !== String(userId)) {
        throw new AuthorizationError('Нет прав на удаление карточки');
      }

      return Card.findByIdAndDelete(req.params.cardId);
    })
    .then((deletedCard) => {
      if (deletedCard) {
        res.status(200).send({ data: deletedCard });
      } else {
        throw new ServerError('Ошибка сервера');
      }
    })
    .catch(next);
};

export const likeCard = (req: RequestWithUser, res: Response, next: NextFunction) => {
  if (req.user) {
    Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
      .then((card) => {
        if (!card) {
          throw new NotFoundError('Карточка не найдена');
        }
        res.status(200).send({ data: card });
      })
      .catch(next);
  }
};

export const dislikeCard = (req: RequestWithUser, res: Response, next: NextFunction) => {
  if (req.user) {
    Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
      .then((card) => {
        if (!card) {
          throw new NotFoundError('Карточка не найдена');
        }
        res.status(200).send({ data: card });
      })
      .catch(next);
  }
};
