import { celebrate, Joi } from 'celebrate';
import { Router } from 'express';
import { ROUTES } from '../constants/routes';
import { getCards, createCard, likeCard, dislikeCard, deleteCard } from '../controllers/cards';
import { CARD_NAME_MIN_LENGTH, CARD_NAME_MAX_LENGTH, CARD_ID_LENGTH } from '../constants/models/card-model';
import HEADERS_VALIDATION from '../constants/validation/headers-validation';

const router = Router();

router.get(ROUTES.cards, getCards);

const cardValidation = {
  body: Joi.object().keys({
    name: Joi.string().min(CARD_NAME_MIN_LENGTH).max(CARD_NAME_MAX_LENGTH),
    link: Joi.string().uri(),
  }),
  headers: HEADERS_VALIDATION.headers,
};

router.post(ROUTES.cards, celebrate(cardValidation), createCard);
router.delete(
  `${ROUTES.cards}/:cardId`,
  celebrate({
    params: Joi.object().keys({ cardId: Joi.string().hex().length(CARD_ID_LENGTH) }),
    ...HEADERS_VALIDATION,
  }),
  deleteCard,
);
router.put(
  `${ROUTES.cards}/:cardId/likes`,
  celebrate({
    params: Joi.object().keys({ cardId: Joi.string().hex().length(CARD_ID_LENGTH) }),
    ...HEADERS_VALIDATION,
  }),
  likeCard,
);
router.delete(
  `${ROUTES.cards}/:cardId/likes`,
  celebrate({
    params: Joi.object().keys({ cardId: Joi.string().hex().length(CARD_ID_LENGTH) }),
    ...HEADERS_VALIDATION,
  }),
  dislikeCard,
);

export default router;
