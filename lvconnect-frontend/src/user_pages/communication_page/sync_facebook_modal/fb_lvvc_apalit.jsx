import PublishModal from "../comms_components/fbmodal";
import { useState } from "react";

const FbLvccApalit = () => {
  const [modalOpen, setModalOpen] = useState(true);

  return (
    <>
      <PublishModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        facebookPages={[
          "La Verdad Christian College, Inc. - Apalit, Pampanga"
        ]}
      />
    </>
  );
};

export default FbLvccApalit;
