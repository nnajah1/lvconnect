import { formatTitle } from "@/utils/textFormatter";
import { ExternalLink, Eye, PenBoxIcon, Pencil } from "lucide-react";

export const surveyTemplateSchema = {
    // id: { header: "#", display: true},
    title: { header: "Surveys", display: true,
      customCell: (value) => (
                  <span className="font-semibold text-gray-700">
                      {formatTitle(value)}
                  </span>)
    },
    created_at: { header: "Date Created", display: true, format: "date", sortable: true, },
};

export const surveySubmittedSchema = {
    form_type_title: { header: "Surveys", display: true },
    status: { header: "Status", display: true },
};

export const surveyActions = (openFormModal) => ({
  view: {
  label: (item) => item.completed_at ? "Completed" : "Answer Survey", 
  icon: (item) => {
    if (item.completed_at) {
      return (
        <div className="flex items-center justify-center gap-1.5">
          <ExternalLink className="h-4 w-4" />
          <span className="hidden sm:inline text-white font-medium">Completed</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center justify-center gap-1.5">
          <PenBoxIcon className="h-4 w-4" />
          <span className="hidden sm:inline font-medium">Answer Survey</span>
        </div>
      );
    }
  },
  fn: (id, item) => openFormModal(item),
  variant: (item) => item.completed_at ? "outline" : "default",
   className: "text-white bg-blue-900 hover:bg-blue-800",
}

})

// Sample action conditions
export const surveyActionConditions = {
    view: (item, context, userRole) => true,
};

