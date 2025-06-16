import StatusBadge from "@/components/dynamic/statusBadge";
import { Check, ExternalLink, Eye, Pencil, X } from "lucide-react";
import { PiExclamationMark } from "react-icons/pi";

export const registrarSchema = {

  full_name: {
    header: "Name",
    display: true,
    filterable: true,
  },
  student_id_number: { header: "ID", display: true, },
  program: { header: "Program", display: true, filterable: true },
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
        not_enrolled: "Not Enrolled",
        enrolled: "Enrolled",
        pending: "Pending",
        rejected: "Temporary Enrolled",
      };

      return status ? (
        <StatusBadge status={status} label={map[status]}>
        </StatusBadge>
      ) : "-";
    },
    filterFn: (row, columnId, filterValue) => {
      const status = row.original?.enrollee_record?.[0]?.enrollment_status;
      return status?.toLowerCase().includes(filterValue.toLowerCase());
    },

  },
};

export const actions = (openModal, openAcceptModal, openRejectModal, tab) => ({

  view: {
    label: "View",
    icon: () => <ExternalLink size={16} />,
    fn: (id, item) => openModal(item),
    className: "text-blue-900 hover:bg-blue-100",
  },
  accept: {
    label: "Accept",
    icon: (item) => <Check size={16} />,
    // {
    // if (item.enrollee_record?.[0]?.enrollment_status === "pending" && tab === "pending" || tab === "all" || tab === "rejected") {
    //   return (

    //   )
    // }
    // return null;
    // },
    fn: (id, item) => openAcceptModal(item),
  },
  reject: {
    label: "Temporary Enrolled",
    icon: (item) => <X size={16} />,
    //   {
    //   if (item.enrollee_record?.[0]?.enrollment_status === "pending" && tab === "pending" || tab === "all") {
    //     return (

    //     )
    //   }
    // },
    fn: (id, item) => openRejectModal(item),
  },
})

export const actionNotEnrolled = (openDirectModal, tab) => ({
  enroll: {
    label: "Direct Enroll",
    icon: (item) => {
      if (item.enrollee_record?.[0]?.enrollment_status === "not_enrolled" && tab === "not_enrolled" || tab === "all") {
        return (
          <Pencil size={16} />
        )
      }
      return null;
    },
    fn: (id, item) => openDirectModal(item),
  },
})

export const actionConditions = {
  view: (item, context, userRole) => item.enrollee_record?.[0]?.enrollment_status !== 'not_enrolled',
  accept: (item, context, userRole) => item.enrollee_record?.[0]?.enrollment_status === 'pending' || item.enrollee_record?.[0]?.enrollment_status === 'rejected',
  reject: (item, context, userRole) => item.enrollee_record?.[0]?.enrollment_status === 'pending',
};

export const actionConditionsNotEnrolled = {
  enroll: (item, context, userRole) => item.enrollee_record?.[0]?.enrollment_status === 'not_enrolled',
}

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
        .replace(/_/g, ' ')
        .replace(/\b\w/g, char => char.toUpperCase());

      return <StatusBadge status={formattedStatus} />;
    }

  },
};

export const enrollActions = (openDirectModal) => ({

  enroll: {
    label: "Direct Enroll",
    icon: (item) =>
      <Pencil size={14} />,
    // {/* <div className="flex items-center justify-center gap-1.5">
    //   <Pencil size={16} />
    //   <span className="hidden sm:inline text-white font-medium">Direct Enroll</span>
    // </div>, */}

    fn: (id, item) => openDirectModal(item),
    className: "text-white hover:bg-blue-800 bg-blue-900",
  },

})


export const enrollActionConditions = {
  enroll: (item, context, userRole) => true,
};