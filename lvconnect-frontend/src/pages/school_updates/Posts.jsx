"use client"; // Mark as a Client Component

import React, { useEffect, useState } from "react";
import { DataTable } from "@/components/school_updates/data-table";
import { getColumns } from "@/components/school_updates/columns";
import { fetchPosts } from "@/axios";


export default function Posts() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleEdit = (id) => {
    console.log("Edit post with ID:", id);
    // Add your edit logic here
  };

  const handleDelete = (id) => {
    console.log("Delete post with ID:", id);
    // Add your delete logic here
  };

  const columns = getColumns(handleEdit, handleDelete);

  useEffect(() => {
    const loadData = async () => {
      try {
        const posts = await fetchPosts(); // Fetch posts from the API
        setData(posts);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Posts</h1>
      <DataTable columns={columns} data={data} />
    </div>
  );
}