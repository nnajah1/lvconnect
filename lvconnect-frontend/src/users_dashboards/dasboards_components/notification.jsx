"use client"

import { useState, useEffect, useRef } from "react"
import { LuSquareArrowOutUpRight } from "react-icons/lu"
import Navbar from "./navbar"
import NotificationContentModal from "./open_notication_content"

const NotificationsPanel = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState("all")
  const [isExpandedView, setIsExpandedView] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [openedNotification, setOpenedNotification] = useState(null)
  const panelRef = useRef(null)

  const notifications = [
    {
      id: 1,
      title: "SY '24-'25 2nd Sem.: You’re Eligible to Enroll at La Verdad Christian College, Inc.",
      message:
        "We’re excited to let you know that you’ve met the grade requirements and have successfully fulfilled all the required documents for enrollment in the upcoming semester at La Verdad Christian College, Inc.",
      time: "1 min ago",
      unread: true,
    },
    {
      id: 2,
      title: "✨ LVCC @ 26: Celebrating Free Education, Excellence, and Unity! ✨",
      message:
        "Gear up, LVCC family! From February 24–28, 2025, we’re marking 26 years of free and quality education with a week-long celebration filled with excitement, creativity, and camaraderie!",
      time: "2 days ago",
      unread: false,
    },
    {
      id: 3,
      title: "No Classes and No Office Transactions on November 18",
      message:
        "Please take necessary precautions, and remain indoors if possible. Stay safe and updated, La Verdarians!",
      time: "2 days ago",
      unread: false,
    },
  ]

  const filtered = notifications.filter((n) => {
    const inTab = activeTab === "all" || (activeTab === "unread" && n.unread)
    const inSearch =
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.message.toLowerCase().includes(searchTerm.toLowerCase())
    return inTab && inSearch
  })

  useEffect(() => {
    function handleClickOutside(event) {
      if (openedNotification) return
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        if (onClose) onClose()
        else setIsExpandedView(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [onClose, openedNotification])

  

  return (
    <>
      {!isExpandedView && (
        <div
          ref={panelRef}
          className="absolute top-[80px] right-5 w-[90vw] sm:w-[400px] bg-white shadow-lg rounded-xl z-40 flex flex-col max-h-[calc(100vh-100px)]"
        >
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <h2 className="text-[#0C2D57] font-bold text-lg flex items-center gap-2">
              Notifications
              <LuSquareArrowOutUpRight
                className="text-sky-500 cursor-pointer"
                onClick={() => setIsExpandedView(true)}
              />
            </h2>
            <div className="flex gap-2 bg-gray-100 rounded-full p-1 text-sm">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-3 py-1 rounded-full font-semibold transition ${
                  activeTab === "all"
                    ? "bg-sky-500 text-white"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveTab("unread")}
                className={`px-3 py-1 rounded-full font-semibold transition ${
                  activeTab === "unread"
                    ? "bg-sky-500 text-white"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Unread
              </button>
            </div>
          </div>
          <div className="overflow-y-auto px-4 pb-4 space-y-4">
            {filtered.map((n) => (
              <div
                key={n.id}
                className={`rounded-lg shadow-sm p-4 flex gap-3 items-start ${
                  n.unread ? "bg-gray-100" : "bg-white"
                }`}
              >
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-gray-900 text-sm">{n.title}</h3>
                    <span className="text-xs text-gray-400 ml-2">{n.time}</span>
                  </div>
                  <p className="text-gray-600 text-sm mt-1 line-clamp-3">{n.message}</p>
                  <div className="flex justify-end gap-2 mt-2">
                    <button
                      className="bg-sky-500 text-white px-3 py-1 text-sm rounded-md"
                      onClick={() => setOpenedNotification(n)}
                    >
                      Open
                    </button>
                    <button className="bg-red-600 text-white px-3 py-1 text-sm rounded-md">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {isExpandedView && (
        <div ref={panelRef} className="fixed inset-0 z-50 bg-white flex flex-col">
          <Navbar />

          <div className="p-6 border-b border-gray-200 bg-white">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-[#0C2D57]">Notifications</h2>
            </div>
            <div className="mt-4">
              <div className="flex gap-2 bg-gray-100 rounded-full p-1 text-sm w-max">
                <button
                  onClick={() => setActiveTab("all")}
                  className={`px-4 py-1 rounded-full font-semibold transition ${
                    activeTab === "all"
                      ? "bg-sky-500 text-white"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setActiveTab("unread")}
                  className={`px-4 py-1 rounded-full font-semibold transition ${
                    activeTab === "unread"
                      ? "bg-sky-500 text-white"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Unread
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-gray-50">
            {filtered.map((n) => (
              <div
                key={n.id}
                className={`rounded-lg p-4 shadow-sm border border-gray-200 flex gap-3 items-start ${
                  n.unread ? "bg-gray-100" : "bg-white"
                }`}
              >
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-gray-900">{n.title}</h3>
                    <span className="text-sm text-gray-400">{n.time}</span>
                  </div>
                  <p className="text-gray-600 text-sm mt-1">{n.message}</p>
                  <div className="flex justify-end gap-2 mt-3">
                    <button
                      className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-1 rounded-md text-sm"
                      onClick={() => setOpenedNotification(n)}
                    >
                      Open
                    </button>
                    <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-md text-sm">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {openedNotification && (
        <NotificationContentModal
          notification={openedNotification}
          onClose={() => setOpenedNotification(null)}
        />
      )}
    </>
  )
}

export default NotificationsPanel
