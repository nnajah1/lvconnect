"use client"

import { X } from "lucide-react"

const OpenNotificationContent = ({ notification, onClose }) => {
  if (!notification) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full relative overflow-y-auto max-h-full">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
        >
          <X />
        </button>
        <div className="p-6 space-y-4">
          <h2 className="text-2xl font-bold text-[#0C2D57]">{notification.title}</h2>
          <p className="text-sm text-gray-500">{notification.time}</p>
          <p className="text-gray-700 whitespace-pre-line">{notification.message}</p>

          {/* Optional: Include media from admin */}
          {/* {notification.image && (
            <Image
              src={notification.image}
              alt="Notification Image"
              width={800}
              height={600}
              className="rounded-lg mt-4"
            />
          )} */}
        </div>
      </div>
    </div>
  )
}

export default OpenNotificationContent
