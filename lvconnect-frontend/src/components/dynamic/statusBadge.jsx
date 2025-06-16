
import React from "react";

const statusStyles = {
  draft: "bg-gray-100 text-gray-800 border-gray-300",
  published: "bg-green-100 text-green-800 border-green-300",
  Published: "bg-green-100 text-green-800 border-green-300",
  archived: "bg-yellow-100 text-yellow-800 border-yellow-300",
  rejected: "bg-red-100 text-red-800 border-red-300",
  pending: "bg-orange-100 text-orange-800 border-orange-300",
  approved: "bg-blue-100 text-emerald-800 border-emerald-300",
  hidden: "bg-gray-100 text-gray-800 border-gray-300",
  visible: "bg-green-100 text-green-800 border-green-300",
  Visible: "bg-green-100 text-green-800 border-green-300",
};

const StatusBadge = ({ status }) => {
  const style = statusStyles[status] || statusStyles["draft"];
  return (
    <span
      className={`px-2 py-1 rounded-md border ${style} whitespace-nowrap capitalize`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
