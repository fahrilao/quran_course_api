import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { User, UserDocument, UserPublicProperty } from './user.schema'
import { Model, Types } from 'mongoose'
import { BodyUpdatePasswordDto, BodyCreateUserDto } from './users.dto'
import { PaginationRequest, PaginationResponse } from '../../common/pagination'
import { hash, compare } from 'bcrypt'
import { UserLevelProcessor } from './levels/level.processor'

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(data: BodyCreateUserDto): Promise<UserPublicProperty> {
    data.password = await hash(data.password, 10)

    const user = new UserLevelProcessor(this.userModel, data)
    await user.create()
    return user.toObject()
  }

  async fetchUser(
    pagination: PaginationRequest,
  ): Promise<PaginationResponse<UserPublicProperty>> {
    const [data, total] = await Promise.all([
      this.userModel
        .find()
        .skip(pagination.size * (pagination.page - 1))
        .limit(pagination.size)
        .exec(),
      this.userModel.countDocuments(),
    ])

    return {
      data: data.map((user) => {
        const { password, ...res } = user.toObject()
        return res
      }),
      page: +pagination.page,
      size: +pagination.size,
      total_item: total,
      total_page: Math.ceil(total / pagination.size),
    }
  }

  async getUserById(id: string): Promise<UserPublicProperty> {
    const user = await UserLevelProcessor.get(this.userModel, id)
    return user.toObject()
  }

  async updateUser(id: string, data: Partial<User>): Promise<number> {
    const user = await UserLevelProcessor.get(this.userModel, id)
    if (!user.getProperty('username')) {
      throw new NotFoundException('User not found')
    }
    return await user.update(data)
  }

  async updatePasswordUser(id: string, body: BodyUpdatePasswordDto): Promise<number> {
    const user = await UserLevelProcessor.get(this.userModel, id)
    if (!user.getProperty('username')) {
      throw new NotFoundException('User not found')
    }
    const isPasswordMatch = await compare(body.old_password, user.getProperty('password'))
    if (!isPasswordMatch) {
      throw new BadRequestException('Password did not match with the old password')
    }

    const newpassword = await hash(body.new_password, 10)
    return await user.update({ password: newpassword })
  }

  async deleteUser(id: string): Promise<number> {
    const user = await UserLevelProcessor.get(this.userModel, id)
    if (!user.getProperty('username')) {
      throw new NotFoundException('User not found')
    }
    return await user.delete()
  }
}
