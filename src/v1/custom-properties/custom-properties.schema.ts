import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, ObjectId } from 'mongoose'

@Schema()
export class CustomProperty {
  _id?: ObjectId

  @Prop()
  field_name: string

  @Prop()
  type: string

  @Prop()
  section: string

  @Prop()
  is_required: boolean

  @Prop()
  custom_validation?: string

  @Prop({ default: () => new Date(), type: Date, name: 'created_at' })
  created_at?: string

  @Prop({ default: () => new Date(), type: Date, name: 'updated_at' })
  updated_at?: string
}

export type CustomPropertyDocument = HydratedDocument<CustomProperty>
export const CustomPropertySchema = SchemaFactory.createForClass(CustomProperty)
export type CustomPropertyInsertableType = {
  [key: string]: Omit<CustomProperty, '_id'>
}
