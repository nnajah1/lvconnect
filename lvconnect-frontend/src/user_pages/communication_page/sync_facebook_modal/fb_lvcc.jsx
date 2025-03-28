import PublishModal from "../comms_components/fbmodal";
import { useState } from "react";

const FbLvcc = ({ adminApproval }) => {  // Accept adminApproval as prop
  const [modalOpen, setModalOpen] = useState(true);

  return (
    <>
      <PublishModal
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        facebookPages={[
          "La Verdad Christian College, Inc. - Apalit, Pampanga",
          "La Verdad Christian College, Inc. - Higher Education"
        ]}
        adminApproval={adminApproval} // Pass down the prop
      />
    </>
  );
};

export default FbLvcc;
