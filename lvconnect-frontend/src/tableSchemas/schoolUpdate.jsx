import StatusBadge from "@/components/dynamic/statusBadge";
import { formatTitle, toTitleCase } from "@/utils/textFormatter";
import { Archive, ArchiveRestore, ArchiveRestoreIcon, Check, ExternalLink, Eye, Pencil, Trash, Trash2, Trash2Icon, TrashIcon, View, X } from "lucide-react";
import { BiPencil, BiTrash } from "react-icons/bi";
import { BsEye, BsEyeFill, BsTrash } from "react-icons/bs";
import { FaFacebook } from "react-icons/fa6";
import { MdArchive, MdPublish, MdRestore, MdRestoreFromTrash } from "react-icons/md";

export const schoolUpdateSchema = {
    title: {
        header: "Updates",
        display: true,
        enableSorting: true,
        customCell: (value) => (
            <span className="font-semibold text-gray-700">
                {formatTitle(value)}
            </span>)
    },
    status: {
        header: "Status",
        display: true,
        enableSorting: true,
        customCell: (value) => <StatusBadge status={value} />,
    },
    type: {
        header: "Type",
        display: true,
        enableSorting: true,
         customCell: (value) => (<span>
                {toTitleCase(value)}
            </span>)    
    },
    updated_at: {
        header: "Last Modified",
        display: true,
        format: "date",
        enableSorting: true
    },
};

export const actions = (
  handleViewPost, handlePublish, handleEdit, handleDelete,
  handleArchive, handlePostFb
) => ({
  view: {
    label: "View",
    icon: () => <ExternalLink size={16} />,
    fn: (id, item) => handleViewPost(item),
    className: "text-blue-900 hover:bg-blue-100",
  },
  edit: {
    label: "Edit",
    icon: () => <BiPencil size={16} />,
    fn: (id, item) => handleEdit(item),
  },
  publish: {
    label: "Publish",
    icon: () => <MdPublish size={16} />,
    fn: (id, item) => handlePublish(item),
  },
  delete: {
    label: "Delete",
    icon: () => <Trash size={16} />,
    fn: (id, item) => handleDelete(item),
  },
  archive: {
    label: "Archive",
    icon: () => <MdArchive size={16} />,
    fn: (id, item) => handleArchive(item),
  },
  postFb: {
    label: "Post to Facebook",
    icon: () => <FaFacebook size={16} />,
    fn: (id, item) => handlePostFb(item),
  },
 
});

export const actionsForSchoolAdmin = ( handleViewPost, handleApprove, handleReject
) => ({
  view: {
    label: "View",
    icon: () => <ExternalLink size={16} />,
    fn: (id, item) => handleViewPost(item),
    className: "text-blue-900 hover:bg-blue-100",
  },
   approve: {
    label: "Approve",
    icon: () => <Check size={16} />,
    fn: (id, item) => handleApprove(item),
  },
  reject: {
    label: "Reject",
    icon: () => <X size={16} />,
    fn: (id, item) => handleReject(item),
  },
});

// Sample action conditions
export const actionConditions = {
    view: () => true,
    edit: (item, userRole) => userRole === "comms" && (item.status === "draft" || item.status === "revision"),
    delete: (item, userRole) => userRole === "comms" && item.status === "archived",
    publish: (item, userRole) => userRole === "comms" && item.status === "approved",
    archive: (item, userRole) => userRole === "comms" && item.status === "published",
    postFb: (item, userRole) => userRole === "comms" && (item.status === "published" && item.status !== "published & synced"),
};

export const actionConditionsForSchoolAdmin = {
   view: () => true,
   approve: (item, userRole) =>
        userRole === "scadmin" && (item.status === "pending" || item.status === "revision"),
    reject: (item, userRole) =>
        userRole === "scadmin" && (item.status === "pending" || item.status === "revision"),
}

export const archiveSchema = {
    title: {
        header: "Updates",
        display: true,
        enableSorting: true,
         customCell: (value) => (
            <span className="font-semibold text-gray-700">
                {formatTitle(value)}
            </span>)
    },
    status: {
        header: "Status",
        display: true,
        enableSorting: true,
        customCell: (value) => <StatusBadge status={value} />,
    },
    type: {
        header: "Type",
        display: true,
        enableSorting: true
    },
    published_at: {
        header: "Date Posted",
        display: true,
        format: "date",
        enableSorting: true
    },
    archived_at: {
        header: "Date Archieved",
        display: true,
        format: "date",
        enableSorting: true
    },

}

export const archiveActions = (handleView, handleDelete, handleArchive) => ({
    view: {
        icon: () => <ExternalLink size={16} />,
        fn: (id, item) => handleView(item),
        className: "text-blue-900 hover:bg-blue-100"
    },
    delete: {
        icon: () => <Trash2Icon size={16}/>,
        fn: (id, item) => handleDelete(item),
    },
    restore: {
        icon: () => <ArchiveRestoreIcon size={20}/>,
        fn: (id, item) => handleArchive(item),
    },

});

// Sample action conditions
export const archiveActionConditions = {
    view: () => true,
    delete: (item, userRole) => userRole === "comms" && item.status === "archived",
    restore: (item, userRole) => userRole === "comms" && item.status === "archived",

};

