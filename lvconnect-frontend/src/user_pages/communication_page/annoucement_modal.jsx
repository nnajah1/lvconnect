import { useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import ApprovalModal from "./switch_approval_modal";
import FbLvccApalit from "./sync_facebook_modal/fb_lvvc_apalit";
import FbLvccHighEd from "./sync_facebook_modal/fb_lvcc_high_ed";
import FbLvcc from "./sync_facebook_modal/fb_lvcc";
import FacebookSync from "./comms_components/fbsync";
import TextEditor from "./comms_components/texteditor";
import Tooltip from "./comms_components/tooltip";
import Calendar from "./comms_components/calendar";
import PublishEvent from "./publish_event_modal";
import LoadingPage from "./comms_components/loading";

const AnnouncementModal = ({ setIsModalOpen }) => {
  const [selectedType, setSelectedType] = useState("Announcement");
  const [notification, setNotification] = useState(false);
  const [adminApproval, setAdminApproval] = useState(false);
  const [syncApalit, setSyncApalit] = useState(false);
  const [syncHigherEd, setSyncHigherEd] = useState(false);
  const [content, setContent] = useState("");
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null); 
  const [isLoading, setIsLoading] = useState(false);

  const eventColors = ["#979595", "#2CA4DD", "#FFC107", "#E3212E", "#9747FF", "#55B47D"];

  const handleSubmit = () => {
  setIsLoading(true); 
  setShowApprovalModal(false);
  setShowPublishModal(null);

  setTimeout(() => {
    setIsLoading(false); 

    if (selectedType === "Announcement" && adminApproval) {
      setShowApprovalModal(true);
    } else if (selectedType === "Announcement") {
      if (syncApalit && syncHigherEd) {
        setShowPublishModal("Both");
      } else if (syncApalit) {
        setShowPublishModal("Apalit");
      } else if (syncHigherEd) {
        setShowPublishModal("HigherEd");
      }
    } else if (selectedType === "Event") {
      setShowPublishModal("Event");
    }
  }, 1000); 
};
  

  return (
    <div
      className="fixed inset-0 flex justify-center items-center bg-black/30 backdrop-blur-sm z-50 p-4"
      onClick={() => setIsModalOpen(false)}
    >
      <div
        className="bg-[#EAF2FD] w-full max-w-[780px] max-h-[97vh] p-4 rounded-lg shadow-lg relative flex flex-col gap-3 overflow-x-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b pb-2">
          <button onClick={() => setIsModalOpen(false)} className="text-xl text-[#1A2B50] hover:text-gray-600">
            <IoArrowBack />
          </button>
          <h2 className="text-xl font-semibold text-[#20C1FB]">Create New {selectedType}</h2>
          <div></div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex bg-white p-1 rounded-full w-fit">
            {["Announcement", "Event"].map((type) => (
              <button
                key={type}
                className={`px-4 py-1 rounded-full ${selectedType === type ? "bg-[#20C1FB] text-white" : "text-[#20C1FB]"}`}
                onClick={() => setSelectedType(type)}
              >
                {type}
              </button>
            ))}
          </div>
          <Tooltip
            selectedType={selectedType}
            notification={notification}
            setNotification={setNotification}
            adminApproval={adminApproval}
            setAdminApproval={setAdminApproval}
          />
        </div>

        <input
          type="text"
          placeholder="Title"
          className="w-full p-3.5 border rounded-md text-lg bg-white focus:outline-none focus:border-[#2CA4DD]"
        />

        {selectedType === "Announcement" ? (
          <>
            <TextEditor content={content} setContent={setContent} />
            <FacebookSync syncApalit={syncApalit} setSyncApalit={setSyncApalit} syncHigherEd={syncHigherEd} setSyncHigherEd={setSyncHigherEd} />
          </>
        ) : (
          <div className="grid grid-cols-7 gap-4 items-start p-4">
            {/* Start Date */}
            <div className="col-span-2">
              <Calendar label="Start Date" />
            </div>

            {/* End Date */}
            <div className="col-span-2">
              <Calendar label="End Date" />
            </div>

            {/* About Event */}
            <div className="col-span-3">
              <label className="block text-sm font-medium text-gray-700">About Event</label>
              <textarea
                className="w-full h-32 p-2 border border-gray-300 rounded-md bg-white resize-none focus:border-[#2CA4DD] focus:ring-0 focus:outline-none"
                placeholder="About event"
              ></textarea>
            </div>

            {/* Select Event Color */}
            <div className="col-span-7">
              <label className="block text-sm font-medium text-gray-700">Select Event Color</label>
              <div className="flex space-x-3 mt-2">
                {eventColors.map((color) => (
                  <button
                    key={color}
                    className={`w-6 h-6 rounded-full border-2 ${
                      selectedColor === color ? "border-black" : "border-transparent"
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setSelectedColor(color)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-4">
          <button className="px-3 py-2 text-gray-600 border border-gray-300 rounded-md">Save Draft</button>
          <button onClick={handleSubmit} className="px-3 py-1 bg-[#2CA4DD] hover:bg-[#1e90d9] text-white rounded-md">
            {selectedType === "Announcement" ? "Submit" : "Publish"}
          </button>
        </div>

        {isLoading && <LoadingPage />}
        {showApprovalModal && <ApprovalModal onClose={() => setShowApprovalModal(false)} />}
        {showPublishModal === "Apalit" && <FbLvccApalit onClose={() => setShowPublishModal(null)} />}
        {showPublishModal === "HigherEd" && <FbLvccHighEd onClose={() => setShowPublishModal(null)} />}
        {showPublishModal === "Both" && <FbLvcc onClose={() => setShowPublishModal(null)} />}
        {showPublishModal === "Event" && <PublishEvent onClose={() => setShowPublishModal(null)} />}


      </div>
    </div>
  );
};

export default AnnouncementModal;
