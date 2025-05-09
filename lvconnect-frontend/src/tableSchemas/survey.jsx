import { Pencil } from "lucide-react";

export const surveySchema = {
    id: { header: "#", display: true },
    title: { header: "Surveys", display: true },
    is_visible: { header: "Status", display: true },
    created_at: { header: "Date Created", display: true, format: "date" },
};

export const actions =  (openModal) => ( {
    update: {
        icon: <Pencil size={18} />,
        fn: (id, item) => openModal(item), 
        variant: "ghost",
        className: "text-blue-600 hover:bg-blue-200 p-1"
    },
});

// Sample action conditions
export const actionConditions = {
    update: (item, context, userRole) =>  true,
};
