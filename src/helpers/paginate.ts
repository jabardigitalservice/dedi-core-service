export const perPage = (requestQuery: {
  per_page: string,
  current_page: string
}) => {
  const perPageNumber = Number(requestQuery.per_page) || 20
  const currentPageNumber = Number(requestQuery.current_page) || 1

  return {
    perPage: perPageNumber,
    currentPage: currentPageNumber
  }
}
