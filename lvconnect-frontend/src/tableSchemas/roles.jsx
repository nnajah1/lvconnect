import { Eye, Pencil, Trash, Trash2, UserRoundCheck, UserRoundX } from "lucide-react";

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
            return original?.roles && original?.roles.length > 0
                ? original.roles.join(", ")
                : "No roles";
        }
    },
    is_active: { header: "Status", display: true, customCell: (value) => (value === 1 ? "Active" : "Inactive") },


};

export const actions = (openModal, openModalDelete, openModalReactivate, openModalDeactivate) => ({
    update: {
        icon: () => <Pencil size={18} />,
        fn: (id, item) => openModal(item),
        variant: () => "ghost",
        className: "hover:bg-blue-100 flex p-1 text-xs sm:text-sm max-w-xs"
    },
    reactivate: {
        icon: () => <UserRoundCheck size={18} className="text-white"/>,
        fn: (id, item) => openModalReactivate(item),
        variant: () => "ghost",
        className: "hover:bg-green-200 bg-green-400 flex p-1 text-xs sm:text-sm max-w-xs"
    },
    deactivate: {
        icon: () => <UserRoundX size={18} className="text-white" />,
        fn: (id, item) => openModalDeactivate(item),
        variant: () => "ghost",
        className: "hover:bg-red-200 bg-red-500 flex p-1 text-xs sm:text-sm max-w-xs"
    },
    delete: {
        icon: () => <Trash2 size={18} />,
        fn: (id, item) => openModalDelete(item),
        variant: () => "default",
        className: "hover:bg-red-200 bg-red-500 flex p-1 text-xs sm:text-sm max-w-xs"
    },

})

export const actionConditions = {
    update: (item, context, userRole) => true,
    delete: (item, context, userRole) => true,
    reactivate: (item, context, userRole) => item.is_active === 0,
    deactivate: (item, context, userRole) => item.is_active === 1,
};
