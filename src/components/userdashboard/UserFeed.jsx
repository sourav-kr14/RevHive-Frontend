import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  AlertCircle,
  Bookmark,
  Loader,
  Flag,
  Image as ImageIcon,
  Edit,
  Trash2,
  PlusCircle,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { postAPI, followAPI, bookmarkAPI, likeAPI } from "@/services/api";
import { toast } from "sonner";

import CommentSection from "./CommentSection";
import EditPostModal from "./EditPostModal";
import ReportModal from "../Reportmodal";

export default function UserFeed({
  profileData,
  refreshTrigger,
  onlyUserPosts = false,
  feedType = "forYou",
  activeTopic = "",
  onTopicClear,
  onFeedStatsChange,
  onPromptSelect,
}) {
  const [posts, setPosts] = useState([]);
  const [sortMode, setSortMode] = useState("latest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [followingStatus, setFollowingStatus] = useState({});
  const [followLoading, setFollowLoading] = useState({});
  const [showReport, setShowReport] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [likeLoading, setLikeLoading] = useState({});
  const [postToDelete, setPostToDelete] = useState(null);

  const isMounted = useRef(false);

  const currentUserId = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"))?.id;
    } catch {
      return null;
    }
  })();

  const getFeedTitle = () => {
    if (onlyUserPosts) return "My Posts";
    if (activeTopic) return activeTopic;
    if (feedType === "trending") return "Trending Posts";
    if (feedType === "following") return "Following";
    if (feedType === "discover") return "Discover";
    return "For You";
  };

  const getFeedSubtitle = () => {
    if (onlyUserPosts) return "Your shared thoughts, media, and updates.";
    if (activeTopic) return "Posts connected to this live conversation.";
    if (feedType === "trending")
      return "Popular conversations gaining momentum right now.";
    if (feedType === "following")
      return "Fresh updates from people you follow.";
    if (feedType === "discover")
      return "Find new creators, communities, and ideas.";
    return "Curated updates from your RevHive community.";
  };

  const handleBookmark = async (postId) => {
    const post = posts.find((p) => p.id === postId);
    if (!post) return;
    try {
      if (post.bookmarked) {
        await bookmarkAPI.removeBookmark(profileData.id, postId);
      } else {
        await bookmarkAPI.addBookmark(profileData.id, postId);
      }
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId ? { ...p, bookmarked: !p.bookmarked } : p,
        ),
      );
    } catch (err) {
      console.error(err);
    }
  };

  function buildTrendingTags(items) {
    const tagCounts = items.reduce((acc, post) => {
      const tags = post.content?.match(/#[\w]+/g) || [];
      tags.forEach((tag) => {
        const normalized = tag.trim();
        acc[normalized] = (acc[normalized] || 0) + 1;
      });
      return acc;
    }, {});

    return Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([tag, count]) => ({
        tag,
        posts: count,
      }));
  }

  function buildFeedInsights(items) {
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;

    const tagCounts = items.reduce((acc, post) => {
      const tags = post.content?.match(/#[\w]+/g) || [];
      tags.forEach((tag) => {
        const normalized = tag.trim();
        acc[normalized] = (acc[normalized] || 0) + 1;
      });
      return acc;
    }, {});

    const creatorMap = items.reduce((acc, post) => {
      const username = post.user?.username || "Unknown";
      acc[username] = acc[username] || {
        username,
        posts: 0,
        likes: 0,
      };
      acc[username].posts += 1;
      acc[username].likes += post.likeCount || 0;
      return acc;
    }, {});

    const trendingTags = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([tag, count]) => ({
        tag,
        posts: count,
      }));

    return {
      totalPosts: items.length,
      mediaPosts: items.filter((post) => post.imageUrl || post.videoUrl).length,
      totalLikes: items.reduce((sum, post) => sum + (post.likeCount || 0), 0),
      totalComments: items.reduce((sum, post) => sum + (post.commentCount || 0), 0),
      freshPosts: items.filter((post) => {
        if (!post.createdAt) return false;
        return new Date(post.createdAt).getTime() >= oneDayAgo;
      }).length,
      trendingTags,
      allTagsMap: tagCounts,
      topCreators: Object.values(creatorMap)
        .sort((a, b) => b.likes + b.posts - (a.likes + a.posts))
        .slice(0, 4),
    };
  }

  const fetchFeed = async () => {
    setLoading(true);
    setError(null);

    try {
      let response;

      if (onlyUserPosts) {
        response = await postAPI.getMyPosts(0, 20);
      } else if (feedType === "trending") {
        response = await postAPI.getTrending(0, 20);
      } else {
        response = await postAPI.getFeed(0, 20);
      }

      // Response is double-wrapped: response.data.data.data.content
      const rawData = response.data?.data?.data;
      const content = rawData?.content || response.data?.data?.content || [];

      let validPosts = content.filter((p) => p?.id);

      validPosts = validPosts.map((post) => {
        const username =
          post.username || (post.userId ? `User_${post.userId}` : "Unknown");
        return {
          ...post,
          liked: post.isLikedByCurrentUser || post.likedByCurrentUser || false,
          user: {
            id: post.userId,
            username,
          },
        };
      });

      if (!isMounted.current) return;

      setPosts(validPosts);
      onFeedStatsChange?.(buildFeedInsights(validPosts));

      if (profileData?.id && validPosts.length > 0) {
        const statusMap = {};
        await Promise.allSettled(
          validPosts.map(async (post) => {
            if (post.user?.id && post.user.id !== currentUserId) {
              try {
                const res = await followAPI.isFollowing(
                  profileData.id,
                  post.user.id,
                );
                statusMap[post.user.id] = res.data?.isFollowing ?? false;
              } catch {
                statusMap[post.user.id] = false;
              }
            }
          }),
        );
        if (isMounted.current) {
          setFollowingStatus(statusMap);
        }
      }
    } catch (err) {
      if (isMounted.current) {
        setError(err.message || "Failed to load feed");
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    isMounted.current = true;
    const timeoutId = window.setTimeout(() => {
      fetchFeed();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
      isMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feedType, refreshTrigger, profileData?.id]);

  const visiblePosts = [...posts]
    .filter((post) => {
      if (activeTopic) {
        return post.content?.toLowerCase().includes(activeTopic.toLowerCase());
      }

      if (sortMode === "media") {
        return Boolean(post.imageUrl || post.videoUrl);
      }

      return true;
    })
    .sort((a, b) => {
      if (sortMode === "popular") {
        return (b.likeCount || 0) - (a.likeCount || 0);
      }

      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });

  const handleLike = async (postId) => {
    const post = posts.find((p) => p.id === postId);
    if (!post || !currentUserId || likeLoading[postId]) return;

    setLikeLoading((prev) => ({ ...prev, [postId]: true }));
    const previousLiked = post.liked;
    const previousCount = post.likeCount || 0;

    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              liked: !p.liked,
              likeCount: (p.likeCount || 0) + (p.liked ? -1 : 1),
            }
          : p,
      ),
    );

    try {
      if (!previousLiked) {
        await likeAPI.addLike(currentUserId, postId);
      } else {
        await likeAPI.removeLike(currentUserId, postId);
      }
      try {
        const countResponse = await likeAPI.getLikeCount(postId);
        const newCount = countResponse.data?.likeCount ?? 0;
        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId ? { ...p, likeCount: newCount } : p,
          ),
        );
      } catch (countError) {
        console.error("Error fetching like count:", countError);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? { ...p, liked: previousLiked, likeCount: previousCount }
            : p,
        ),
      );
      if (error.response?.status === 401) {
        toast.error("Please login to like posts");
      } else {
        toast.error("Failed to like/unlike post. Please try again.");
      }
    } finally {
      setLikeLoading((prev) => ({ ...prev, [postId]: false }));
    }
  };

  const handleFollowToggle = async (authorId) => {
    if (!authorId || !profileData?.id) return;
    setFollowLoading((prev) => ({ ...prev, [authorId]: true }));
    try {
      if (followingStatus[authorId]) {
        await followAPI.unfollowUser(profileData.id, authorId);
      } else {
        await followAPI.followUser(profileData.id, authorId);
      }
      setFollowingStatus((prev) => ({ ...prev, [authorId]: !prev[authorId] }));
    } catch {
      toast.error("Follow failed");
    } finally {
      setFollowLoading((prev) => ({ ...prev, [authorId]: false }));
    }
  };

  const executeDeletePost = async (postId) => {
    try {
      await postAPI.deletePost(postId);
      setPosts((prev) => prev.filter((p) => p.id !== postId));
      toast.success("Post deleted successfully");
    } catch (err) {
      console.error("Failed to delete post", err);
      toast.error(err.response?.data?.message || "Failed to delete post");
    }
  };

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
              {[
                { id: "latest", label: "Latest" },
                { id: "popular", label: "Popular" },
                { id: "media", label: "Media" },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSortMode(item.id)}
                  className={`rounded-lg px-3 py-2 text-xs font-bold transition ${
                    sortMode === item.id
                      ? "bg-white text-slate-950 shadow-sm"
                      : "text-slate-500 hover:text-slate-950"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          {activeTopic && (
            <div className="border-t border-slate-100 px-5 py-3">
              <button
                type="button"
                onClick={onTopicClear}
                className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 transition hover:bg-slate-200"
              >
                Clear topic filter
              </button>
            </div>
          )}
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
                              className="flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
                            >
                              <Edit size={14} />
                              Edit
                            </button>

                            <button
                              onClick={() => setPostToDelete(post.id)}
                              className="flex h-9 items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 text-xs font-bold text-red-600 hover:bg-red-100 transition"
                            >
                              <Trash2 size={14} />
                              Delete
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
                          disabled={likeLoading[post.id]}
                          className={`social-action ${
                            post.liked
                              ? "bg-red-50 text-red-500"
                              : "text-slate-500 hover:bg-red-50 hover:text-red-500"
                          } ${likeLoading[post.id] ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                          {likeLoading[post.id] ? (
                            <Loader size={16} className="animate-spin" />
                          ) : (
                            <Heart
                              size={18}
                              className={post.liked ? "fill-red-500" : ""}
                            />
                          )}
                          <span>{post.likeCount || 0}</span>
                        </button>

                        <CommentSection
                          postId={post.id}
                          currentUserId={currentUserId}
                          onCommentAdded={() => {}}
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
                {activeTopic ? `No posts for ${activeTopic}` : "No posts yet"}
              </h3>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                {activeTopic
                  ? "Start this topic yourself or clear the filter to return to the full feed."
                  : "Start the conversation by sharing a thought, photo, or update with your community."}
              </p>
              <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={() =>
                    onPromptSelect?.(
                      activeTopic
                        ? `Starting a conversation about ${activeTopic}: `
                        : "Here is something worth sharing: ",
                    )
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-extrabold text-white transition hover:bg-slate-800"
                >
                  <PlusCircle size={16} />
                  Create post
                </button>
                {activeTopic && (
                  <button
                    type="button"
                    onClick={onTopicClear}
                    className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-extrabold text-slate-700 transition hover:bg-slate-50"
                  >
                    Clear filter
                  </button>
                )}
              </div>
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
          onUpdate={(updated) => {
            const actualUpdated = updated?.data ? updated.data : updated;
            setPosts((prev) =>
              prev.map((p) => {
                if (p.id === actualUpdated.id) {
                  return {
                    ...p,
                    ...actualUpdated,
                    content: actualUpdated.content,
                    imageUrl: actualUpdated.imageUrl,
                    user: p.user, // Keep the nested user metadata intact
                  };
                }
                return p;
              }),
            );
            toast.success("Post updated successfully");
          }}
        />
      )}

      {/* Modern, High-Fidelity Delete Confirmation Modal */}
      <AnimatePresence>
        {postToDelete && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPostToDelete(null)}
              className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 12 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl"
            >
              <div className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600 ring-4 ring-red-100/50">
                  <Trash2 size={22} />
                </div>

                <h3 className="mt-4 text-lg font-black text-slate-950">
                  Delete Post?
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Are you sure you want to permanently delete this post? This action is permanent and cannot be undone.
                </p>
              </div>

              <div className="mt-6 flex flex-col gap-2.5 sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={async () => {
                    const postId = postToDelete;
                    setPostToDelete(null);
                    await executeDeletePost(postId);
                  }}
                  className="inline-flex w-full items-center justify-center rounded-xl bg-red-600 px-4 py-2.5 text-sm font-extrabold text-white shadow-sm transition hover:bg-red-500 sm:w-auto"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => setPostToDelete(null)}
                  className="inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-extrabold text-slate-700 shadow-sm transition hover:bg-slate-50 sm:w-auto"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
