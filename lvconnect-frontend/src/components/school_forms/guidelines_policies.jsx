import React, { useState } from "react";
import { FaFileLines, FaUserShield } from "react-icons/fa6";
import PrivacyPolicy from "@/layouts/PrivacyPolicy";

export default function StudentResources() {
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  return (
    <div className="box-border flex flex-col items-start p-2.5 gap-5 w-full max-w-full border border-solid border-[#CED4DA] rounded-lg mx-auto">
      <div className="flex flex-col items-start w-full">
        <h5 className="font-lato font-semibold text-xl text-[#1F3463] mb-1">
          Guidelines and Policies
        </h5>
        <div className="font-inter font-medium text-sm text-[#686868]">
          View important guidelines and policies to stay informed and compliant.
        </div>
      </div>

      {/* Cards */}
      <div className="flex flex-col sm:flex-row items-stretch p-2.5 gap-2.5 w-full">
        {/* Student Handbook */}
        <a
          href="/my/student-services/student-handbook"
          className="box-border flex flex-col justify-between items-center py-3 px-2.5 gap-2 w-full sm:w-[200px] h-fit border border-solid border-[#CED4DA] rounded-[4px] transition-all hover:shadow-md"
        >
          <FaFileLines className="text-[35px] text-[#1F3463] mb-2.5" />
          <div className="box-border px-2 py-1 border border-[#CED4DA] rounded-[2px] w-full max-w-[160px] text-center">
            <div className="font-inter text-[11px] text-black">
              Student Handbook
            </div>
          </div>
        </a>

        {/* Data Privacy Policy (button to open modal) */}
        <button
          type="button"
          onClick={() => setShowPrivacyModal(true)}
          className="box-border flex flex-col justify-between items-center py-3 px-2.5 gap-2 w-full sm:w-[200px] h-fit border border-solid border-[#CED4DA] rounded-[4px] transition-all hover:shadow-md"
        >
          <FaUserShield className="text-[35px] text-[#1F3463] mb-2.5" />
          <div className="box-border px-2 py-1 border border-[#CED4DA] rounded-[2px] w-full max-w-[160px] text-center">
            <div className="font-inter text-[11px] text-black">
              Data Privacy Policy
            </div>
          </div>
        </button>
      </div>

      {/* Show modal if triggered */}
      {showPrivacyModal && (
        <PrivacyPolicy onClose={() => setShowPrivacyModal(false)} />
      )}
    </div>
  );
}
