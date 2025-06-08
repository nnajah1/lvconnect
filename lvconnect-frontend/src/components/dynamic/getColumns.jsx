
import React, { useState } from "react"
import { ArrowDown, ArrowUp, ArrowUpDown, Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"

// FilterPopover component extracted to safely use useState
const FilterPopover = ({ column, config }) => {
  const [open, setOpen] = useState(false)
  const [filterValue, setFilterValue] = useState("")

  return (
    <Popover open={open} onOpenChange={setOpen} >
      <PopoverTrigger onClick={(e) => e.stopPropagation()}>
        <Button
          variant="ghost"
          size="icon"
          className="h-5 w-5 align-middle hover:bg-gray-100 dark:hover:bg-gray-700 "
          onClick={(e) => {
            e.stopPropagation();
            setOpen(!open);
          }}
        >
          <Filter className="h-4 w-4" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-60 p-3 bg-white" align="start" onClick={(e) => e.stopPropagation()}>
        <div className="space-y-2">
          <h4 className="font-medium">Filter {config.header}</h4>
          <Input
            placeholder={`Filter ${config.header.toLowerCase()}...`}
            value={filterValue}
            onChange={(e) => {
              e.stopPropagation();
              column.setFilterValue(e.target.value)
              setFilterValue(e.target.value)
            }}
            className="h-8"
          />
          <div className="flex justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // e.stopPropagation();
                column.setFilterValue("")
                setFilterValue("")
              }}
              className="text-xs flex"
            >
              <X className="mr-1 h-4 w-4" />
              Clear
            </Button>
            <Button size="sm" onClick={(e) => {
              e.stopPropagation()
              setOpen(false)
            }} className="text-xs">
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export const getColumns = ({
  userRole,
  schema = {},
  context,
  openModal,
  actions = {},
  actionConditions = {},
  showSelectionColumn = false, 
  showActionColumn =  true,
}) => {
  
  const selectionColumn = showSelectionColumn
    ? {
      id: "select",
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={table.getIsAllPageRowsSelected()}
          onChange={table.getToggleAllPageRowsSelectedHandler()}
          className="m-auto"
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
          className="m-auto"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    }
    : null; 

  const baseColumns = Object.entries(schema)
    .filter(([_, config]) => config.display !== false)
    .map(([key, config]) => {
      return {
        accessorKey: key !== "select" && key !== "actions" ? key : undefined,
        header: ({ column }) => {
          if (config.header === "Actions") return config.header

          const isSorted = column.getIsSorted()
          const isInteractive = config.sortable || config.filterable

          return (
            <div
              className={`flex items-center gap-1 w-full ${isInteractive ? "cursor-pointer justify-between" : "justify-center"}`}
              onClick={() => {
                if (config.sortable) {
                  column.toggleSorting(isSorted === "asc")
                }
              }}
            >
              <span className="truncate">{config.header}</span>
              <div className="flex items-center flex-shrink-0">
                {config.filterable && <FilterPopover column={column} config={config} />}
                {config.sortable && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 p-0 ml-1 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={(e) => {
                      e.stopPropagation()
                      column.toggleSorting(isSorted === "asc")
                    }}
                  >
                    {isSorted === "asc" ? (
                      <ArrowUp className="h-4 w-4" />
                    ) : isSorted === "desc" ? (
                      <ArrowDown className="h-4 w-4" />
                    ) : (
                      <ArrowUpDown className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                )}
              </div>
            </div>
          )
        },
        cell: ({ row }) => {
          const value = row.original[key]

          if (key === "id") return row.index + 1

          if (config.customCell) return config.customCell(value, row.original)

          if (config.format === "date") {
            return value ? new Date(value).toLocaleDateString() : "-"
          }

          if (config.format === "array") {
            return value ? value.join(", ") : "-"
          }

          return value || "-"
        },
        enableSorting: config.sortable || false,
        enableFiltering: config.filterable || false,
        enableGlobalFilter: true,
        ...(config.filterFn && { filterFn: config.filterFn })
        
      }
      
    })

  const actionColumn = showActionColumn ?
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      const item = row.original

      const applicableActions = Object.entries(actions)
        .filter(([actionName]) => {
          const condition = actionConditions[actionName]
          return condition ? condition(item, userRole, context) : false
        })
        .map(([actionName, { fn, variant, icon, className }]) => (
          <Button
            key={actionName}
            variant={variant(item) || "default"}
            size="icon"
            className={`flex items-center gap-1 px-4 py-2 ${className}`}
            onClick={() => fn(item.id, item)}
          >
            {icon(item)}
          </Button>
        ))

      return <div className="flex justify-center gap-2">{applicableActions}</div>
    },
  } : null;

  // Return the columns, including the selection column if it's enabled
  return [selectionColumn, ...baseColumns, actionColumn].filter(Boolean)
}
