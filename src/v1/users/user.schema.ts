import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { HydratedDocument } from 'mongoose'

export enum UserLevel {
  SUPER = 'super',
  HEADMASTER = 'headmaster',
  ADMIN = 'admin',
  TEACHER = 'teacher',
  STUDENT = 'student',
}

@Schema({
  collection: 'users',
})
export class User {
  _id?: mongoose.Types.ObjectId

  @Prop({ required: true })
  username: string

  @Prop({ required: true })
  password: string

  @Prop()
  level: UserLevel

  @Prop({ default: () => new Date(), type: Date, name: 'created_at' })
  created_at?: string

  @Prop({ default: () => new Date(), type: Date, name: 'updated_at' })
  updated_at?: string
}

export type UserDocument = HydratedDocument<User>
export type UserPublicProperty = Omit<User, 'password'>
export const UserSchema = SchemaFactory.createForClass(User)
