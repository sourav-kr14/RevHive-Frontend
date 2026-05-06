import { useState, useRef, useEffect } from "react";
import EmojiPicker from "emoji-picker-react";
import {
  FaHeart,
  FaRegHeart,
  FaRegComment,
  FaRegBookmark,
  FaBookmark,
} from "react-icons/fa";
import { FiSend } from "react-icons/fi";
import { callAI } from "../api/ai-content";

const Post = () => {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(320001);
  const [hashtags, setHashtags] = useState([]);
  const [loadingTags, setLoadingTags] = useState(false);

  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");

  const [showEmoji, setShowEmoji] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const emojiRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setShowEmoji(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  const toggleBookmark = () => {
    setBookmarked(!bookmarked);
  };

  const addComment = () => {
    if (!text.trim()) return;

    setComments([{ id: Date.now(), content: text }, ...comments]);

    setText("");
    setShowEmoji(false);
  };

  const addTag = (tag) => {
    if (text.includes(tag)) return;

    setText((prev) => prev + " " + tag);
  };

  const generateHashtags = async () => {
    setLoadingTags(true);

    try {
      const res = await callAI({
        type: "hashtags",
        content: text,
      });

      const tags = res.data.result
        .split(/\s+/)
        .filter((t) => t.startsWith("#"));

      setHashtags(tags);
    } catch {
      setHashtags([]);
    }

    setLoadingTags(false);
  };

  return (
    <div className="w-full rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <img
            src="https://i.pravatar.cc/40"
            className="w-10 h-10 rounded-full object-cover"
          />

          <div className="min-w-0">
            <div className="text-sm font-semibold text-black truncate">
              Mima Agency
            </div>

            <div className="text-xs text-gray-500">3 min ago</div>
          </div>
        </div>

        <button
          className="bg-black text-white px-4 py-1.5 
          rounded-full text-sm hover:opacity-90 transition"
        >
          Follow
        </button>
      </div>

      {/* Image */}
      <img
        src="https://images.unsplash.com/photo-1501785888041-af3ef285b470"
        className="w-full max-h-[500px] object-cover rounded-xl"
      />

      {/* Actions */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-5 sm:gap-6">
          <div
            onClick={toggleLike}
            className="flex items-center gap-1 cursor-pointer text-black"
          >
            {liked ? <FaHeart color="red" /> : <FaRegHeart />}

            <span className="text-sm">{likeCount}</span>
          </div>

          <div
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1 cursor-pointer text-black"
          >
            <FaRegComment />

            <span className="text-sm">{comments.length}</span>
          </div>

          <FiSend className="cursor-pointer text-black" />
        </div>

        <div onClick={toggleBookmark} className="cursor-pointer text-black">
          {bookmarked ? <FaBookmark /> : <FaRegBookmark />}
        </div>
      </div>

      {/* Comments */}
      {showComments && (
        <div className="mt-5">
          {comments.map((c) => (
            <div
              key={c.id}
              className="bg-gray-100 text-black p-3 rounded-xl mb-2 text-sm"
            >
              {c.content}
            </div>
          ))}

          <div className="relative flex flex-col gap-3 mt-4">
            {/* INPUT */}
            <div className="flex flex-wrap sm:flex-nowrap gap-2">
              <button
                onClick={() => setShowEmoji(!showEmoji)}
                className="px-3 py-2 rounded-lg border border-gray-300"
              >
                😊
              </button>

              <button
                onClick={generateHashtags}
                className="px-3 py-2 rounded-lg border border-gray-300 text-black"
              >
                #
              </button>

              <input
                className="flex-1 min-w-[150px] p-3 rounded-xl border border-gray-300 text-black outline-none focus:border-black"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Add comment..."
              />

              <button
                onClick={addComment}
                className="bg-black text-white px-5 py-3 rounded-xl hover:opacity-90 transition"
              >
                Post
              </button>
            </div>

            {/* Loading */}
            {loadingTags && (
              <p className="text-xs text-gray-500">Generating hashtags...</p>
            )}

            {/* Hashtags */}
            {hashtags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {hashtags.map((tag, i) => (
                  <span
                    key={i}
                    onClick={() => addTag(tag)}
                    className="bg-gray-100 border border-gray-200 
                    px-3 py-1 rounded-full cursor-pointer 
                    hover:bg-gray-200 text-sm text-black transition"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Emoji Picker */}
            {showEmoji && (
              <div ref={emojiRef} className="absolute bottom-20 left-0 z-50">
                <EmojiPicker
                  onEmojiClick={(e) => {
                    setText((prev) => prev + e.emoji);
                    setShowEmoji(false);
                  }}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Post;
