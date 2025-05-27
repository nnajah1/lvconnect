//notworking
// resources/js/components/Sidebar.jsx
import React, { useState, useContext } from "react";
import { useAuthContext } from "@/context/AuthContext"; // Adjust path to your AuthContext
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarHeader,
} from "./ui/sidebar"; // Adjust path to shadcn/ui components
import { HiHome, HiOutlineHome } from "react-icons/hi";
import { FaAddressCard, FaRegAddressCard, FaFileAlt, FaRegFileAlt } from "react-icons/fa";
import { HiClipboardDocumentList, HiOutlineClipboardDocumentList, HiArchiveBox, HiOutlineArchiveBox } from "react-icons/hi2";

const AppSidebar = () => {
  const { user } = useAuthContext(); // Get user from AuthContext
  const [active, setActive] = useState("Dashboard");

  // Define all possible menu items with permissions
  const allMenuItems = [
    { name: "Dashboard", solidIcon: HiHome, outlineIcon: HiOutlineHome, permission: "view-dashboard" },
    { name: "Enrollment", solidIcon: FaAddressCard, outlineIcon: FaRegAddressCard, permission: "view-enrollment" },
    { name: "Grades", solidIcon: FaFileAlt, outlineIcon: FaRegFileAlt, permission: "view-grades" },
    { name: "Updates", solidIcon: HiClipboardDocumentList, outlineIcon: HiOutlineClipboardDocumentList, permission: "view-updates" },
    { name: "Archive", solidIcon: HiArchiveBox, outlineIcon: HiOutlineArchiveBox, permission: "view-archive" },
  ];

  // Filter menu items based on user permissions from AuthContext
  const menuItems = user
    ? allMenuItems.filter((item) => user.permissions?.includes(item.permission))
    : [];

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" className="bg-[#1a2b50] text-white">
        <SidebarHeader>
          <SidebarTrigger className="text-white" />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => {
              const Icon = active === item.name ? item.solidIcon : item.outlineIcon;
              return (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    isActive={active === item.name}
                    onClick={() => setActive(item.name)}
                    className="text-white"
                  >
                    <Icon size={21} />
                    <span>{item.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
};

export default AppSidebar;