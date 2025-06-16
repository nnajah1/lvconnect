import { Eye, Pencil } from "lucide-react";

export const schoolFormTemplateSchema = {
    title: { header: "Form", display: true, },
};

export const schoolFormSubmittedSchema = {
    form_type_title: { header: "Form", display: true },
    status: { header: "Status", display: true },
};

export const formActions = (openFormModal) => ({
    update: {
        icon:() => <Pencil size={18} />,
        fn: (id, item) => openFormModal(item), 
        variant:() =>  "ghost",
        className: "text-blue-600 hover:bg-blue-100 p-1"
    },

});

// Sample action conditions
export const formActionConditions = {
    update: (item, context, userRole) =>  true,
};

export const formSubmitActions = (openSubmittedModal) => ({
    view: {
        icon:() =>  <Eye size={20}/>,
        fn: (id, item) =>  openSubmittedModal(item),
        variant:() =>  "ghost",
        className: "text-blue-600 hover:bg-blue-100 p-1"
    },

})

// Sample action conditions
export const formSubmitActionConditions = {
    view: (item, context, userRole) => true,
};