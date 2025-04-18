
import * as Dialog from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { X } from "lucide-react";

const DynamicModal = ({ isOpen, closeModal, showCloseButton, children, className = "", title, description, showTitle = true,
  showDescription = true, }) => {
  return (
    <Dialog.Root open={isOpen} onOpenChange={closeModal}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm z-10" />
        <Dialog.Content className={`fixed top-1/2 left-1/2 max-w-lg w-full -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg z-50 ${className}`}
        >
          {/* Optional Close Button */}
          {showCloseButton && (
            <Dialog.Close className="absolute top-4 right-4 opacity-70 hover:opacity-100">
              <X className="w-4 h-4" />
              <span className="sr-only">Close</span>
            </Dialog.Close>
          )}

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
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default DynamicModal;
