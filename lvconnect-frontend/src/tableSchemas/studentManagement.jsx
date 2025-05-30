import { Archive, Check, Eye, Pencil, X } from "lucide-react";

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
  program: { header: "Course", display: true },
  year: {
    header: "Year", display: true,
    customCell: (value, original) => {
      const year = original?.enrollee_record?.[0]?.year_level;
      const yearMap = {
        1: "1st Year",
        2: "2nd Year",
        3: "3rd Year",
        4: "4th Year",
      };
      return year ? yearMap[year] || `${year}th Year` : "-";
    }
  },
  status: {
    header: "Status",
    sortable: false,
    display: true,
    customCell: (value, original) => {
      const status = original?.enrollee_record?.[0]?.enrollment_status;
      const map = {
        enrolled: <span style={{ color: "green" }}>Enrolled</span>,
      };
      return map[status];
    }

  },
};


export const smActions = (openModal, openArchiveModal) => ({
  
  update: {
    icon: () => <Pencil size={18} />,
    fn: (id, item) => openModal(item),
    variant: () => "ghost",
    className: "hover:bg-blue-200 flex px-2 py-1 text-xs sm:text-sm max-w-xs"
  },
  archive: {
    icon: (item) =>  <div className="flex items-center justify-center gap-1.5">
                <Archive className="h-4 w-4 text-white" />
                <span className="hidden sm:inline text-white font-medium">Archive</span>
            </div>,
    fn: (id, item) => openArchiveModal(item),
    variant: (item) => "default",
    className: "hover:bg-blue-300 bg-blue-500 flex px-2 py-1 text-xs sm:text-sm max-w-xs"
  },


})

export const smActionsConditions = {
  update: (item, context, userRole) => true,
  archive: (item, context, userRole) => true
};
