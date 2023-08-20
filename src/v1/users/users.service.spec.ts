import { Test, TestingModule } from '@nestjs/testing'
import { UsersService } from './users.service'
import { getModelToken } from '@nestjs/mongoose'
import { User, UserDocument } from '../../schemas/user.chema'
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
    }
    const modelCreate = jest
      .spyOn(model, 'create')
      .mockImplementationOnce(() => Promise.resolve(mockUserBody as any))

    const create = await userService.createUser(mockUserBody)
    expect(create).toHaveProperty('username', mockUserBody.username)
    expect(modelCreate).toHaveBeenCalledWith({
      ...mockUserBody,
      id: 'uuidv4',
      password: 'hashpassword',
    })
  })

  it('should fetch array of users', async () => {
    const mockUserBody: UserDocument[] = [
      {
        _id: new mongoose.Types.ObjectId('4edd40c86762e0fb12000003'),
        id: '123',
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
      _id: new mongoose.Types.ObjectId('idfotheusers'),
      id: 'uuidv4',
      username: 'dummy',
      password: '123456789',
    } as UserDocument

    const findOneModel = jest.spyOn(model, 'findOne').mockReturnValue({
      exec: jest.fn().mockReturnValue(mockUser),
    } as any)

    const findOne = await userService.getUserById(mockUser.id)
    expect(findOne).toEqual(mockUser)
    expect(findOneModel).toHaveBeenCalledWith({
      id: mockUser.id,
    })
  })

  it('should update password user', async () => {
    const mockUser: UserDocument = {
      _id: new mongoose.Types.ObjectId('idfotheusers'),
      id: 'uuidv4',
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

    const updatePassword = await userService.updatePasswordUser(mockUser.id, body)

    expect(updatePassword).toEqual(1)
    expect(findOneAndUpdateModel).toHaveBeenCalledWith(
      { id: mockUser.id },
      { password: 'hashpassword' },
    )
    expect(findOneModel).toHaveBeenCalledWith({ id: mockUser.id })
  })

  it('should update user', async () => {
    const mockUser: UserDocument = {
      _id: new mongoose.Types.ObjectId('idfotheusers'),
      id: 'uuidv4',
      username: 'dummy',
      password: 'hashpassword',
    } as UserDocument

    const body: User = {
      id: 'uuidv4',
      username: 'dummicous',
      password: 'hashpasswordtwo',
    }

    const findOneAndUpdateModel = jest
      .spyOn(model, 'findOneAndUpdate')
      .mockReturnValue(mockUser as any)

    const updateUser = await userService.updateUser(mockUser.id, body)

    expect(updateUser).toEqual(1)
    expect(findOneAndUpdateModel).toHaveBeenCalledWith({ id: mockUser.id }, body)
  })

  it('should remove user', async () => {
    const mockUser: UserDocument = {
      _id: new mongoose.Types.ObjectId('idfotheusers'),
      id: 'uuidv4',
      username: 'dummy',
      password: 'hashpassword',
    } as UserDocument

    const findOneAndDeleteModel = jest
      .spyOn(model, 'findOneAndDelete')
      .mockReturnValue(mockUser as any)

    const deleteUser = await userService.deleteUser(mockUser.id)

    expect(deleteUser).toEqual(1)
    expect(findOneAndDeleteModel).toHaveBeenCalledWith({ id: mockUser.id })
  })
})
