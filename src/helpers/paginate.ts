export interface metaPaginate {
  current_page: number
  from: number
  last_page: number
  per_page: number
  to: number
  total: number
}

export const perPage = (requestQuery: {
  per_page: string,
  current_page: string
}) => {
  const perPage = Number(requestQuery.per_page) || 20
  const currentPage = Number(requestQuery.current_page) || 1

  return {
    perPage,
    currentPage,
    isFromStart: true
  }
}

export const metaPagination = (pagination: any): metaPaginate => {
  return {
    current_page: pagination.currentPage,
    from: pagination.from,
    last_page: pagination.lastPage || 0,
    per_page: pagination.perPage,
    to: pagination.to,
    total: pagination.total || 0,
  }
}
