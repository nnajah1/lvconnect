
import * as Dialog from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { X } from "lucide-react";

const DynamicModal = ({ isOpen, closeModal, children, className = "", title, description, showTitle = true,
  showDescription = true }) => {
  return (

    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && closeModal()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm z-10" />
       <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Content container with proper positioning */}
      <div className="relative h-full w-full flex items-center justify-center">
        {/* Dialog content with relative positioning to position the button */}
        <div className="relative pointer-events-auto">
          {/* Close button positioned absolutely relative to this container */}
          <button
            onClick={closeModal}
            className="absolute -top-4 -right-4 bg-red-500 text-white rounded-full p-2 hover:opacity-90 transform translate-y-[-50%] translate-x-[50%] z-10 cursor-pointer"
          >
          <X className="w-5 h-5 bg-red-500 rounded text-white" />
            <span className="sr-only">Close</span>
        </button>
        
        {/* Dialog content */}
        <Dialog.Content 
          onPointerDownOutside={(event) => event.preventDefault()}
          onEscapeKeyDown={(event) => event.preventDefault()}
          className={`max-w-lg w-full bg-white p-4 rounded-lg shadow-lg pointer-events-auto ${className}`}
        >

          {/* Close Button */}
          {/* <Dialog.Close 
            className="absolute -top-4 -right-4 bg-red-500 rounded-full p-1 hover:opacity-90 cursor-pointer">
            <X className="w-5 h-5 bg-red-500 rounded text-white" />
            <span className="sr-only">Close</span>
          </Dialog.Close> */}

          {/* Title Section */}
          {showTitle ? (
            <Dialog.Title aria-labelledby="dialog-title" className="text-lg font-semibold text-center text-[#20C1FB]">
              {title}
            </Dialog.Title>
          ) : (
            <VisuallyHidden>
              <Dialog.Title aria-labelledby="dialog-title">{title}</Dialog.Title>
            </VisuallyHidden>
          )}

          {/* Description Section */}
          {showDescription ? (
            <Dialog.Description
              aria-describedby="dialog-description" className="text-sm text-center text-gray-500 mb-4">
              {description}
            </Dialog.Description>
          ) : (
            <VisuallyHidden>
              <Dialog.Description
                aria-describedby="dialog-description">{description}</Dialog.Description>
            </VisuallyHidden>
          )}

          {/* Modal Content */}
          <div>
            {children}
          </div>

        </Dialog.Content>
        </div>
        </div>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default DynamicModal;
