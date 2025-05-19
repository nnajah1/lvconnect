import { HiHome, HiOutlineHome, HiClipboardDocumentList, HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { FaAddressCard, FaRegAddressCard, FaFileAlt, FaRegFileAlt } from "react-icons/fa";
import { RiGraduationCapFill, RiGraduationCapLine } from "react-icons/ri";

export const roleMenus = {
  student: [
    { name: "Dashboard", path: "/my", solidIcon: HiHome, outlineIcon: HiOutlineHome },
    { name: "Enrollment", path: "/my/enrollment", solidIcon: FaAddressCard, outlineIcon: FaRegAddressCard },
    { name: "Grades", path: "/my/grades", solidIcon: FaFileAlt, outlineIcon: FaRegFileAlt },
    { name: "SOA", path: "/my/soa", solidIcon: HiClipboardDocumentList, outlineIcon: HiOutlineClipboardDocumentList },
    { name: "Student Services", path: "/my/student-services", solidIcon: RiGraduationCapFill, outlineIcon: RiGraduationCapLine },
    { name: "Surveys", path: "/my/surveys", solidIcon: RiGraduationCapFill, outlineIcon: RiGraduationCapLine },
  ],
  comms: [
    { name: "Dashboard", path: "/comms-admin", solidIcon: HiHome, outlineIcon: HiOutlineHome },
    { name: "Updates", path: "/comms-admin/posts", solidIcon: FaAddressCard, outlineIcon: FaRegAddressCard },
    { name: "Archive", path: "/comms-admin/archive", solidIcon: FaFileAlt, outlineIcon: FaRegFileAlt },
  ],
  scadmin: [
    { name: "Dashboard", path: "/school-admin", solidIcon: HiHome, outlineIcon: HiOutlineHome },
    { name: "Review Posts", path: "/school-admin/posts/review", solidIcon: FaAddressCard, outlineIcon: FaRegAddressCard },
  ],
  psas: [
    { name: "Dashboard", path: "/psas-admin", solidIcon: HiHome, outlineIcon: HiOutlineHome },
    { name: "Survey", path: "/psas-admin/surveys", solidIcon: FaAddressCard, outlineIcon: FaRegAddressCard },
    { name: "School Forms", path: "/psas-admin/forms", solidIcon: FaFileAlt, outlineIcon: FaRegFileAlt },
  ],
  registrar: [
    { name: "Dashboard", path: "/registrar", solidIcon: HiHome, outlineIcon: HiOutlineHome },
    { name: "Enrollment", path: "/registrar/enrollment", solidIcon: FaAddressCard, outlineIcon: FaRegAddressCard },
    { name: "Students", path: "/registrar/student-information-management", solidIcon: FaFileAlt, outlineIcon: FaRegFileAlt },
    { name: "SOA", path: "/registrar/soa", solidIcon: FaAddressCard, outlineIcon: FaRegAddressCard },
  ],
   superadmin: [
    { name: "Dashboard", path: "/system-admin", solidIcon: HiHome, outlineIcon: HiOutlineHome },
  ],
};
