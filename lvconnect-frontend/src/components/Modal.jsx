;
import React from "react";
import  Button  from "@/components/ui/button";

const Modal = ({ isOpen, onClose, title, content, actions = [] }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-lg w-full shadow-lg">
        {title && <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">{title}</h2>}
        {content && <div className="mb-6 text-gray-700 dark:text-gray-300">{content}</div>}
        <div className="flex justify-end space-x-2">
          {actions.map((action, index) => (
            <Button key={index} variant={action.variant || "default"} onClick={action.onClick}>
              {action.label}
            </Button>
          ))}
          <Button variant="outline" onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
