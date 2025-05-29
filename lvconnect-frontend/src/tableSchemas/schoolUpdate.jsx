import { Eye, Pencil, Trash } from "lucide-react";

export const schoolUpdateSchema = {
    id: { header: "#", display: true },
    title: {
        header: "Updates", display: true,
        customCell: (value) => {
            // const plainText = value.replace(/<\/?[^>]+(>|$)/g, "");
            return value.split(" ").slice(0, 3).join(" ");
        }
    },
    status: { header: "Status", display: true },
    type: { header: "Type", display: true },
    updated_at: { header: "Last Modified", display: true, format: "date" },
};

export const actions = (handleViewPost, handleEdit, handleDete) => ({
    view: {
        icon: () => <Eye size={18} />,
        fn: (id, item) => handleViewPost(item),
        variant: () => "ghost",
        className: "text-blue-600 hover:bg-blue-200 p-1"
    },
    edit: {
        icon: () => <Pencil size={18} />,
        fn: (id, item) => handleEdit(item),
        variant: () => "ghost",
        className: "text-blue-600 hover:bg-blue-200 p-1"
    },
    delete: {
        icon: () => <Trash size={18} />,
        fn: (id, item) => handleDete(item),
        variant: () => "ghost",
        className: "text-blue-600 hover:bg-blue-200 p-1"
    },
});

// Sample action conditions
export const actionConditions = {
    view: () => true,
    edit: (item, userRole) => userRole === "comms" && item.status === "draft",
    delete: (item, userRole) => userRole === "comms" && item.status === "archived"
};

export const archiveSchema = {
    // select: {
    //     header: ({ table }) => (
    //         <input
    //             type="checkbox"
    //             onChange={(e) => {
    //                 const isChecked = e.target.checked;
    //                 table.toggleAllRowsSelected(isChecked);
    //             }}
    //         />
    //     ),
    //     cell: ({ row }) => (
    //         <input
    //         type="checkbox"
    //         checked={row.getIsSelected()}
    //         onChange={() => row.toggleSelected()}
    //     />
    // ),
    // enableSorting: false, 
    // },
    content: {
        header: "Updates",
        display: true,
        enableSorting: true
    },
    status: {
        header: "Status",
        display: true,
        enableSorting: true
    },
    type: {
        header: "Type",
        display: true,
        enableSorting: true
    },
    published_at: {
        header: "Date Posted",
        display: true,
        format: "date",
        enableSorting: true
    },
    archieved_at: {
        header: "Date Archieved",
        display: true,
        format: "date",
        enableSorting: true
    },

}

