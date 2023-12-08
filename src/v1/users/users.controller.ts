import {
  Controller,
  HttpCode,
  Get,
  Post,
  Param,
  Query,
  Body,
  UsePipes,
  Patch,
  Delete,
  Put,
} from '@nestjs/common'
import { UsersService } from './users.service'
import { User, UserPublicProperty } from './user.schema'
import {
  BodyCreateUserDto,
  BodyUpdatePasswordDto,
  BodyUpdateUserDto,
  QueryFetchUserDto,
} from './users.dto'
import { JoiValidationPipe } from '../../common/pipes/joi.pipe'
import {
  createUserValidation,
  updatePasswordUserValidation,
  updateUserValidation,
} from './users.validation'
import { ResponseData, ResponseError, ResponseResult } from '../../common/response'
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'

@ApiTags('Users')
@Controller('api/v1/users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new JoiValidationPipe(createUserValidation))
  @ApiOperation({ summary: 'Create a new user' })
  @ApiOkResponse({
    description: 'The user records',
    type: ResponseResult<User>,
  })
  async createUser(
    @Body() user: BodyCreateUserDto,
  ): Promise<ResponseResult<UserPublicProperty>> {
    const data = await this.userService.createUser(user)
    return {
      statusCode: 201,
      data,
    }
  }

  @Get()
  @ApiOperation({ summary: 'Fetch users with pagination' })
  @ApiOkResponse({
    description: 'The user records',
    type: ResponseResult<User>,
  })
  async fetchUsers(
    @Query() query: QueryFetchUserDto,
  ): Promise<ResponseResult<UserPublicProperty>> {
    const { page = 1, size = 10 } = query

    const data = await this.userService.fetchUser({ page, size })

    return {
      statusCode: 200,
      data,
    }
  }

  @Get(':id/detail')
  @ApiOperation({ summary: 'Find one user by ID' })
  @ApiOkResponse({
    description: 'The user records',
    type: ResponseResult<User>,
  })
  async findUserById(
    @Param('id') id: string,
  ): Promise<ResponseResult<UserPublicProperty>> {
    const data = await this.userService.getUserById(id)

    delete data.password

    return {
      statusCode: 200,
      data,
    }
  }

  @Put(':id/detail')
  @ApiOperation({ summary: 'Change user data by ID' })
  @ApiOkResponse({
    description: 'The user records',
    type: ResponseData,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    type: ResponseError,
  })
  @UsePipes(new JoiValidationPipe(updateUserValidation))
  async updateUserById(
    @Param('id') id: string,
    @Body() body: BodyUpdateUserDto,
  ): Promise<ResponseData> {
    await this.userService.updateUser(id, body)

    return {
      statusCode: 200,
      message: 'User updated successfully',
    }
  }

  @Patch(':id/detail')
  @ApiOperation({ summary: 'Change password user by ID' })
  @ApiOkResponse({
    description: 'The user records',
    type: ResponseData,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    type: ResponseError,
  })
  @UsePipes(new JoiValidationPipe(updatePasswordUserValidation))
  async updatePasswordUserById(
    @Param('id') id: string,
    @Body() body: BodyUpdatePasswordDto,
  ): Promise<ResponseData> {
    await this.userService.updatePasswordUser(id, body)
    return {
      statusCode: 200,
      message: 'Password updated successfully',
    }
  }

  @Delete(':id/detail')
  @ApiOkResponse({
    description: 'The user records',
    type: ResponseData,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
    type: ResponseError,
  })
  @ApiOperation({ summary: 'Delete User by ID' })
  async deleteUserById(@Param('id') id: string): Promise<ResponseData> {
    await this.userService.deleteUser(id)
    return {
      statusCode: 200,
      message: 'User deleted successfully',
    }
  }
}
