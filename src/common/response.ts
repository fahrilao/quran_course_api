import { ApiProperty } from '@nestjs/swagger'
import { PaginationResponse } from './pagination'

export class ResponseData {
  @ApiProperty({
    title: 'status code',
  })
  statusCode: number

  @ApiProperty({
    title: 'message',
    required: false,
  })
  message?: string
}

export class ResponseError extends ResponseData {
  @ApiProperty({
    title: 'error message',
  })
  error: string
}

export class ResponseResult<T> extends ResponseData {
  @ApiProperty({
    title: 'result data',
  })
  data: T | PaginationResponse<T>
}
