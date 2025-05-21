import { Check, Eye, Pencil, X } from "lucide-react";

export const registrarSchema = {

  fullname: {
    header: "Name",
    display: true,
    customCell: (value, original) => {
      const first = original.first_name || '';
      const last = original.last_name || '';
      const fullName = `${first} ${last}`.trim();

      return fullName || 'Unknown';
    }
  },
  student_id_number: { header: "ID", display: true },
  course: { header: "Course", display: true },
  year: {
    header: "Year", display: true,
    customCell: (value, original) => {
      const year = original?.enrollee_record?.[0]?.year_level;
      const text = `${year}th Year`
      return text || "Unknown";
    }
  },
  stat: {
    header: "Status",
    sortable: false,
    display: true,
    customCell: (value, original) => {
      const status = original?.enrollee_record?.[0]?.enrollment_status;
      const map = {
        not_enrolled: <span style={{ color: "gray" }}>Not Enrolled</span>,
        enrolled: <span style={{ color: "green" }}>Enrolled</span>,
        pending: <span style={{ color: "orange" }}>Pending</span>,
        rejected: <span style={{ color: "red" }}>Rejected</span>
      };
      return map[status] || "Unknown";
    }

  },
};

export const actions = (openModal, openAcceptModal, openRejectModal, openDirectModal, tab) => ({
  
  view: {
    icon: () => <Eye size={18} />,
    fn: (id, item) => openModal(item),
    variant: () => "ghost",
    className: "hover:bg-blue-200 flex px-2 py-1 text-xs sm:text-sm max-w-xs"
  },
  accept: {
    icon: (item) => {
      if (item.enrollee_record?.[0]?.enrollment_status === "pending" && tab === "pending" || tab === "all") {
        return (
          <div className="flex items-center justify-center gap-1.5">
            <Check className="h-4 w-4 text-white" />
          </div>
        )
      }
      return null;
    },
    fn: (id, item) => openAcceptModal(item),
    variant: (item) => "default",
    className: "hover:bg-green-300 bg-green-500 flex px-2 py-1 text-xs sm:text-sm max-w-xs"
  },
  reject: {
    icon: (item) => {
      if (item.enrollee_record?.[0]?.enrollment_status === "pending" && tab === "pending" || tab === "all") {
        return (
          <div className="flex items-center justify-center gap-1.5 ">
            <X className="h-4 w-4 text-white" />
          </div>
        )
      }
    },
    fn: (id, item) => openRejectModal(item),
    variant: (item) => "default",
    className: "hover:bg-red-300 bg-red-500 flex px-2 py-1 text-xs sm:text-sm max-w-xs"
  },
  enroll: {
    icon: (item) => {
      if (item.enrollee_record?.[0]?.enrollment_status === "not_enrolled" && tab === "not_enrolled" || tab === "all") {
        return (
          <div className="flex items-center justify-center gap-1.5">
            <Pencil className="h-4 w-4 text-white" />
            <span className="hidden sm:inline text-white font-medium">Direct Enroll</span>
          </div>
        )
      }
      return null;
    },
    fn: (id, item) => openDirectModal(item),
    variant: (item) => "default",
    className: "hover:bg-blue-300 bg-blue-500 flex px-2 py-1 text-xs sm:text-sm max-w-xs"
  },

})


export const actionConditions = {
  view: (item, context, userRole) => item.enrollee_record?.[0]?.enrollment_status !== 'not_enrolled',
  accept: (item, context, userRole) => item.enrollee_record?.[0]?.enrollment_status === 'pending',
  reject: (item, context, userRole) => item.enrollee_record?.[0]?.enrollment_status === 'pending',
  enroll: (item, context, userRole) => item.enrollee_record?.[0]?.enrollment_status === 'not_enrolled',
};
