export const schoolFormTemplateSchema = {
    id: { header: "#", display: true },
    title: { header: "Form", display: true },
    is_visible: {
        header: "Status",
        sortable: false,
        display: true,
        customCell: (value) => (value ? "Published" : "Hidden")
    },
    created_at: { header: "Date Created", display: true, format: "date", sortable: true, },
    updated_at: { header: "Last Modified", display: true, format: "date",sortable: true, },
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
    view: (item, context, userRole) => userRole === "psas" && context === "formsSubmitted",
    update: (item, context, userRole) => userRole === "psas"  && context === "formsTemplate",
};