export interface IPagination {
  currentPage: number
  perpage: number
  searchTerm: string
  total: number
  totalPages: number
  refreshTable: boolean
}
