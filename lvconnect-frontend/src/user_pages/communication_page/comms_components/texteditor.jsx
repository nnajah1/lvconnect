import React from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const TextEditor = ({ content, setContent }) => {
  return (
    <div className="bg-white border rounded-md h-[240px] flex flex-col">
      <ReactQuill
        value={content}
        onChange={setContent}
        placeholder="Write here..."
        className="w-full flex-1"
        modules={{
          toolbar: [
            [{ font: [] }, { size: [] }],
            ["bold", "italic", "underline", "strike"],
            [{ color: [] }, { background: [] }],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ align: [] }],
            ["link", "image"],
            ["clean"],
          ],
        }}
        formats={[
          "font",
          "size",
          "bold",
          "italic",
          "underline",
          "strike",
          "color",
          "background",
          "list",
          "bullet",
          "link",
          "image",
        ]}
      />


<style>
          {`
          
            .ql-container {
              min-height: 350px !important; /* Set a minimum height */
              max-height: 350px !important; /* Limit max height */
              overflow-y: auto !important; /* Enable scrolling */
              border: none !important;
              word-wrap: break-word !important; /* Prevent text overflow */
}

              .ql-editor {
                max-height: 180px !important;
                overflow-y: auto !important;
                white-space: normal !important; /* Ensure text wraps properly */
                word-wrap: break-word !important;
              }
                .ql-toolbar {
                            position: sticky;
                            top: 0;
                            background: white;
                            z-index: 10;
                          }

            
          `}
        </style>
    </div>



  );
};

export default TextEditor;
