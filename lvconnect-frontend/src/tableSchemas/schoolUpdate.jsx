import { Archive, ArchiveRestore, Check, Eye, Pencil, Trash, Trash2, X } from "lucide-react";
import { FaFacebook } from "react-icons/fa6";
import { MdPublish } from "react-icons/md";

export const schoolUpdateSchema = {
    id: { header: "#", display: true },
    title: {
        header: "Updates", display: true,
        customCell: (value) => {
            // const plainText = value.replace(/<\/?[^>]+(>|$)/g, "");
            return value.split(" ").slice(0, 3).join(" ");
        }
    },
    status: { header: "Status", display: true },
    type: { header: "Type", display: true },
    updated_at: { header: "Last Modified", display: true, format: "date", sortable: true},
};

export const actions = (handleViewPost, handlePublish, handleEdit, handleDelete, handleArchive, handlePostFb, handleApprove, handleReject) => ({
    view: {
        icon: () => <Eye size={18} />,
        fn: (id, item) => handleViewPost(item),
        variant: () => "ghost",
        className: "text-blue-600 hover:bg-blue-200 p-1"
    },
    edit: {
        icon: () => <Pencil size={18} />,
        fn: (id, item) => handleEdit(item),
        variant: () => "ghost",
        className: "text-blue-600 hover:bg-blue-200 p-1"
    },
    publish: {
        icon: () => <MdPublish size={18} />,
        fn: (id, item) => handlePublish(item),
        variant: () => "ghost",
        className: "text-blue-600 hover:bg-blue-200 p-1"
    },
    delete: {
        icon: () => <Trash size={18} />,
        fn: (id, item) => handleDelete(item),
        variant: () => "ghost",
        className: "text-blue-600 hover:bg-blue-200 p-1"
    },
    archive: {
        icon: () => <Archive size={18} />,
        fn: (id, item) => handleArchive(item),
        variant: () => "ghost",
        className: "text-blue-600 hover:bg-blue-200 p-1"
    },
    postFb: {
        icon: () => <FaFacebook size={18} />,
        fn: (id, item) => handlePostFb(item),
        variant: () => "ghost",
        className: "text-blue-600 hover:bg-blue-200 p-1"
    },
    approve: {
        icon: () => <Check size={18} />,
        fn: (id, item) => handleApprove(item),
        variant: () => "default",className: "hover:bg-green-300 bg-green-500 p-1 text-xs sm:text-sm max-w-xs"
    },
    reject: {
        icon: () => <X size={18} />,
        fn: (id, item) => handleReject(item),
        variant: () => "default",
        className: "hover:bg-red-300 bg-red-500 p-1 text-xs sm:text-sm max-w-xs"
    },
});

// Sample action conditions
export const actionConditions = {
    view: () => true,
    edit: (item, userRole) => userRole === "comms" && item.status === "draft" && item.status === "rejected" && item.status === "revision",
    delete: (item, userRole) => userRole === "comms" && item.status === "archived",
    publish: (item, userRole) => userRole === "comms" && item.status === "approved",
    archive: (item, userRole) => userRole === "comms" && item.status === "published",
    postFb: (item, userRole) => userRole === "comms" && item.status === "published" && item.status !== "published & synced",
    approve: (item, userRole) => userRole === "scadmin" && item.status === "pending" || item.status === "revision", 
    reject: (item, userRole) => userRole === "scadmin" && item.status === "pending" || item.status === "revision", 
    
};

export const archiveSchema = {
    title: {
        header: "Updates",
        display: true,
        enableSorting: true,    
        customCell: (value) => {
            return value.split(" ").slice(0, 3).join(" ");
        }
    },
    status: {
        header: "Status",
        display: true,
        enableSorting: true
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
        icon: () => <Eye size={18} />,
        fn: (id, item) => handleView(item),
        variant: () => "ghost",
        className: "text-blue-600 hover:bg-blue-200 p-1"
    },
    delete: {
        icon: () => <Trash2 size={18} />,
        fn: (id, item) => handleDelete(item),
        variant: () => "ghost",
        className: "text-red-600 hover:bg-red-200 p-1"
    },
    restore: {
        icon: () => <ArchiveRestore size={18} />,
        fn: (id, item) => handleArchive(item),
        variant: () => "ghost",
        className: "text-blue-600 hover:bg-blue-200 p-1"
    },

});

// Sample action conditions
export const archiveActionConditions = {
    view: () => true,
    delete: (item, userRole) => userRole === "comms" && item.status === "archived",
    restore: (item, userRole) => userRole === "comms" && item.status === "archived",
    
};

