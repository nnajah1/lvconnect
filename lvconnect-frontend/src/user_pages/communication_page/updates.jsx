import { useState, useEffect } from "react";
import { CiCirclePlus, CiSearch } from "react-icons/ci";
import { IoMdArrowDropdown } from "react-icons/io";
import { IoFilterOutline } from "react-icons/io5";
import { VscFilter } from "react-icons/vsc";


import AnnouncementModal from "./annoucement_modal";
import LoadingPage from "./comms_components/loading";

const Updates = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Handle loading before showing modal
  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setIsLoading(false);
        setModalType("Announcement"); 
      }, 1000); 
      return () => clearTimeout(timer); 
    }
  }, [isLoading]);

  return (
    <div className="bg-[#F8FAFC] w-full">
      <h1 className="text-2xl font-bold mb-4">School Updates</h1>

      {/* Create & Search Section */}
      <div className="flex justify-between items-center mb-4">
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-2 bg-[#2CA4DD] text-white px-3 py-2 rounded-md"
          >
            <CiCirclePlus size={25} />
            <span>Create Update</span>
            <IoMdArrowDropdown size={25} />
          </button>
          {dropdownOpen && (
            <div className="absolute left-0 mt-2 w-40 bg-white rounded-md shadow-lg">
              <ul className="py-2 text-[#1A2B50]">
                <li
                  className="px-4 py-2 hover:bg-gray-200 hover:text-[#20C1FB] cursor-pointer"
                  onClick={() => {
                    setDropdownOpen(false);
                    setIsLoading(true); // Show loading before opening modal
                  }}
                >
                  Announcement
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-200 hover:text-[#20C1FB] cursor-pointer"
                  onClick={() => {
                    setDropdownOpen(false);
                    setModalType("Event");
                  }}
                >
                  Event
                </li>
              </ul>
            </div>
          )}
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

      {/* Updates Table */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left text-gray-500 border-b-0">
              <th className="p-2 border-r border-gray-300 w-10">#</th>
              <th className="p-2 border-r border-gray-300">
                <div className="flex justify-between items-center">
                  Updates
                  <span className="flex gap-2">
                    <IoFilterOutline />
                    <VscFilter />
                  </span>
                </div>
              </th>
              <th className="p-2 border-r border-gray-300">
                <div className="flex justify-between items-center">
                  Status
                  <IoFilterOutline />
                </div>
              </th>
              <th className="p-2 border-r border-gray-300">
                <div className="flex justify-between items-center">
                  Type
                  <IoFilterOutline />
                </div>
              </th>
              <th className="p-2 border-r border-gray-300">
                <div className="flex justify-between items-center">
                  Last Modified
                  <span className="flex gap-2">
                    <IoFilterOutline />
                    <VscFilter />
                  </span>
                </div>
              </th>
              <th className="p-2 text-center">Actions</th>
            </tr>
          </thead>
        </table>
      </div>

      {/* Show Loading Screen or Modal */}
      {isLoading ? <LoadingPage /> : modalType === "Announcement" && <AnnouncementModal />}
    </div>
  );
};

export default Updates;
