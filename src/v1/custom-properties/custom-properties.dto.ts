import { ApiProperty } from '@nestjs/swagger'

export class BodyCustomPropertiesDto {
  @ApiProperty({
    title: 'Field Name',
    format: 'string',
    required: true,
  })
  field_name: string

  @ApiProperty({
    title: 'Is Required',
    format: 'string',
    required: true,
  })
  is_required: boolean

  @ApiProperty({
    title: 'Type',
    format: 'string',
    required: true,
  })
  type: string

  @ApiProperty({
    title: 'Section',
    format: 'string',
    required: true,
  })
  section: string

  @ApiProperty({
    title: 'Custom Validation Name',
    format: 'string',
    required: false,
  })
  custom_validation?: string
}

export class QueryFetchCustomPropertyDto {
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

  @ApiProperty({
    title: 'Type',
    format: 'string',
    example: 'User:Teacher',
    required: false,
  })
  section?: string

  @ApiProperty({
    title: 'Name Field',
    format: 'string',
    example: 'Other Field',
    required: false,
  })
  field_name?: string
}
