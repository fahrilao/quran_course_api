import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UsePipes,
} from '@nestjs/common'
import { CustomPropertiesService } from './custom-properties.service'
import { JoiValidationPipe } from '../../common/pipes/joi.pipe'
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'
import { ResponseData, ResponseError, ResponseResult } from '../../common/response'
import { CustomProperty } from './custom-properties.schema'
import {
  BodyCustomPropertiesDto,
  QueryFetchCustomPropertyDto,
} from './custom-properties.dto'
import { bodyCustomPropertyValidation } from './custom-properties.validation'

@ApiTags('Custom Properties')
@Controller('api/v1/custom-properties')
export class CustomPropertiesController {
  constructor(private customPropertiesService: CustomPropertiesService) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new JoiValidationPipe(bodyCustomPropertyValidation))
  @ApiOperation({ summary: 'Create a new custom property' })
  @ApiOkResponse({
    description: 'The custom property records',
    type: ResponseResult<CustomProperty>,
  })
  async createCustomProperty(
    @Body() customProperty: BodyCustomPropertiesDto,
  ): Promise<ResponseResult<CustomProperty>> {
    const data = await this.customPropertiesService.createCustomProperty(customProperty)
    return {
      statusCode: 201,
      data,
    }
  }

  @Get()
  @ApiOperation({ summary: 'Fetch custom properties with pagination' })
  @ApiOkResponse({
    description: 'The custom property records',
    type: ResponseResult<CustomProperty>,
  })
  async fetchCustomProperties(
    @Query() query: QueryFetchCustomPropertyDto,
  ): Promise<ResponseResult<CustomProperty>> {
    const { page = 1, size = 10, section, field_name } = query
    const search = { section, field_name }

    const data = await this.customPropertiesService.fetchCustomProperties(
      { page, size },
      search,
    )

    return {
      statusCode: 200,
      data,
    }
  }

  @Get(':id/detail')
  @ApiOperation({ summary: 'Find one custom property by ID' })
  @ApiOkResponse({
    description: 'The custom property records',
    type: ResponseResult<CustomProperty>,
  })
  async findCustomPropertyById(
    @Param('id') id: string,
  ): Promise<ResponseResult<CustomProperty>> {
    const data = await this.customPropertiesService.getCustomPropertyById(id)

    return {
      statusCode: 200,
      data,
    }
  }

  @Put(':id/detail')
  @ApiOperation({ summary: 'Change custom property data by ID' })
  @ApiOkResponse({
    description: 'The custom property records',
    type: ResponseData,
  })
  @ApiNotFoundResponse({
    description: 'CustomProperty not found',
    type: ResponseError,
  })
  @UsePipes(new JoiValidationPipe(bodyCustomPropertyValidation))
  async updateCustomPropertyById(
    @Param('id') id: string,
    @Body() body: BodyCustomPropertiesDto,
  ): Promise<ResponseData> {
    const affected = await this.customPropertiesService.updateCustomProperty(id, body)

    return {
      statusCode: 200,
      message: `Total ${affected} affected`,
    }
  }

  @Delete(':id/detail')
  @ApiOkResponse({
    description: 'The custom property records',
    type: ResponseData,
  })
  @ApiNotFoundResponse({
    description: 'CustomProperty not found',
    type: ResponseError,
  })
  @ApiOperation({ summary: 'Delete CustomProperty by ID' })
  async deleteCustomPropertyById(@Param('id') id: string): Promise<ResponseData> {
    const affected = await this.customPropertiesService.deleteCustomProperty(id)
    return {
      statusCode: 200,
      message: `Total ${affected} affected`,
    }
  }
}
