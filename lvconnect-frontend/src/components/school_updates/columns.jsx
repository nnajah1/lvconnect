
import Button from "@/components/ui/button";

export const getColumns = (handleEdit, handleDelete) => [
  {
    accessorKey: "post",
    header: "Post",
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
    accessorKey: "lastModified",
    header: "Last Modified",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleEdit(row.original.id)}
        >
          Edit
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => handleDelete(row.original.id)}
        >
          Delete
        </Button>
      </div>
    ),
  },
];