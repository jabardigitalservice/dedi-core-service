export const perPage = (requestQuery: {
  per_page: string,
  current_page: string
}) => {
  const perPageNumber = Number(requestQuery.per_page)
  const currentPageNumber = Number(requestQuery.current_page)

  const perPage = requestQuery.per_page && !isNaN(perPageNumber) ? perPageNumber : 20
  const currentPage = requestQuery.current_page && !isNaN(currentPageNumber) ? currentPageNumber : 1

  return {
    perPage,
    currentPage
  }
}
