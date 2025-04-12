"use client"; // Mark as a Client Component

import React, { useEffect, useRef, useState } from "react";
import { DataTable } from "@/components/dynamic/DataTable";
import { getColumns } from "@/components/dynamic/getColumns";
import { getPosts } from "@/services/axios";
import { actionConditions, actions, schoolUpdateSchema } from "@/utils/schoolUpdate";
import { CiCirclePlus, CiSearch } from "react-icons/ci";
import CreatePostModal from "@/pages/admins/comms/CreatePost";
import ViewPostModal from "./ViewPost";

const Posts = ({ userRole }) => {
  const [schoolUpdates, setSchoolUpdates] = useState([]);
  // const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false)
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);


  
  const handleViewPost = (id, item) => {
    setSelectedPostId(id);
    setViewModalOpen(true);
  };

  const columns = getColumns({
    userRole,
    schema: schoolUpdateSchema,
    actions: actions(handleViewPost),
    actionConditions: actionConditions

  });

  useEffect(() => {
    const loadUpdates = async () => {
      const data = await getPosts();
      setSchoolUpdates(data);
    };
    loadUpdates();
  }, []);

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }


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
        <div className="relative w-96">
          <CiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search..."
            className="border border-gray-300 rounded-md pl-10 pr-4 py-2 w-full outline-none focus:ring-2 focus:ring-gray-50"
          />
        </div>
      </div>

      <DataTable columns={columns} data={schoolUpdates} context="Posts" />

      {/* Modals */}
      <CreatePostModal isOpen={isOpen} closeModal={() => setIsOpen(false)} />

      <ViewPostModal isOpen={viewModalOpen} closeModal={() => setViewModalOpen(false)} postId={selectedPostId}
      />
    </div>
  );
}

export default Posts;