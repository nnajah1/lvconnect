"use client";
import { BiSortUp, BiSortDown, BiSortAlt2} from "react-icons/bi";
import { Button } from "@/components/ui/button";

export const getColumns = ({
    userRole,
    schema = {},
    context,
    actions = {},
    actionConditions = {},
    customRenderers = {},
    sorting, // Sorting state from parent component
    setSorting, // Function to update sorting state

}) => {

    // Generate columns from schema
    const baseColumns = Object.entries(schema)
        .filter(([_, config]) => config.display !== false)
        .map(([key, config]) => ({
            accessorKey: key,
            header: ({ column }) => {
                if (config.header === "Actions") return config.header;

                const isSorted = column.getIsSorted();

                return (
                    <button
                        onClick={() => column.toggleSorting(isSorted === "asc")}
                        className="items-center space-x-1 inline-flex"
                    >
                        <span>{config.header}</span>
                        {isSorted === "asc" ? (
                            <BiSortUp />
                        ) : isSorted === "desc" ? (
                            <BiSortDown />
                        ) : (
                            <BiSortAlt2 />
                        )}
                    </button>
                );
            },

            cell: ({ row }) => {
                const value = row.original[key];

                // Checkbox for ID column
                if (key === "id") {
                    return row.index + 1;
                }

                // Use custom renderer if provided
                if (customRenderers[key]) {
                    return customRenderers[key](value, row.original);
                }

                // Default formatting
                if (config.format === "date") {
                    return value ? new Date(value).toLocaleDateString() : "-";
                }

                if (config.format === "array") {
                    return value ? value.join(", ") : "-";
                }
                return value || "-";
            },
            enableSorting: config.enableSorting || false,
        }));

    // Action column
    const actionColumn = {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const item = row.original;
            const applicableActions = Object.entries(actions)
                .filter(([actionName]) => {
                    const condition = actionConditions[actionName];
                    return condition ? condition(item, userRole, context) : true;
                })
                .map(([actionName, { fn, variant}]) => (
                    <Button
                        key={actionName}
                        variant={variant || "outline"}
                        size="sm"
                        onClick={() => fn(item.id, item)}
                    >
                        {actionName.charAt(0).toUpperCase() + actionName.slice(1)}
                    </Button>
                ));

            return <div className="flex space-x-2 justify-center items-center w-full">{applicableActions}</div>;
        },
    };

    return [...baseColumns, actionColumn];
};