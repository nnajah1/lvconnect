import { Eye, Pencil } from "lucide-react";

export const surveyTemplateSchema = {
    title: { header: "Surveys", display: true, },
};

export const surveySubmittedSchema = {
    form_type_title: { header: "Surveys", display: true },
    status: { header: "Status", display: true },
};

export const surveyActions = (openFormModal) => ({
    update: {
        icon: <Pencil size={18} />,
        fn: (id, item) => openFormModal(item), 
        variant: "ghost",
        className: "text-blue-600 hover:bg-blue-200 p-1"
    },

});

// Sample action conditions
export const surveyActionConditions = {
    update: (item, context, userRole) =>  true,
};

export const surveySubmitActions = (openSubmittedModal) => ({
    view: {
        icon: <Eye size={20}/>,
        fn: (id, item) =>  openSubmittedModal(item),
        variant: "ghost",
        className: "text-blue-600 hover:bg-blue-200 p-1"
    },

})

// Sample action conditions
export const surveySubmitActionConditions = {
    view: (item, context, userRole) => true,
};