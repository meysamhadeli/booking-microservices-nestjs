import Joi from 'joi';
import { BadRequestException } from '@nestjs/common';

export const password: Joi.CustomValidator<string> = (value) => {
  if (value.length < 8) {
    throw new BadRequestException('password must be at least 8 characters');
  }
  if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
    throw new BadRequestException('password must contain at least 1 letter and 1 number');
  }
  return value;
};
