; // Mark as a Client Component

import React, { useEffect, useState } from "react";
import { DataTable } from "@/components/dynamic/DataTable";
import { getColumns } from "@/components/dynamic/getColumns";
import { deletePost, getArchivePosts, restorePost } from "@/services/axios";
import { archiveActionConditions, archiveActions, archiveSchema } from "@/tableSchemas/schoolUpdate";
import { useUserRole } from "@/utils/userRole";
import { InfoModal, WarningModal } from "@/components/dynamic/alertModal";


const ArchivePosts = () => {
  const userRole = useUserRole();
  const [archive, setArchive] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [deleteItem, setDeleteItem] = useState(false);
  const [restoreItem, setRestoreItem] = useState(false);

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

  const handleDeletePost = async () => {
    setLoading(true)
    try {
      await deletePost(deleteItem.id);
      toast.success('Post deleted successfully!');
      setDeleteItem(false)
      await loadArchive();
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
      toast.success('Post restored successfully!');
      setRestoreItem(false)
    } catch (error) {
      console.error(error);
      toast.error('Failed to restore post');
    } finally {
      setLoading(false);
    }
  };

  const action = archiveActions(handleDelete, handleRestore);

  const columns = getColumns({
    userRole,
    schema: archiveSchema,
    actions: action,
    actionConditions: archiveActionConditions

  });

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Archive</h1>
      <DataTable columns={columns} data={archive} context="archives" isLoading={loading} />

       {deleteItem && (
        <WarningModal
          isOpen={() => setDeleteItem(true)}
          closeModal={() => setDeleteItem(false)}
          title="Delete Post"
          description="Are you sure you want to delete this post?"
        >
          <button
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 cursor-pointer"
            onClick={() => setDeleteItem(false)}
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

      {restoreItem && (
        <InfoModal
          isOpen={() => setRestoreItem(true)}
          closeModal={() => setRestoreItem(false)}
          title="Archive Post"
          description="Are you sure you want to archive this post?"
        >
          <button
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 cursor-pointer"
            onClick={() => setRestoreItem(false)}
          >
            cancel
          </button>
          <button
            className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 cursor-pointer"
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