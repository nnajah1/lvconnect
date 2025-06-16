import { Check, Eye, Pencil, X } from "lucide-react";
import { PiExclamationMark } from "react-icons/pi";

export const registrarSchema = {

  full_name: {
    header: "Name",
    display: true,
    filterable: true,
  },
  student_id_number: { header: "ID", display: true, },
  program: { header: "Program", display: true, filterable:true },
  year: {
    header: "Year", display: true, sortable: true,
    customCell: (value, original) => {
      const year = original?.enrollee_record?.[0]?.year_level;
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
  status: {
    header: "Status",
    sortable: false,
    display: true,
    customCell: (value, original) => {
      const status = original?.enrollee_record?.[0]?.enrollment_status;
      const map = {
        not_enrolled: <span style={{ color: "gray" }}>Not Enrolled</span>,
        enrolled: <span style={{ color: "green" }}>Enrolled</span>,
        pending: <span style={{ color: "orange" }}>Pending</span>,
        rejected: <span style={{ color: "#8B8000" }}>Temporary Enrolled</span>
      };
      return map[status] || "-";
    },
    filterFn: (row, columnId, filterValue) => {
      const status = row.original?.enrollee_record?.[0]?.enrollment_status;
      return status?.toLowerCase().includes(filterValue.toLowerCase());
    },

  },
};

export const actions = (openModal, openAcceptModal, openRejectModal, openDirectModal, tab) => ({

  view: {
    icon: () => <Eye size={18} />,
    fn: (id, item) => openModal(item),
    variant: () => "ghost",
    className: "hover:bg-blue-100 flex px-2 py-1 text-xs sm:text-sm max-w-xs"
  },
  accept: {
    icon: (item) => {
      if (item.enrollee_record?.[0]?.enrollment_status === "pending" && tab === "pending" || tab === "all" || tab === "rejected") {
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
            <PiExclamationMark className="h-4 w-4 text-white" />
          </div>
        )
      }
    },
    fn: (id, item) => openRejectModal(item),
    variant: (item) => "default",
    className: "hover:bg-yellow-300 bg-yellow-500 flex px-2 py-1 text-xs sm:text-sm max-w-xs"
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
  accept: (item, context, userRole) => item.enrollee_record?.[0]?.enrollment_status === 'pending' || item.enrollee_record?.[0]?.enrollment_status === 'rejected',
  reject: (item, context, userRole) => item.enrollee_record?.[0]?.enrollment_status === 'pending',
  enroll: (item, context, userRole) => item.enrollee_record?.[0]?.enrollment_status === 'not_enrolled',
};


export const registrarNotEnrolledSchema = {

  name: {
    header: "Name",
    display: true,
    filterable: true,
  },
  student_id: { header: "ID", display: true, },
  // program: { header: "Course", display: true },
  // year_level: {
  //   header: "Year", display: true, sortable: true,
  //   customCell: (value, original) => {
  //     const year = original?.enrollee_record?.[0]?.year_level;
  //     const yearMap = {
  //       1: "1st Year",
  //       2: "2nd Year",
  //       3: "3rd Year",
  //       4: "4th Year",
  //     };
  //     return year ? yearMap[year] || `${year}th Year` : "-";
  //   }
  // },
  enrollment_status: {
    header: "Status",
    sortable: false,
    display: true,
    customCell: (value, original) => {
      const formattedStatus = value
        .replace(/_/g, ' ')                      // Replace underscores with spaces
        .replace(/\b\w/g, char => char.toUpperCase()); // Capitalize each word

      return formattedStatus;
    }

  },
};

export const enrollActions = (openDirectModal) => ({

  enroll: {
    icon: (item) =>
      <div className="flex items-center justify-center gap-1.5">
        <Pencil className="h-4 w-4 text-white" />
        <span className="hidden sm:inline text-white font-medium">Direct Enroll</span>
      </div>,

    fn: (id, item) => openDirectModal(item),
    variant: (item) => "default",
    className: "hover:bg-blue-300 bg-blue-500 flex px-2 py-1 text-xs sm:text-sm max-w-xs"
  },

})


export const enrollActionConditions = {
  enroll: (item, context, userRole) => true,
};