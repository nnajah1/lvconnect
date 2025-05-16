import { useState } from "react";
import logo from "@/assets/lv-logo.png";
import { RxTextAlignJustify } from "react-icons/rx";
import { Link } from "react-router-dom";
import { useAuthContext } from "@/context/AuthContext";
import { roleMenus } from "@/config/roleMenus";

const Sidebar = () => {
  const { user } = useAuthContext(); 
  const [isExpanded, setIsExpanded] = useState(true);

 
    // Get user role and set menu dynamically
    const userRole = user?.roles?.[0]?.name || "student"; // Default to student
    const menuItems = roleMenus[userRole] || [];
  
  return (
    <div
      className={`bg-[#1a2b50] text-white p-4 flex flex-col transition-all duration-300 ${
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
          {menuItems.map(({ name, path, solidIcon, outlineIcon }) => {
            const Icon = location.pathname === path ? solidIcon : outlineIcon;
            return (
              <li key={name}>
                <Link
                  to={path}
                  className={`flex items-center ${isExpanded ? "space-x-3" : "justify-center"} p-2 rounded-md ${location.pathname === path ? "bg-[#20C1FB]" : ""}`}
                >
                  <Icon size={21} className="text-white" />
                  {isExpanded && <span>{name}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
