import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { User, UserDocument } from '../../schemas/user.chema'
import { Model } from 'mongoose'
import { BodyUpdatePasswordDto, BodyCreateUserDto } from './users.dto'
import { PaginationRequest, PaginationResponse } from '../../common/pagination'
import { hash, compare } from 'bcrypt'
import { v4 } from 'uuid'

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(data: BodyCreateUserDto): Promise<User> {
    const uid = v4()
    data.password = await hash(data.password, 10)

    const user = await this.userModel.create({
      ...data,
      id: uid,
    })

    return {
      _id: user._id,
      id: user.id,
      username: user.username,
    }
  }

  async fetchUser(pagination: PaginationRequest): Promise<PaginationResponse<User>> {
    const [data, total] = await Promise.all([
      this.userModel
        .find()
        .skip(pagination.size * (pagination.page - 1))
        .limit(pagination.size)
        .exec(),
      this.userModel.countDocuments(),
    ])

    return {
      data: data.map((user) => ({
        _id: user._id,
        id: user.id,
        username: user.username,
      })),
      page: +pagination.page,
      size: +pagination.size,
      total_item: total,
      total_page: Math.ceil(total / pagination.size),
    }
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.userModel.findOne({ id }).exec()

    return user
  }

  async updateUser(id: string, data: Partial<User>): Promise<number> {
    const user = await this.userModel.findOneAndUpdate({ id }, data)
    if (!user) {
      throw new NotFoundException('User not found')
    }

    return 1
  }

  async updatePasswordUser(id: string, data: BodyUpdatePasswordDto): Promise<number> {
    const user = await this.getUserById(id)
    if (!user) {
      throw new NotFoundException('User does not exist')
    }

    const isPasswordMatch = await compare(data.old_password, user.password)
    if (!isPasswordMatch) {
      throw new BadRequestException('Password did not match with the old password')
    }

    user.password = await hash(data.new_password, 10)
    return await this.updateUser(id, { password: user.password })
  }

  async deleteUser(id: string): Promise<number> {
    const user = await this.userModel.findOneAndDelete({ id })
    if (!user) {
      throw new NotFoundException('User not found')
    }

    return 1
  }
}
