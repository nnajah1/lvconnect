"use client"; // Ensure it's a client component
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export const columns = [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Title
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "updated_at",
    header: "Last Modified",
    cell: ({ row }) => new Date(row.getValue("updated_at")).toLocaleString(),
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const post = row.original;
      return (
        <div className="flex space-x-2">
          <Button size="sm" variant="outline" onClick={() => console.log("Edit", post.id)}>Edit</Button>
          <Button size="sm" variant="destructive" onClick={() => console.log("Delete", post.id)}>Delete</Button>
        </div>
      );
    },
  },
];
