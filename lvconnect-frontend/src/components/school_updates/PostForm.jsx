// src/components/PostForm.js
import React, { useState, useEffect } from 'react';
import { useAuthContext } from '@/context/AuthContext';
import { createPost, updatePost } from '@/services/axios';

const PostForm = ({ post, onSave }) => {
  const { user } = useAuthContext();
  if (user.role !== 'comms') return null;

  const [formData, setFormData] = useState({
    title: post?.title || '',
    content: post?.content || '',
    type: post?.type || 'announcement',
    image: null,
    file: null,
    is_urgent: post?.is_urgent || false,
  });

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title,
        content: post.content,
        type: post.type,
        image: null,
        file: null,
        is_urgent: post.is_urgent,
      });
    }
  }, [post]);

  const handleSubmit = async (status) => {
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key]) data.append(key, formData[key]);
    });
    if (status) data.append('status', status);

    try {
      const response = post
        ? await updatePost(post.id, data)
        : await createPost(data);
      onSave(response.data.post);
    } catch (error) {
      console.error('Error saving post:', error);
    }
  };

  return (
    <form>
      {post?.status === 'revision' && (
        <div>
          <h3>Revision Required</h3>
          <p><strong>Fields to Revise:</strong> {post.revision_fields.join(', ')}</p>
          {post.revision_remarks && <p><strong>Remarks:</strong> {post.revision_remarks}</p>}
        </div>
      )}

      <input
        type="text"
        value={formData.title}
        onChange={e => setFormData({ ...formData, title: e.target.value })}
        placeholder="Title"
      />
      <textarea
        value={formData.content}
        onChange={e => setFormData({ ...formData, content: e.target.value })}
        placeholder="Content"
      />
      <select
        value={formData.type}
        onChange={e => setFormData({ ...formData, type: e.target.value })}
      >
        <option value="announcement">Announcement</option>
        <option value="event">Event</option>
      </select>
      <input
        type="file"
        onChange={e => setFormData({ ...formData, image: e.target.files[0] })}
        accept="image/*"
      />
      <input
        type="file"
        onChange={e => setFormData({ ...formData, file: e.target.files[0] })}
        accept=".pdf,.docx"
      />
      <label>
        <input
          type="checkbox"
          checked={formData.is_urgent}
          onChange={e => setFormData({ ...formData, is_urgent: e.target.checked })}
        />
        
      </label>
      <button type="button" onClick={() => handleSubmit('draft')}>Save Draft</button>
      <button type="button" onClick={() => handleSubmit('pending')}>Submit for Approval</button>
    </form>
  );
};

export default PostForm;