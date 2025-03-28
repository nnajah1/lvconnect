import PublishModal from "../comms_components/fbmodal";
import { useState } from "react";

const FbLvccHighEd = () => {
  const [modalOpen, setModalOpen] = useState(true);

  return (
    <>
      
      <PublishModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        facebookPages={[
          "La Verdad Christian College, Inc. - Higher Education"
        ]}
      />
    </>
  );
};

export default FbLvccHighEd;
