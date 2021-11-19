export interface metaPaginate {
  current_page: number
  from: number
  last_page: number
  per_page: number
  to: number
  total: number
}

export const pagination = (requestQuery: {
  per_page: string,
  current_page: string
}) => {
  const perPage = Number(requestQuery.per_page) || 20
  const currentPage = Number(requestQuery.current_page) || 1

  return {
    perPage,
    currentPage,
    isLengthAware: true,
  }
}

export const metaPagination = (pagination: any): metaPaginate => ({
  current_page: pagination.currentPage,
  from: (pagination.currentPage - 1) * pagination.perPage + 1,
  last_page: pagination.lastPage,
  per_page: pagination.perPage,
  to: pagination.to,
  total: pagination.total,
})
