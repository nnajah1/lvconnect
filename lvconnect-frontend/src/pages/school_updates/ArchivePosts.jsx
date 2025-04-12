"use client"; // Mark as a Client Component

import React, { useEffect, useState } from "react";
import { DataTable } from "@/components/DataTable";
import { getColumns } from "@/components/getColumns";
import { getArchivePosts } from "@/services/axios";
import { archiveSchema } from "@/utils/schoolUpdate";


const ArchivePosts = ({ userRole }) => {
  const [archive, setArchive] = useState([]);
  // const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const loadArchive = async () => {
      const data = await getArchivePosts();
      setArchive(data);
    };
    loadArchive();
  }, []);


  const columns = getColumns({
    userRole,
    schema: archiveSchema,
  });

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Archive</h1>
      <DataTable columns={columns} data={archive} />
    </div>
  );
}

export default ArchivePosts;