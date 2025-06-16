
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
    <div className="w-full overflow-x-auto">
      <div className="max-w-[80vw] sm:max-w-full w-full">
      {/* Bulk Actions */}
      {bulkActions.length > 0 && selectedRows.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-2 p-3 sm:p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
         {bulkActions.map(({ label, onClick, message }) => (
          <div key={label} className="flex flex-col sm:flex-row sm:justify-between gap-2 sm:gap-0 w-full sm:w-auto">
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

      {/* Table Container with Horizontal Scroll */}
      <div className="w-full overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
        <table className="w-full min-w-[600px] table-auto text-left text-gray-900 dark:text-gray-100">
         <thead className="text-left dark:bg-gray-800 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
             {headerGroup.headers.map((header) => (
              <th
                key={header.id}
                className="bg-white dark:bg-gray-900 px-2 sm:px-3 py-2 sm:py-2.5 font-semibold border-gray-200 dark:border-gray-700 text-left text-gray-500"
                style={{
                 width: header.column.id === "actions" || header.column.id === "action" ? "8rem" : header.column.id === "id" ? "50px" : "auto",
                 minWidth: header.column.id === "actions" || header.column.id === "action" ? "8rem" : header.column.id === "id" ? "50px" : "120px",
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
             <td colSpan={columns.length} className="p-4 text-left text-gray-500 dark:text-gray-400">
              <Loader2Icon className="mx-auto h-6 w-6 animate-spin" />
             </td>
            </tr>
          ) : table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
             <tr
              key={row.id}
              className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
             >
              {row.getVisibleCells().map((cell) => (
                <td
                 key={cell.id}
                 className="px-2 sm:px-3 py-2 sm:py-2.5 text-left border-gray-200 dark:border-gray-700"
                 style={{
                  maxWidth:
                    cell.column.id === "actions"
                     ? "fit-content"
                     : cell.column.id === "title"
                      ? "200px"
                      : "150px",
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
             <td
              colSpan={columns.length}
              className="p-4 text-center text-gray-500 dark:text-gray-400"
             >
              No data available
             </td>
            </tr>
          )}
         </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 px-3 sm:px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
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
          className="flex-1 sm:flex-none px-3 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
         >
          Prev
         </button>
         <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="flex-1 sm:flex-none px-3 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
         >
          Next
         </button>
        </div>
      </div>
     </div>
    </div>
    )
}
