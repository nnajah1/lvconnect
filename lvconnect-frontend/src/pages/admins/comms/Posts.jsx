
import React, { useEffect, useRef, useState } from "react";
import { DataTable } from "@/components/dynamic/DataTable";
import { getColumns } from "@/components/dynamic/getColumns";
import { archivePost, deletePost, fbPost, getPosts, publishPost, restorePost } from "@/services/axios";
import { actionConditions, actions, schoolUpdateSchema } from "@/tableSchemas/schoolUpdate";
import { CiCirclePlus, CiSearch } from "react-icons/ci";
import CreatePostModal from "@/pages/admins/comms/CreatePost";
import ViewPostModal from "./ViewPost";
import SearchBar from "@/components/dynamic/searchBar";
import { useUserRole } from "@/utils/userRole";
import { ConfirmationModal, InfoModal, WarningModal } from "@/components/dynamic/alertModal";
import EditPostForm from "@/components/school_updates/editPostForm";
import EditPostModal from "./EditPost";
import { toast } from "react-toastify";

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
  const [deleteItem, setDeleteItem] = useState(null);
  const [archiveItem, setArchiveItem] = useState(null);
  const [postItem, setPostItem] = useState(null);
  const [publishItem, setPublishItem] = useState(null);


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

  const handleViewPost = (item) => {
    setViewItem(item);
  };
  const handleEdit = (item) => {
    setEditItem(item);
  };

  const handleDelete = (item) => {
    setDeleteItem(item);
  };

   const handlePublish = (item) => {
    setPublishItem(item);
  };

  const handleDeletePost = async () => {
    setLoading(true)
    try {
      await deletePost(deleteItem.id);
      toast.success('Post deleted successfully!');
      setDeleteItem(null)
      await loadUpdates();
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete post');
    } finally {
      setLoading(false);
    }
  };

  const handleArchive = (item) => {
    setArchiveItem(item);
  };

  const handleArchivePost = async () => {
    setLoading(true)
    try {
      await archivePost(archiveItem.id);
      await loadUpdates();
      toast.success('Post archived successfully!');
      setArchiveItem(null)
    } catch (error) {
      console.error(error);
      toast.error('Failed to archive post');
    } finally {
      setLoading(false);
    }
  };

  const handlePostFb = (item) => {
    setPostItem(item);
  };

  const handleFbPost = async () => {
    setLoading(true)
    try {
      const response = await fbPost(postItem.id);
      await loadUpdates();
      toast.success('Post synced to Facebook successfully!');
      setPostItem(null)
      console.log('FB Response:', response.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to sync to Facebook');
    } finally {
      setLoading(false);
    }
  };

  const handlePublishPost = async () => {
    setLoading(true)
    try {
      await publishPost(publishItem.id);
      await loadUpdates();
      toast.success('Post published successfully!');
      setPublishItem(null)
    } catch (error) {
      console.error(error);
      toast.error('Failed to publish post');
    } finally {
      setLoading(false);
    }
  };

  const action = actions(handleViewPost, handlePublish, handleEdit, handleDelete, handleArchive, handlePostFb);

  const columns = getColumns({
    userRole,
    schema: schoolUpdateSchema,
    actions: action,
    actionConditions: actionConditions

  });


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
      <CreatePostModal isOpen={isOpen} closeModal={() => setIsOpen(false)} loadUpdates={loadUpdates} />

      {viewItem && (
        <ViewPostModal
          isOpen={!!viewItem}
          closeModal={() => setViewItem(null)}
          postId={viewItem.id}
          loadUpdates={loadUpdates}
        />

      )}
      {editItem && (
        <EditPostModal
          isOpen={!!editItem}
          closeModal={() => setEditItem(null)}
          onDeleteModal={() => setIsSuccessModalOpen(true)}
          onSuccessModal={() => setIsSuccessModalOpen(false)}
          postId={editItem}
          loadUpdates={loadUpdates}
        />
      )}
      {deleteItem && (
        <WarningModal
          isOpen={!!deleteItem}
          closeModal={() => setDeleteItem(null)}
          title="Delete Post"
          description="Are you sure you want to delete this post?"
        >
          <button
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 cursor-pointer"
            onClick={() => setDeleteItem(null)}
          >
            cancel
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer"
            onClick={handleDeletePost}
           disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>

        </WarningModal>
      )}

      {archiveItem && (
        <WarningModal
          isOpen={!!archiveItem}
          closeModal={() => setArchiveItem(null)}
          title="Archive Post"
          description="Are you sure you want to archive this post?"
        >
          <button
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 cursor-pointer"
            onClick={() => setArchiveItem(null)}
          >
            cancel
          </button>
          <button
            className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 cursor-pointer"
            onClick={handleArchivePost}
           disabled={loading}
          >
            {loading ? 'Archiving...' : 'Archive'}
          </button>

        </WarningModal>
      )}


      {postItem && (
        <InfoModal
          isOpen={!!postItem}
          closeModal={() => setPostItem(null)}
          title="Post to Facebook"
          description="Are you sure you want to post this post on Facebook? this is irreversible"
        >
          <button
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 cursor-pointer"
            onClick={() => setPostItem(null)}
          >
            cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
            onClick={handleFbPost}
            disabled={loading}
          >
            {loading ? 'Syncing...' : 'Sync To Facebook'}
          </button>

        </InfoModal>
      )}

      {publishItem && (
        <ConfirmationModal
          isOpen={!!publishItem}
          closeModal={() => setPublishItem(null)}
          title="Publish Post"
          description="Are you sure you want to publish this post?"
        >
          <button
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 cursor-pointer"
            onClick={() => setPublishItem(null)}
          >
            cancel
          </button>
          <button
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 cursor-pointer"
            onClick={handlePublishPost}
           disabled={loading}
          >
            {loading ? 'Publishing...' : 'Publish'}
          </button>

        </ConfirmationModal>
      )}


    </div>
  );
}

export default Posts;