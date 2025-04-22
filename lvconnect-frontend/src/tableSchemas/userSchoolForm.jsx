import { Eye, Pencil } from "lucide-react";

export const schoolFormTemplateSchema = {
    title: { header: "Form", display: true, },
};

export const schoolFormSubmittedSchema = {
    title: { header: "Form", display: true },
    status: { header: "Status", display: true },
};

export const formActions = (openModal) => ({
    update: {
        icon: <Pencil size={18} />,
        fn: (id, item) => openModal(item), 
        variant: "ghost",
        className: "text-blue-600 hover:bg-blue-200 p-1"
    },

});

// Sample action conditions
export const formActionConditions = {
    update: (item, context, userRole) =>  true,
};

export const formSubmitActions = {
    view: {
        icon: <Eye size={20}/>,
        fn: (id, item, navigate) =>  openModal(id),
        variant: "ghost",
        className: "text-blue-600 hover:bg-blue-200 p-1"
    },

}

// Sample action conditions
export const formSubmitActionConditions = {
    view: (item, context, userRole) => true,
};