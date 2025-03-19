"use client";
import { useEffect, useState } from "react";
import DataTable from "@/components/school_updates/data-table";
import axios from "axios";

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/api/posts") // Adjust this to your Laravel API route
      .then((response) => {
        setPosts(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading posts...</p>;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">X Admin - Manage Posts</h2>
      <DataTable data={posts} />
    </div>
  );
}
