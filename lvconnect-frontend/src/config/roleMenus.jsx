import { HiHome, HiOutlineHome, HiClipboardDocumentList, HiOutlineClipboardDocumentList, HiOutlineUsers, HiUsers, HiMiniShieldCheck} from "react-icons/hi2";
import { FaAddressCard, FaRegAddressCard, FaFileAlt, FaRegFileAlt, } from "react-icons/fa";
import { RiGraduationCapFill, RiGraduationCapLine, RiArchiveFill, RiFileCopy2Fill, RiFileCopy2Line } from "react-icons/ri";
import { IoNewspaperOutline, IoNewspaper} from "react-icons/io5";
import { GoArchive } from "react-icons/go";
import { MdOutlineFileCopy, MdFileCopy} from "react-icons/md";
import { BiSolidFolderOpen, BiFolderOpen } from "react-icons/bi";
import { HiOutlineShieldCheck } from "react-icons/hi"

export const roleMenus = {
  student: [
     { name: "Dashboard", solidIcon: HiHome, outlineIcon: HiOutlineHome },
     { name: "Enrollment", solidIcon: FaAddressCard, outlineIcon: FaRegAddressCard },
     { name: "Grades", solidIcon: FaFileAlt, outlineIcon: FaRegFileAlt },
     { name: "SOA", solidIcon: HiClipboardDocumentList, outlineIcon: HiOutlineClipboardDocumentList },
     { name: "Student Services", solidIcon: RiGraduationCapFill, outlineIcon: RiGraduationCapLine },
     { name: "Surveys", solidIcon: MdFileCopy, outlineIcon: MdOutlineFileCopy },
   ],
   comms: [
     { name: "Dashboard", solidIcon: HiHome, outlineIcon: HiOutlineHome },
     { name: "Updates", solidIcon: IoNewspaper, outlineIcon: IoNewspaperOutline },
     { name: "Archive", solidIcon: RiArchiveFill, outlineIcon: GoArchive },
   ],
   scadmin: [
     { name: "Dashboard", solidIcon: HiHome, outlineIcon: HiOutlineHome },
     { name: "School Updates", solidIcon: RiFileCopy2Fill, outlineIcon: RiFileCopy2Line },
   ],
   psas: [
     { name: "Dashboard", solidIcon: HiHome, outlineIcon: HiOutlineHome },
     { name: "Survey", solidIcon: MdFileCopy, outlineIcon: MdOutlineFileCopy },
     { name: "School Forms", solidIcon: BiSolidFolderOpen, outlineIcon: BiFolderOpen },
   ],
   registrar: [
     { name: "Dashboard", solidIcon: HiHome, outlineIcon: HiOutlineHome },
     { name: "Enrollment", solidIcon: FaAddressCard, outlineIcon: FaRegAddressCard },
     { name: "Students", solidIcon: HiUsers, outlineIcon: HiOutlineUsers },
     { name: "SOA", solidIcon: HiClipboardDocumentList, outlineIcon: HiOutlineClipboardDocumentList },
     { name: "Archive", solidIcon: RiArchiveFill, outlineIcon: GoArchive },
   ],
   superadmin: [
     { name: "Dashboard", solidIcon: HiHome, outlineIcon: HiOutlineHome },
   ],
    systemadmin: [
     { name: "Dashboard", solidIcon: HiHome, outlineIcon: HiOutlineHome },
     { name: "Users", solidIcon: HiUsers, outlineIcon: HiOutlineUsers },
     { name: "Roles", solidIcon: HiMiniShieldCheck, outlineIcon: HiOutlineShieldCheck },
     { name: "Archive", solidIcon: RiArchiveFill, outlineIcon: GoArchive },
   ],
 };