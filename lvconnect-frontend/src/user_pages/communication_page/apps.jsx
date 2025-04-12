import { useState } from "react";
import logo from "../../assets/lv-logo.png";
import { HiHome, HiOutlineHome, HiClipboardDocumentList, HiOutlineClipboardDocumentList, HiArchiveBox  } from "react-icons/hi2";
import { RxTextAlignJustify } from "react-icons/rx";
import Updates from "./updates";
import { IoCalendar, IoCalendarOutline  } from "react-icons/io5";
import { HiOutlineArchive } from "react-icons/hi";



const Sidebar = () => {
  const [active, setActive] = useState("Dashboard");
  const [isExpanded, setIsExpanded] = useState(true);

  const menuItems = [
    { name: "Dashboard", solidIcon: HiHome, outlineIcon: HiOutlineHome },
    { name: "Updates", solidIcon: HiClipboardDocumentList, outlineIcon: HiOutlineClipboardDocumentList },
    { name: "Calendar", solidIcon: IoCalendar, outlineIcon: IoCalendarOutline },
    { name: "Archive", solidIcon: HiArchiveBox, outlineIcon: HiOutlineArchive  },
  ];


  return (
    <div className="flex">
      {/* Sidebar */}
      <div className={`h-screen bg-[#1a2b50] text-white p-4 flex flex-col transition-all duration-300 ${isExpanded ? "w-64" : "w-20"}`}>
        {/* Sidebar Toggle Button */}
        <div className={`flex ${isExpanded ? "justify-end" : "justify-center"} mb-4`}>
          <button onClick={() => setIsExpanded(!isExpanded)} className="text-white">
            <RxTextAlignJustify size={21} />
          </button>
        </div>

        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 flex items-center justify-center">
            <img src={logo} alt="Logo" className="w-16 h-16" />
          </div>
          {isExpanded && (
            <h1 className="text-[25px] leading-[40px] text-white text-center">
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
                  <button
                    className={`flex items-center ${isExpanded ? "space-x-3" : "justify-center"} p-2 rounded-md w-full ${
                      active === item.name ? "bg-[#20C1FB]" : ""
                    }`}
                    onClick={() => setActive(item.name)}
                  >
                    <Icon size={21} className="text-white" />
                    {isExpanded && <span>{item.name}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="p-6 bg-[#F8FAFC] w-full">
        {active === "Updates" ? <Updates /> : (
          <div>
            <h1 className="text-2xl font-bold mb-4">Welcome to {active}</h1>
            <p>Explore the {active} section to manage your content.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
