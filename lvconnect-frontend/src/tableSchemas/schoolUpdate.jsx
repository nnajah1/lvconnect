
export const schoolUpdateSchema = {
    id: { header: "#", display: true },
    content: { header: "Updates", display: true },
    status: { header: "Status", display: true },
    type: { header: "Type", display: true },
    updated_at: { header: "Last Modified", display: true, format: "date" },
};

export const actions =  (handleViewPost) => ( {
    view: {
        fn: handleViewPost,
        variant: "default"
    },
    edit: {
        fn: (id, item) => console.log(`Editing item ${id}:`, item),
        variant: "outline"
    },
    delete: {
        fn: (id, item) => console.log(`Deleting item ${id}:`, item),
        variant: "destructive"
    }
});

// Sample action conditions
export const actionConditions = {
    view: () => true,
    edit: (item, userRole) => userRole === "comms" && item.status === "draft",
    delete: (item, userRole ) =>  userRole === "comms" && item.status === "archived"
};

export const archiveSchema = {
    select: {
        header: ({ table }) => (
            <input
                type="checkbox"
                onChange={(e) => {
                    const isChecked = e.target.checked;
                    table.toggleAllRowsSelected(isChecked);
                }}
            />
        ),
        cell: ({ row }) => (
            <input
            type="checkbox"
            checked={row.getIsSelected()}
            onChange={() => row.toggleSelected()}
        />
    ),
    enableSorting: false, 
    },
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

