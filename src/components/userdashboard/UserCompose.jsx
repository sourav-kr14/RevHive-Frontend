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
      setHashtags([]);
      setAiResult("");

      onPostCreated && onPostCreated(response.data);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create post");
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
    <motion.div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-semibold">
          {initials}
        </div>
        <div>
          <p className="text-sm font-semibold">What's buzzing?</p>
          <p className="text-xs text-gray-500">Share updates or ideas</p>
        </div>
      </div>

      {/* ERROR */}
      {error && <div className="mb-2 text-red-500 text-sm">{error}</div>}

      {/* TEXTAREA */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          className="w-full bg-gray-50 border border-gray-300 rounded-lg p-3 text-sm outline-none"
          placeholder="Share something with the hive…"
          rows="3"
          value={postText}
          onChange={handleTextChange}
          maxLength={500}
        />
        <span className="absolute bottom-2 right-2 text-xs text-gray-400">
          {charCount}/500
        </span>
      </div>

      {/* HASHTAGS */}
      {loadingTags && <p className="text-xs mt-2">Generating hashtags...</p>}
      {hashtags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {hashtags.map((tag, i) => (
            <span
              key={i}
              onClick={() => addTag(tag)}
              className="bg-gray-200 px-2 py-1 rounded text-xs cursor-pointer hover:bg-gray-300"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* AI RESULT */}
      {loadingAI && <p className="text-xs mt-2">Generating {aiType}...</p>}

      {aiResult && aiType !== "moderate" && (
        <div className="bg-gray-100 p-2 rounded mt-2 text-sm">
          {aiResult}
          <button
            onClick={() => {
              setPostText(aiResult);
              setAiResult("");
            }}
            className="block mt-1 text-blue-600 text-xs"
          >
            Use this
          </button>
        </div>
      )}

      {/* MODERATION */}
      {aiType === "moderate" && aiResult && (
        <p
          className={`mt-2 text-sm ${
            aiResult.includes("UNSAFE") ? "text-red-500" : "text-green-500"
          }`}
        >
          {aiResult}
        </p>
      )}

      {/* ACTION BUTTONS (UNCHANGED + AI BELOW) */}
      <div className="flex items-center justify-between mt-3">
        {/* EXISTING ICON BUTTONS */}
        <div className="flex gap-2">
          {[Image, Link2, Hash, MapPin].map((Icon, i) => (
            <button
              key={i}
              onClick={() => {
                if (i === 0) setShowMediaInput(!showMediaInput);
                if (i === 2) generateHashtags();
              }}
              className="w-8 h-8 flex items-center justify-center border rounded-md text-gray-600 hover:bg-gray-100"
            >
              <Icon size={14} />
            </button>
          ))}
        </div>

        {/* POST BUTTON */}
        <button
          disabled={!postText.trim() || isPosting}
          onClick={handleCreatePost}
          className={`px-4 py-2 rounded text-sm ${
            postText.trim()
              ? "bg-black text-white"
              : "bg-gray-200 text-gray-400"
          }`}
        >
          {isPosting ? "Posting..." : "Post"}
        </button>
      </div>

      <div className="flex gap-2 mt-3 flex-wrap">
        {/* Caption */}
        <button
          onClick={() => handleAI("caption")}
          className="px-3 py-1.5 text-xs border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100 transition"
        >
          Caption
        </button>

        {/* Hashtags (same as icon but text version optional) */}
        <button
          onClick={generateHashtags}
          className="px-3 py-1.5 text-xs border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100 transition"
        >
          Tags
        </button>

        {/* Summarize */}
        <button
          onClick={() => handleAI("summarize")}
          className="px-3 py-1.5 text-xs border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100 transition"
        >
          Summary
        </button>

        {/* Moderation */}
        <button
          onClick={() => handleAI("moderate")}
          className="px-3 py-1.5 text-xs border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100 transition"
        >
          Check
        </button>
      </div>
    </motion.div>
  );
}
