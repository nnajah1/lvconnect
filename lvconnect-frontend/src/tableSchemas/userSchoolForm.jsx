import StatusBadge from "@/components/dynamic/statusBadge";
import { ExternalLink, Eye, PenBoxIcon, Pencil } from "lucide-react";

export const schoolFormTemplateSchema = {
    title: { header: "Form", display: true, },
};

export const schoolFormSubmittedSchema = {
    form_type_title: { header: "Form", display: true },
    status: { header: "Status", display: true, 
        customCell: (value) => <StatusBadge status={value} />,
     },
};

export const formActions = (openFormModal) => ({
    update: {
        label: "Update",
        icon:() => <PenBoxIcon size={16} />,
        fn: (id, item) => openFormModal(item), 
        className: "bg-blue-900 hover:bg-blue-100 text-white",
    },

});

// Sample action conditions
export const formActionConditions = {
    update: (item, context, userRole) =>  true,
};

export const formSubmitActions = (openSubmittedModal) => ({
    view: {
        label: "View",
        icon: () => <ExternalLink size={16} />,
        fn: (id, item) =>  openSubmittedModal(item),
        className: "text-blue-900 hover:bg-blue-100",
    },

})

// Sample action conditions
export const formSubmitActionConditions = {
    view: (item, context, userRole) => true,
};