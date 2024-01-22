import { Joi } from 'celebrate';

const HEADERS_VALIDATION = {
  headers: Joi.object()
    .keys({
      authorization: Joi.string().required(),
    })
    .unknown(true),
};

export default HEADERS_VALIDATION;
