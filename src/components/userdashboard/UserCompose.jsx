import { motion, AnimatePresence } from "framer-motion";
import {
  Image,
  Loader,
  AlertCircle,
  Wand2,
  X,
  Video,
  Send,
  FileText,
  Sparkles,
  Hash,
  FileSearch,
  ShieldCheck,
  Bot,
  Lock,
} from "lucide-react";
import { useState, useRef } from "react";
import { postAPI } from "../../services/api";
import { callAI } from "../../api/ai-content";

export default function DashboardCompose({
  profileData,
  draftText = "",
  onPostCreated,
}) {
  const [postText, setPostText] = useState(draftText);
  const [isPosting, setIsPosting] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [showMediaInput, setShowMediaInput] = useState(false);
  const [mediaType, setMediaType] = useState("image");
  const [error, setError] = useState("");
  const [charCount, setCharCount] = useState(draftText.length);
  const [hashtags, setHashtags] = useState([]);
  const [aiResult, setAiResult] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiType, setAiType] = useState("");
  const textareaRef = useRef(null);
  const token = localStorage.getItem("token");

  let isPremium = false;

  if (
    token &&
    token !== "undefined" &&
    token !== "null" &&
    token.trim() !== ""
  ) {
    try {
      const base64Url = token.split(".")[1];
      if (base64Url) {
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const pad = base64.length % 4;
        const padded = pad ? base64 + "=".repeat(4 - pad) : base64;
        const payload = JSON.parse(atob(padded));
        isPremium = payload.premium === true;
      }
    } catch (e) {
      console.log("Error decoding token in compose:", e);
    }
  }

  const initials = profileData?.username
    ? profileData.username.slice(0, 2).toUpperCase()
    : "RH";

  const avatarUrl = profileData?.avatarUrl || profileData?.avatar || "";

  const handleTextChange = (e) => {
    setPostText(e.target.value);
    setCharCount(e.target.value.length);

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
    setHashtags([]);
    setLoadingAI(true);
    setAiType("hashtags");
    setAiResult("");

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
      setAiResult(res.data.result);
    } catch {
      setHashtags([]);
      setAiResult("Something went wrong");
    }

    setLoadingAI(false);
  };

  const addTag = (tag) => {
    if (postText.includes(tag)) return;

    setPostText((prev) => `${prev.trim()} ${tag}`.trim());
    setCharCount((prev) => prev + tag.length + 1);
  };

  const handleAI = async (type) => {
    setLoadingAI(true);
    setAiType(type);
    setAiResult("");

    const payload = {
      type,
      content: postText || "social media post",
      userId: profileData?.id,
    };
    console.log("[Frontend Request Payload] Sending AI request:", payload);

    try {
      const res = await callAI(payload);
      console.log("[Frontend Request Payload] Received AI response:", res.data);
      setAiResult(res.data.result);
    } catch (err) {
      console.error("[Frontend Request Payload] AI request failed:", err);
      setAiResult("Something went wrong");
    }

    setLoadingAI(false);
  };

  const hasMedia =
    (mediaType === "image" && imageUrl.trim()) ||
    (mediaType === "video" && videoUrl.trim());

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
    >
      <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={profileData?.username || "User"}
              className="h-11 w-11 rounded-xl object-cover"
            />
          ) : (
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-sm font-bold text-white">
              {initials}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-slate-950">Create post</p>
            <p className="truncate text-xs text-slate-500">
              Share an update with your RevHive community
            </p>
          </div>

          <div className="hidden items-center gap-2 rounded-full bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-500 sm:flex">
            AI assisted
          </div>
        </div>
      </div>

      <div className="px-5 py-4 sm:px-6">
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="mb-4 flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-sm font-medium text-red-600"
            >
              <AlertCircle size={15} />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative">
          <textarea
            ref={textareaRef}
            autoFocus={Boolean(draftText)}
            className="min-h-[148px] w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 pr-16 text-[15px] leading-6 text-slate-950 outline-none transition focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-100"
            placeholder="What's happening in your world?"
            rows="5"
            value={postText}
            onChange={handleTextChange}
            maxLength={500}
          />

          <span
            className={`absolute bottom-3 right-4 text-xs font-bold ${
              charCount > 450 ? "text-red-500" : "text-slate-400"
            }`}
          >
            {charCount}/500
          </span>
        </div>

        <AnimatePresence>
          {showMediaInput && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div className="flex rounded-xl bg-white p-1 shadow-sm">
                    <button
                      type="button"
                      onClick={() => setMediaType("image")}
                      className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold ${
                        mediaType === "image"
                          ? "bg-slate-950 text-white"
                          : "text-slate-500"
                      }`}
                    >
                      <Image size={14} />
                      Image
                    </button>

                    <button
                      type="button"
                      onClick={() => setMediaType("video")}
                      className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold ${
                        mediaType === "video"
                          ? "bg-slate-950 text-white"
                          : "text-slate-500"
                      }`}
                    >
                      <Video size={14} />
                      Video
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowMediaInput(false)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-white hover:text-slate-700"
                    aria-label="Close media input"
                  >
                    <X size={16} />
                  </button>
                </div>

                <input
                  type="url"
                  value={mediaType === "image" ? imageUrl : videoUrl}
                  onChange={(e) =>
                    mediaType === "image"
                      ? setImageUrl(e.target.value)
                      : setVideoUrl(e.target.value)
                  }
                  placeholder={
                    mediaType === "image"
                      ? "Paste image URL"
                      : "Paste video URL"
                  }
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-300 focus:ring-4 focus:ring-slate-100"
                />

                {hasMedia && mediaType === "image" && (
                  <img
                    src={imageUrl}
                    alt=""
                    className="mt-3 max-h-64 w-full rounded-xl object-cover"
                  />
                )}

                {hasMedia && mediaType === "video" && (
                  <video
                    src={videoUrl}
                    controls
                    className="mt-3 max-h-64 w-full rounded-xl bg-black object-cover"
                  />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {hashtags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {hashtags.map((tag, i) => (
              <button
                key={i}
                type="button"
                onClick={() => addTag(tag)}
                className="rounded-full bg-fuchsia-50 px-3 py-1.5 text-xs font-bold text-fuchsia-700 transition hover:bg-fuchsia-600 hover:text-white"
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        <AnimatePresence>
          {loadingAI && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="mt-4 rounded-2xl border border-fuchsia-100 bg-gradient-to-br from-fuchsia-50 to-white p-4"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white">
                  <Wand2 size={16} className="animate-pulse" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-slate-950">
                      RevHive AI is working
                    </p>
                    <Loader size={14} className="animate-spin text-slate-500" />
                  </div>

                  <p className="mt-1 text-xs text-slate-500">
                    Polishing your content for better engagement
                  </p>

                  <div className="mt-4 space-y-2">
                    <div className="h-2.5 w-full rounded-full bg-slate-200 animate-pulse" />
                    <div className="h-2.5 w-5/6 rounded-full bg-slate-200 animate-pulse" />
                    <div className="h-2.5 w-4/6 rounded-full bg-slate-200 animate-pulse" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!loadingAI && aiResult && aiType !== "moderate" && (
          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-white">
                <Wand2 size={16} />
              </div>

              <div className="flex-1">
                <p className="text-sm leading-6 text-slate-700">{aiResult}</p>

                <button
                  type="button"
                  onClick={() => {
                    setPostText(aiResult);
                    setCharCount(aiResult.length);
                    setAiResult("");
                  }}
                  className="mt-3 text-xs font-bold text-fuchsia-700 hover:text-fuchsia-800"
                >
                  Use this content
                </button>
              </div>
            </div>
          </div>
        )}

        {!loadingAI && aiType === "moderate" && aiResult && (
          <div
            className={`mt-4 rounded-xl px-3 py-2 text-sm font-bold ${
              aiResult.includes("UNSAFE")
                ? "bg-red-50 text-red-600"
                : "bg-emerald-50 text-emerald-600"
            }`}
          >
            {aiResult}
          </div>
        )}
      </div>

      <div className="border-t border-slate-100 bg-slate-50/70 px-5 py-4 sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setShowMediaInput(!showMediaInput)}
              className={`tool-btn ${showMediaInput ? "tool-active" : ""}`}
            >
              <Image size={17} />
              Media
            </button>
          </div>

          <button
            type="button"
            disabled={!postText.trim() || isPosting}
            onClick={handleCreatePost}
            className={`flex h-11 items-center justify-center gap-2 rounded-xl px-6 text-sm font-bold transition ${
              postText.trim() && !isPosting
                ? "bg-slate-950 text-white shadow-[0_12px_28px_rgba(15,23,42,0.18)] hover:-translate-y-0.5 hover:bg-slate-800"
                : "cursor-not-allowed bg-slate-200 text-slate-400"
            }`}
          >
            {isPosting ? (
              <>
                <Loader size={16} className="animate-spin" />
                Posting
              </>
            ) : (
              <>
                <Send size={16} />
                Post
              </>
            )}
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {[
            { label: "Improve", type: "caption", icon: Sparkles },
            { label: "Tags", type: "hashtags", icon: Hash },
            { label: "Summary", type: "summarize", icon: FileText },
            { label: "Safety", type: "moderate", icon: ShieldCheck },
          ].map((btn) => {
            const Icon = btn.icon;

            return (
              <button
                key={btn.type}
                type="button"
                disabled={!isPremium || loadingAI}
                onClick={() => {
                  if (!isPremium) return;

                  btn.type === "hashtags"
                    ? generateHashtags()
                    : handleAI(btn.type);
                }}
                className={`rounded-full border px-3 py-1.5 text-xs font-bold transition flex items-center gap-2 ${
                  !isPremium || loadingAI
                    ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
                    : "border-slate-200 bg-white text-slate-600 hover:border-fuchsia-200 hover:bg-fuchsia-50 hover:text-fuchsia-700"
                }`}
              >
                {!isPremium && <Lock size={13} />}

                {loadingAI && aiType === btn.type ? (
                  <>
                    <Loader size={13} className="animate-spin" />
                    Working
                  </>
                ) : (
                  <>
                    <Icon size={13} />
                    {btn.label}
                  </>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <style>{`
        .tool-btn {
          display: inline-flex;
          height: 40px;
          align-items: center;
          gap: 8px;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          background: #ffffff;
          padding: 0 12px;
          color: #475569;
          font-size: 13px;
          font-weight: 700;
          transition: all 0.2s ease;
        }

        .tool-btn:hover {
          border-color: #d4d4d8;
          background: #f8fafc;
          color: #0f172a;
        }

        .tool-active {
          border-color: #f0abfc;
          background: #fdf4ff;
          color: #a21caf;
        }
      `}</style>
    </motion.section>
  );
}
