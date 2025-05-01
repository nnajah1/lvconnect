import { useState } from "react";
import logo from "../../assets/lv-logo.png";
import { HiHome, HiOutlineHome } from "react-icons/hi2";
import { RxTextAlignJustify } from "react-icons/rx";
import { RiSurveyLine, RiSurveyFill } from "react-icons/ri";
import { IoDocumentsOutline, IoDocumentsSharp } from "react-icons/io5";
import "../psas.css";
import Schoolform from "./school_form";

const PsasSidebar = () => {
  const [active, setActive] = useState("Dashboard");
  const [isExpanded, setIsExpanded] = useState(true);

  const menuItems = [
    { name: "Dashboard", solidIcon: HiHome, outlineIcon: HiOutlineHome },
    { name: "Survey", solidIcon: RiSurveyFill, outlineIcon: RiSurveyLine },
    { name: "School Forms", solidIcon: IoDocumentsSharp, outlineIcon: IoDocumentsOutline },
  ];

  return (
    <div className="psas_sidebar_container">
      {/* Sidebar */}
      <div className={`psas_sidebar ${isExpanded ? "expanded" : "collapsed"}`}>
        {/* Toggle Button */}
        <div className={`psas_toggle_wrapper ${isExpanded ? "justify-end" : "justify-center"}`}>
          <button onClick={() => setIsExpanded(!isExpanded)} className="psas_toggle_button">
            <RxTextAlignJustify size={21} />
          </button>
        </div>

        {/* Logo */}
        <div className="psas_logo_section">
          <div className="psas_logo_box">
            <img src={logo} alt="Logo" className="psas_logo_img" />
          </div>
          {isExpanded && (
            <h1 className="psas_branding">
              <span className="psas_lv">LV</span>
              <span className="psas_connect">Connect</span>
            </h1>
          )}
        </div>

        {/* Navigation Menu */}
        <nav>
          <ul className="psas_nav_list">
            {menuItems.map((item) => {
              const Icon = active === item.name ? item.solidIcon : item.outlineIcon;
              return (
                <li key={item.name}>
                  <button
                    className={`psas_nav_item ${active === item.name ? "active" : ""} ${isExpanded ? "expanded" : "collapsed"}`}
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
     
      <div className="psas_main_content">
  {active === "School Forms" ? (
    <Schoolform />
  ) : (
    <div>
      <h1 className="text-2xl font-bold mb-4">Welcome to {active}</h1>
      <p>Explore the {active} section to manage your content.</p>
    </div>
  )}
</div>

         



      {/* <div className="psas_main_content">
        <h1 className="text-2xl font-bold mb-4">Welcome to {active}</h1>
        <p>Explore the {active} section to manage your content.</p>
      </div> */}
    </div>
  );
};

export default PsasSidebar;
