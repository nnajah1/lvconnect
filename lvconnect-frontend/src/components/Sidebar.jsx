import { useState } from "react";
import logo from "../src/assets/lv-logo.png";
import { HiHome, HiOutlineHome, HiClipboardDocumentList, HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { FaFileAlt, FaAddressCard, FaRegAddressCard, FaRegFileAlt } from "react-icons/fa";
import { RiGraduationCapLine, RiGraduationCapFill } from "react-icons/ri";
import { RxTextAlignJustify } from "react-icons/rx";


const Sidebar = () => {
  const [active, setActive] = useState("Dashboard");
  const [isExpanded, setIsExpanded] = useState(true);

  const menuItems = [
    { name: "Dashboard", solidIcon: HiHome, outlineIcon: HiOutlineHome },
    { name: "Enrollment", solidIcon: FaAddressCard, outlineIcon: FaRegAddressCard },
    { name: "Grades", solidIcon: FaFileAlt, outlineIcon: FaRegFileAlt },
    { name: "SOA", solidIcon: HiClipboardDocumentList, outlineIcon: HiOutlineClipboardDocumentList },
    { name: "Student Services", solidIcon: RiGraduationCapFill, outlineIcon: RiGraduationCapLine },
  ];

  return (

    
    <div
      className={`h-screen bg-[#1a2b50] text-white p-4 flex flex-col transition-all duration-300 ${
        isExpanded ? "w-64" : "w-20"
      }`}
    >
      {/* Sidebar Toggle Button */}
      <div className={`flex ${isExpanded ? "justify-end" : "justify-center"} mb-4`}>
        <button onClick={() => setIsExpanded(!isExpanded)} className="text-white">
          {isExpanded ? <RxTextAlignJustify  size={21} /> : <RxTextAlignJustify size={21} />}
        </button>
      </div>

      {/* Logo - Fixed Size */}
      <div className="flex flex-col items-center mb-6">
        <div className="w-16 h-16 flex items-center justify-center">
          <img src={logo} alt="Logo" className="w-16 h-16" />
        </div>
        {isExpanded && (
          <h1 className="text-[25px] leading-[40px] text-white">
            <span className="text-[#36A9E1] font-extrabold">LV</span>
            <span className="text-[17px] leading-[24px] font-extrabold">Connect</span>
          </h1>
        )}
      </div>

      {/* Navigation Menu */}
      <nav>
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = active === item.name ? item.solidIcon : item.outlineIcon;
            return (
              <li key={item.name}>
                <a
                  href="#"
                  className={`flex items-center ${
                    isExpanded ? "space-x-3" : "justify-center"
                  } p-2 rounded-md ${
                    active === item.name ? "bg-[#20C1FB]" : ""
                  }`}
                  onClick={() => setActive(item.name)}
                >
                  <Icon size={21} className="text-white" />
                  {isExpanded && <span>{item.name}</span>}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
