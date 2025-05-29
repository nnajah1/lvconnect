
import React, { useEffect, useRef, useState } from "react";
import { DataTable } from "@/components/dynamic/DataTable";
import { getColumns } from "@/components/dynamic/getColumns";
import { getPosts } from "@/services/axios";
import { actionConditions, actions, schoolUpdateSchema } from "@/tableSchemas/schoolUpdate";
import { CiCirclePlus, CiSearch } from "react-icons/ci";
import CreatePostModal from "@/pages/admins/comms/CreatePost";
import ViewPostModal from "./ViewPost";
import SearchBar from "@/components/dynamic/searchBar";
import { useUserRole } from "@/utils/userRole";
import { ConfirmationModal, WarningModal } from "@/components/dynamic/alertModal";
import EditPostForm from "@/components/school_updates/editPostForm";
import EditPostModal from "./EditPost";

const Posts = () => {
  const userRole = useUserRole();
  const [schoolUpdates, setSchoolUpdates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false)
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [globalFilter, setGlobalFilter] = useState("");
  const [viewItem, setViewItem] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(false);

  const handleViewPost = (item) => {
    setViewItem(item);
  };
  const handleEdit = (item) => {
    setEditItem(item);
  };

  const handleDelete = (item) => {
    setDeleteItem(item);
  };

   const handleDeletePost = () => {
    // setDeleteItem(item);
  };


  const action = actions(handleViewPost, handleEdit, handleDelete);

  const columns = getColumns({
    userRole,
    schema: schoolUpdateSchema,
    actions: action,
    actionConditions: actionConditions

  });

  const loadUpdates = async () => {
      setLoading(true)
      try {
        const data = await getPosts();
        setSchoolUpdates(data);
      } catch (err) {
        console.error("Failed to load posts", err);
        toast.error("Failed to load posts.");
      } finally {
        setLoading(false);
      }
    };
  useEffect(() => {
    loadUpdates();
  }, []);

  // if (error) {
  //   return <p className="text-red-500">Error: {error}</p>;
  // }


  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Posts</h1>

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
            <span>Create Update</span>
            {/* <IoMdArrowDropdown size={25} /> */}
          </button>
        </div>

        {/* Search Input */}
        <div><SearchBar value={globalFilter} onChange={setGlobalFilter} /></div>
      </div>

      <DataTable columns={columns} data={schoolUpdates} context="Posts" globalFilter={globalFilter} isLoading={loading} />

      {/* Modals */}
      <CreatePostModal isOpen={isOpen} closeModal={() => setIsOpen(false)} load={loadUpdates} />

      {viewItem && (
        <ViewPostModal
          isOpen={!!viewItem}
          closeModal={() => setViewItem(null)}
          postId={viewItem.id}
        />

      )}
      {editItem && (
        <EditPostModal
          isOpen={!!editItem}
          closeModal={() => setEditItem(null)}
          onDeleteModal={() => setIsSuccessModalOpen(true)}
          onSuccessModal={() => setIsSuccessModalOpen(false)}
          postId={editItem}
        />
      )}
      {deleteItem && (
        <WarningModal
          isOpen={() => setDeleteItem(true)}
          closeModal={() => setDeleteItem(false)}
          title="Delete Post"
          description="Are you sure you want to delete this post?"
        >
          <button
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            onClick={() => setDeleteItem(false)}
          >
           cancel
          </button>
            <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={() => handleDeletePost}
          >
           Delete
          </button>

        </WarningModal>
      )}

      {/* <ConfirmationModal
          isOpen={() => setDeleteItem(true)}
          closeModal={() => setDeleteItem(false)}
          title="Create Post"
          description="Are you sure you want to delete this post?"
        >
          <button
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            onClick={() => setDeleteItem(false)}
          >
           cancel
          </button>
            <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={() => handleDeletePost}
          >
           Delete
          </button>

        </ConfirmationModal> */}


    </div>
  );
}

export default Posts;