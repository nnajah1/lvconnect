"use client"

import { useEffect, useState } from "react"
import { DataTable } from "@/components/dynamic/DataTable"
import { getColumns } from "@/components/dynamic/getColumns"
import {
  approvePost,
  archivePost,
  deletePost,
  fbPost,
  getPosts,
  publishPost,
  rejectPost,
  revisionPost,
} from "@/services/axios"
import { actionConditions, actions, schoolUpdateSchema } from "@/tableSchemas/schoolUpdate"
import { CiCirclePlus } from "react-icons/ci"
import CreatePostModal from "@/pages/admins/comms/CreatePost"
import ViewPostModal from "./ViewPost"
import SearchBar from "@/components/dynamic/searchBar"
import { useUserRole } from "@/utils/userRole"
import { ConfirmationModal, ErrorModal, InfoModal, WarningModal } from "@/components/dynamic/alertModal"
import EditPostModal from "./EditPost"
import { toast } from "react-toastify"
import { loadNotifications } from "@/hooks/notification"

const Posts = () => {
  const userRole = useUserRole()
  const [schoolUpdates, setSchoolUpdates] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isOpen, setIsOpen] = useState(false)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [selectedPost, setSelectedPost] = useState(null)
  const [globalFilter, setGlobalFilter] = useState("")
  const [viewItem, setViewItem] = useState(null)
  const [editItem, setEditItem] = useState(null)
  const [deleteItem, setDeleteItem] = useState(null)
  const [archiveItem, setArchiveItem] = useState(null)
  const [postItem, setPostItem] = useState(null)
  const [publishItem, setPublishItem] = useState(null)
  const [approveItem, setApproveItem] = useState(null)
  const [rejectItem, setRejectItem] = useState(null)
  const [remarks, setRemarks] = useState("")
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)

  const [revisionItem, setRevisionItem] = useState(null)

  const loadUpdates = async () => {
    setLoading(true)
    try {
      const data = await getPosts()
      setSchoolUpdates(data)
    } catch (err) {
      console.error("Failed to load posts", err)
      toast.error("Failed to load posts.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUpdates()
  }, [])

  const handleViewPost = (item) => {
    setViewItem(item)
  }

  const handleEdit = (item) => {
    setEditItem(item)
  }

  const handleDelete = (item) => {
    setDeleteItem(item)
  }

  const handlePublish = (item) => {
    setPublishItem(item)
  }

  const handleApprove = (item) => {
    setApproveItem(item)
  }

  const handleReject = (item) => {
    setRejectItem(item)
  }

  const handleRevision = (item) => {
    setRevisionItem(item)
  }

  const handleDeletePost = async () => {
    setLoading(true)
    try {
      await deletePost(deleteItem.id)
      toast.success("Post deleted successfully!")
      setDeleteItem(null)
      await loadUpdates()
    } catch (error) {
      console.error(error)
      toast.error("Failed to delete post")
    } finally {
      setLoading(false)
    }
  }

  const handleArchive = (item) => {
    setArchiveItem(item)
  }

  const handleArchivePost = async () => {
    setLoading(true)
    try {
      await archivePost(archiveItem.id)
      await loadUpdates()
      toast.success("Post archived successfully!")
      setArchiveItem(null)
    } catch (error) {
      console.error(error)
      toast.error("Failed to archive post")
    } finally {
      setLoading(false)
    }
  }

  const handlePostFb = (item) => {
    setPostItem(item)
  }

  const handleFbPost = async () => {
    setLoading(true)
    try {
      const response = await fbPost(postItem.id, {
        schoolupdate_id: postItem.id,
        title: postItem.title,
        content: postItem.content,
        image_url: postItem.image_url || [],
      })
      await loadUpdates()
      toast.success("Post synced to Facebook successfully!")
      setPostItem(null)
      console.log("FB Response:", response.data)
    } catch (error) {
      console.error(error)
      toast.error("Failed to sync to Facebook")
    } finally {
      setLoading(false)
    }
  }

  const handlePublishPost = async () => {
    setLoading(true)
    try {
      await publishPost(publishItem.id)
      await loadUpdates()
      await loadNotifications()
      toast.success("Post published successfully!")
      setPublishItem(null)
    } catch (error) {
      console.error(error)
      toast.error("Failed to publish post")
    } finally {
      setLoading(false)
    }
  }

  const handleApprovePost = async () => {
    setLoading(true)
    try {
      await approvePost(approveItem.id)
      await loadUpdates()
      await loadNotifications()
      toast.success("Post approved successfully!")
      setApproveItem(null)
    } catch (error) {
      console.error(error)
      toast.error("Failed to approve post")
    } finally {
      setLoading(false)
    }
  }

  const handleRejectPost = async () => {
    if (!rejectItem.id) {
      toast.info("No valid post found.")
      console.log("rejectItem:", rejectItem)
      return
    }
    if (!remarks) {
      toast.error("Input admin remarks")
      console.log("rejectItem:", rejectItem)
      return
    }
    setLoading(true)
    try {
      await rejectPost(rejectItem.id, { revision_remarks: remarks })
      await loadUpdates()
      await loadNotifications()
      toast.success("Post rejected successfully!")
      setRejectItem(null)
      setRemarks("")
    } catch (error) {
      console.error(error)
      toast.error("Failed to reject post")
    } finally {
      setLoading(false)
    }
  }

  const handleRevisionPost = async (e) => {
    if (!revisionItem.id) {
      toast.info("No valid post found.")
      console.log("revisionItem:", revisionItem)
      return
    }
    if (!remarks) {
      toast.error("Input admin remarks")
      console.log("revisionItem:", revisionItem)
      return
    }
    setLoading(true)
    try {
      await revisionPost(revisionItem.id, { revision_remarks: remarks })
      await loadUpdates()
      toast.success("Post submitted for revision!")
      setRevisionItem(null)
      setRemarks("")
    } catch (error) {
      console.error(error)
      toast.error("Failed to submit post for revision")
    } finally {
      setLoading(false)
    }
  }

  // Modal handlers that will be passed to ViewPostModal
  const modalHandlers = {
    onEdit: (item) => {
      setViewItem(null)
      setEditItem(item)
    },
    onDelete: (item) => {
      setViewItem(null)
      setDeleteItem(item)
    },
    onArchive: (item) => {
      setViewItem(null)
      setArchiveItem(item)
    },
    onPublish: (item) => {
      setViewItem(null)
      setPublishItem(item)
    },
    onPostFb: (item) => {
      setViewItem(null)
      setPostItem(item)
    },
    onApprove: (item) => {
      setViewItem(null)
      setApproveItem(item)
    },
    onReject: (item) => {
      setViewItem(null)
      setRejectItem(item)
    },
    onRevision: (item) => {
      setViewItem(null)
      setRevisionItem(item)
    },
  }

  const action = actions(
    handleViewPost,
    handlePublish,
    handleEdit,
    handleDelete,
    handleArchive,
    handlePostFb,
    handleApprove,
    handleReject,
  )

  const columns = getColumns({
    userRole,
    schema: schoolUpdateSchema,
    actions: action,
    actionConditions: actionConditions,
  })

  return (
    <div className="container mx-auto p-4">
      {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
              {/* Title and Subtitle */}
              <div>
                <h1 className="text-2xl font-bold text-[#253965]">Updates Management</h1>
                <p className="text-[16px] text-gray-600 mt-1">Create, manage, and publish school updates such as announcements and events.</p>
              </div>
              {/* Search Input */}
              <div>
                <SearchBar value={globalFilter} onChange={setGlobalFilter} />
              </div>
            </div>

    

      {/* Create Update Button */}
      <div className="mb-6">
        {userRole === "comms" && (
          <button
            onClick={() => {
              setIsOpen(true)
            }}
            className="flex items-center space-x-2 bg-[#1F3463] text-white px-4 py-3 rounded-md  transition-colors cursor-pointer"
          >
            <CiCirclePlus size={20} />
            <span>Create Update</span>
          </button>
        )}
      </div>

      <DataTable
        columns={columns}
        data={schoolUpdates}
        context="Posts"
        globalFilter={globalFilter}
        isLoading={loading}
      />

      {/* Modals */}
      <CreatePostModal isOpen={isOpen} closeModal={() => setIsOpen(false)} loadUpdates={loadUpdates} />

      {viewItem && (
        <ViewPostModal
          isOpen={!!viewItem}
          closeModal={() => setViewItem(null)}
          postId={viewItem.id}
          loadUpdates={loadUpdates}
          userRole={userRole}
          modalHandlers={modalHandlers}
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
            {loading ? "Deleting..." : "Delete"}
          </button>
        </ErrorModal>
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
            {loading ? "Archiving..." : "Archive"}
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
            {loading ? "Syncing..." : "Sync To Facebook"}
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
            {loading ? "Publishing..." : "Publish"}
          </button>
        </ConfirmationModal>
      )}

      {approveItem && (
        <ConfirmationModal
          isOpen={!!approveItem}
          closeModal={() => setApproveItem(null)}
          title="Approve Post"
          description="Are you sure you want to approve this post?"
        >
          <button
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 cursor-pointer"
            onClick={() => setApproveItem(null)}
          >
            cancel
          </button>
          <button
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 cursor-pointer"
            onClick={handleApprovePost}
            disabled={loading}
          >
            {loading ? "Approving..." : "Approve"}
          </button>
        </ConfirmationModal>
      )}

      {rejectItem && (
        <ErrorModal
          isOpen={!!rejectItem}
          closeModal={() => {
            setRejectItem(null)
            setRemarks("")
          }}
          title="Reject Post"
          description="Are you sure you want to reject this post?"
        >
          <div className="flex w-full flex-col">
            <div className="w-full">
              <textarea
                placeholder="Enter admin remarks"
                className="w-full px-3 py-2 border rounded mb-4"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                required
              />
            </div>

            <div className="flex justify-end">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 mr-2"
                onClick={() => {
                  setRejectItem(null)
                  setRemarks("")
                }}
              >
                Cancel
              </button>

              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={handleRejectPost}
                disabled={loading}
              >
                {loading ? "Rejecting..." : "Reject"}
              </button>
            </div>
          </div>
        </ErrorModal>
      )}

      {revisionItem && (
        <WarningModal
          isOpen={!!revisionItem}
          closeModal={() => {
            setRevisionItem(null)
            setRemarks("")
          }}
          title="For Revision Post"
          description="Are you sure you want to submit this post for revision?"
        >
          <div className="flex w-full flex-col">
            <div className="w-full">
              <textarea
                placeholder="Enter admin remarks"
                className="w-full px-3 py-2 border rounded mb-4"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                required
              />
            </div>

            <div className="flex justify-end">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 mr-2"
                onClick={() => {
                  setRevisionItem(null)
                  setRemarks("")
                }}
              >
                Cancel
              </button>

              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={handleRevisionPost}
                disabled={loading}
              >
                {loading ? "Submitting..." : "For Revision"}
              </button>
            </div>
          </div>
        </WarningModal>
      )}
    </div>
  )
}

export default Posts
