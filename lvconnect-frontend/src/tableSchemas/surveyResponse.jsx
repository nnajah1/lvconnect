import { Eye, Pencil } from "lucide-react";

//Summary Data
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
    updated_at: { header: "Last Modified", display: true, format: "date", sortable: true, },
};

export const formActions = () => ({
    update: {
        icon: () =>
            <Pencil size={18} />,
        fn: (id, item) => openFormModal(item),
        variant: () => "ghost",
        className: "text-blue-600 hover:bg-blue-200 p-1"
    },

});

export const formActionConditions = {
    update: (item, context, userRole) => true,
};

//Responses Data
export const surveySubmittedSchema = {
    id: { header: "#", display: true },
    survey_id: { header: "Name", display: true },
    submitted_by_name: { header: "Course", display: true },
    status: { header: "Year", display: true },
    created_at: { header: "Date Responded", display: true, format: "date" },
};

export const surveySubmitActions = (openSubmittedModal) => ({
    view: {
        icon: () => <div className="flex items-center justify-center gap-1.5">
            <Eye className="h-4 w-4 text-gray-700" />
            <span className="hidden sm:inline text-gray-700 font-medium">View Details</span>
        </div>,
        fn: (id, item) => openSubmittedModal(item),
        variant: () => "ghost",
        className: "hover:bg-blue-200 flex px-2 py-1 text-xs sm:text-sm max-w-xs"
    },

});

export const surveySubmitActionConditions = {
    view: (item, context, userRole) => true,
};