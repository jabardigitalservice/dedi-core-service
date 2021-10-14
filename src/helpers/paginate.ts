export const perPage = (requestQuery: {
  per_page: string,
  current_page: string
}) => {
  const perPage = Number(requestQuery.per_page) || 20
  const currentPage = Number(requestQuery.current_page) || 1

  return { perPage, currentPage }
}
