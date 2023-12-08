import { ApiProperty } from '@nestjs/swagger'
import { UserLevel } from './user.schema'

export class BodyCreateUserDto {
  @ApiProperty({
    title: 'Username',
    format: 'string',
  })
  username: string

  @ApiProperty({
    title: 'Password',
    format: 'string',
  })
  password: string

  @ApiProperty({
    title: 'Level',
    format: 'string',
    example: UserLevel.ADMIN,
  })
  level: UserLevel
}

export class BodyUpdateUserDto {
  @ApiProperty({
    title: 'Username',
    format: 'string',
  })
  username: string

  @ApiProperty({
    title: 'Level',
    format: 'string',
    example: UserLevel.ADMIN,
  })
  level: UserLevel
}

export class QueryFetchUserDto {
  @ApiProperty({
    title: 'Page',
    format: 'int32',
    default: 1,
    required: false,
  })
  page: number

  @ApiProperty({
    title: 'Size',
    format: 'int32',
    default: 10,
    required: false,
  })
  size: number
}

export class BodyUpdatePasswordDto {
  @ApiProperty({
    title: 'Old Password',
    format: 'string',
  })
  old_password: string

  @ApiProperty({
    title: 'New Password',
    format: 'string',
  })
  new_password: string
}
