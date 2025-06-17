import StatusBadge from "@/components/dynamic/statusBadge";
import { formatTitle } from "@/utils/textFormatter";
import { ExternalLink, Eye, PenBoxIcon } from "lucide-react";

export const surveySchema = {
    // id: { header: "#", display: true },
    title: {
        header: "Surveys", display: true,
        customCell: (value) => (
            <span className="font-semibold text-gray-700">
                {formatTitle(value)}
            </span>)
    },
    visibility_mode: {
        header: "Status",
        sortable: false,
        display: true,
        customCell: (value) => {
            const map = {
                hidden: "Hidden",
                optional: "Published",
                mandatory: "Published",
            };
            return (
                <StatusBadge status={map[value] || "Unknown"} />
            );
        },

    },
    created_at: { header: "Date Created", display: true, format: "date", sortable: true },
};

export const actions = (openModal, openResponseModal, openPreviewModal) => ({
    update: {
        label: "Change visibility",
        icon: () => <PenBoxIcon size={16} />,
        fn: (id, item) => openModal(item),
        className: "hover:bg-blue-800 bg-blue-900 text-white"
    },
    preview: {
        label: "Preview Survey",
        icon: (item) => <ExternalLink size={16} />,
        fn: (id, item) => openPreviewModal(item),
    },
    view: {
        label: "View Responses",
        icon: (item) => <ExternalLink size={16} />,
        fn: (id, item) => openResponseModal(item),
    },
})


// Sample action conditions
export const actionConditions = {
    update: (item, context, userRole) => true,
    preview: (item, context, userRole) => true,
    view: (item, context, userRole) => true,
};
