import * as AlertDialog from "@radix-ui/react-alert-dialog"
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react"

const AlertTypes = {
  SUCCESS: "success",
  ERROR: "error",
  WARNING: "warning",
  INFO: "info",
  DATA: "data",
}

const AlertIcons = {
  [AlertTypes.SUCCESS]: CheckCircle,
  [AlertTypes.ERROR]: AlertCircle,
  [AlertTypes.WARNING]: AlertTriangle,
  [AlertTypes.INFO]: Info,
  [AlertTypes.DATA]: Info,
}

const AlertColors = {
  [AlertTypes.SUCCESS]: {
    bg: "bg-white",
    border: "border-gray-200",
    icon: "text-blue-900",
    title: "text-blue-900",
  },
  [AlertTypes.ERROR]: {
    bg: "bg-white",
    border: "border-gray-200",
    icon: "text-blue-900",
    title: "text-blue-900",
  },
  [AlertTypes.WARNING]: {
    bg: "bg-white",
    border: "border-gray-200",
    icon: "text-blue-900",
    title: "text-blue-9000",
  },
  [AlertTypes.INFO]: {
    bg: "bg-white",
    border: "border-gray-200",
    icon: "text-blue-900",
    title: "text-blue-900",
  },
  [AlertTypes.DATA]: {
    bg: "bg-white",
    border: "border-gray-200",
    icon: "text-yellow-500",
    title: "text-blue-900",
  },
}

const DynamicAlertDialog = ({
  isOpen,
  closeModal,
  title,
  description,
  children,
  type = AlertTypes.SUCCESS,
  showIcon = true,
  className = "",
}) => {
  // Determine the alert style based on type
  const alertStyle = AlertColors[type] || AlertColors[AlertTypes.INFO]
  const IconComponent = AlertIcons[type] || AlertIcons[AlertTypes.INFO]

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

            {/* Centered Content */}
            <div className="flex flex-col items-center text-center space-y-4">
              {/* Alert Icon - Top Center */}
              {showIcon && (
                <div className={`${alertStyle.icon}`}>
                  <IconComponent className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
              )}

              {/* Title - Centered */}
              <AlertDialog.Title className={`text-base sm:text-lg font-semibold mb-2 ${alertStyle.title}`}>
                {title}
              </AlertDialog.Title>

              {/* Description - Centered */}
              <AlertDialog.Description className="text-sm text-gray-600 mb-1.5">{description}</AlertDialog.Description>

              {/* Action Buttons - Right aligned */}
              <div className="flex justify-end gap-2 w-full mt-5">{children}</div>
            </div>
          </AlertDialog.Content>
        </div>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  )
}

export const ConfirmationModal = (props) => {
  return <DynamicAlertDialog type={AlertTypes.SUCCESS} {...props} />
}

export const ErrorModal = (props) => {
  return <DynamicAlertDialog type={AlertTypes.ERROR} {...props} />
}

export const WarningModal = (props) => {
  return <DynamicAlertDialog type={AlertTypes.WARNING} {...props} />
}

export const InfoModal = (props) => {
  return <DynamicAlertDialog type={AlertTypes.INFO} {...props} />
}

export const DataModal = (props) => {
  return <DynamicAlertDialog type={AlertTypes.DATA} {...props} />
}

export const DeleteModal = ({
  title = "Confirm Deletion",
  description = "Are you sure you want to delete this item? This action cannot be undone.",
  ...props
}) => {
  return <DynamicAlertDialog type={AlertTypes.WARNING} title={title} description={description} {...props} />
}

export { AlertTypes }
export default DynamicAlertDialog
