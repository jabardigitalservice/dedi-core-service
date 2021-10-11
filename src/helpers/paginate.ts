export const perPage = (requestQuery: {
  perPage: string,
  currentPage: string
}) => {
  const perPageNumber = Number(requestQuery.perPage)
  const currentPageNumber = Number(requestQuery.currentPage)

  const perPage = requestQuery.perPage && !isNaN(perPageNumber) ? perPageNumber : 20
  const currentPage = requestQuery.currentPage && !isNaN(currentPageNumber) ? currentPageNumber : 1

  return {
    perPage,
    currentPage
  }
}
