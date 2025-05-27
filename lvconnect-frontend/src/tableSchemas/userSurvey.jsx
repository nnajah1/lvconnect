import { Eye, Pencil } from "lucide-react";

export const surveyTemplateSchema = {
    id: { header: "#", display: true},
    title: { header: "Surveys", display: true},
    created_at: { header: "Date Created", display: true, format: "date", sortable: true, },
};

export const surveySubmittedSchema = {
    form_type_title: { header: "Surveys", display: true },
    status: { header: "Status", display: true },
};

export const surveyActions = (openFormModal) => ({
  view: {
    icon: (item) => {
      if (item.completed_at) {
        return (
          <div className="flex items-center justify-center gap-1.5">
            <Eye className="h-4 w-4 text-gray-700" />
            <span className="hidden sm:inline text-gray-700 font-medium">Completed</span>
          </div>
        )
      } else {
        return (
          <div className="flex items-center justify-center gap-1.5">
            <Pencil className="h-4 w-4" />
            <span className="hidden sm:inline font-medium">Answer Survey</span>
          </div>
        )
      }
    },
    fn: (id, item) => openFormModal(item),
    variant: (item) => (item.completed_at ? "outline" : "default"),
    className: "hover:bg-blue-200 flex px-2 py-1 text-xs sm:text-sm max-w-xs"
  },
})

// Sample action conditions
export const surveyActionConditions = {
    view: (item, context, userRole) => true,
};

