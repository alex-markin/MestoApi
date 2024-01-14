import { Router } from 'express';
import { getCards, createCard, likeCard, dislikeCard, deleteCard } from '../controllers/cards';

const router = Router();

router.get('/cards', getCards);
router.post('/cards', createCard);
router.delete('/cards/:cardId', deleteCard);
router.put('/:cardId/likes', likeCard);
router.delete('/cards/:cardId', dislikeCard);
