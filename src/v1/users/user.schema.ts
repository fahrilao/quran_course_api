import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { HydratedDocument } from 'mongoose'

export enum UserLevel {
  SUPER = 'super',
  HEADMASTER = 'headmaster',
  ADMIN = 'admin',
  TEACHER = 'teacher',
  STUDENT = 'student',
  STAFF = 'staff',
}

@Schema({
  timestamps: true,
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
}

export type UserDocument = HydratedDocument<User>
export type UserInterface = Pick<UserDocument, keyof User | '_id'>
export type UserPublicProperty = Omit<User, 'password'>
export const UserSchema = SchemaFactory.createForClass(User)
