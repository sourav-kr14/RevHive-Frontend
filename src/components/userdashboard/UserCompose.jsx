import { motion } from "framer-motion";
import {
  Image,
  Link2,
  Hash,
  Loader,
  AlertCircle,
  MapPin,
  Wand2,
} from "lucide-react";
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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="
      group
      bg-white/95 backdrop-blur-xl
      border border-gray-100
      rounded-[32px]
      p-5 sm:p-6
      shadow-sm hover:shadow-2xl
      transition-all duration-500
      "
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-5">
        <div
          className="
          w-12 h-12 rounded-2xl
          bg-gradient-to-br from-gray-900 to-gray-700
          flex items-center justify-center
          text-white font-semibold
          shadow-md
          "
        >
          {initials}
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-gray-900">Create Post</p>
          </div>

          <p className="text-xs text-gray-500 mt-0.5">
            Share something with your community
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div
          className="
          mb-4 p-3 rounded-2xl
          flex items-center gap-2
          bg-red-50 border border-red-200
          text-red-600 text-sm
          "
        >
          <AlertCircle size={15} />
          {error}
        </div>
      )}

      {/* Textarea */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          className="
          w-full rounded-3xl
          border border-gray-200
          bg-gray-50/70
          p-5 text-sm text-gray-900
          placeholder:text-gray-400
          resize-none outline-none
          transition-all duration-300
          focus:bg-white
          focus:border-gray-400
          focus:shadow-lg
          "
          placeholder="What's happening today?"
          rows="5"
          value={postText}
          onChange={handleTextChange}
          maxLength={500}
        />

        <span
          className={`
          absolute bottom-4 right-4
          text-xs font-medium
          ${charCount > 450 ? "text-red-500" : "text-gray-400"}
          `}
        >
          {charCount}/500
        </span>
      </div>

      {/* Hashtags */}
      {hashtags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {hashtags.map((tag, i) => (
            <button
              key={i}
              onClick={() => addTag(tag)}
              className="
              px-3 py-1.5 rounded-full
              bg-gray-100
              text-gray-700
              text-xs font-medium
              hover:bg-gray-900
              hover:text-white
              hover:scale-105
              transition-all duration-300
              "
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* AI Result */}
      {aiResult && aiType !== "moderate" && (
        <div
          className="
          mt-4 rounded-3xl
          border border-gray-200
          bg-gray-50/80
          p-4
          "
        >
          <div className="flex items-start gap-3">
            <div
              className="
              w-9 h-9 rounded-xl
              bg-black text-white
              flex items-center justify-center
              shrink-0
              "
            >
              <Wand2 size={16} />
            </div>

            <div className="flex-1">
              <p className="text-sm text-gray-700 leading-relaxed">
                {aiResult}
              </p>

              <button
                onClick={() => {
                  setPostText(aiResult);
                  setAiResult("");
                }}
                className="
                mt-3 text-xs font-semibold
                text-orange-500 hover:text-orange-600
                transition
                "
              >
                Use this content
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Moderation */}
      {aiType === "moderate" && aiResult && (
        <p
          className={`mt-4 text-sm font-medium ${
            aiResult.includes("UNSAFE") ? "text-red-500" : "text-green-600"
          }`}
        >
          {aiResult}
        </p>
      )}

      {/* Bottom */}
      <div
        className="
        flex items-center justify-between
        mt-5 pt-5
        border-t border-gray-100
        "
      >
        {/* Actions */}
        <div className="flex items-center gap-2">
          {[Image, Link2, Hash, MapPin].map((Icon, i) => (
            <button
              key={i}
              onClick={() => {
                if (i === 0) setShowMediaInput(!showMediaInput);

                if (i === 2) generateHashtags();
              }}
              className="
              w-10 h-10 rounded-2xl
              border border-gray-200
              bg-white
              flex items-center justify-center
              text-gray-600
              hover:bg-black
              hover:text-white
              hover:scale-110
              transition-all duration-300
              "
            >
              <Icon size={17} />
            </button>
          ))}
        </div>

        {/* Post */}
        <button
          disabled={!postText.trim() || isPosting}
          onClick={handleCreatePost}
          className={`
            px-6 py-2.5 rounded-2xl
            text-sm font-semibold
            transition-all duration-300
            ${
              postText.trim()
                ? `
                 bg-red-500
                  text-white
                  hover:scale-105
                  hover:shadow-xl
                  hover:shadow-red-200
                  `
                : `
                  bg-gray-200
                  text-gray-400
                  cursor-not-allowed
                  `
            }
          `}
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
      <div className="flex flex-wrap gap-2 mt-5">
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
            className="
            px-4 py-2 rounded-2xl
            border border-gray-200
            bg-white
            text-xs font-medium text-gray-700
            hover:bg-gray-900
            hover:text-white
            hover:-translate-y-0.5
            transition-all duration-300
            "
          >
            {btn.label}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
