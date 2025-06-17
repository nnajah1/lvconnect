
import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { X } from "lucide-react";
const DynamicModal = ({
  isOpen,
  closeModal,
  children,
  className = "",
  title,
  description,
  showTitle = true,
  showDescription = true,
  footerButtons,
  showFooter = false,
  onConfirm,
  confirmText = "Confirm",
  cancelText = "Cancel",
  headerButtons,
}) => {
  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && closeModal()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30" />
        <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center p-4 sm:p-6">
          {/* Content container with proper positioning */}
          <div className="relative h-full w-full flex items-center justify-center">
            {/* Dialog content with relative positioning to position the button */}
            <div className="relative pointer-events-auto">

              {/* Dialog content */}
              <Dialog.Content
                onPointerDownOutside={(event) => event.preventDefault()}
                onEscapeKeyDown={(event) => event.preventDefault()}
                className={`
                  w-full 
                  rounded-lg 
                  shadow-lg 
                  pointer-events-auto 
                  min-w-[50vw]
                  min-h-[20vh]
                  max-w-full 
                  max-h-[85vh] 
                  ${className}
                  
                  sm:max-w-lg 
                  md:max-w-[45rem] 
                  md:max-h-[35rem] 
                  
                  bg-white
                  flex
                  flex-col
                `}
              >
                <Dialog.Close className="absolute top-2 right-3 opacity-70 hover:opacity-100 cursor-pointer z-10 p-1 rounded-full hover:bg-gray-100 transition-colors">
                  <X className="w-4 h-4" />
                  <span className="sr-only">Close</span>
                </Dialog.Close>

                {/* Fixed Header */}
                <div className="flex-shrink-0 p-4 pr-12 border-b border-gray-200">
                  <div className={`flex ${headerButtons ? 'justify-between' : 'justify-center'} items-center`}>
                    {/* Title and Description Section */}
                    <div className="flex-1">
                      {/* Title Section */}
                      {showTitle ? (
                        <Dialog.Title
                          aria-labelledby="dialog-title"
                          className={`text-lg font-semibold ${headerButtons ? 'text-left' : 'text-center'} text-secondary`}
                        >
                          {title}
                        </Dialog.Title>
                      ) : (
                        <VisuallyHidden>
                          <Dialog.Title aria-labelledby="dialog-title">
                            {title}
                          </Dialog.Title>
                        </VisuallyHidden>
                      )}

                      {/* Description Section */}
                      {showDescription ? (
                        <Dialog.Description
                          aria-describedby="dialog-description"
                          className={` ${headerButtons ? 'text-left' : 'text-center'} text-gray-500`}
                        >
                          {description}
                        </Dialog.Description>
                      ) : (
                        <VisuallyHidden>
                          <Dialog.Description aria-describedby="dialog-description">
                            {description}
                          </Dialog.Description>
                        </VisuallyHidden>
                      )}
                    </div>

                    {/* Custom Header Buttons */}
                    {headerButtons && (
                      <div className="flex-shrink-0 ml-4">
                        {headerButtons}
                      </div>
                    )}
                  </div>
                </div>
                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  {children}
                </div>

                {/* Fixed Footer */}
                {showFooter && (
                  <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-gray-50">
                    <div className="flex justify-end space-x-2">
                      {footerButtons ? (
                        footerButtons
                      ) : (
                        // Default buttons if no custom buttons provided
                        <>
                          <button
                            onClick={closeModal}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
                          >
                            {cancelText}
                          </button>
                          <button
                            onClick={onConfirm}
                            disabled={!onConfirm}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-900 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500  cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
                          >
                            {confirmText}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </Dialog.Content>
            </div>
          </div>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
export default DynamicModal;
