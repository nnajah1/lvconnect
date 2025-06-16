import StatusBadge from "@/components/dynamic/statusBadge";
import { formatTitle } from "@/utils/textFormatter";
import { ExternalLink, Eye, PenBoxIcon, Pencil } from "lucide-react";
import { Label } from "recharts";

export const schoolFormTemplateSchema = {
    // id: { header: "#", display: true },
    title: {
        header: "Form", display: true,
        customCell: (value) => (
            <span className="font-semibold text-gray-700">
                {formatTitle(value)}
            </span>
        )
    },
    is_visible: {
        header: "Status",
        sortable: false,
        display: true,
        customCell: (value) => (
            <StatusBadge status={value ? "published" : "hidden"} />
        )
    },
    created_at: { header: "Date Created", display: true, format: "date", sortable: true, },
    // updated_at: { header: "Last Modified", display: true, format: "date", sortable: true, },
};

export const schoolFormSubmittedSchema = {
    // id: { header: "#", display: true },
    form_type_title: { header: "Form", display: true,  customCell: (value) => (
                <span className="font-semibold text-gray-700">
                    {formatTitle(value)}
                </span>) },
    submitted_by_name: { header: "Submitted by", display: true },
    status: { header: "Status", display: true,  customCell: (value) => (
            <StatusBadge status={value} />
        ) },
    created_at: { header: "Date Submitted", display: true, format: "date" },
};

export const formActions = (openFormModal) => ({
    update: {
        label: "Change visibility",
        icon: () => <PenBoxIcon size={16} />,
        fn: (id, item) => openFormModal(item),
        className: "text-white bg-blue-900 hover:bg-blue-800",
    },

});

// Sample action conditions
export const formActionConditions = {
    update: (item, context, userRole) => true,
};

export const formSubmitActions = (openSubmittedModal) => ({
    view: {
        icon: () => <ExternalLink size={16} />,
        fn: (id, item) => openSubmittedModal(item),
        variant: () => "ghost",
        className: "text-blue-900 hover:bg-blue-100 p-1"
    },

});

// Sample action conditions
export const formSubmitActionConditions = {
    view: (item, context, userRole) => true,
};