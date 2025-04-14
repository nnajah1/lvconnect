export const schoolFormTemplateSchema = {
    id: { header: "#", display: true },
    title: { header: "Form", display: true },
    status: { header: "Status", display: true },
    created_at: { header: "Date Created", display: true, format: "date" },
    updated_at: { header: "Last Modified", display: true, format: "date" },
};

export const schoolFormSubmittedSchema = {
    id: { header: "#", display: true },
    title: { header: "Form", display: true },
    submitted_by: { header: "Submitted_by", display: true },
    status: { header: "Status", display: true },
    created_at: { header: "Date Submitted", display: true, format: "date" },
};

export const formActions = {
    view: {
        fn: (id, item) => console.log(`Viewing item ${id}:`, item),
        variant: "default"
    },
    update: {
        fn: (id, item) => console.log(`Editing item ${id}:`, item),
        variant: "outline"
    },

}

// Sample action conditions
export const formActionConditions = {
    View: () => true,
    update: (item, userRole) => userRole === "psas" && item.status === "draft",
   
};