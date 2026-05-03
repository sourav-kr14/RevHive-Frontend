import { motion } from "framer-motion";
import { Image, Link2, Hash, Loader, AlertCircle, MapPin } from "lucide-react";
import { useState, useRef } from "react";
import { postAPI } from "../../services/api";

export default function DashboardCompose({ profileData, onPostCreated }) {
  const [postText, setPostText] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [showMediaInput, setShowMediaInput] = useState(false);
  const [mediaType, setMediaType] = useState("image");
  const [error, setError] = useState("");
  const [charCount, setCharCount] = useState(0);
  const textareaRef = useRef(null);

  const initials = profileData?.username
    ? profileData.username.slice(0, 2).toUpperCase()
    : "RH";

  const handleTextChange = (e) => {
    const text = e.target.value;
    setPostText(text);
    setCharCount(text.length);
    if (error) setError("");
  };

  const handleCreatePost = async () => {
    if (!postText.trim()) {
      setError("Please enter some content for your post");
      textareaRef.current?.focus();
      return;
    }

    if (charCount > 500) {
      setError("Post content cannot exceed 500 characters");
      return;
    }

    setIsPosting(true);
    setError("");

    try {
      const response = await postAPI.createPost(
        postText,
        mediaType === "image" ? imageUrl || null : null,
        mediaType === "video" ? videoUrl || null : null,
      );

      setPostText("");
      setImageUrl("");
      setVideoUrl("");
      setShowMediaInput(false);
      setCharCount(0);

      onPostCreated && onPostCreated(response.data);
    } catch (error) {
      if (error.response) {
        setError(error.response.data?.message || "Failed to create post");
      } else {
        setError("Server error");
      }
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-semibold text-gray-700 border">
          {initials}
        </div>

        <div>
          <p className="text-sm font-semibold text-gray-900">What's buzzing?</p>
          <p className="text-xs text-gray-500">Share updates or ideas</p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-red-600 text-sm">
          <AlertCircle size={14} />
          {error}
        </div>
      )}

      {/* Textarea */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-gray-300 resize-none"
          placeholder="Share something with the hive…"
          rows="3"
          value={postText}
          onChange={handleTextChange}
          disabled={isPosting}
          maxLength={500}
        />
        <span className="absolute bottom-2 right-2 text-xs text-gray-400">
          {charCount}/500
        </span>
      </div>

      {/* Media Input */}
      {showMediaInput && (
        <div className="mt-3 space-y-2">
          <div className="flex gap-2">
            <button
              onClick={() => setMediaType("image")}
              className={`px-3 py-1 text-xs rounded-md ${
                mediaType === "image"
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              Image
            </button>
            <button
              onClick={() => setMediaType("video")}
              className={`px-3 py-1 text-xs rounded-md ${
                mediaType === "video"
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              Video
            </button>
          </div>

          <input
            type="text"
            placeholder={`Enter ${mediaType} URL`}
            value={mediaType === "image" ? imageUrl : videoUrl}
            onChange={(e) =>
              mediaType === "image"
                ? setImageUrl(e.target.value)
                : setVideoUrl(e.target.value)
            }
            className="w-full border border-gray-300 rounded-md p-2 text-sm outline-none focus:ring-2 focus:ring-gray-300"
          />
        </div>
      )}

      {/* Bottom */}
      <div className="flex items-center justify-between mt-4">
        {/* Actions */}
        <div className="flex gap-2">
          {[Image, Link2, Hash, MapPin].map((Icon, i) => (
            <button
              key={i}
              onClick={
                i === 0 ? () => setShowMediaInput(!showMediaInput) : undefined
              }
              className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100"
            >
              <Icon size={14} />
            </button>
          ))}
        </div>

        {/* Post */}
        <button
          disabled={!postText.trim() || isPosting}
          onClick={handleCreatePost}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            postText.trim()
              ? "bg-gray-900 text-white hover:bg-black"
              : "bg-gray-200 text-gray-400"
          }`}
        >
          {isPosting ? (
            <span className="flex items-center gap-1">
              <Loader size={14} className="animate-spin" />
              Posting
            </span>
          ) : (
            "Post"
          )}
        </button>
      </div>
    </motion.div>
  );
}
