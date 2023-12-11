import { Test, TestingModule } from '@nestjs/testing'
import { UsersService } from './users.service'
import { getModelToken } from '@nestjs/mongoose'
import { User, UserDocument, UserLevel } from './user.schema'
import { BodyUpdatePasswordDto, BodyCreateUserDto } from './users.dto'
import { PaginationRequest } from '../../common/pagination'
import mongoose, { Model } from 'mongoose'

jest.mock(
  'bcrypt',
  jest.fn().mockImplementation(() => ({
    hash: jest.fn().mockReturnValue('hashpassword'),
    compare: jest.fn().mockReturnValue(1),
  })),
)

jest.mock(
  'uuid',
  jest.fn().mockImplementation(() => ({
    v4: jest.fn().mockReturnValue('uuidv4'),
  })),
)

describe('UsersService', () => {
  let userService: UsersService, model: Model<UserDocument>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn().mockReturnThis(),
            updateOne: jest.fn(),
            create: jest.fn(),
            deleteOne: jest.fn(),
            countDocuments: jest.fn(),
          },
        },
      ],
    }).compile()

    userService = module.get<UsersService>(UsersService)
    model = module.get<Model<UserDocument>>(getModelToken('User'))
  })

  it('should be defined', () => {
    expect(userService).toBeDefined()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should create a new user', async () => {
    const mockUserBody: BodyCreateUserDto = {
      username: 'dummy',
      password: '123456789',
      level: UserLevel.ADMIN,
    }
    const modelCreate = jest
      .spyOn(model, 'create')
      .mockImplementationOnce(() => Promise.resolve(mockUserBody as any))

    const create = await userService.createUser(mockUserBody)
    expect(create).toHaveProperty('username', mockUserBody.username)
    expect(modelCreate).toHaveBeenCalledWith({
      ...mockUserBody,
      password: 'hashpassword',
    })
  })

  it('should fetch array of users', async () => {
    const mockUser = [
      {
        _id: new mongoose.Types.ObjectId('6572740145f495910232a390'),
        username: 'dummy',
        password: 'hashpassword',
        level: UserLevel.SUPER,
        toObject: function () {
          return {
            _id: this._id,
            username: this.username,
            password: this.password,
            level: UserLevel.SUPER,
          }
        },
      },
    ]

    const modelFind = jest.spyOn(model, 'find').mockReturnValue({
      limit: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      exec: () => mockUser,
    } as any)

    const modelCount = jest.spyOn(model, 'countDocuments').mockReturnValue(1 as any)

    const pagination: PaginationRequest = {
      size: 10,
      page: 1,
    }

    const fetch = await userService.fetchUser(pagination)
    expect(fetch.size).toEqual(pagination.size)
    expect(fetch.page).toEqual(pagination.page)
    expect(fetch.data).toHaveLength(1)
    expect(fetch.data).toEqual(
      mockUser.map((user) => {
        const { password, ...data } = user.toObject()
        return data
      }),
    )
    expect(modelFind).toHaveBeenCalled()
    expect(modelCount).toHaveBeenCalled()
  })

  it('should return one user', async () => {
    const mockUser = {
      _id: new mongoose.Types.ObjectId('6572740145f495910232a390'),
      username: 'dummy',
      password: 'hashpassword',
      level: UserLevel.SUPER,
      toObject: function () {
        return {
          _id: this._id,
          username: this.username,
          password: this.password,
          level: UserLevel.SUPER,
        }
      },
    }

    const findOneModel = jest.spyOn(model, 'findOne').mockReturnValue(mockUser as any)
    const findOne = await userService.getUserById(mockUser._id.toString())
    const { password, ...mockRes } = mockUser.toObject()

    expect(findOne).toEqual(mockRes)
    expect(findOneModel).toHaveBeenCalledWith({
      _id: mockUser._id,
    })
  })

  it('should update password user', async () => {
    const mockUser = {
      _id: new mongoose.Types.ObjectId('6572740145f495910232a390'),
      username: 'dummy',
      password: 'hashpassword',
      level: UserLevel.SUPER,
      toObject: function () {
        return {
          _id: this._id,
          username: this.username,
          password: this.password,
          level: UserLevel.SUPER,
        }
      },
    }

    const body: BodyUpdatePasswordDto = {
      old_password: 'oldpassword',
      new_password: 'newpassword',
    }

    const findOne = jest.spyOn(model, 'findOne').mockReturnValue(mockUser as any)
    const updateOne = jest
      .spyOn(model, 'updateOne')
      .mockReturnValue({ modifiedCount: 1 } as any)

    const updatePassword = await userService.updatePasswordUser(
      mockUser._id.toString(),
      body,
    )

    expect(updatePassword).toEqual(1)
    expect(updateOne).toHaveBeenCalledWith(
      { _id: mockUser._id },
      { password: 'hashpassword' },
    )
    expect(findOne).toHaveBeenCalledWith({ _id: mockUser._id })
  })

  it('should update user', async () => {
    const mockUser = {
      _id: new mongoose.Types.ObjectId('6572740145f495910232a390'),
      username: 'dummy',
      password: 'hashpassword',
      level: UserLevel.SUPER,
      toObject: function () {
        return {
          _id: this._id,
          username: this.username,
          password: this.password,
          level: UserLevel.SUPER,
        }
      },
    }

    const body: User = {
      username: 'dummicous',
      password: 'hashpasswordtwo',
      level: UserLevel.SUPER,
    }

    const findOne = jest.spyOn(model, 'findOne').mockReturnValue(mockUser as any)
    const updateOne = jest
      .spyOn(model, 'updateOne')
      .mockReturnValue({ modifiedCount: 1 } as any)

    const updateUser = await userService.updateUser(mockUser._id.toString(), body)

    expect(updateUser).toEqual(1)
    expect(findOne).toHaveBeenCalledWith({ _id: mockUser._id })
    expect(updateOne).toHaveBeenCalledWith({ _id: mockUser._id }, body)
  })

  it('should remove user', async () => {
    const mockUser = {
      _id: new mongoose.Types.ObjectId('6572740145f495910232a390'),
      username: 'dummy',
      password: 'hashpassword',
      level: UserLevel.SUPER,
      toObject: function () {
        return {
          _id: this._id,
          username: this.username,
          password: this.password,
          level: this.level,
        }
      },
    }

    const findOne = jest.spyOn(model, 'findOne').mockReturnValue(mockUser as any)
    const deleteOne = jest
      .spyOn(model, 'deleteOne')
      .mockReturnValue({ deletedCount: 1 } as any)

    const deleteUser = await userService.deleteUser(mockUser._id.toString())

    expect(deleteUser).toEqual(1)
    expect(findOne).toHaveBeenCalledWith({ _id: mockUser._id })
    expect(deleteOne).toHaveBeenCalledWith({ _id: mockUser._id })
  })
})
