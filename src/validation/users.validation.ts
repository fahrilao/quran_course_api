import * as Joi from 'joi'

export const createUserValidation = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
})

export const updatePasswordUserValidation = Joi.object({
  old_password: Joi.string().required(),
  new_password: Joi.string().required(),
})

export const updateUserValidation = Joi.object({
  username: Joi.string().required(),
})
