import { Injectable, NotFoundException, Param } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { CustomProperty, CustomPropertyDocument } from './custom-properties.schema'
import { Model } from 'mongoose'
import { BodyCustomPropertiesDto } from './custom-properties.dto'
import { PaginationRequest, PaginationResponse } from '../../common/pagination'

@Injectable()
export class CustomPropertiesService {
  constructor(
    @InjectModel(CustomProperty.name)
    private customPropertiesModel: Model<CustomPropertyDocument>,
  ) {}

  async createCustomProperty(
    data: BodyCustomPropertiesDto,
  ): Promise<CustomPropertyDocument> {
    const customProperties = await this.customPropertiesModel.create(data)

    return customProperties
  }

  async fetchCustomProperties(
    pagination: PaginationRequest,
    search: Partial<CustomPropertyDocument>,
  ): Promise<PaginationResponse<CustomPropertyDocument>> {
    const where: any = {}
    if (search.field_name)
      where.field_name = {
        $regex: search.field_name,
      }
    if (search.section) where.section = search.section

    const [data, total] = await Promise.all([
      this.customPropertiesModel
        .find()
        .where(where)
        .skip(pagination.size * (pagination.page - 1))
        .limit(pagination.size)
        .exec(),
      this.customPropertiesModel.where(where).countDocuments(),
    ])

    return {
      data,
      page: +pagination.page,
      size: +pagination.size,
      total_item: total,
      total_page: Math.ceil(total / pagination.size),
    }
  }

  async getCustomPropertyById(id: string): Promise<CustomProperty> {
    const customProperty = await this.customPropertiesModel.findOne({ _id: id })
    if (!customProperty) {
      throw new NotFoundException('Custom Property not found')
    }
    return customProperty
  }

  async updateCustomProperty(id: string, data: Partial<CustomProperty>): Promise<number> {
    const customProperty = await this.customPropertiesModel.findOne({ _id: id })
    if (!customProperty) {
      throw new NotFoundException('Custom Property not found')
    }
    const res = await this.customPropertiesModel.updateOne({ _id: id }, data)
    return res.modifiedCount
  }

  async deleteCustomProperty(id: string): Promise<number> {
    const customProperty = await this.customPropertiesModel.findOne({ _id: id })
    if (!customProperty) {
      throw new NotFoundException('Custom Property not found')
    }

    const res = await this.customPropertiesModel.deleteOne({ _id: id })
    return res.deletedCount
  }
}
