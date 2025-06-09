import { useUserRole } from "@/utils/userRole";
import { Archive, Check, Eye, Pencil, X } from "lucide-react";

export const registrarSchema = {
  full_name: {
    header: "Name",
    display: true,
    filterable: true,

  },
  student_id_number: { header: "ID", display: true },
  program: {
    header: "Program", display: true,
    filterable: true,
  },
  year: {
    filterable: true,
    header: "Year Level", display: true,
    accessorFn: (original) => {
      return original?.enrollee_record?.[0]?.year_level ?? null;
    },
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
    filterable: true,
    customCell: (value, original) => {
      const status = original?.enrollee_record?.[0]?.enrollment_status;
      const map = {
        not_enrolled: <span style={{ color: "gray" }}>Not Enrolled</span>,
        enrolled: <span style={{ color: "green" }}>Enrolled</span>,
        pending: <span style={{ color: "orange" }}>Pending</span>,
        rejected: <span style={{ color: "#8B8000" }}>Temporary Enrolled</span>,
        archived: <span style={{ color: "gray" }}>Archived</span>,
      };
      return map[status];
    },
    filterFn: (row, columnId, filterValue) => {
      const status = row.original?.enrollee_record?.[0]?.enrollment_status;
      return status?.toLowerCase().includes(filterValue.toLowerCase());
    },

  },
};

export const archiveSchema = {
  full_name: {
    header: "Name",
    display: true,
    filterable: true,

  },
  student_id_number: { header: "ID", display: true },
  program: {
    header: "Program", display: true,
    filterable: true,
  },
  year: {
    filterable: true,
    header: "Year Level", display: true,
    accessorFn: (original) => {
      return original?.enrollee_record?.[0]?.year_level ?? null;
    },
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
  admin_remarks: {
    header: "Remarks",
    sortable: false,
    display: true,
    filterable: true,
    customCell: (value, original) => {
      const remarks = original?.enrollee_record?.[0]?.admin_remarks;
      return remarks;
    },
    filterFn: (row, columnId, filterValue) => {
      const remarks = row.original?.enrollee_record?.[0]?.admin_remarks;
      return remarks?.toLowerCase().includes(filterValue.toLowerCase());
    },
  },
};


export const smActions = (viewModal, openModal, openArchiveModal) => ({
  view: {
    icon: () => <Eye size={18} />,
    fn: (id, item) => viewModal(item),
    variant: () => "ghost",
    className: "hover:bg-blue-200 flex px-2 py-1 text-xs sm:text-sm max-w-xs"
  },
  update: {
    icon: () => <Pencil size={18} />,
    fn: (id, item) => openModal(item),
    variant: () => "ghost",
    className: "hover:bg-blue-200 flex px-2 py-1 text-xs sm:text-sm max-w-xs"
  },
  archive: {
    icon: (item) => <div className="flex items-center justify-center gap-1.5">
      <Archive className="h-4 w-4 text-white" />
      <span className="hidden sm:inline text-white font-medium">Archive</span>
    </div>,
    fn: (id, item) => openArchiveModal(item),
    variant: (item) => "default",
    className: "hover:bg-blue-300 bg-blue-500 flex px-2 py-1 text-xs sm:text-sm max-w-xs"
  },


})

export const smActionsConditions = {
  view: (item, context, userRole) => item.enrollee_record?.[0]?.enrollment_status === 'archived',
  update: (item, context, userRole) => item.enrollee_record?.[0]?.enrollment_status !== 'archived',
  archive: (item, context, userRole) => item.enrollee_record?.[0]?.enrollment_status !== 'archived',
};


export const newStudentSchema = {
  full_name: {
    header: "Name",
    display: true,
  },
  email: {
    header: "Email",
    display: true,
  }
  // enrollment_status: {
  //   header: "Status",
  //   display: true,
  //   customCell: (value, original) => {
  //     const status = original?.enrollment_status;
  //     const map = {
  //       not_enrolled: <span style={{ color: "gray" }}>Not Enrolled</span>,
  //       enrolled: <span style={{ color: "green" }}>Enrolled</span>,
  //     };
  //     return map[status];
  //   }
  // },
};