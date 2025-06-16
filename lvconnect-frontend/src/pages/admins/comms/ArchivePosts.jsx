; // Mark as a Client Component

import React, { useEffect, useState } from "react";
import { DataTable } from "@/components/dynamic/DataTable";
import { getColumns } from "@/components/dynamic/getColumns";
import { deletePost, getArchivePosts, restorePost } from "@/services/axios";
import { archiveActionConditions, archiveActions, archiveSchema } from "@/tableSchemas/schoolUpdate";
import { useUserRole } from "@/utils/userRole";
import { ErrorModal, InfoModal, WarningModal } from "@/components/dynamic/alertModal";
import SearchBar from "@/components/dynamic/searchBar"
import { toast } from "react-toastify";
import ViewPostModal from "./ViewPost";


const ArchivePosts = () => {
  const userRole = useUserRole();
  const [archive, setArchive] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [deleteItem, setDeleteItem] = useState(null);
  const [restoreItem, setRestoreItem] = useState(null);
    const [viewItem, setViewItem] = useState(null);

  const loadArchive = async () => {
    setLoading(true)
    try {
      const data = await getArchivePosts();
      setArchive(data);
    } catch (err) {
      console.error("Failed to load archived posts", err);
      toast.error("Failed to load archived posts.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadArchive();
  }, []);

  const handleDelete = (item) => {
    setDeleteItem(item);
  };

    const handleView = (item) => {
    setViewItem(item);
  };

  const handleDeletePost = async () => {
    setLoading(true)
    try {
      await deletePost(deleteItem.id);
      await loadArchive();
      setDeleteItem(null);
      toast.success('Post deleted successfully!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete post');
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = (item) => {
    setRestoreItem(item);
  };

  const handleRestorePost = async () => {

    setLoading(true)
    try {
      await restorePost(restoreItem.id);
      await loadArchive();
      setRestoreItem(null)
      toast.success('Post restored successfully!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to restore post');
    } finally {
      setLoading(false);
    }
  };
  
  const action = archiveActions(handleView, handleDelete, handleRestore);
  const columns = getColumns({
    userRole,
    schema: archiveSchema,
    actions: action,
    handleDelete,
    handleRestore,
    actionConditions: archiveActionConditions

  });

  // if (error) {
  //   return <p className="text-red-500">Error: {error}</p>;
  // }

  return (
    <div className="container mx-auto p-4">
       <div className="flex justify-between items-center mb-6">
              {/* Title and Subtitle */}
              <div>
                <h1 className="text-2xl font-bold text-[#253965]">Archived Updates</h1>
                <p className="text-[16px] text-gray-600 mt-1">View and manage previously published school updates in the archive</p>
              </div>
           
            
            </div>
      <DataTable columns={columns} data={archive} context="archives" isLoading={loading} />

      {viewItem && (
        <ViewPostModal
          isOpen={!!viewItem}
          closeModal={() => setViewItem(null)}
          postId={viewItem.id}
          loadUpdates={loadArchive}
          userRole={userRole}
        />

      )}

      {deleteItem && (
        <ErrorModal
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

        </ErrorModal>
      )}

      {restoreItem && (
        <InfoModal
          isOpen={!!restoreItem}
          closeModal={() => setRestoreItem(null)}
          title="Restore Post"
          description="Are you sure you want to restore this post?"
        >
          <button
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 cursor-pointer"
            onClick={() => setRestoreItem(null)}
          >
            cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
            onClick={handleRestorePost}
            disabled={loading}
          >
            {loading ? 'Restoring...' : 'Restore'}
          </button>

        </InfoModal>
      )}
    </div>
  );
}

export default ArchivePosts;