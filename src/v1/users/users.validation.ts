import * as Joi from 'joi'
import { UserLevel } from './user.schema'

export const createUserValidation = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
  level: Joi.string()
    .valid(...Object.keys(UserLevel))
    .required(),
})

export const updatePasswordUserValidation = Joi.object({
  old_password: Joi.string().required(),
  new_password: Joi.string().required(),
})

export const updateUserValidation = Joi.object({
  username: Joi.string().required(),
  level: Joi.string()
    .valid(...Object.keys(UserLevel))
    .required(),
})
