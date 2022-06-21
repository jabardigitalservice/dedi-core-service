export interface metaPaginate {
  current_page: number
  from: number
  last_page: number
  per_page: number
  to: number
  total: number
}

interface Pagination {
  per_page: string
  current_page: string
}

export const pagination = (request: Pagination) => {
  const perPage = Number(request.per_page) || 20
  const currentPage = Number(request.current_page) || 1

  return {
    perPage,
    currentPage,
    isLengthAware: true,
  }
}

export const metaPagination = (pagination: any): metaPaginate => ({
  current_page: pagination.currentPage,
  from: pagination.from,
  last_page: pagination.lastPage,
  per_page: pagination.perPage,
  to: pagination.to,
  total: pagination.total,
})
