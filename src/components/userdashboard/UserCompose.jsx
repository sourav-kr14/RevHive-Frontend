import { motion } from "framer-motion";
import { Image, Link2, Hash, Loader, AlertCircle, MapPin } from "lucide-react";
import { useState, useRef } from "react";
import { postAPI } from "../../services/api";
import { callAI } from "../../api/ai-content";

export default function DashboardCompose({ profileData, onPostCreated }) {
  const [postText, setPostText] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [showMediaInput, setShowMediaInput] = useState(false);
  const [mediaType, setMediaType] = useState("image");
  const [error, setError] = useState("");
  const [charCount, setCharCount] = useState(0);

  const [hashtags, setHashtags] = useState([]);
  const [loadingTags, setLoadingTags] = useState(false);

  const [aiResult, setAiResult] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiType, setAiType] = useState("");

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
      setHashtags([]);
      setAiResult("");

      onPostCreated && onPostCreated(response.data);
    } catch (error) {
      setError(error.response?.data?.message || "Server error");
    } finally {
      setIsPosting(false);
    }
  };

  const generateHashtags = async () => {
    setLoadingTags(true);
    setHashtags([]);

    try {
      const res = await callAI({
        type: "hashtags",
        content: postText || "social media post",
      });

      const tags = res.data.result
        .split(/\s+/)
        .filter((t) => t.startsWith("#"))
        .slice(0, 10);

      setHashtags(tags);
    } catch {
      setHashtags([]);
    }

    setLoadingTags(false);
  };

  const addTag = (tag) => {
    if (postText.includes(tag)) return;
    setPostText((prev) => prev + " " + tag);
  };

  const handleAI = async (type) => {
    setLoadingAI(true);
    setAiType(type);
    setAiResult("");

    try {
      const res = await callAI({
        type,
        content: postText || "social media post",
      });

      setAiResult(res.data.result);
    } catch {
      setAiResult("Something went wrong");
    }

    setLoadingAI(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-11 h-11 rounded-full bg-gray-900 
      flex items-center justify-center text-white font-semibold"
        >
          {initials}
        </div>

        <div>
          <p className="text-sm font-semibold text-gray-900">Create Post</p>
          <p className="text-xs text-gray-500">
            Share your thoughts with the community
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-3 p-3 rounded-xl flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm">
          <AlertCircle size={15} />
          {error}
        </div>
      )}

      {/* Textarea */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          className="w-full rounded-xl border border-gray-300 
      bg-gray-50 p-4 text-sm text-gray-900 
      placeholder:text-gray-400 resize-none outline-none
      focus:border-gray-900 focus:bg-white transition"
          placeholder="What's on your mind?"
          rows="4"
          value={postText}
          onChange={handleTextChange}
          maxLength={500}
        />

        <span className="absolute bottom-3 right-3 text-xs text-gray-400">
          {charCount}/500
        </span>
      </div>

      {/* Hashtags */}
      {hashtags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {hashtags.map((tag, i) => (
            <button
              key={i}
              onClick={() => addTag(tag)}
              className="px-3 py-1 rounded-full bg-gray-100 
          text-gray-700 text-xs hover:bg-gray-200 transition"
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* AI Result */}
      {aiResult && aiType !== "moderate" && (
        <div className="mt-3 rounded-xl border border-gray-200 bg-gray-50 p-3">
          <p className="text-sm text-gray-700">{aiResult}</p>

          <button
            onClick={() => {
              setPostText(aiResult);
              setAiResult("");
            }}
            className="mt-2 text-xs font-medium text-gray-900 hover:underline"
          >
            Use this
          </button>
        </div>
      )}

      {/* Moderation */}
      {aiType === "moderate" && aiResult && (
        <p
          className={`mt-3 text-sm ${
            aiResult.includes("UNSAFE") ? "text-red-500" : "text-green-600"
          }`}
        >
          {aiResult}
        </p>
      )}

      {/* Bottom Actions */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
        {/* Left */}
        <div className="flex items-center gap-2">
          {[Image, Link2, Hash, MapPin].map((Icon, i) => (
            <button
              key={i}
              onClick={() => {
                if (i === 0) setShowMediaInput(!showMediaInput);
                if (i === 2) generateHashtags();
              }}
              className="w-9 h-9 rounded-lg border border-gray-200 
          flex items-center justify-center text-gray-600
          hover:bg-gray-100 transition"
            >
              <Icon size={16} />
            </button>
          ))}
        </div>

        {/* Right */}
        <button
          disabled={!postText.trim() || isPosting}
          onClick={handleCreatePost}
          className={`px-5 py-2 rounded-xl text-sm font-medium transition ${
            postText.trim()
              ? "bg-gray-900 text-white hover:bg-black"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          {isPosting ? (
            <span className="flex items-center gap-2">
              <Loader size={15} className="animate-spin" />
              Posting...
            </span>
          ) : (
            "Post"
          )}
        </button>
      </div>

      {/* AI Buttons */}
      <div className="flex flex-wrap gap-2 mt-4">
        {[
          { label: "Caption", type: "caption" },
          { label: "Tags", type: "hashtags" },
          { label: "Summary", type: "summarize" },
          { label: "Check", type: "moderate" },
        ].map((btn) => (
          <button
            key={btn.label}
            onClick={() =>
              btn.type === "hashtags" ? generateHashtags() : handleAI(btn.type)
            }
            className="px-3 py-1.5 rounded-lg border border-gray-200 
        text-xs text-gray-700 hover:bg-gray-100 transition"
          >
            {btn.label}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
