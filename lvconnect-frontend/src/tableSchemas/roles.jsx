import StatusBadge from "@/components/dynamic/statusBadge";
import { Eye, PenBoxIcon, Pencil, Trash, Trash2, UserRoundCheck, UserRoundX } from "lucide-react";

export const roleSchema = {
    // id: { header: "#", display: true },
    name: { header: "Name", display: true, filterable: true, },
    email: {
        header: "Email",
        filterable: true,
        display: true,
    },
    role: {
        header: "Role",
        display: true,
        filterable: true,
        customCell: (value, original) => {
    return original?.roles && original.roles.length > 0
        ? original.roles.join(", ").toUpperCase()
        : "No Roles";
}

    },
  is_active: {
  header: "Status",
  display: true,
  customCell: (value) => {
    const label = value === 1 ? "Active" : "Inactive";
    return <StatusBadge status={label} />;
  },
},


};

export const actions = (openModal, openModalDelete, openModalReactivate, openModalDeactivate) => ({
    update: {
        label: "Update",
        icon: () => <PenBoxIcon size={18} />,
        fn: (id, item) => openModal(item),
        variant: () => "ghost",
        className: "hover:bg-blue-100 bg-blue-900 text-white"
    },
    reactivate: {
        label: "Reactivate",
        icon: () => <UserRoundCheck size={18} />,
        fn: (id, item) => openModalReactivate(item),
    },
    deactivate: {
        
        label: "Deactivate",
        icon: () => <UserRoundX size={18} />,
        fn: (id, item) => openModalDeactivate(item),
    },
    delete: {
        label: "Delete",
        icon: () => <Trash2 size={18} />,
        fn: (id, item) => openModalDelete(item),
    },

})

export const actionConditions = {
    update: (item, context, userRole) => true,
    delete: (item, context, userRole) => true,
    reactivate: (item, context, userRole) => item.is_active === 0,
    deactivate: (item, context, userRole) => item.is_active === 1,
};
