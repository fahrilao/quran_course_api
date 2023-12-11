import { Types } from 'mongoose'
import { User, UserDocument, UserPublicProperty } from '../user.schema'

export interface IUserLevel {
  getProperty<T extends keyof User>(key: T): User[T]
  toObject(): UserPublicProperty
  get(id: string | Types.ObjectId): Promise<UserDocument>
  create(): Promise<UserDocument>
  update(data: Partial<UserDocument>): Promise<number>
  delete(): Promise<number>
}
