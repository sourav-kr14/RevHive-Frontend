import { motion } from "framer-motion";
import { Send, Trash2, MessageCircle } from "lucide-react";

import { useState, useEffect } from "react";

import api, { commentAPI } from "../../services/api";

export default function CommentSection({
  postId,
  currentUserId,
  onCommentAdded,
}) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const [loading, setLoading] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const [showComments, setShowComments] = useState(false);

  const [commentCount, setCommentCount] = useState(0);

  const [error, setError] = useState(null);

  useEffect(() => {
    if (showComments) {
      fetchComments();
    }
  }, [showComments, postId]);

  useEffect(() => {
    fetchCommentCount();
  }, [postId]);

  const fetchCommentCount = async () => {
    try {
      const response = await commentAPI.getCommentCount(postId);

      setCommentCount(response.data.count || 0);
    } catch (error) {
      console.error("Error fetching comment count:", error);
    }
  };

  const fetchComments = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await commentAPI.getComments(postId);

      const commentsData = response.data.content || [];

      setComments(commentsData);
      setCommentCount(commentsData.length);
    } catch (error) {
      console.error("Error fetching comments:", error);

      setError("Failed to load comments");
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      setError("Please enter a comment");
      return;
    }

    if (!currentUserId) {
      setError("You must be logged in to comment");
      return;
    }

    if (!postId) {
      setError("Invalid post");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await commentAPI.addComment(postId, currentUserId, newComment);

      setNewComment("");

      await fetchComments();

      if (onCommentAdded) {
        onCommentAdded();
      }
    } catch (error) {
      if (error.response?.status === 401) {
        setError("Please login to comment");
      } else if (error.response?.status === 404) {
        setError("Post not found");
      } else {
        setError(error.response?.data?.message || "Failed to add comment");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm("Delete this comment?")) {
      try {
        await commentAPI.deleteComment(commentId);

        await fetchComments();
      } catch (error) {
        console.error("Error deleting comment:", error);

        setError("Failed to delete comment");
      }
    }
  };

  return (
    <div className="mt-1">
      {/* Toggle */}
      <button
        onClick={() => setShowComments(!showComments)}
        className="
        flex items-center gap-2
        text-gray-500
        hover:text-orange-500
        transition-all duration-300
        group/comment
        "
      >
        <MessageCircle
          size={18}
          className="
          transition-all duration-300
          group-hover/comment:scale-125
          "
        />

        <span className="text-sm font-medium">{commentCount}</span>
      </button>

      {/* Comments */}
      {showComments && (
        <motion.div
          initial={{
            opacity: 0,
            y: -10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="
          mt-4 space-y-4
          "
        >
          {/* Error */}
          {error && (
            <div
              className="
              p-3 rounded-2xl
              bg-red-50 border border-red-200
              text-red-500 text-sm
              "
            >
              {error}
            </div>
          )}

          {/* Input */}
          <div className="flex gap-3">
            <input
              type="text"
              value={newComment}
              onChange={(e) => {
                setNewComment(e.target.value);

                if (error) setError(null);
              }}
              placeholder="Write a comment..."
              className="
              flex-1
              bg-gray-50
              border border-gray-200
              rounded-2xl
              px-4 py-3
              text-sm text-gray-800
              outline-none
              transition-all duration-300
              focus:bg-white
              focus:border-orange-300
              focus:shadow-lg
              "
              onKeyPress={(e) =>
                e.key === "Enter" && !submitting && handleAddComment()
              }
              disabled={submitting}
            />

            <button
              onClick={handleAddComment}
              disabled={!newComment.trim() || submitting}
              className="
              px-4 rounded-2xl
              bg-gradient-to-r
              from-orange-400 to-pink-500
              text-white
              hover:scale-105
              hover:shadow-lg
              hover:shadow-orange-200
              transition-all duration-300
              disabled:opacity-50
              flex items-center gap-2
              "
            >
              {submitting ? (
                <>
                  <div
                    className="
                    w-4 h-4
                    border-2 border-white/30
                    border-t-white
                    rounded-full
                    animate-spin
                    "
                  />

                  <span className="text-xs">Sending</span>
                </>
              ) : (
                <>
                  <Send size={15} />
                </>
              )}
            </button>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="text-center text-gray-500 py-4">
              Loading comments...
            </div>
          ) : comments.length > 0 ? (
            <div
              className="
              space-y-3
              max-h-96 overflow-y-auto
              pr-1
              "
            >
              {comments.map((comment) => (
                <motion.div
                  key={comment.id}
                  initial={{
                    opacity: 0,
                    x: -10,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  whileHover={{ y: -2 }}
                  className="
                  bg-gray-50/80
                  border border-gray-100
                  rounded-3xl
                  p-4
                  transition-all duration-300
                  hover:shadow-md
                  "
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div
                        className="
                        flex items-center gap-2
                        flex-wrap
                        mb-2
                        "
                      >
                        <span
                          className="
                          text-xs font-semibold
                          text-orange-500
                          "
                        >
                          @{comment.user?.username || "Anonymous"}
                        </span>

                        <span
                          className="
                          text-[11px]
                          text-gray-400
                          "
                        >
                          {comment.createdAt
                            ? new Date(comment.createdAt).toLocaleString()
                            : "Just now"}
                        </span>
                      </div>

                      <p
                        className="
                        text-sm text-gray-700
                        leading-relaxed
                        "
                      >
                        {comment.content}
                      </p>
                    </div>

                    {/* Delete */}
                    {comment.user?.id === currentUserId && (
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="
                        p-2 rounded-xl
                        text-gray-400
                        hover:text-red-500
                        hover:bg-red-50
                        transition-all duration-300
                        "
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div
              className="
              text-center py-6
              text-gray-400 text-sm
              "
            >
              No comments yet
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
