import { Eye, Pencil } from "lucide-react";

export const schoolFormTemplateSchema = {
    // id: { header: "#", display: true },
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
    form_type_title: { header: "Form", display: true },
    submitted_by_name: { header: "Submitted by", display: true },
    status: { header: "Status", display: true },
    created_at: { header: "Date Submitted", display: true, format: "date" },
};

export const formActions = (openFormModal) => ({
    update: {
        icon:() => <Pencil size={18} />,
        fn: (id, item) => openFormModal(item), 
        variant:() => "ghost",
        className: "text-blue-600 hover:bg-blue-200 p-1"
    },

});

// Sample action conditions
export const formActionConditions = {
    update: (item, context, userRole) =>  true,
};

export const formSubmitActions = (openSubmittedModal) => ({
    view: {
        icon:() => <Eye size={20}/>,
        fn: (id, item) =>  openSubmittedModal(item),
        variant:() => "ghost",
        className: "text-blue-600 hover:bg-blue-200 p-1"
    },

});

// Sample action conditions
export const formSubmitActionConditions = {
    view: (item, context, userRole) => true,
};