import React, { useState } from "react";
import DynamicModal from "@/components/dynamic/DynamicModal";

export default function PrivacyPolicy() {
  const [isOpen, setIsOpen] = useState(true);

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <DynamicModal
      isOpen={isOpen}
      closeModal={closeModal}
      title="Privacy Policy"
      showFooter={false}
    >
      <div className="space-y-6">
        <section>
          <h2 className="text-[16px] font-semibold mb-2">1. INTRODUCTION</h2>
          <p className="text-gray-700 text-sm pl-[20px]" style={{ textIndent: "-20px" }}>
            &nbsp;&nbsp;&nbsp;&nbsp;La Verdad Christian College, Inc. - Apalit, Pampanga (LVCC Apalit) respects your right to privacy.
            This Privacy Policy outlines how we collect, use, store, and protect your personal information through LVConnect.
          </p>
        </section>

        <section>
          <h2 className="text-[16px] font-semibold mb-2">2. INFORMATION WE COLLECT</h2>
          <p className="text-gray-700 text-sm pl-[20px]" style={{ textIndent: "-20px" }}>
            &nbsp;&nbsp;&nbsp;&nbsp;When using LVConnect, we may collect the following information:
            Personal Information: Full name, student ID number, email address, course, year level, and contact details.
            Academic Information: Grades, subjects enrolled, and school-related documents.
            Login Information: Email address and encrypted passwords.
            System Usage Data: Device information, IP address, browser type, and access logs.
          </p>
        </section>

        <section>
          <h2 className="text-[16px] font-semibold mb-2">3. HOW WE USE YOUR INFORMATION</h2>
          <p className="text-gray-700 text-sm pl-[20px]" style={{ textIndent: "-20px" }}>
            &nbsp;&nbsp;&nbsp;&nbsp;The information collected is used to:
            Provide access to academic records and student services
            Improve system performance and user experience
            Authenticate user identity and protect account security
            Communicate important announcements and updates
            Support administrative and academic functions of the school.
          </p>
        </section>

        <section>
          <h2 className="text-[16px] font-semibold mb-2">4. DATA STORAGE AND SECURITY</h2>
          <p className="text-gray-700 text-sm pl-[20px]" style={{ textIndent: "-20px" }}>
            &nbsp;&nbsp;&nbsp;&nbsp;All data is stored securely in a protected database with access restricted to authorized school personnel only.
            Passwords are stored in encrypted format.
            The system uses secure protocols (e.g., HTTPS) to protect data during transmission.
            Regular backups and system audits are performed to ensure data integrity and security.
          </p>
        </section>

        <section>
          <h2 className="text-[16px] font-semibold mb-2">5. DATA SHARING AND DISCLOSURE</h2>
          <p className="text-gray-700 text-sm pl-[20px]" style={{ textIndent: "-20px" }}>
            &nbsp;&nbsp;&nbsp;&nbsp;Your information will not be sold or shared with third parties. It may only be accessed by:
            Authorized MIS Department personnel
            Academic and administrative staff with legitimate educational interest
            Regulatory bodies or legal entities when required by law.
          </p>
        </section>

        <section>
          <h2 className="text-[16px] font-semibold mb-2">6. USER RIGHTS</h2>
          <p className="text-gray-700 text-sm pl-[20px]" style={{ textIndent: "-20px" }}>
            &nbsp;&nbsp;&nbsp;&nbsp;As a user of the portal, you have the right to:
            Access and review your personal and academic data
            Request corrections to inaccurate information
            Be informed about how your data is used
            Report any privacy concerns or unauthorized access
          </p>
        </section>

        <section>
          <h2 className="text-[16px] font-semibold mb-2">7. CHANGES TO THIS PRIVACY POLICY</h2>
          <p className="text-gray-700 text-sm pl-[20px]" style={{ textIndent: "-20px" }}>
            &nbsp;&nbsp;&nbsp;&nbsp;This policy may be updated as needed. Users will be notified of any significant changes through the portal or email announcements.
          </p>
        </section>
      </div>
    </DynamicModal>
  );
}
