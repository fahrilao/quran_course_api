import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { HydratedDocument } from 'mongoose'
import * as uuid from 'uuid'

@Schema({
  timestamps: true,
  collection: 'users',
})
export class User {
  _id?: mongoose.Types.ObjectId

  @Prop({
    default: uuid,
    index: true,
  })
  id: string

  @Prop({ required: true })
  username: string

  @Prop({ required: true })
  password?: string
}

export type UserDocument = HydratedDocument<User>
export type UserInterface = Pick<UserDocument, keyof User | '_id'>
export const UserSchema = SchemaFactory.createForClass(User)
