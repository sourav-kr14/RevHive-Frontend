
import { useState, useRef, useEffect } from "react";
import EmojiPicker from "emoji-picker-react";
import { FaHeart, FaRegHeart, FaRegComment, FaRegBookmark, FaBookmark } from "react-icons/fa";
import { FiSend } from "react-icons/fi";

const UserDashboard = () => {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(320001);
  const [isFollowing, setIsFollowing] = useState(false);

  const [comments, setComments] = useState([
    {
      id: 1,
      user: "falcao8000",
      content: "That’s cool 😆",
      liked: false,
      likeCount: 12,
      replies: [
        {
          id: 11,
          user: "creator",
          content: "Thanks! 😍",
          liked: false,
          likeCount: 5,
          replies: []
        }
      ]
    }
  ]);

  const [text, setText] = useState("");
  const [replyText, setReplyText] = useState("");
  const [replyTo, setReplyTo] = useState(null);

  const [showEmoji, setShowEmoji] = useState(false);
  const [showReplyEmoji, setShowReplyEmoji] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const emojiRef = useRef(null);
  const replyEmojiRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setShowEmoji(false);
      }
      if (replyEmojiRef.current && !replyEmojiRef.current.contains(event.target)) {
        setShowReplyEmoji(false);
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

  const toggleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  const toggleCommentLike = (id) => {
    const update = (list) =>
      list.map((c) => {
        if (c.id === id) {
          return {
            ...c,
            liked: !c.liked,
            likeCount: c.liked ? c.likeCount - 1 : c.likeCount + 1
          };
        }
        return { ...c, replies: update(c.replies || []) };
      });
    setComments(update(comments));
  };

  const addComment = () => {
    if (!text.trim()) return;
    setComments([
      {
        id: Date.now(),
        user: "you",
        content: text,
        liked: false,
        likeCount: 0,
        replies: []
      },
      ...comments
    ]);
    setText("");
    setShowEmoji(false);
  };

  const addReply = (id) => {
    if (!replyText.trim()) return;

    const update = (list) =>
      list.map((c) => {
        if (c.id === id) {
          return {
            ...c,
            replies: [
              ...c.replies,
              {
                id: Date.now(),
                user: "you",
                content: replyText,
                liked: false,
                likeCount: 0,
                replies: []
              }
            ]
          };
        }
        return { ...c, replies: update(c.replies || []) };
      });

    setComments(update(comments));
    setReplyText("");
    setReplyTo(null);
    setShowReplyEmoji(false);
  };

  const renderComments = (list, level = 0) =>
    list.map((c) => (
      <div key={c.id} style={{ marginLeft: level * 20 }}>
        <div style={styles.commentCard}>
          <b>{c.user}</b>
          <p>{c.content}</p>

          <div style={styles.actionsRow}>
            <span
              style={{ cursor: "pointer", color: c.liked ? "#ff4d6d" : "#aaa" }}
              onClick={() => toggleCommentLike(c.id)}
            >
              {c.liked ? "❤️" : "🤍"} {c.likeCount}
            </span>

            <span style={styles.replyBtn} onClick={() => setReplyTo(c.id)}>
              Reply
            </span>
          </div>
        </div>

        {replyTo === c.id && (
          <div style={{ position: "relative", marginLeft: 20 }}>
            <div style={styles.commentBox}>
              <input
                style={styles.input}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Reply..."
              />

              <button onClick={() => setShowReplyEmoji(!showReplyEmoji)}>😊</button>
              <button onClick={() => addReply(c.id)}>Send</button>
            </div>

            {showReplyEmoji && (
              <div ref={replyEmojiRef} style={styles.emojiPopupRight}>
                <EmojiPicker
                  onEmojiClick={(e) => {
                    setReplyText((prev) => prev + e.emoji);
                    setShowReplyEmoji(false);
                  }}
                />
              </div>
            )}
          </div>
        )}

        {renderComments(c.replies || [], level + 1)}
      </div>
    ));

  return (
    <div style={styles.container}>
      <div style={styles.postHeader}>
        <div style={styles.userInfo}>
          <img
            src="https://i.pravatar.cc/40"
            alt="profile"
            style={styles.avatar}
          />
          <div>
            <div style={styles.username}>Mima Agency</div>
            <div style={styles.time}>3 min ago</div>
          </div>
        </div>

        <button
          style={{
            ...styles.followBtn,
            background: isFollowing ? "#334155" : "#3b82f6"
          }}
          onClick={toggleFollow}
        >
          {isFollowing ? "Following" : "Follow"}
        </button>
      </div>

      <img
        src="https://images.unsplash.com/photo-1501785888041-af3ef285b470"
        style={styles.image}
      />

      <div style={styles.actionsBar}>
        <div style={styles.left}>
          <div style={styles.iconGroup} onClick={toggleLike}>
            {liked ? <FaHeart color="red" /> : <FaRegHeart />}
            <span>{likeCount}</span>
          </div>

          <div
            style={styles.iconGroup}
            onClick={() => setShowComments(!showComments)}
          >
            <FaRegComment />
            <span>{comments.length}</span>
          </div>

          <div style={styles.iconGroup}>
            <FiSend />
          </div>
        </div>

        <div style={styles.iconGroup} onClick={toggleBookmark}>
          {bookmarked ? <FaBookmark /> : <FaRegBookmark />}
        </div>
      </div>

      {showComments && (
        <>
          {renderComments(comments)}

          <div style={{ position: "relative" }}>
            <div style={styles.commentBox}>
              <button onClick={() => setShowEmoji(!showEmoji)}>😊</button>

              <input
                style={styles.input}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Add a comment..."
              />

              <button onClick={addComment}>Post</button>
            </div>

            {showEmoji && (
              <div ref={emojiRef} style={styles.emojiPopup}>
                <EmojiPicker
                  onEmojiClick={(e) => {
                    setText((prev) => prev + e.emoji);
                    setShowEmoji(false);
                  }}
                />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default UserDashboard;

const styles = {
  container: {
    padding: 20,
    background: "#0f172a",
    color: "white",
    minHeight: "100vh"
  },

  postHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10
  },

  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: 10
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: "50%"
  },

  username: {
    fontWeight: "bold",
    fontSize: 14
  },

  time: {
    fontSize: 12,
    color: "#aaa"
  },

  followBtn: {
    border: "none",
    padding: "6px 12px",
    borderRadius: 20,
    color: "white",
    cursor: "pointer"
  },

  image: {
    width: "100%",
    borderRadius: 10
  },

  actionsBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10
  },

  left: {
    display: "flex",
    alignItems: "center",
    gap: 20
  },

  iconGroup: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    cursor: "pointer",
    fontSize: 18
  },

  commentCard: {
    background: "#1e293b",
    padding: 10,
    borderRadius: 10,
    marginTop: 10
  },

  actionsRow: {
    display: "flex",
    gap: 15,
    fontSize: 12
  },

  replyBtn: {
    color: "#60a5fa",
    cursor: "pointer"
  },

  commentBox: {
    display: "flex",
    gap: 10,
    marginTop: 10
  },

  input: {
    flex: 1,
    padding: 8,
    borderRadius: 10,
    border: "none"
  },

  emojiPopup: {
    position: "absolute",
    bottom: 60,
    left: 0
  },

  emojiPopupRight: {
    position: "absolute",
    top: -300,
    right: 0
  }
};