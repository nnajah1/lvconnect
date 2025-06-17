import { HiHome, HiOutlineHome, HiClipboardDocumentList, HiOutlineClipboardDocumentList, HiOutlineUsers, HiUsers, HiMiniShieldCheck } from "react-icons/hi2";
import { FaAddressCard, FaRegAddressCard, FaFileAlt, FaRegFileAlt } from "react-icons/fa";
import { RiGraduationCapFill, RiGraduationCapLine, RiArchiveFill, RiFileCopy2Fill, RiFileCopy2Line } from "react-icons/ri";
import { IoNewspaperOutline, IoNewspaper } from "react-icons/io5";
import { GoArchive } from "react-icons/go";
import { MdOutlineFileCopy, MdFileCopy } from "react-icons/md";
import { BiSolidFolderOpen, BiFolderOpen } from "react-icons/bi";
import { HiFolder, HiOutlineFolder, HiOutlineShieldCheck } from "react-icons/hi"

export const roleMenus = [
  // Student
  {
    name: "Dashboard",
    path: "/my",
    roles: ["student"],
    solidIcon: HiHome,
    outlineIcon: HiOutlineHome,
  },
  {
    name: "Enrollment",
    path: "/my/enrollment",
    roles: ["student"],
    solidIcon: FaAddressCard,
    outlineIcon: FaRegAddressCard,
  },
  {
    name: "Grades",
    path: "/my/grades",
    roles: ["student"],
    solidIcon: FaFileAlt,
    outlineIcon: FaRegFileAlt,
  },
  {
    name: "SOA",
    path: "/my/soa",
    roles: ["student"],
    solidIcon: HiClipboardDocumentList,
    outlineIcon: HiOutlineClipboardDocumentList,
  },
  {
    name: "School Forms",
    path: "/my/school-forms",
    roles: ["student"],
    solidIcon: HiFolder,
    outlineIcon: HiOutlineFolder,
  },
  {
    name: "Student Services",
    path: "/my/student-services",
    roles: ["student"],
    solidIcon: RiGraduationCapFill,
    outlineIcon: RiGraduationCapLine,
  },
  {
    name: "Surveys",
    path: "/my/surveys",
    roles: ["student"],
    solidIcon: MdFileCopy,
    outlineIcon: MdOutlineFileCopy,
  },

  // Comms
  {
    name: "Dashboard",
    path: "/comms-admin",
    roles: ["comms"],
    solidIcon: HiHome,
    outlineIcon: HiOutlineHome,
  },
  {
    name: "Update Management",
    path: "/comms-admin/posts",
    roles: ["comms"],
    solidIcon: IoNewspaper,
    outlineIcon: IoNewspaperOutline,
  },
  {
    name: "Archive",
    path: "/comms-admin/archive",
    roles: ["comms"],
    solidIcon: GoArchive,
    outlineIcon: GoArchive, // No outline version available
  },

  // School Admin
  {
    name: "Dashboard",
    path: "/school-admin",
    roles: ["scadmin"],
    solidIcon: HiHome,
    outlineIcon: HiOutlineHome,
  },
  {
    name: "School Updates",
    path: "/school-admin/posts",
    roles: ["scadmin"],
    solidIcon: MdFileCopy,
    outlineIcon: MdOutlineFileCopy,
  },

  // PSAS
  {
    name: "Dashboard",
    path: "/psas-admin",
    roles: ["psas"],
    solidIcon: HiHome,
    outlineIcon: HiOutlineHome,
  },
  {
    name: "Survey Management",
    path: "/psas-admin/surveys",
    roles: ["psas"],
    solidIcon: MdFileCopy,
    outlineIcon: MdOutlineFileCopy,
  },
  {
    name: "School Form Management",
    path: "/psas-admin/forms",
    roles: ["psas"],
    solidIcon: BiSolidFolderOpen,
    outlineIcon: BiFolderOpen,
  },

  // Registrar
  {
    name: "Dashboard",
    path: "/registrar",
    roles: ["registrar"],
    solidIcon: HiHome,
    outlineIcon: HiOutlineHome,
  },
  {
    name: "Enrollment Management",
    path: "/registrar/enrollment",
    roles: ["registrar"],
    solidIcon: FaAddressCard,
    outlineIcon: FaRegAddressCard,
  },
  {
    name: "Student Management",
    path: "/registrar/student-information-management",
    roles: ["registrar"],
    solidIcon: HiUsers,
    outlineIcon: HiOutlineUsers,
  },
  {
    name: "SOA Management",
    path: "/registrar/soa",
    roles: ["registrar"],
    solidIcon: HiClipboardDocumentList,
    outlineIcon: HiOutlineClipboardDocumentList,
  },

  // Superadmin - Dropdowns for each role
  {
    name: "Dashboard",
    path: "/system-admin",
    roles: ["superadmin"],
    solidIcon: HiHome,
    outlineIcon: HiOutlineHome,
  },
  {
    name: "Student",
    roles: ["superadmin"],
    dropdown: [
      {
        name: "Student",
        path: "/my",
        solidIcon: HiHome,
        outlineIcon: HiOutlineHome,
      },
      {
        name: "Enrollment",
        path: "/my/enrollment",
        solidIcon: FaAddressCard,
        outlineIcon: FaRegAddressCard,
      },
      {
        name: "Grades",
        path: "/my/grades",
        solidIcon: FaFileAlt,
        outlineIcon: FaRegFileAlt,
      },
      {
        name: "SOA",
        path: "/my/soa",
        solidIcon: HiClipboardDocumentList,
        outlineIcon: HiOutlineClipboardDocumentList,
      },
      {
        name: "School Forms",
        path: "/my/school-forms",
        solidIcon: HiFolder,
        outlineIcon: HiOutlineFolder,
      },
      {
        name: "Student Services",
        path: "/my/student-services",
        solidIcon: RiGraduationCapFill,
        outlineIcon: RiGraduationCapLine,
      },
      {
        name: "Surveys",
        path: "/my/surveys",
        solidIcon: MdFileCopy,
        outlineIcon: MdOutlineFileCopy,
      },
    ],
    solidIcon: HiHome,
    outlineIcon: HiOutlineHome,
  },
  {
    name: "Communications Officer",
    roles: ["superadmin"],
    dropdown: [
      {
        name: "Comms Dashboard",
        path: "/comms-admin",
        solidIcon: HiHome,
        outlineIcon: HiOutlineHome,
      },
      {
        name: "Update Management",
        path: "/comms-admin/posts",
        solidIcon: IoNewspaper,
        outlineIcon: IoNewspaperOutline,
      },
      {
        name: "Archive",
        path: "/comms-admin/archive",
        solidIcon: GoArchive,
        outlineIcon: GoArchive,
      },
    ],
    solidIcon: HiHome,
    outlineIcon: HiOutlineHome,
  },
  {
    name: "College Chancellor ",
    roles: ["superadmin"],
    dropdown: [
      {
        name: "School Admin Dashboard",
        path: "/school-admin",
        solidIcon: HiHome,
        outlineIcon: HiOutlineHome,
      },
      {
        name: "School Updates",
        path: "/school-admin/posts",
        solidIcon: MdFileCopy,
        outlineIcon: MdOutlineFileCopy,
      },
    ],
    solidIcon: HiHome,
    outlineIcon: HiOutlineHome,
  },
  {
    name: "Prefect",
    roles: ["superadmin"],
    dropdown: [
      {
        name: "PSAS Dashboard",
        path: "/psas-admin",
        solidIcon: HiHome,
        outlineIcon: HiOutlineHome,
      },
      {
        name: "Survey Management",
        path: "/psas-admin/surveys",
        solidIcon: MdFileCopy,
        outlineIcon: MdOutlineFileCopy,
      },
      {
        name: "School Form Management",
        path: "/psas-admin/forms",
        solidIcon: BiSolidFolderOpen,
        outlineIcon: BiFolderOpen,
      },
    ],
    solidIcon: HiHome,
    outlineIcon: HiOutlineHome,
  },
  {
    name: "Registrar",
    roles: ["superadmin"],
    dropdown: [
      {
        name: "Registrar Dashboard",
        path: "/registrar",
        solidIcon: HiHome,
        outlineIcon: HiOutlineHome,
      },
      {
        name: "Enrollment Management",
        path: "/registrar/enrollment",
        solidIcon: FaAddressCard,
        outlineIcon: FaRegAddressCard,
      },
      {
        name: "Student Management",
        path: "/registrar/student-information-management",
        solidIcon: HiUsers,
        outlineIcon: HiOutlineUsers,
      },
      {
        name: "SOA Management",
        path: "/registrar/soa",
        solidIcon: HiClipboardDocumentList,
        outlineIcon: HiOutlineClipboardDocumentList,
      },
    ],
    solidIcon: HiHome,
    outlineIcon: HiOutlineHome,
  },

];
