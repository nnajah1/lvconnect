
import React, { useEffect, useRef, useState } from "react";
import { DataTable } from "@/components/dynamic/DataTable";
import { getColumns } from "@/components/dynamic/getColumns";
import { getSurveys } from "@/services/surveyAPI";
import { actionConditions, actions, roleSchema } from "@/tableSchemas/roles";
import { CiCirclePlus, CiSearch } from "react-icons/ci";
import SearchBar from "@/components/dynamic/searchBar";
import { toast } from "react-toastify";
import { useUserRole } from "@/utils/userRole";
import api from "@/services/axios";
import { ConfirmationModal, ErrorModal } from "@/components/dynamic/alertModal";
import CreateAccountForm from "@/components/role_management/createAccount";
import CreateAccountModal from "./CreateAccount";
import EditAccountModal from "./EditAccount";

const RoleManagement = () => {
  const userRole = useUserRole();
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [reactivateItem, setReactivateItem] = useState(null);
  const [deactivateItem, setDeactivateItem] = useState(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");

  const [users, setUsers] = useState([])
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)


  const fetchData = async () => {
    try {
      const res = await api.get("/users");
      const { users, roles } = res.data;

      setUsers(users);
      setRoles(roles);

    } catch (error) {
      console.error("Error fetching users/roles:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.post(`/users/${userId}/roles`, {
        roles: [newRole],
      })

      // Optimistically update local state
      setUsers(prev =>
        prev.map(user =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      )
    } catch (error) {
      console.error("Failed to update role:", error)
    }
  }

  const handleDeleteAccount = async () => {
    setLoading(true)
    try {
      await api.delete(`/users/${deleteItem.id}`);
      toast.success('Account deleted successfully!');
      setDeleteItem(null)
      await fetchData();
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete account');
    } finally {
      setLoading(false);
    }
  }
  const handleDeactivate = async () => {
    setLoading(true)
    try {
      await api.put(`/system-admin/deactivate-user/${deactivateItem.id}`);
      toast.success("User deactivated successfully.");
      setDeactivateItem(null)
      fetchData();
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.error || "Failed to deactivate user.";
      toast.error(msg);
    }finally {
      setLoading(false);
    }
  };

  const handleReactivate = async () => {
    setLoading(true)
    try {
      await api.put(`/system-admin/reactivate-user/${reactivateItem.id}`);
      toast.success("User reactivated successfully.");
      setReactivateItem(null)
      fetchData();
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.error || "Failed to reactivate user.";
      toast.error(msg);
    }finally {
      setLoading(false);
    }
  };

  const openModal = (item) => {
    setEditItem(item);
  };

   const openReactivate = (item) => {
    setReactivateItem(item);
  };

   const openDeactivate = (item) => {
    setDeactivateItem(item);
  };

  const openModalDelete = (item) => {
    setDeleteItem(item);
  };

  const columns = getColumns({
    userRole,
    schema: roleSchema,
    actions: actions(openModal, openModalDelete, openReactivate, openDeactivate),
    actionConditions: actionConditions

  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>

      {/* Create & Search Section */}
      <div className="flex justify-between items-center mb-4">
        {/* Create Update Button */}
        <div className="relative">
          <button
            onClick={() => {
              setIsOpen(true)
            }}
            className="flex items-center space-x-2 bg-[#2CA4DD] text-white px-3 py-2 rounded-md cursor-pointer"
          >
            <CiCirclePlus size={25} />
            <span>Add User</span>
          </button>
        </div>

        {/* Search Input */}
        <div><SearchBar value={globalFilter} onChange={setGlobalFilter} /></div>
      </div>

      <DataTable columns={columns} data={users} context="Roles" globalFilter={globalFilter} isLoading={loading} />
          
      {isOpen && (
        <CreateAccountModal 
        isOpen={isOpen}
        closeModal={() => setIsOpen(false)}
        availableRoles={roles}
        fetchData={fetchData}
         />
      )}

       {editItem && (
        <EditAccountModal 
        isOpen={!!editItem}
        closeModal={() => setEditItem(null)}
        availableRoles={roles}
        fetchData={fetchData}
        mode="edit"
        initialData={editItem}
         />
      )}

      {deleteItem && (
        <ErrorModal
          isOpen={!!deleteItem}
          closeModal={() => setDeleteItem(null)}
          title="Delete Account"
          description="Are you sure you want to delete this account?"
        >
          <button
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 cursor-pointer"
            onClick={() => setDeleteItem(null)}
          >
            cancel
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer"
            onClick={handleDeleteAccount}
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </ErrorModal>
      )}

      {reactivateItem && (
        <ConfirmationModal
          isOpen={!!reactivateItem}
          closeModal={() => setReactivateItem(null)}
          title="Reactivate Account"
          description="Are you sure you want to reactivate this account?"
        >
          <button
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 cursor-pointer"
            onClick={() => setReactivateItem(null)}
          >
            cancel
          </button>
          <button
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 cursor-pointer"
            onClick={handleReactivate}
            disabled={loading}
          >
            {loading ? 'saving...' : 'Reactivate'}
          </button>
        </ConfirmationModal>
      )}
      {deactivateItem && (
        <ErrorModal
          isOpen={!!deactivateItem}
          closeModal={() => setDeactivateItem(null)}
          title="Deactivate Account"
          description="Are you sure you want to deactivate this account?"
        >
          <button
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 cursor-pointer"
            onClick={() => setDeactivateItem(null)}
          >
            cancel
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer"
            onClick={handleDeactivate}
            disabled={loading}
          >
            {loading ? 'saving...' : 'Deactivate'}
          </button>
        </ErrorModal>
      )}

    </div>
  );
}

export default RoleManagement;