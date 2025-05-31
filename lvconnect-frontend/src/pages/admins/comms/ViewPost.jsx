import { useEffect, useState } from "react";
import { getPostById } from "@/services/axios";
import DynamicModal from "@/components/dynamic/DynamicModal";
import DOMPurify from "dompurify"; // For safe HTML rendering
import { Loader } from "@/components/dynamic/loader";

const ViewPostModal = ({ isOpen, closeModal, postId }) => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageLoadStates, setImageLoadStates] = useState({});

  useEffect(() => {
    if (isOpen && postId) {
      setLoading(true);
      getPostById(postId)
        .then((data) => {
          setPost(data);
          if (data?.image_url) {
            const urls = parseImageUrls(data.image_url);
            const initialStates = {};
            urls.forEach((_, idx) => {
              initialStates[idx] = "loading";
            });
            setImageLoadStates(initialStates);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [isOpen, postId]);

  const parseImageUrls = (imageUrl) => {
    try {
      const urls = typeof imageUrl === "string" ? JSON.parse(imageUrl) : imageUrl;
      return Array.isArray(urls) ? urls.filter((url) => url) : [urls].filter((url) => url);
    } catch {
      return imageUrl ? [imageUrl] : [];
    }
  };

  const handleImageLoad = (index) => {
    setImageLoadStates((prev) => ({ ...prev, [index]: "loaded" }));
  };

  const handleImageError = (index) => {
    setImageLoadStates((prev) => ({ ...prev, [index]: "error" }));
  };

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center mt-4 w-[10rem] text-center">
          <Loader />
        </div>
      ) : (
        <DynamicModal
          isOpen={isOpen}
          closeModal={closeModal}
          title="View School Update"
          description="View school updates"
          showTitle={true}
          showDescription={false}
          showCloseButton={true}
          className="w-[60rem]! max-h-[80vh]! rounded-lg overflow-hidden"
        >
          {post ? (
            <div className="space-y-4 p-4 overflow-y-auto max-h-[calc(80vh-3rem)] bg-white rounded-lg mt-4">
            
              <h1 className="text-sm text-gray-500 capitalize">{post.type}</h1>
              <h2 className="text-2xl font-bold text-gray-900">{post.title}</h2>

              {/* Post Content */}
              <div
                className="mt-4 text-gray-800 whitespace-pre-line"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
              />

              {/* Facebook-style Image Grid (Below Content) */}
              {post.image_url && (() => {
                const images = parseImageUrls(post.image_url);
                const imageCount = images.length;

                const getGridClass = () => {
                  switch (imageCount) {
                    case 1:
                      return "grid-cols-1";
                    case 2:
                      return "grid-cols-2";
                    case 3:
                    case 4:
                      return "grid-cols-2";
                    default:
                      return "grid-cols-3";
                  }
                };

                return (
                  <div className={`mt-3 grid gap-2 ${getGridClass()}`}>
                    {images.map((url, idx) => {
                      const imageUrl = `${import.meta.env.VITE_BASE_URL}${url}`;
                      const state = imageLoadStates[idx] || "loading";
                      const isPrimary = (imageCount === 3 && idx === 0) || imageCount === 1;

                      return (
                        <div
                          key={idx}
                          className={`relative group overflow-hidden rounded-lg ${isPrimary ? "col-span-2 row-span-2" : ""}`}
                          style={{
                            aspectRatio: isPrimary ? "3 / 2" : "1 / 1",
                            maxHeight: "400px",
                            minHeight: "150px",
                          }}
                        >
                          {state === "loading" && (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100">
                              <Loader size="small" />
                            </div>
                          )}

                          <img
                            src={state === "error" ? "/placeholder-image.png" : imageUrl}
                            alt={`Post image ${idx + 1}`}
                            className={`w-full h-full object-cover transition-opacity duration-300 ${
                              state === "loaded" ? "opacity-100" : "opacity-0"
                            }`}
                            
                            // crossOrigin="anonymous"
                            onLoad={() => handleImageLoad(idx)}
                            onError={() => handleImageError(idx)}
                          />

                          {state === "loaded" && (
                            <a
                              href={imageUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200"
                            >
                              <svg
                                className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                              </svg>
                            </a>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })()}

              {/* Timestamp */}
              <div className="text-xs text-gray-500 mt-4">
                <div>Posted on: {new Date(post.created_at).toLocaleString()}</div>
                {post.updated_at && post.updated_at !== post.created_at && (
                  <div>Last updated: {new Date(post.updated_at).toLocaleString()}</div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-10 text-red-500">Post not found.</div>
          )}
        </DynamicModal>
      )}
    </>
  );
};


export default ViewPostModal;
