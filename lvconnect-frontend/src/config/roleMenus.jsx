import { HiHome, HiOutlineHome, HiClipboardDocumentList, HiOutlineClipboardDocumentList, HiOutlineUsers, HiUsers, HiMiniShieldCheck} from "react-icons/hi2";
import { FaAddressCard, FaRegAddressCard, FaFileAlt, FaRegFileAlt } from "react-icons/fa";
import { RiGraduationCapFill, RiGraduationCapLine, RiArchiveFill, RiFileCopy2Fill, RiFileCopy2Line } from "react-icons/ri";
import { IoNewspaperOutline, IoNewspaper} from "react-icons/io5";
import { GoArchive } from "react-icons/go";
import { MdOutlineFileCopy, MdFileCopy} from "react-icons/md";
import { BiSolidFolderOpen, BiFolderOpen } from "react-icons/bi";
import { HiOutlineShieldCheck } from "react-icons/hi"

export const roleMenus = {
  student: [
    { name: "Dashboard", path: "/my", solidIcon: HiHome, outlineIcon: HiOutlineHome },
    { name: "Enrollment", path: "/my/enrollment", solidIcon: FaAddressCard, outlineIcon: FaRegAddressCard },
    { name: "Grades", path: "/my/grades", solidIcon: FaFileAlt, outlineIcon: FaRegFileAlt },
    { name: "SOA", path: "/my/soa", solidIcon: HiClipboardDocumentList, outlineIcon: HiOutlineClipboardDocumentList },
    { name: "Student Services", path: "/my/student-services", solidIcon: RiGraduationCapFill, outlineIcon: RiGraduationCapLine },
    { name: "Surveys", path: "/my/surveys", solidIcon: MdFileCopy, outlineIcon: MdOutlineFileCopy},
  ],
  comms: [
    { name: "Dashboard", path: "/comms-admin", solidIcon: HiHome, outlineIcon: HiOutlineHome },
    { name: "Updates", path: "/comms-admin/posts",  solidIcon: IoNewspaper, outlineIcon: IoNewspaperOutline},
    { name: "Archive", path: "/comms-admin/archive", solidIcon: RiArchiveFill, outlineIcon: GoArchive },
  ],
  scadmin: [
    { name: "Dashboard", path: "/school-admin", solidIcon: HiHome, outlineIcon: HiOutlineHome },
    { name: "School Updates", path: "/school-admin/posts", solidIcon: RiFileCopy2Fill, outlineIcon: RiFileCopy2Line },
  ],
  psas: [
    { name: "Dashboard", path: "/psas-admin", solidIcon: HiHome, outlineIcon: HiOutlineHome },
    { name: "Survey", path: "/psas-admin/surveys",match: "/psas-admin/surveys", solidIcon: MdFileCopy, outlineIcon: MdOutlineFileCopy  },
    { name: "School Forms", path: "/psas-admin/forms", solidIcon: BiSolidFolderOpen, outlineIcon: BiFolderOpen },
  ],
  registrar: [
    { name: "Dashboard", path: "/registrar", solidIcon: HiHome, outlineIcon: HiOutlineHome },
    { name: "Enrollment", path: "/registrar/enrollment", match: "/registrar/enrollment", solidIcon: FaAddressCard, outlineIcon: FaRegAddressCard },
  
    { name: "Students", path: "/registrar/student-information-management", solidIcon: HiUsers, outlineIcon: HiOutlineUsers },
    { name: "SOA", path: "/registrar/soa", solidIcon: HiClipboardDocumentList, outlineIcon: HiOutlineClipboardDocumentList},
    //  { name: "Archive", solidIcon: RiArchiveFill, outlineIcon: GoArchive },
  ],
   superadmin: [
    { name: "Dashboard", path: "/system-admin", solidIcon: HiHome, outlineIcon: HiOutlineHome },
  ],
};
