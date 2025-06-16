import StatusBadge from "@/components/dynamic/statusBadge";
import { useUserRole } from "@/utils/userRole";
import { Archive, Check, ExternalLink, Eye, Pencil, X } from "lucide-react";

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
        not_enrolled: "Not Enrolled",
        enrolled: "Enrolled",
        pending: "Pending",
        rejected: "Temporary Enrolled",
        archived: "Archived"
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
      return remarks ? (
    <StatusBadge status="not_enrolled" label={remarks} />
  ) : "-";
    },
    
    filterFn: (row, columnId, filterValue) => {
      const remarks = row.original?.enrollee_record?.[0]?.admin_remarks;
      return remarks?.toLowerCase().includes(filterValue.toLowerCase());
    },
  },
};


export const smActions = (viewModal, openModal, openArchiveModal) => ({
  view: {
    label: "View",
    icon: () => <ExternalLink size={16} />,
    fn: (id, item) => viewModal(item),
    className: "text-blue-900 hover:bg-blue-100",
  },
  update: {
    label: "Update",
    icon: () => <Pencil size={16} />,
    fn: (id, item) => openModal(item),
  },
  archive: {
    label: "Archive",
    icon: (item) => <Archive size={16}/>,
    fn: (id, item) => openArchiveModal(item),
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