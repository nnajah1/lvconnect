import { Eye, Pencil } from "lucide-react";

export const surveySchema = {
    // id: { header: "#", display: true },
    title: { header: "Surveys", display: true },
    visibility_mode: {
        header: "Status",
        sortable: false,
        display: true,
        customCell: (value) => {
            const map = {
                hidden: "Hidden",
                optional: "Visible",
                mandatory: "Visible",
            };
            return map[value] || "Unknown";
        },

    },
    created_at: { header: "Date Created", display: true, format: "date", sortable:true },
};

export const actions = (openModal, openResponseModal) => ({
    update: {
        icon: () => <Pencil size={18} />,
        fn: (id, item) => openModal(item),
        variant: () => "ghost",
        className: "hover:bg-blue-200 flex px-2 py-1 text-xs sm:text-sm max-w-xs"
    },
    view: {
        icon: (item) => 
            <div className="flex items-center justify-center gap-1.5">
                <Eye className="h-4 w-4 text-white" />
                <span className="hidden sm:inline text-white font-medium">View Responses</span>
            </div>
        ,
        fn: (id, item) => openResponseModal(item),
        variant: (item) => "default",
        className: "hover:bg-blue-200 flex px-2 py-1 text-xs sm:text-sm max-w-xs"
    },
})


// Sample action conditions
export const actionConditions = {
    update: (item, context, userRole) => true,
    view: (item, context, userRole) => true,
};
