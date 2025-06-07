import React from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const AlertTypes = {
  SUCCESS: "success",
  ERROR: "error",
  WARNING: "warning",
  INFO: "info",
  DATA: "data"
};

const AlertIcons = {
  [AlertTypes.SUCCESS]: CheckCircle,
  [AlertTypes.ERROR]: AlertCircle,
  [AlertTypes.WARNING]: AlertTriangle,
  [AlertTypes.INFO]: Info,
  [AlertTypes.DATA]: Info
};

const AlertColors = {
  [AlertTypes.SUCCESS]: {
    bg: "bg-green-50",
    border: "border-green-200",
    icon: "text-green-500",
    title: "text-green-700"
  },
  [AlertTypes.ERROR]: {
    bg: "bg-red-50",
    border: "border-red-200",
    icon: "text-red-500",
    title: "text-red-700"
  },
  [AlertTypes.WARNING]: {
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    icon: "text-yellow-500",
    title: "text-yellow-700"
  },
  [AlertTypes.INFO]: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    icon: "text-blue-500",
    title: "text-blue-700"
  },
   [AlertTypes.DATA]: {
    bg: "bg-violet-50",
    border: "border-violet-200",
    icon: "text-violet-500",
    title: "text-violet-700"
  }
};

const DynamicAlertDialog = ({
  isOpen,
  closeModal,
  title,
  description,
  children,
  type = AlertTypes.SUCCESS,
  showIcon = true,
  className = ""
}) => {
  // Determine the alert style based on type
  const alertStyle = AlertColors[type] || AlertColors[AlertTypes.INFO];
  const IconComponent = AlertIcons[type] || AlertIcons[AlertTypes.INFO];

  return (
    <AlertDialog.Root open={isOpen} onOpenChange={closeModal}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50" />
        <div className="fixed top-1/2 left-1/2 w-[95%] sm:w-[85%] md:max-w-md -translate-x-1/2 -translate-y-1/2 z-50">
          <AlertDialog.Content
            className={`${alertStyle.bg} ${alertStyle.border} border rounded-lg shadow-lg p-4 sm:p-6 ${className}`}
          >
            {/* Close Button */}
            <AlertDialog.Cancel className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="sr-only">Close</span>
            </AlertDialog.Cancel>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
              {/* Alert Icon */}
              {showIcon && (
                <div className={`${alertStyle.icon} flex-shrink-0`}>
                  <IconComponent className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
              )}

              <div className="flex-1">
                {/* Title */}
                <AlertDialog.Title className={`text-base sm:text-lg font-semibold ${alertStyle.title} mb-1 sm:mb-2`}>
                  {title}
                </AlertDialog.Title>

                {/* Description */}
                <AlertDialog.Description className="text-sm text-gray-600 mb-4">
                  {description}
                </AlertDialog.Description>

                {/* Action Buttons */}
                <div className="flex justify-end gap-2 mt-2">
                  {children}
                </div>
              </div>
            </div>
          </AlertDialog.Content>
        </div>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
};

export const ConfirmationModal = (props) => {
  return <DynamicAlertDialog type={AlertTypes.SUCCESS} {...props} />;
};

export const ErrorModal = (props) => {
  return <DynamicAlertDialog type={AlertTypes.ERROR} {...props} />;
};

export const WarningModal = (props) => {
  return <DynamicAlertDialog type={AlertTypes.WARNING} {...props} />;
};

export const InfoModal = (props) => {
  return <DynamicAlertDialog type={AlertTypes.INFO} {...props} />;
};

export const DataModal = (props) => {
  return <DynamicAlertDialog type={AlertTypes.DATA} {...props} />;
};

export const DeleteModal = ({ 
  title = "Confirm Deletion", 
  description = "Are you sure you want to delete this item? This action cannot be undone.", 
  ...props 
}) => {
  return (
    <DynamicAlertDialog 
      type={AlertTypes.WARNING} 
      title={title} 
      description={description} 
      {...props} 
    />
  );
};

export { AlertTypes };
export default DynamicAlertDialog;