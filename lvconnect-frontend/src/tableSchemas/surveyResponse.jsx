import { ExternalLink, Eye, Pencil } from "lucide-react";

//Summary Data
export const schoolFormTemplateSchema = {
    // id: { header: "#", display: true },
    title: { header: "Form", display: true },
    is_visible: {
        header: "Status",
        // sortable: false,
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
        className: "text-blue-600 hover:bg-blue-100 p-1"
    },

});

export const formActionConditions = {
    update: (item, context, userRole) => true,
};

//Responses Data
export const surveySubmittedSchema = {
    // id: { header: "#", display: true },
    name: {
        header: "Name",
        display: true,
        // filterable: true,
    },
    course: { header: "Program", display: true },
    year: {
        header: "Year Level", display: true, 
        // filterable: true,
        customCell: (value, original) => {
            const year = original?.year;
            const yearMap = {
                1: "1st Year",
                2: "2nd Year",
                3: "3rd Year",
                4: "4th Year",
            };
            return year ? yearMap[year] || `${year}th Year` : "-";
        },
        filterFn: (row, columnId, filterValue) => {
            const year = row.original?.enrollee_record?.[0]?.year_level;
            const yearMap = {
                1: "1st Year",
                2: "2nd Year",
                3: "3rd Year",
                4: "4th Year",
            };
            const label = year ? yearMap[year] || `${year}th Year` : "-";
            return label.toLowerCase().includes(filterValue.toLowerCase());
        },

    },
    submitted_at: { header: "Date Responded", display: true, format: "date" },
};

export const surveySubmitActions = (openSubmittedModal) => ({
    view: {
        label: "View Details",
        icon: () => <ExternalLink size={16} />,
        fn: (id, item) => openSubmittedModal(item),
        className: "hover:bg-blue-800 bg-blue-900 text-white"
    },

});

export const surveySubmitActionConditions = {
    view: (item, context, userRole) => true,
};