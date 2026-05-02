// components/userdashboard/CommentSection.jsx
import { motion } from "framer-motion";
import { Send, Trash2, MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";
import api, { commentAPI } from "../../services/api";

export default function CommentSection({ postId, currentUserId, onCommentAdded }) {
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
      console.log("Adding comment:", {
        postId,
        userId: currentUserId,
        content: newComment
      });

      const response = await commentAPI.addComment(
        postId,
        currentUserId,
        newComment
      );

      console.log("Comment added successfully:", response.data);
      
      setNewComment("");
      await fetchComments();
      
      if (onCommentAdded) {
        onCommentAdded();
      }
      
    } catch (error) {
      console.error("Error adding comment - Full error:", error);
      console.error("Error response:", error.response);
      console.error("Error data:", error.response?.data);
      
      if (error.response?.status === 401) {
        setError("Please login to comment");
      } else if (error.response?.status === 404) {
        setError("Post not found");
      } else {
        setError(error.response?.data?.message || "Failed to add comment. Please try again.");
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
    <div className="mt-3">
      <button
        onClick={() => setShowComments(!showComments)}
        className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors text-sm"
      >
        <MessageCircle size={16} />
        <span>{commentCount} comments</span>
      </button>

      {showComments && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 space-y-3"
        >
          {/* Error Display */}
          {error && (
            <div className="p-2 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs">
              {error}
            </div>
          )}

          {/* Add Comment Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => {
                setNewComment(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Write a comment..."
              className="flex-1 bg-white/5 border border-white/10 rounded-lg p-2 text-white text-sm outline-none focus:border-blue-500/40"
              onKeyPress={(e) => e.key === 'Enter' && !submitting && handleAddComment()}
              disabled={submitting}
            />
            <button
              onClick={handleAddComment}
              disabled={!newComment.trim() || submitting}
              className="px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-1"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span className="text-xs">Sending...</span>
                </>
              ) : (
                <>
                  <Send size={14} />
                  <span className="text-xs">Post</span>
                </>
              )}
            </button>
          </div>

          {/* Comments List */}
          {loading ? (
            <div className="text-center text-gray-500 py-4">Loading comments...</div>
          ) : comments.length > 0 ? (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {comments.map((comment) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white/5 rounded-lg p-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-blue-400">
                          @{comment.user?.username || "Anonymous"}
                        </span>
                        <span className="text-xs text-gray-500">
                          {comment.createdAt ? new Date(comment.createdAt).toLocaleString() : "Just now"}
                        </span>
                      </div>
                      <p className="text-sm text-gray-300">{comment.content}</p>
                    </div>
                    {comment.user?.id === currentUserId && (
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-gray-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-4">No comments yet. Be the first!</div>
          )}
        </motion.div>
      )}
    </div>
  );
}