export const schoolFormTemplateSchema = {
    title: { header: "Form", display: true },
};

export const schoolFormSubmittedSchema = {
    title: { header: "Form", display: true },
    status: { header: "Status", display: true },
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
    View: (context) => context === "UserFormsSubmitted",
    // item.status === "approved" && item.status === "pending" &&
    update: (context) => context === "UserFormsTemplate",
    // userRole === "student" && 

};