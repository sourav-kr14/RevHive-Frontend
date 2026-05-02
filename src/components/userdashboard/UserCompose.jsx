// components/userdashboard/UserCompose.jsx
import { motion } from "framer-motion";
import { Image, Link2, Hash, Loader, AlertCircle, Video, MapPin } from "lucide-react";
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
        mediaType === "video" ? videoUrl || null : null
      );

      console.log("Post created successfully:", response.data);

      // Reset form
      setPostText("");
      setImageUrl("");
      setVideoUrl("");
      setShowMediaInput(false);
      setCharCount(0);
      
      // Notify parent
      if (onPostCreated) {
        onPostCreated(response.data);
      }
      
    } catch (error) {
      console.error("Error creating post:", error);
      
      if (error.response) {
        switch (error.response.status) {
          case 401:
            setError("Session expired. Please login again.");
            setTimeout(() => {
              localStorage.clear();
              window.location.href = "/signin";
            }, 2000);
            break;
          case 400:
            setError(error.response.data?.message || "Invalid post data");
            break;
          case 413:
            setError("Media file too large");
            break;
          default:
            setError(error.response.data?.message || "Failed to create post");
        }
      } else if (error.request) {
        setError("Cannot connect to server. Please check if backend is running.");
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative group"
    >
      <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-purple-600/30 via-blue-600/30 to-cyan-500/30 blur-xl opacity-0 group-focus-within:opacity-100 transition-all duration-500" />

      <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 transition-all duration-300 group-focus-within:border-blue-500/40 group-hover:border-white/20">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <motion.div
            whileHover={{ scale: 1.08 }}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold shadow-lg shadow-purple-500/20"
          >
            {initials}
          </motion.div>

          <div>
            <p className="text-sm font-medium text-gray-300">
              What's buzzing in the hive?
            </p>
            <p className="text-xs text-gray-500">
              Share updates, ideas or moments 🚀
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400 text-sm"
          >
            <AlertCircle size={16} />
            {error}
          </motion.div>
        )}

        {/* Textarea */}
        <div className="relative">
          <textarea
            ref={textareaRef}
            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 resize-none outline-none text-sm leading-relaxed focus:border-blue-500/40 focus:bg-white/10 transition-all duration-300"
            placeholder="Share something with the hive…"
            rows="3"
            value={postText}
            onChange={handleTextChange}
            disabled={isPosting}
            maxLength={500}
          />
          <div className="absolute bottom-2 right-2 text-xs text-gray-500">
            {charCount}/500
          </div>
        </div>

        {/* Media URL Input */}
        {showMediaInput && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 space-y-2"
          >
            <div className="flex gap-2">
              <button
                onClick={() => setMediaType("image")}
                className={`px-3 py-1 rounded-lg text-xs ${
                  mediaType === "image" 
                    ? "bg-blue-600 text-white" 
                    : "bg-white/10 text-gray-400"
                }`}
              >
                Image
              </button>
              <button
                onClick={() => setMediaType("video")}
                className={`px-3 py-1 rounded-lg text-xs ${
                  mediaType === "video" 
                    ? "bg-blue-600 text-white" 
                    : "bg-white/10 text-gray-400"
                }`}
              >
                Video
              </button>
            </div>
            
            <input
              type="text"
              placeholder={`Enter ${mediaType} URL...`}
              value={mediaType === "image" ? imageUrl : videoUrl}
              onChange={(e) => {
                if (mediaType === "image") setImageUrl(e.target.value);
                else setVideoUrl(e.target.value);
              }}
              className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white text-sm outline-none focus:border-blue-500/40"
            />
          </motion.div>
        )}

        {/* Bottom Section */}
        <div className="flex items-center justify-between mt-4">
          {/* Actions */}
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowMediaInput(!showMediaInput)}
              className="w-9 h-9 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 backdrop-blur-md transition-all flex items-center justify-center"
              title="Add media"
            >
              <Image size={16} />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-9 h-9 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 backdrop-blur-md transition-all flex items-center justify-center"
              title="Add link"
            >
              <Link2 size={16} />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-9 h-9 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 backdrop-blur-md transition-all flex items-center justify-center"
              title="Add hashtag"
            >
              <Hash size={16} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-9 h-9 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 backdrop-blur-md transition-all flex items-center justify-center"
              title="Check in"
            >
              <MapPin size={16} />
            </motion.button>
          </div>

          {/* Post Button */}
          <motion.button
            whileHover={postText.trim() && !isPosting ? { scale: 1.05, y: -1 } : {}}
            whileTap={postText.trim() && !isPosting ? { scale: 0.95 } : {}}
            disabled={!postText.trim() || isPosting}
            onClick={handleCreatePost}
            className="relative px-6 py-2 rounded-xl text-sm font-semibold overflow-hidden"
          >
            <span
              className={`absolute inset-0 transition-all duration-300 ${
                postText.trim() && !isPosting
                  ? "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-100"
                  : "bg-white/10 opacity-50"
              }`}
            />

            {postText.trim() && !isPosting && (
              <span className="absolute inset-0 blur-lg bg-gradient-to-r from-blue-500 to-purple-500 opacity-40" />
            )}

            <span className="relative z-10 flex items-center gap-2">
              {isPosting ? (
                <>
                  <Loader size={16} className="animate-spin" />
                  Posting...
                </>
              ) : (
                "Post it ✨"
              )}
            </span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}