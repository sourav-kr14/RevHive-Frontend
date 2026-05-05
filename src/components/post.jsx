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
  const [isFollowing, setIsFollowing] = useState(false);
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
    console.log("button clicked");

    // if (!text.trim()) return;
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
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-3">
          <img
            src="https://i.pravatar.cc/40"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <div className="text-sm font-bold">Mima Agency</div>
            <div className="text-xs text-gray-400">3 min ago</div>
          </div>
        </div>

        <button className="bg-blue-600 px-3 py-1 rounded-full text-sm">
          Follow
        </button>
      </div>

      {/* Image */}
      <img
        src="https://images.unsplash.com/photo-1501785888041-af3ef285b470"
        className="w-full rounded-lg"
      />

      {/* Actions */}
      <div className="flex justify-between mt-3">
        <div className="flex gap-6 items-center">
          <div onClick={toggleLike} className="flex gap-1 cursor-pointer">
            {liked ? <FaHeart color="red" /> : <FaRegHeart />}
            <span>{likeCount}</span>
          </div>

          <div
            onClick={() => setShowComments(!showComments)}
            className="flex gap-1 cursor-pointer"
          >
            <FaRegComment />
            <span>{comments.length}</span>
          </div>

          <FiSend />
        </div>

        <div onClick={toggleBookmark} className="cursor-pointer">
          {bookmarked ? <FaBookmark /> : <FaRegBookmark />}
        </div>
      </div>

      {/* Comments */}
      {showComments && (
        <div className="mt-3">
          {comments.map((c) => (
            <div key={c.id} className="bg-gray-800 p-2 rounded mb-2">
              {c.content}
            </div>
          ))}

          <div className="relative flex flex-col gap-2 mt-2">
            {/* INPUT ROW */}
            <div className="flex gap-2">
              <button onClick={() => setShowEmoji(!showEmoji)}>😊</button>

              {/* HASHTAG BUTTON */}
              <button onClick={generateHashtags}>#</button>

              <input
                className="flex-1 p-2 rounded text-black"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Add comment..."
              />

              <button onClick={addComment}>Post</button>
            </div>

            {/* LOADING */}
            {loadingTags && (
              <p className="text-xs text-gray-400">Generating hashtags...</p>
            )}

            {/* HASHTAGS */}
            {hashtags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {hashtags.map((tag, i) => (
                  <span
                    key={i}
                    onClick={() => addTag(tag)}
                    className="bg-gray-700 px-2 py-1 rounded cursor-pointer hover:bg-gray-600 text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* EMOJI PICKER */}
            {showEmoji && (
              <div ref={emojiRef} className="absolute bottom-20">
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
