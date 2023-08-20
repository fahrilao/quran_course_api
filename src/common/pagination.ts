export class PaginationRequest {
  page: number
  size: number
}

export class PaginationResponse<T> extends PaginationRequest {
  data: T[]
  total_item: number
  total_page: number
}
