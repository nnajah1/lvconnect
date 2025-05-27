// src/components/PostList.js
import React, { useState, useEffect } from 'react';
import { useAuthContext } from '@/context/AuthContext';
import {
  getPosts,
  getArchivedPosts,
  archivePost,
  restorePost,
  deletePost,
  submitPost,
  approvePost,
  rejectPost,
  requestRevision,
  publishPost,
} from '@/services/axios';

const PostList = () => {
  const { user } = useAuthContext();
  const [activeTab, setActiveTab] = useState('active');
  const [posts, setPosts] = useState([]);
  const [archivedPosts, setArchivedPosts] = useState([]);
  const [showConfirm, setShowConfirm] = useState(null);
  const [showRevisionForm, setShowRevisionForm] = useState(null);
  const [revisionData, setRevisionData] = useState({
    revisionFields: [],
    revisionRemarks: '',
  });

  useEffect(() => {
    fetchPosts();
    if (user.role === 'comms') fetchArchivedPosts();
  }, [user]);

  const fetchPosts = async () => {
    try {
      const response = await getPosts();
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const fetchArchivedPosts = async () => {
    try {
      const response = await getArchivedPosts();
      setArchivedPosts(response.data);
    } catch (error) {
      console.error('Error fetching archived posts:', error);
    }
  };

  const handleAction = async (postId, action) => {
    try {
      if (action === 'archive') {
        setShowConfirm(postId);
        return;
      }
      if (action === 'revision') {
        setShowRevisionForm(postId);
        return;
      }
      const actions = {
        archive: archivePost,
        restore: restorePost,
        destroy: deletePost,
        submit: submitPost,
        approve: approvePost,
        reject: rejectPost,
        revision: (id) => requestRevision(id, revisionData.revisionFields, revisionData.revisionRemarks),
        publish: publishPost,
      };
      await actions[action](postId);
      fetchPosts();
      if (user.role === 'comms') fetchArchivedPosts();
      setShowConfirm(null);
      setShowRevisionForm(null);
    } catch (error) {
      console.error(`Error ${action} post:`, error);
    }
  };

  const handleRevisionSubmit = (postId) => {
    if (revisionData.revisionFields.length === 0) {
      alert('Please select at least one field for revision.');
      return;
    }
    handleAction(postId, 'revision');
  };

  const toggleRevisionField = (field) => {
    setRevisionData(prev => ({
      ...prev,
      revisionFields: prev.revisionFields.includes(field)
        ? prev.revisionFields.filter(f => f !== field)
        : [...prev.revisionFields, field],
    }));
  };

  return (
    <div>
      {user.role === 'comms' && (
        <div>
          <button onClick={() => setActiveTab('active')}>Active Posts</button>
          <button onClick={() => setActiveTab('archived')}>Archived Posts</button>
        </div>
      )}

      {activeTab === 'active' && posts.map(post => (
        <div key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
          {post.image_url && <img src={post.image_url} alt={post.title} />}
          {post.file_url && <a href={post.file_url}>Download File</a>}

          {/* Display revision details for comms */}
          {user.role === 'comms' && post.status === 'revision' && (
            <div>
              <p><strong>Fields to Revise:</strong> {post.revision_fields.join(', ')}</p>
              {post.revision_remarks && <p><strong>Remarks:</strong> {post.revision_remarks}</p>}
            </div>
          )}

          {/* comms controls */}
          {user.role === 'comms' && (
            <>
              {post.status === 'draft' && (
                <button onClick={() => handleAction(post.id, 'submit')}>Submit</button>
              )}
              {post.status === 'published' && (
                <button onClick={() => handleAction(post.id, 'archive')}>Archive</button>
              )}
              <button onClick={() => handleAction(post.id, 'destroy')}>Delete</button>
            </>
          )}

          {/* scadmin controls */}
          {user.role === 'scadmin' && post.status === 'pending' && (
            <>
              <button onClick={() => handleAction(post.id, 'approve')}>Approve</button>
              <button onClick={() => handleAction(post.id, 'reject')}>Reject</button>
              <button onClick={() => handleAction(post.id, 'revision')}>Request Revision</button>
              <button onClick={() => handleAction(post.id, 'publish')}>Publish</button>
            </>
          )}

          {/* Archive confirmation */}
          {showConfirm === post.id && (
            <div>
              <p>Are you sure you want to archive this post? It will no longer be visible to students but will remain in your records.</p>
              <button onClick={() => { handleAction(post.id, 'archive'); setShowConfirm(null); }}>Yes</button>
              <button onClick={() => setShowConfirm(null)}>No</button>
            </div>
          )}

          {/* Revision form for scadmin */}
          {showRevisionForm === post.id && user.role === 'scadmin' && (
            <div>
              <p>Select fields to revise:</p>
              <label>
                <input
                  type="checkbox"
                  checked={revisionData.revisionFields.includes('title')}
                  onChange={() => toggleRevisionField('title')}
                />
                Title
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={revisionData.revisionFields.includes('content')}
                  onChange={() => toggleRevisionField('content')}
                />
                Content
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={revisionData.revisionFields.includes('type')}
                  onChange={() => toggleRevisionField('type')}
                />
                Type
              </label>
              <textarea
                value={revisionData.revisionRemarks}
                onChange={e => setRevisionData({ ...revisionData, revisionRemarks: e.target.value })}
                placeholder="Revision remarks (optional)"
                maxLength={1000}
              />
              <button onClick={() => handleRevisionSubmit(post.id)}>Submit Revision</button>
              <button onClick={() => setShowRevisionForm(null)}>Cancel</button>
            </div>
          )}
        </div>
      ))}

      {activeTab === 'archived' && user.role === 'comms' && (
        <div>
          <h1>Archived Updates</h1>
          {archivedPosts.map(post => (
            <div key={post.id}>
              <h2>{post.title}</h2>
              <p>Category: {post.type}</p>
              <p>Date Published: {new Date(post.published_at).toLocaleDateString()}</p>
              <p>Date Archived: {new Date(post.archived_at).toLocaleDateString()}</p>
              <p>Status: Archived</p>
              <button onClick={() => handleAction(post.id, 'restore')}>Restore</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostList;