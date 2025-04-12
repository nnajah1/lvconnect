import { HiHome, HiOutlineHome, HiClipboardDocumentList, HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { FaAddressCard, FaRegAddressCard, FaFileAlt, FaRegFileAlt } from "react-icons/fa";
import { RiGraduationCapFill, RiGraduationCapLine } from "react-icons/ri";

export const roleMenus = {
  student: [
    { name: "Dashboard", path: "/dashboard", solidIcon: HiHome, outlineIcon: HiOutlineHome },
    { name: "Enrollment", path: "/enrollment", solidIcon: FaAddressCard, outlineIcon: FaRegAddressCard },
    { name: "Grades", path: "/grades", solidIcon: FaFileAlt, outlineIcon: FaRegFileAlt },
    { name: "SOA", path: "/soa", solidIcon: HiClipboardDocumentList, outlineIcon: HiOutlineClipboardDocumentList },
    { name: "Student Services", path: "/services", solidIcon: RiGraduationCapFill, outlineIcon: RiGraduationCapLine },
  ],
  comms: [
    { name: "Dashboard", path: "/comms-admin", solidIcon: HiHome, outlineIcon: HiOutlineHome },
    { name: "Updates", path: "comms-admin/posts", solidIcon: FaAddressCard, outlineIcon: FaRegAddressCard },
    { name: "Archive", path: "comms-admin/archive", solidIcon: FaFileAlt, outlineIcon: FaRegFileAlt },
  ],
  scadmin: [
    { name: "Dashboard", path: "/school-admin", solidIcon: HiHome, outlineIcon: HiOutlineHome },
    { name: "Review Posts", path: "school-admin/posts/review", solidIcon: FaAddressCard, outlineIcon: FaRegAddressCard },
  ],
  psasadmin: [
    { name: "Dashboard", path: "/psas-admin", solidIcon: HiHome, outlineIcon: HiOutlineHome },
    { name: "Survey", path: "psas-admin/survey", solidIcon: FaAddressCard, outlineIcon: FaRegAddressCard },
    { name: "School Forms", path: "psas-admin/forms", solidIcon: FaAddressCard, outlineIcon: FaRegAddressCard },
  ],
};
