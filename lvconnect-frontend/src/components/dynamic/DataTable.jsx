"use client";
import React, { useState } from "react";
import { flexRender, getCoreRowModel, useReactTable, getFilteredRowModel, getSortedRowModel } from "@tanstack/react-table";

export function DataTable({ columns, data }) {
    const [sorting, setSorting] = useState([]);

    const table = useReactTable({
        data: data || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(), // Enable sorting
        getFilteredRowModel: getFilteredRowModel(), // Enable filtering
        state: { sorting },
        onSortingChange: setSorting,
    });

    return (
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-x-auto">
            <table className="w-full text-left text-gray-900 dark:text-gray-100 divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-100 dark:bg-gray-800">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th key={header.id} className="p-3 text-center border-r border-gray-200 dark:border-gray-700 last:border-r-0">
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {table.getRowModel().rows.length ? (
                        table.getRowModel().rows.map((row) => (
                            <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                {row.getVisibleCells().map((cell) => (
                                    <td key={cell.id} className="p-3 text-center border-r border-gray-200 dark:border-gray-700 last:border-r-0">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={columns.length} className="p-3 text-center">No data available</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}