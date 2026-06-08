import { motion } from "framer-motion";
import {
  Heart,
  AlertCircle,
  Bookmark,
  Loader,
  Flag,
  Image as ImageIcon,
  Trash2,
  Pencil,
} from "lucide-react";
import { useState } from "react";
import { useDashboard } from "./DashboardContext";
import { postAPI } from "../../services/api";

import CommentSection from "./CommentSection";
import EditPostModal from "./EditPostModal";
import ReportModal from "../Reportmodal";
import { toast } from "sonner";

export default function UserFeed({
  profileData,
  onlyUserPosts = false, // If true, can still display user posts
}) {
  const {
    posts,
    filteredPosts,
    loading,
    error,
    viewMode,
    setViewMode,
    handleLike,
    handleBookmark,
    handleFollowToggle,
    updatePostCommentCount,
    updatePostLocally,
    deletePostLocally,
    followingStatus,
    followLoading,
  } = useDashboard();

  const [editingPost, setEditingPost] = useState(null);
  const [showReport, setShowReport] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const handleDeletePost = async (postId) => {
    toast.custom(
      (t) => (
        <div className="rounded-xl bg-white p-4 shadow-lg border">
          <h3 className="font-semibold">Delete Post?</h3>
          <p className="text-sm text-gray-500 mt-1">
            Are you sure you want to delete this post?
          </p>

          <div className="flex gap-2 mt-3">
            <button
              onClick={() => toast.dismiss(t)}
              className="px-3 py-1 rounded bg-gray-100"
            >
              Cancel
            </button>

            <button
              onClick={async () => {
                toast.dismiss(t);

                try {
                  await postAPI.deletePost(postId);
                  deletePostLocally(postId);
                  toast.success("Post deleted successfully");
                } catch (err) {
                  console.error(err);
                  toast.error("Failed to delete post");
                }
              }}
              className="px-3 py-1 rounded bg-red-500 text-white"
            >
              Delete
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity,
      },
    );
  };

  const currentUserId = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"))?.id;
    } catch {
      return null;
    }
  })();

  const getFeedTitle = () => {
    if (onlyUserPosts) return "My Posts";
    return "For You";
  };

  const getFeedSubtitle = () => {
    if (onlyUserPosts) return "Your shared thoughts, media, and updates.";
    return "Curated updates from your RevHive community.";
  };

  // If onlyUserPosts is true, we filter filteredPosts locally to match current user's posts
  const visiblePosts = onlyUserPosts
    ? filteredPosts.filter(
        (post) => Number(post.user?.id) === Number(currentUserId),
      )
    : filteredPosts;

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="h-7 w-36 rounded-full bg-slate-200 animate-pulse" />
            <div className="mt-3 h-4 w-64 rounded-full bg-slate-100 animate-pulse" />
          </div>
          <Loader size={22} className="animate-spin text-fuchsia-500" />
        </div>
        <div className="space-y-5">
          {[1, 2].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-slate-100 bg-slate-50 p-5"
            >
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-slate-200 animate-pulse" />
                <div className="flex-1">
                  <div className="h-4 w-32 rounded-full bg-slate-200 animate-pulse" />
                  <div className="mt-2 h-3 w-48 rounded-full bg-slate-200 animate-pulse" />
                </div>
              </div>
              <div className="mt-5 space-y-2">
                <div className="h-3 w-full rounded-full bg-slate-200 animate-pulse" />
                <div className="h-3 w-5/6 rounded-full bg-slate-200 animate-pulse" />
                <div className="h-3 w-3/5 rounded-full bg-slate-200 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-8 text-center text-red-500">
        <AlertCircle className="mx-auto mb-3" />
        <p className="font-bold">{error}</p>
      </div>
    );
  }

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="mb-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-2 flex w-fit items-center gap-2 rounded-full bg-fuchsia-50 px-3 py-1 text-xs font-bold text-fuchsia-700">
                Live feed
              </div>
              <h2 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                {getFeedTitle()}
              </h2>
              <p className="mt-1 text-sm text-slate-500">{getFeedSubtitle()}</p>
            </div>
            <div className="flex rounded-xl bg-slate-100 p-1">
              <button
                onClick={() => setViewMode("latest")}
                className={`rounded-lg px-3 py-2 text-xs font-bold ${
                  viewMode === "latest"
                    ? "bg-white text-slate-950 shadow-sm"
                    : "text-slate-500"
                }`}
              >
                Latest
              </button>

              <button
                onClick={() => setViewMode("popular")}
                className={`rounded-lg px-3 py-2 text-xs font-bold ${
                  viewMode === "popular"
                    ? "bg-white text-slate-950 shadow-sm"
                    : "text-slate-500"
                }`}
              >
                Popular
              </button>

              <button
                onClick={() => setViewMode("media")}
                className={`rounded-lg px-3 py-2 text-xs font-bold ${
                  viewMode === "media"
                    ? "bg-white text-slate-950 shadow-sm"
                    : "text-slate-500"
                }`}
              >
                Media
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          {visiblePosts.length > 0 ? (
            visiblePosts.map((post, index) => {
              const isOwnPost = Number(post.user?.id) === Number(currentUserId);
              const initials =
                post.user?.username?.slice(0, 2)?.toUpperCase() || "NA";

              return (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.04, 0.2) }}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl"
                >
                  <div className="p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex min-w-0 gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-500 via-rose-500 to-orange-400 text-sm font-black text-white shadow-sm">
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="truncate text-sm font-extrabold text-slate-950 sm:text-base">
                              @{post.user?.username}
                            </p>
                            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-black text-emerald-600">
                              ACTIVE
                            </span>
                            {index === 0 && (
                              <span className="rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-black text-orange-600">
                                FRESH
                              </span>
                            )}
                          </div>
                          <p className="mt-1 text-xs font-medium text-slate-500">
                            {post.createdAt
                              ? new Date(post.createdAt).toLocaleString()
                              : "Just now"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {!isOwnPost && post.user?.id && (
                          <button
                            disabled={followLoading[post.user.id]}
                            onClick={() => handleFollowToggle(post.user.id)}
                            className={`rounded-full px-4 py-2 text-xs font-extrabold transition ${
                              followingStatus[post.user.id]
                                ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                : "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-fuchsia-100 hover:-translate-y-0.5"
                            }`}
                          >
                            {followLoading[post.user.id]
                              ? "..."
                              : followingStatus[post.user.id]
                                ? "Following"
                                : "Follow"}
                          </button>
                        )}
                        {isOwnPost && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setEditingPost(post)}
                              className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-extrabold text-slate-700 hover:bg-slate-200 transition"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              onClick={() => handleDeletePost(post.id)}
                              className="rounded-full bg-red-50 px-3 py-1.5 text-xs font-extrabold text-red-600 hover:bg-red-100 transition flex items-center gap-1.5"
                            >
                              <Trash2 size={14} />
                              {/* Delete */}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <p className="mt-5 whitespace-pre-line text-[15px] leading-7 text-slate-700">
                      {post.content}
                    </p>

                    {post.imageUrl && (
                      <div className="mt-5 overflow-hidden rounded-2xl border border-slate-100 bg-slate-50">
                        <img
                          src={post.imageUrl}
                          alt=""
                          className="max-h-[520px] w-full object-cover transition duration-500 group-hover:scale-[1.01]"
                        />
                      </div>
                    )}

                    {post.videoUrl && (
                      <video
                        src={post.videoUrl}
                        controls
                        className="mt-5 max-h-[520px] w-full rounded-2xl bg-black object-cover"
                      />
                    )}
                  </div>

                  <div className="border-t border-slate-100 bg-slate-50/70 px-5 py-3 sm:px-6">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <button
                          onClick={() => handleLike(post.id)}
                          className={`social-action ${
                            post.liked
                              ? "bg-red-50 text-red-500"
                              : "text-slate-500 hover:bg-red-50 hover:text-red-500"
                          }`}
                        >
                          <Heart
                            size={18}
                            className={post.liked ? "fill-red-500" : ""}
                          />
                          <span>{post.likeCount || 0}</span>
                        </button>

                        <CommentSection
                          postId={post.id}
                          postUserId={post.user?.id}
                          currentUserId={currentUserId}
                          onCommentCountChange={(newCount) =>
                            updatePostCommentCount(post.id, newCount)
                          }
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleBookmark(post.id)}
                          className="flex h-10 w-10 items-center justify-center rounded-xl transition hover:bg-orange-50"
                        >
                          <Bookmark
                            size={19}
                            className={`transition ${
                              post.bookmarked
                                ? "fill-orange-500 text-orange-500"
                                : "text-slate-500"
                            }`}
                          />
                        </button>

                        <button
                          onClick={() => {
                            setSelectedPost(post.id);
                            setShowReport(true);
                          }}
                          className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-red-50 hover:text-red-500"
                        >
                          <Flag size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.article>
              );
            })
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-500 to-cyan-400 text-white shadow-lg shadow-fuchsia-100">
                <ImageIcon size={26} />
              </div>
              <h3 className="text-lg font-extrabold text-slate-950">
                No posts yet
              </h3>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                Start the conversation by sharing a thought, photo, or update
                with your community.
              </p>
            </div>
          )}
        </div>
      </motion.div>

      <ReportModal
        isOpen={showReport}
        onClose={() => setShowReport(false)}
        targetType="POST"
        targetId={selectedPost}
      />

      {editingPost && (
        <EditPostModal
          post={editingPost}
          onClose={() => setEditingPost(null)}
          onUpdate={(updated) => updatePostLocally(updated)}
        />
      )}

      <style>{`
        .social-action {
          display: inline-flex;
          min-height: 40px;
          align-items: center;
          gap: 7px;
          border-radius: 12px;
          padding: 0 10px;
          font-size: 13px;
          font-weight: 800;
          transition: all 0.2s ease;
          cursor: pointer;
        }
        .social-action:hover { transform: translateY(-1px); }
        .social-action:disabled { cursor: not-allowed; opacity: 0.6; }
      `}</style>
    </>
  );
}
