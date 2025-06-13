
import { useEffect, useState } from "react"
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel
} from "@tanstack/react-table"
import { Loader, Loader2 } from "./loader"
import { Loader2Icon } from "lucide-react"

export function DataTable({ columns, data, globalFilter, bulkActions = [], showSelection = true, isLoading, pagesize = 5, }) {
  const [sorting, setSorting] = useState([])
  const [columnFilters, setColumnFilters] = useState([])
  const [rowSelection, setRowSelection] = useState({})
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: pagesize,
  })

  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      columnFilters,
      globalFilter,
      rowSelection,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    enableRowSelection: showSelection,
  })

  const selectedRows = table.getSelectedRowModel().rows;

  return (
    <div className="w-full overflow-x-auto rounded-md border border-gray-200 dark:border-gray-700 shadow-sm">

      {/* Bulk actions */}
      {bulkActions.length > 0 && selectedRows.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-2 p-3 sm:p-4 bg-white">
          {bulkActions.map(({ label, onClick, message }) => (
            <div key={label} className="flex flex-col sm:flex-row sm:justify-between gap-2 sm:gap-0">
              <span className="text-sm sm:text-base">{message}</span>
              <button
                className="px-3 py-2 bg-blue-600 text-white rounded text-sm sm:text-base whitespace-nowrap"
                onClick={() => onClick(selectedRows.map((row) => row.original))}
              >
                {label}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] table-auto text-left text-xs sm:text-sm text-gray-900 dark:text-gray-100">
          <thead className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-2 sm:px-3 py-2 sm:py-2.5 font-medium text-center border-r border-gray-200 dark:border-gray-700 last:border-r-0 text-xs sm:text-sm"
                    style={{
                      width: header.column.id === "actions" ? "8rem" : header.column.id === "id" ? "50px" : "auto",
                      minWidth: header.column.id === "actions" ? "8rem" : header.column.id === "id" ? "50px" : "120px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="p-4 text-center text-gray-500 dark:text-gray-400">
                  <Loader2Icon className="mx-auto h-6 w-6 animate-spin text-gray-500 dark:text-gray-400" />
                </td>
              </tr>
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row, index) => (
                <tr
                  key={row.id}
                  className="dark:hover:bg-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 transition-colors duration-200"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-2 sm:px-3 py-2 sm:py-2.5 text-center border-r border-gray-200 dark:border-gray-700 last:border-r-0 text-xs sm:text-sm"
                      style={{
                        maxWidth: cell.column.id === "actions" ? "12rem" : cell.column.id === "title" ? "200px" : "150px",
                        minWidth: cell.column.id === "actions" ? "8rem" : "80px",
                        whiteSpace: cell.column.id === "title" ? "normal" : "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="p-4 text-center text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 px-3 sm:px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
          <span className="whitespace-nowrap">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            className="px-2 py-1 text-xs sm:text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-500 w-full sm:w-auto"
          >
            {[5, 10, 20, 50].map((size) => (
              <option key={size} value={size}>
                Show {size}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="flex-1 sm:flex-none px-3 py-1 text-xs sm:text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Prev
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="flex-1 sm:flex-none px-3 py-1 text-xs sm:text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
