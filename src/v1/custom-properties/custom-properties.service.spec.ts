import { Test, TestingModule } from '@nestjs/testing'
import { CustomPropertiesService } from './custom-properties.service'
import { CustomProperty, CustomPropertyDocument } from './custom-properties.schema'
import { getModelToken } from '@nestjs/mongoose'
import mongoose, { Model } from 'mongoose'
import {
  BodyCustomPropertiesDto,
  QueryFetchCustomPropertyDto,
} from './custom-properties.dto'
import { PaginationRequest } from '../../common/pagination'
import { NotFoundException } from '@nestjs/common'

describe('CustomPropertiesService', () => {
  let customPropertiesService: CustomPropertiesService,
    model: Model<CustomPropertyDocument>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomPropertiesService,
        {
          provide: getModelToken(CustomProperty.name),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn().mockReturnThis(),
            updateOne: jest.fn(),
            create: jest.fn(),
            deleteOne: jest.fn(),
            countDocuments: jest.fn(),
            where: jest.fn().mockReturnThis(),
          },
        },
      ],
    }).compile()

    customPropertiesService = module.get<CustomPropertiesService>(CustomPropertiesService)
    model = module.get<Model<CustomPropertyDocument>>(getModelToken('CustomProperty'))
  })

  it('should create a new custom properties', async () => {
    const mockCustomPropertyBody: BodyCustomPropertiesDto = {
      field_name: 'Other Info',
      is_required: false,
      type: 'string',
      section: 'User:Teacher',
    }
    const modelCreate = jest
      .spyOn(model, 'create')
      .mockImplementationOnce(() => Promise.resolve(mockCustomPropertyBody as any))

    const create = await customPropertiesService.createCustomProperty(
      mockCustomPropertyBody,
    )
    expect(create).toHaveProperty('field_name', mockCustomPropertyBody.field_name)
    expect(modelCreate).toHaveBeenCalledWith(mockCustomPropertyBody)
  })

  it('should fetch array of users', async () => {
    const mockCustomProperties = [
      {
        _id: new mongoose.Types.ObjectId('6572740145f495910232a390'),
        field_name: 'Other Info',
        is_required: false,
        type: 'string',
        section: 'User:Teacher',
      },
    ]

    const modelFind = jest.spyOn(model, 'find').mockReturnValue({
      where: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      exec: () => mockCustomProperties,
    } as any)

    const modelCount = jest.spyOn(model, 'where').mockReturnValue({
      countDocuments: jest.fn().mockReturnValue(1),
    } as any)

    const pagination: PaginationRequest = {
      size: 10,
      page: 1,
    }

    const search: Omit<QueryFetchCustomPropertyDto, 'size' | 'page'> = {
      field_name: 'Other',
      section: 'User:Teacher',
    }

    const fetch = await customPropertiesService.fetchCustomProperties(pagination, search)
    expect(fetch.size).toEqual(pagination.size)
    expect(fetch.page).toEqual(pagination.page)
    expect(fetch.data).toHaveLength(1)
    expect(fetch.data).toEqual(mockCustomProperties)
    expect(modelFind).toHaveBeenCalled()
    expect(modelCount).toHaveBeenCalled()
  })

  it('should return one user', async () => {
    const mockCustomProperty = {
      _id: new mongoose.Types.ObjectId('6572740145f495910232a390'),
      field_name: 'Other Info',
      is_required: false,
      type: 'string',
      section: 'User:Teacher',
    }

    const findOneModel = jest
      .spyOn(model, 'findOne')
      .mockReturnValue(mockCustomProperty as any)
    const findOne = await customPropertiesService.getCustomPropertyById(
      mockCustomProperty._id.toString(),
    )

    expect(findOne).toEqual(mockCustomProperty)
    expect(findOneModel).toHaveBeenCalledWith({
      _id: mockCustomProperty._id.toString(),
    })
  })

  it('should update custom property', async () => {
    const mockUser = {
      _id: new mongoose.Types.ObjectId('6572740145f495910232a390'),
      field_name: 'Other Info',
      is_required: false,
      type: 'string',
      section: 'User:Teacher',
    }

    const body: CustomProperty = {
      field_name: 'Some Info',
      is_required: false,
      type: 'string',
      section: 'User:Teacher',
    }

    const findOne = jest.spyOn(model, 'findOne').mockReturnValue(mockUser as any)
    const updateOne = jest
      .spyOn(model, 'updateOne')
      .mockReturnValue({ modifiedCount: 1 } as any)

    const updateUser = await customPropertiesService.updateCustomProperty(
      mockUser._id.toString(),
      body,
    )

    expect(updateUser).toEqual(1)
    expect(findOne).toHaveBeenCalledWith({ _id: mockUser._id.toString() })
    expect(updateOne).toHaveBeenCalledWith({ _id: mockUser._id.toString() }, body)
  })

  it('should remove custom property', async () => {
    const mockUser = {
      _id: new mongoose.Types.ObjectId('6572740145f495910232a390'),
      field_name: 'Other Info',
      is_required: false,
      type: 'string',
      section: 'User:Teacher',
    }

    const findOne = jest.spyOn(model, 'findOne').mockReturnValue(mockUser as any)
    const deleteOne = jest
      .spyOn(model, 'deleteOne')
      .mockReturnValue({ deletedCount: 1 } as any)

    const deleteUser = await customPropertiesService.deleteCustomProperty(
      mockUser._id.toString(),
    )

    expect(deleteUser).toEqual(1)
    expect(findOne).toHaveBeenCalledWith({ _id: mockUser._id.toString() })
    expect(deleteOne).toHaveBeenCalledWith({ _id: mockUser._id.toString() })
  })

  it('should throw not found error', async () => {
    const id = '6572740145f495910232a390'

    const findOneModel = jest.spyOn(model, 'findOne').mockReturnValue(null)

    await expect(
      customPropertiesService.getCustomPropertyById(id),
    ).rejects.toBeInstanceOf(NotFoundException)
    await expect(
      customPropertiesService.updateCustomProperty(id, null),
    ).rejects.toBeInstanceOf(NotFoundException)
    await expect(customPropertiesService.deleteCustomProperty(id)).rejects.toBeInstanceOf(
      NotFoundException,
    )
    expect(findOneModel).toHaveBeenCalledWith({
      _id: id,
    })
  })
})
