

import { useState, useEffect } from "react"
import "@/styles/student_soa.css"
import { SOADetailsView } from "@/components/enrollment/soaManager"
import { useUserRole } from "@/utils/userRole";
import { getStudentSoa } from "@/services/enrollmentAPI";
import { Loader3 } from "@/components/dynamic/loader";
import { SOACard } from "@/components/enrollment/soaCard";

const StudentSoa = () => {
  const UserRole = useUserRole();

  const [currentSoaData, setCurrentSoaData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentSoaCollapsed, setCurrentSoaCollapsed] = useState(false);
  const [collapsedSoas, setCollapsedSoas] = useState({});
  const [otherSoas, setOtherSoas] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchAllSoas = async () => {
      setLoading(true);
      try {
        const res = await getStudentSoa();
        setCurrentSoaData(res.data.active || null);
        setOtherSoas(res.data.past || []);
      } catch (err) {
        toast.error("Failed to fetch SOAs");
        setCurrentSoaData(null);
        setOtherSoas([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllSoas();
  }, []);

  const toggleCurrentSoa = () => {
    setCurrentSoaCollapsed(!currentSoaCollapsed);
  };

  const toggleSoa = (soaId) => {
    setCollapsedSoas(prev => ({
      ...prev,
      [soaId]: !prev[soaId]
    }));
  };

  if (loading) {
    return <Loader3 />
  }

  return (
    <div className="">
      {/* Header */}
      <div className="statement-header">
        <div>
          <h1 className="text-2xl font-bold text-[#253965]">Statement of Account</h1>
          <p className="text-sm text-gray-600 mt-1">View the breakdown of fees in your statement of account.</p>
        </div>
      </div>

      {/* Content */}
      {/* <div className="statement-content">
        <div className="statement-card">
          <div className="school-year-header">
            <h2 className="text-xl font-semibold text-white">Current SOA</h2>
          </div>
          {!loading && currentSoaData && (
            <div className="w-full p-4">
              <SOADetailsView
                soaData={currentSoaData}
                isCollapsed={currentSoaCollapsed}
                onToggle={toggleCurrentSoa}
                title={`SOA for ${currentSoaData.school_year}`}
                userRole={UserRole}
                isOther={true}
              />
            </div>
          )}
        </div>
        <div className="statement-card">
          <div className="school-year-header">
            <h2 className="text-xl font-semibold text-white">Previous SOAs</h2>
          </div>
         
          {!loading && otherSoas.length > 0 && (
            <div className="w-full p-4">
              {otherSoas.map((soa) => (
                <SOADetailsView
                  key={soa.id}
                  soaData={soa}
                  isCollapsed={collapsedSoas[soa.id] || false}
                  onToggle={() => toggleSoa(soa.id)}
                  title={`SOA for ${soa.school_year}`}
                  userRole={UserRole}
                  isOther={true}
                />
              ))}
            </div>
          )}
        </div>
      </div> */}
      <div className="flex gap-4 ">
        {otherSoas.map((soa) => (
          <SOACard
            key={soa.id}
            soaData={soa}
            onView={() => {
              setCurrentSoaData(soa);
              setIsModalOpen(true);
            }}
          // onDownload={() => {
          //   setCurrentSoaData(soa);
          //   setTimeout(() => {
          //     handleDownload();
          //   }, 200); // delay ensures printRef updates
          // }}
          />
        ))}
      </div>
      {currentSoaData && (
        <SOADetailsView
          soaData={currentSoaData}
          isCollapsed={currentSoaCollapsed}
          onToggle={toggleCurrentSoa}
          title={`SOA for ${currentSoaData.school_year}`}
          userRole={UserRole}
          isOther={true}
          isModalOpen={isModalOpen}
          closeModal={() => setIsModalOpen(false)}
        />
      )}
    </div>
  )
}

export default StudentSoa;
