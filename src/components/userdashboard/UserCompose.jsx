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
      className="bg-white/5 backdrop-blur-xl border border-white/10 
      rounded-2xl p-5 shadow-[0_0_30px_rgba(139,92,246,0.1)]"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-11 h-11 rounded-full 
        bg-gradient-to-br from-purple-500 to-blue-500 
        flex items-center justify-center text-black font-semibold shadow"
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

      {/* TEXTAREA */}
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
          maxLength={500}
        />
        <span className="absolute bottom-2 right-2 text-xs text-gray-500">
          {charCount}/500
        </span>
      </div>

      {/* HASHTAGS */}
      {loadingTags && (
        <p className="text-xs mt-2 text-gray-400">Generating hashtags...</p>
      )}

      {hashtags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {hashtags.map((tag, i) => (
            <span
              key={i}
              onClick={() => addTag(tag)}
              className="bg-white/5 px-2 py-1 rounded text-xs cursor-pointer 
              text-cyan-300 border border-cyan-500/20
              hover:bg-cyan-500/10 hover:shadow-[0_0_8px_#22d3ee]"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* AI RESULT */}
      {loadingAI && (
        <p className="text-xs mt-2 text-gray-400">Generating {aiType}...</p>
      )}

      {aiResult && aiType !== "moderate" && (
        <div
          className="bg-white/5 backdrop-blur-md border border-purple-500/20 
        p-2 rounded mt-2 text-sm text-gray-200 
        shadow-[0_0_12px_rgba(168,85,247,0.15)]"
        >
          {aiResult}
          <button
            onClick={() => {
              setPostText(aiResult);
              setAiResult("");
            }}
            className="block mt-1 text-cyan-400 text-xs hover:text-cyan-300"
          >
            Use this
          </button>
        </div>
      )}

      {/* MODERATION */}
      {aiType === "moderate" && aiResult && (
        <p
          className={`mt-2 text-sm ${
            aiResult.includes("UNSAFE") ? "text-red-400" : "text-green-400"
          }`}
        >
          {aiResult}
        </p>
      )}

      {/* ACTION BUTTONS */}
      <div className="flex items-center justify-between mt-3">
        <div className="flex gap-2">
          {[Image, Link2, Hash, MapPin].map((Icon, i) => (
            <button
              key={i}
              onClick={() => {
                if (i === 0) setShowMediaInput(!showMediaInput);
                if (i === 2) generateHashtags();
              }}
              className="w-8 h-8 flex items-center justify-center 
              border border-white/10 rounded-md text-gray-400 
              hover:bg-white/10 hover:text-white 
              hover:shadow-[0_0_8px_rgba(139,92,246,0.5)] transition"
            >
              <Icon size={15} />
            </button>
          ))}
        </div>

        <button
          disabled={!postText.trim() || isPosting}
          onClick={handleCreatePost}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition ${
            postText.trim()
              ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg hover:opacity-90"
              : "bg-white/10 text-gray-500"
          }`}
        >
          {isPosting ? "Posting..." : "Post"}
        </button>
      </div>

      {/* AI BUTTONS */}
      <div className="flex gap-2 mt-3 flex-wrap">
        <button
          onClick={() => handleAI("caption")}
          className="px-3 py-1.5 text-xs rounded-md 
          bg-black text-cyan-400 border border-cyan-500/40
          hover:bg-cyan-500/10 hover:shadow-[0_0_10px_#22d3ee]"
        >
          Caption
        </button>

        <button
          onClick={generateHashtags}
          className="px-3 py-1.5 text-xs rounded-md 
          bg-black text-pink-400 border border-pink-500/40
          hover:bg-pink-500/10 hover:shadow-[0_0_10px_#ec4899]"
        >
          Tags
        </button>

        <button
          onClick={() => handleAI("summarize")}
          className="px-3 py-1.5 text-xs rounded-md 
          bg-black text-purple-400 border border-purple-500/40
          hover:bg-purple-500/10 hover:shadow-[0_0_10px_#a855f7]"
        >
          Summary
        </button>

        <button
          onClick={() => handleAI("moderate")}
          className="px-3 py-1.5 text-xs rounded-md 
          bg-black text-green-400 border border-green-500/40
          hover:bg-green-500/10 hover:shadow-[0_0_10px_#4ade80]"
        >
          Check
        </button>
      </div>
    </motion.div>
  );
}
