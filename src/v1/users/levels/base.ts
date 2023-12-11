import { Model, Types } from 'mongoose'
import { User, UserDocument, UserPublicProperty } from '../user.schema'
import { InternalServerErrorException } from '@nestjs/common'
import { IUserLevel } from './level.interface'

export class BaseUserLevel implements IUserLevel {
  constructor(private userModel: Model<UserDocument>, private data: User | null) {}

  getProperty<T extends keyof User>(key: T): User[T] {
    return this.data[key]
  }

  toObject(): UserPublicProperty {
    const { password, ...data } = this.data

    return data
  }

  async get(id: string | Types.ObjectId): Promise<UserDocument> {
    if (typeof id === 'string') {
      id = new Types.ObjectId(id)
    }

    const userDocument = await this.userModel.findOne({ _id: id })
    if (!userDocument) return null

    this.data = userDocument.toObject()
    return userDocument.toObject()
  }

  async create(): Promise<UserDocument> {
    const res = await this.userModel.create(this.data)
    this.data._id = res._id
    this.data.created_at = res.created_at
    this.data.updated_at = res.updated_at

    return res
  }

  async update(data: Partial<UserDocument>): Promise<number> {
    if (!this.data._id) throw new InternalServerErrorException('Invalid data id provided')

    const res = await this.userModel.updateOne({ _id: this.data._id }, data)
    return res.modifiedCount
  }

  async delete(): Promise<number> {
    if (!this.data._id) throw new InternalServerErrorException('Invalid data id provided')

    const res = await this.userModel.deleteOne({ _id: this.data._id })
    return res.deletedCount
  }
}
