import { useEffect, useRef, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { getSignedUrl } from "@/services/axios";
import { X } from "lucide-react";
import { toast } from "react-toastify";


const TextEditor = ({
  content = '',
  onContentChange,
  images = [],
  onImagesChange,
  disabled = false
}) => {
  const editorRef = useRef(null);
  const quillRef = useRef(null);
  const fileInputRef = useRef(null);
  const [signedUrls, setSignedUrls] = useState({});
  const [loadingUrls, setLoadingUrls] = useState(new Set());

  // Initialize Quill editor
  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link'],
            ['clean']
          ]
        },
        placeholder: "Write your post content here...",
      });

      quillRef.current.on('text-change', () => {
        const html = editorRef.current.querySelector('.ql-editor').innerHTML;
        if (onContentChange) onContentChange(html);
      });

      // Set initial content
      if (content) {
        quillRef.current.root.innerHTML = content;
      }
    }
  }, []);

  // Update content when prop changes
  useEffect(() => {
    if (quillRef.current && content !== quillRef.current.root.innerHTML) {
      quillRef.current.root.innerHTML = content;
    }
  }, [content]);

  useEffect(() => {
    const loadSignedUrls = async () => {
      const existingImages = images.filter(img => !img.file && img.url);

      for (const image of existingImages) {
        if (!signedUrls[image.url] && !loadingUrls.has(image.url)) {
          setLoadingUrls(prev => new Set([...prev, image.url]));

          try {
            const signedUrl = await getSignedUrl(image.url);
            if (signedUrl) {
              setSignedUrls(prev => ({
                ...prev,
                [image.url]: signedUrl
              }));
            }
          } catch (error) {
            console.error('Failed to get signed URL:', error);
          } finally {
            setLoadingUrls(prev => {
              const newSet = new Set(prev);
              newSet.delete(image.url);
              return newSet;
            });
          }
        }
      }
    };

    loadSignedUrls();
  }, [images]);

  const MAX_IMAGES = 5;
  const handleImageUpload = (e) => {
    if (disabled) return;

    const files = Array.from(e.target.files);
    if (files.length === 0) return;

  //   const totalImages = images.length + files.length;
  // if (totalImages > MAX_IMAGES) {
  //   toast.error(`You can only upload up to ${MAX_IMAGES} images.`);
  //   e.target.value = '';
  //   return;
  // }

    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    if (onImagesChange) {
      onImagesChange([...images, ...newImages]);
    }

    e.target.value = '';
  };

  const removeImage = (index) => {
    if (disabled) return;

    const newImages = [...images];
    URL.revokeObjectURL(newImages[index]?.preview);
    newImages.splice(index, 1);

    if (onImagesChange) {
      onImagesChange(newImages);
    }
  };

  const getImageUrl = (image, index) => {
    if (image.file) {
      return image.preview;
    }

    if (image.url) {
      if (signedUrls[image.url]) {
        return signedUrls[image.url];
      }

      if (loadingUrls.has(image.url)) {
        return null; // Show loading state
      }

      return '/image-placeholder.png'; // Fallback
    }

    return '/image-placeholder.png';
  };

  return (
    <div className="border rounded-md bg-white">
      {/* Text Editor */}
      <div
        ref={editorRef}
        className="text-editor"
        style={{ minHeight: '200px' }}
      />

      {/* Image Preview */}
      {images.length > 0 && (
        <div className="p-3 border-t bg-gray-50">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {images.map((image, index) => {
              const imageUrl = getImageUrl(image, index);
              const isLoading = !image.file && image.url && loadingUrls.has(image.url);

              return (
                <div key={index} className="relative group">
                  {isLoading ? (
                    <div className="w-full h-24 bg-gray-100 rounded border flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                    </div>
                  ) : (
                    <>
                      {imageUrl ? (
                        <img
                        crossOrigin="anonymous"
                          src={imageUrl}
                          alt={`Preview ${index}`}
                          className="w-full h-24 object-cover rounded border"
                         
                        />
                      ) : (
                        <div className="w-full h-24 flex items-center justify-center bg-gray-100 text-xs text-gray-500 border rounded">
                          Image missing
                        </div>
                      )}

                    </>
                  )}

                  {!disabled && (
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X />
                    </button>
                  )}

                  <div className="text-xs text-gray-500 mt-1 truncate">
                    {image.file ? 'New' : isLoading ? 'Loading...' : 'Existing'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Image Upload Button */}
      {!disabled && (
        <div className="p-2 border-t flex justify-between items-center">
          <label className="flex items-center cursor-pointer">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              multiple
              className="hidden"
            />
            <span className="text-blue-500 hover:text-blue-700 flex items-center">
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Add Photos
            </span>
          </label>
          <div className="text-xs text-gray-500">
            {images.length} {images.length === 1 ? 'photo' : 'photos'} selected
          </div>
        </div>
      )}

      <style jsx global>{`
        .text-editor .ql-container {
          min-height: 200px;
          border: none !important;
          font-size: 16px;
        }
        .text-editor .ql-toolbar {
          border: none !important;
          border-bottom: 1px solid #eee !important;
        }
        .text-editor .ql-editor {
          min-height: 200px;
          padding: 12px;
        }
        .text-editor .ql-editor.ql-blank::before {
          color: #999;
          font-style: normal;
          left: 12px;
        }
      `}</style>
    </div>
  );
};


export default TextEditor;