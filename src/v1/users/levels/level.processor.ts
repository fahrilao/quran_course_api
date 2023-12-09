import { Types, Document, Model } from 'mongoose'
import { User, UserDocument, UserLevel, UserPublicProperty } from '../user.schema'
import { IUserLevel } from './level.interface'
import { UserLevelSuper } from './super'
import { InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { BaseUserLevel } from './base'
import { UserLevelHeadmaster } from './headmaster'
import { UserLevelAdmin } from './admin'
import { UserLevelTeacher } from './teacher'
import { UserLevelStudent } from './student'

export class UserLevelProcessor implements IUserLevel {
  private user: IUserLevel
  private userLevels = {
    [UserLevel.SUPER]: UserLevelSuper,
    [UserLevel.HEADMASTER]: UserLevelHeadmaster,
    [UserLevel.ADMIN]: UserLevelAdmin,
    [UserLevel.TEACHER]: UserLevelTeacher,
    [UserLevel.STUDENT]: UserLevelStudent,
  }

  constructor(userModel: Model<UserDocument>, data: UserDocument | null) {
    const userLevel = this.userLevels[data.level]
    if (!userLevel) {
      throw new InternalServerErrorException('Invalid user level')
    }

    this.user = new userLevel(userModel, data)
  }

  getProperty<T extends keyof User>(key: T): User[T] {
    return this.user.getProperty(key)
  }

  toObject(): UserPublicProperty {
    return this.user.toObject()
  }

  static async get(
    userModel: Model<UserDocument>,
    id: string | Types.ObjectId,
  ): Promise<IUserLevel> {
    const user = new BaseUserLevel(userModel, null)
    const userData = await user.get(id)
    if (!userData) throw new NotFoundException('User not found')
    return new UserLevelProcessor(userModel, userData)
  }

  async create(): Promise<UserDocument> {
    return await this.user.create()
  }

  async update(data: Partial<UserDocument>): Promise<number> {
    return await this.user.update(data)
  }

  async delete(): Promise<number> {
    return await this.user.delete()
  }
}
