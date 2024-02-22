import * as Joi from 'joi'
import { BodyCustomPropertiesDto } from './custom-properties.dto'

export const bodyCustomPropertyValidation = Joi.object<BodyCustomPropertiesDto>({
  field_name: Joi.string().required(),
  is_required: Joi.boolean().required(),
  type: Joi.string().required(),
  section: Joi.string().required(),
  custom_validation: Joi.string().required(),
})
