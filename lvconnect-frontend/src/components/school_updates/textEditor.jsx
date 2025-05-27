import { useEffect, useRef, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

const TextEditor = ({ content, setContent, images, setImages }) => {
  const editorRef = useRef(null); // for DOM mounting
  const quillRef = useRef(null); // for Quill instance

  const handleImageUpload = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          const base64Image = reader.result;
          const quill = quillRef.current;
          const range = quill.getSelection();

          if (range) {
            quill.insertEmbed(range.index, "image", base64Image, "user");

            // Add class to inserted image
            setTimeout(() => {
              const insertedImage = quill.root.querySelector(
                `img[src="${base64Image}"]`
              );
              if (insertedImage) {
                insertedImage.classList.add("custom-image");
              }
            }, 0);
          }

          setImages((prev) => [...prev, file]);
        };
        reader.readAsDataURL(file);
      }
    };
  };

  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        modules: {
          toolbar: {
            container: [
              [{ font: [] }, { size: [] }],
              ["bold", "italic", "underline", "strike"],
              [{ color: [] }, { background: [] }],
              [{ list: "ordered" }, { list: "bullet" }],
              [{ align: [] }],
              ["link", "image"],
              ["clean"],
            ],
            handlers: {
              image: handleImageUpload,
            },
          },
          clipboard: { matchVisual: false },
        },
        formats: [
          "font",
          "size",
          "bold",
          "italic",
          "underline",
          "strike",
          "color",
          "background",
          "list",
          "align",
          "link",
          "image",
        ],
      });

      quillRef.current.root.innerHTML = content;

      quillRef.current.on("text-change", () => {
        setContent(quillRef.current.root.innerHTML);
      });
    }
  }, []);

  return (
    <div className="bg-white border rounded-md flex flex-col">
      <div
        ref={editorRef}
        className="w-full flex-1 min-h-[300px] max-h-[300px] overflow-y-auto"
      />

      <style>{`
        .ql-container {
          min-height: 300px !important;
          max-height: 300px !important;
          overflow-y: auto !important;
          border: none !important;
          word-wrap: break-word !important;
        }

        .ql-editor {
          max-height: 280px !important;
          overflow-y: auto !important;
          white-space: normal !important;
          word-wrap: break-word !important;
        }

        .ql-toolbar {
          position: sticky;
          bottom: 0;
          background: white;
          z-index: 10;
        }

        .custom-image {
          max-width: 300px;
          height: auto;
          object-fit: contain;
        }
      `}</style>
    </div>
  );
};

export default TextEditor;