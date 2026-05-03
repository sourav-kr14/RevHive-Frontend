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
      setError("Enter something first");
      textareaRef.current?.focus();
      return;
    }

    if (charCount > 500) {
      setError("Max 500 chars");
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
      setError(error.response?.data?.message || "Server error");
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 backdrop-blur-xl border border-white/10 
      rounded-2xl p-5 shadow-[0_0_30px_rgba(139,92,246,0.1)]"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-11 h-11 rounded-full 
        bg-gradient-to-br from-purple-500 to-blue-500 
        flex items-center justify-center text-white font-semibold shadow"
        >
          {initials}
        </div>

        <div>
          <p className="text-sm font-semibold text-white">
            What’s on your mind?
          </p>
          <p className="text-xs text-gray-400">Share something with the hive</p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div
          className="mb-3 p-2 rounded-lg flex items-center gap-2 
        bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
        >
          <AlertCircle size={14} />
          {error}
        </div>
      )}

      {/* Textarea */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          className="w-full bg-white/5 border border-white/10 
          rounded-xl p-3 text-sm text-white placeholder-gray-500 
          outline-none focus:ring-1 focus:ring-purple-500 resize-none"
          placeholder="Share something..."
          rows="3"
          value={postText}
          onChange={handleTextChange}
          disabled={isPosting}
          maxLength={500}
        />
        <span className="absolute bottom-2 right-2 text-xs text-gray-500">
          {charCount}/500
        </span>
      </div>

      {/* Media */}
      {showMediaInput && (
        <div className="mt-3 space-y-2">
          <div className="flex gap-2">
            {["image", "video"].map((type) => (
              <button
                key={type}
                onClick={() => setMediaType(type)}
                className={`px-3 py-1 text-xs rounded-md transition ${
                  mediaType === type
                    ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                    : "bg-white/5 text-gray-400"
                }`}
              >
                {type}
              </button>
            ))}
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
            className="w-full bg-white/5 border border-white/10 
            rounded-lg p-2 text-sm text-white placeholder-gray-500 
            outline-none focus:ring-1 focus:ring-purple-500"
          />
        </div>
      )}

      {/* Bottom */}
      <div className="flex items-center justify-between mt-4">
        {/* Icons */}
        <div className="flex gap-2">
          {[Image, Link2, Hash, MapPin].map((Icon, i) => (
            <button
              key={i}
              onClick={
                i === 0 ? () => setShowMediaInput(!showMediaInput) : undefined
              }
              className="w-9 h-9 flex items-center justify-center 
              rounded-lg bg-white/5 border border-white/10 
              text-gray-400 hover:text-white hover:bg-white/10 transition"
            >
              <Icon size={15} />
            </button>
          ))}
        </div>

        {/* Post Button */}
        <button
          disabled={!postText.trim() || isPosting}
          onClick={handleCreatePost}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition ${
            postText.trim()
              ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg hover:opacity-90"
              : "bg-white/10 text-gray-500"
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
