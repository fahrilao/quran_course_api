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
            findOneAndUpdate: jest.fn(),
            create: jest.fn(),
            findOneAndDelete: jest.fn(),
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
    const mockUserBody: UserDocument[] = [
      {
        _id: new mongoose.Types.ObjectId('6572740145f495910232a390'),
        username: 'dummy',
        password: '123456789',
      },
    ] as UserDocument[]

    const modelFind = jest.spyOn(model, 'find').mockReturnValue({
      limit: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      exec: () => mockUserBody,
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
      mockUserBody.map((user) => {
        delete user.password
        return user
      }),
    )
    expect(modelFind).toHaveBeenCalled()
    expect(modelCount).toHaveBeenCalled()
  })

  it('should return one user', async () => {
    const mockUser: UserDocument = {
      _id: new mongoose.Types.ObjectId('6572740145f495910232a390'),
      username: 'dummy',
      password: '123456789',
    } as UserDocument

    const findOneModel = jest.spyOn(model, 'findOne').mockReturnValue({
      exec: jest.fn().mockReturnValue(mockUser),
    } as any)

    const findOne = await userService.getUserById(mockUser._id.toString())
    expect(findOne).toEqual(mockUser)
    expect(findOneModel).toHaveBeenCalledWith({
      _id: mockUser._id,
    })
  })

  it('should update password user', async () => {
    const mockUser: UserDocument = {
      _id: new mongoose.Types.ObjectId('6572740145f495910232a390'),
      username: 'dummy',
      password: 'hashpassword',
    } as UserDocument

    const body: BodyUpdatePasswordDto = {
      old_password: 'oldpassword',
      new_password: 'newpassword',
    }

    const findOneModel = jest.spyOn(model, 'findOne').mockReturnValue({
      exec: jest.fn().mockReturnValue(mockUser),
    } as any)

    const findOneAndUpdateModel = jest
      .spyOn(model, 'findOneAndUpdate')
      .mockReturnValue(mockUser as any)

    const updatePassword = await userService.updatePasswordUser(
      mockUser._id.toString(),
      body,
    )

    expect(updatePassword).toEqual(1)
    expect(findOneAndUpdateModel).toHaveBeenCalledWith(
      { _id: mockUser._id },
      { password: 'hashpassword' },
    )
    expect(findOneModel).toHaveBeenCalledWith({ _id: mockUser._id })
  })

  it('should update user', async () => {
    const mockUser: UserDocument = {
      _id: new mongoose.Types.ObjectId('6572740145f495910232a390'),
      username: 'dummy',
      password: 'hashpassword',
    } as UserDocument

    const body: User = {
      username: 'dummicous',
      password: 'hashpasswordtwo',
      level: UserLevel.SUPER,
    }

    const findOneAndUpdateModel = jest
      .spyOn(model, 'findOneAndUpdate')
      .mockReturnValue(mockUser as any)

    const updateUser = await userService.updateUser(mockUser._id.toString(), body)

    expect(updateUser).toEqual(1)
    expect(findOneAndUpdateModel).toHaveBeenCalledWith({ _id: mockUser._id }, body)
  })

  it('should remove user', async () => {
    const mockUser: UserDocument = {
      _id: new mongoose.Types.ObjectId('6572740145f495910232a390'),
      username: 'dummy',
      password: 'hashpassword',
    } as UserDocument

    const findOneAndDeleteModel = jest
      .spyOn(model, 'findOneAndDelete')
      .mockReturnValue(mockUser as any)

    const deleteUser = await userService.deleteUser(mockUser._id.toString())

    expect(deleteUser).toEqual(1)
    expect(findOneAndDeleteModel).toHaveBeenCalledWith({ _id: mockUser._id })
  })
})
