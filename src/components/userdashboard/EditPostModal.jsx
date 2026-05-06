// components/userdashboard/EditPostModal.jsx
import { motion } from "framer-motion";
import { useState } from "react";
import { X, Loader2, Image as ImageIcon } from "lucide-react";
import { postAPI } from "../../services/api";

export default function EditPostModal({ post, onClose, onUpdate }) {
  const [content, setContent] = useState(post.content);
  const [imageUrl, setImageUrl] = useState(post.imageUrl || "");
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!content.trim()) {
      setError("Content cannot be empty");
      return;
    }

    setIsUpdating(true);
    setError("");

    try {
      const response = await postAPI.updatePost(post.id, content, imageUrl);

      onUpdate(response.data);
      onClose();
    } catch (error) {
      console.error("Error updating post:", error);
      setError("Failed to update post");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: 15, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-2xl rounded-2xl bg-white border border-gray-200 shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-4 sm:px-6 py-4">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-black">
              Edit Post
            </h2>

            <p className="text-sm text-gray-500">Make changes to your post</p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 space-y-4">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </div>
          )}

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
            placeholder="What's on your mind?"
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-black outline-none resize-none transition focus:border-black"
          />

          <div className="relative">
            <ImageIcon
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Add image URL (optional)"
              className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm text-black outline-none transition focus:border-black"
            />
          </div>

          {imageUrl && (
            <div className="overflow-hidden rounded-xl border border-gray-200">
              <img
                src={imageUrl}
                alt="Preview"
                className="max-h-72 w-full object-cover"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 border-t border-gray-200 px-4 sm:px-6 py-4 bg-white">
          <button
            onClick={onClose}
            className="w-full sm:w-auto rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-black hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={!content.trim() || isUpdating}
            className="w-full sm:w-auto rounded-xl bg-black px-5 py-2 text-sm font-medium text-white hover:bg-gray-900 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isUpdating ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Updating...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
