import { motion } from "framer-motion";
import { Heart, AlertCircle, MoreHorizontal, Bookmark } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { postAPI, followAPI, bookmarkAPI } from "@/services/api";

import CommentSection from "./CommentSection";
import EditPostModal from "./EditPostModal";
import ReportModal from "../Reportmodal";

export default function UserFeed({
  profileData,
  refreshTrigger,
  onlyUserPosts = false,
  feedType = "forYou",
}) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editingPost, setEditingPost] = useState(null);

  const [followingStatus, setFollowingStatus] = useState({});

  const [followLoading, setFollowLoading] = useState({});

  const [showReport, setShowReport] = useState(false);

  const [selectedPost, setSelectedPost] = useState(null);

  const isMounted = useRef(true);
  const currentUserId = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"))?.id;
    } catch {
      return null;
    }
  })();

  /* ---------------- Bookmark ---------------- */

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
          p.id === postId
            ? {
                ...p,
                bookmarked: !p.bookmarked,
              }
            : p,
        ),
      );
    } catch (err) {
      console.error(err);
    }
  };

  /* ---------------- Fetch ---------------- */

  useEffect(() => {
    isMounted.current = true;

    if (profileData?.id) {
      fetchFeed();
    }

    return () => {
      isMounted.current = false;
    };
  }, [feedType, refreshTrigger, profileData?.id]);

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

      let validPosts = (response.data?.content || []).filter((p) => p?.id);

      validPosts = validPosts.map((post) => ({
        ...post,
        user: {
          id: post.user?.id,
          username: post.user?.username,
        },
      }));

      validPosts = validPosts.map((post) => {
        const author = post.user || post.author || post.creator || null;

        const userId = author?.id ?? post.userId ?? post.authorId ?? null;

        const username =
          author?.username ||
          author?.userName ||
          author?.name ||
          post.username ||
          (userId ? `User_${userId}` : "Unknown");

        return {
          ...post,
          user: {
            ...(author || {}),
            id: userId,
            username,
          },
        };
      });

      if (!isMounted.current) return;

      setPosts(validPosts);

      if (profileData?.id) {
        const statusMap = {};

        await Promise.all(
          validPosts.map(async (post) => {
            if (post.user?.id && post.user.id !== currentUserId) {
              try {
                const res = await followAPI.isFollowing(
                  profileData.id,
                  post.user.id,
                );

                statusMap[post.user.id] = res.data.isFollowing;
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

  /* ---------------- Like ---------------- */

  const handleLike = async (postId) => {
    const post = posts.find((p) => p.id === postId);

    if (!post) return;

    try {
      post.liked
        ? await postAPI.unlikePost(postId)
        : await postAPI.likePost(postId);

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
    } catch {}
  };

  /* ---------------- Follow ---------------- */

  const handleFollowToggle = async (authorId) => {
    if (!authorId || !profileData?.id) return;

    setFollowLoading((prev) => ({
      ...prev,
      [authorId]: true,
    }));

    try {
      if (followingStatus[authorId]) {
        await followAPI.unfollowUser(profileData.id, authorId);
      } else {
        await followAPI.followUser(profileData.id, authorId);
      }

      setFollowingStatus((prev) => ({
        ...prev,
        [authorId]: !prev[authorId],
      }));
    } catch {
      alert("Follow failed");
    } finally {
      setFollowLoading((prev) => ({
        ...prev,
        [authorId]: false,
      }));
    }
  };

  /* ---------------- States ---------------- */

  if (loading) {
    return <div className="text-center py-16 text-gray-500">Loading...</div>;
  }

  if (error) {
    return (
      <div
        className="
        bg-red-50 border border-red-200
        rounded-3xl p-6 text-center text-red-500
        "
      >
        <AlertCircle className="mx-auto mb-2" />
        {error}
      </div>
    );
  }

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {/* Header */}
        <div className="mb-7 px-1">
          <h2
            className=" pt-4
            text-3xl sm:text-4xl
            font-bold tracking-tight
            text-gray-900
            "
          >
            {onlyUserPosts
              ? "My Posts"
              : feedType === "trending"
                ? "Trending Posts"
                : "For You"}
          </h2>

          <p className="text-sm text-gray-500 mt-2">
            Explore the latest updates from the community
          </p>
        </div>

        {/* Feed */}
        <div className="flex flex-col gap-6">
          {posts.length > 0 ? (
            posts.map((post) => (
              <motion.div
                key={post.id}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.25 }}
                className="
                group
                bg-white/95 backdrop-blur-xl
                border border-gray-100
                rounded-[32px]
                p-5 sm:p-6
                shadow-sm hover:shadow-2xl
                transition-all duration-500
                "
              >
                {/* Top */}
                <div className="flex items-start justify-between gap-4">
                  {/* User */}
                  <div className="flex gap-3 min-w-0">
                    <div
                      className="
                      w-12 h-12 rounded-2xl
                      bg-gradient-to-br
                      from-orange-400
                      via-pink-500
                      to-red-500
                      text-white
                      flex items-center
                      justify-center
                      text-sm font-bold
                      shrink-0 shadow-lg
                      "
                    >
                      {post.user?.username?.slice(0, 2)?.toUpperCase() || "NA"}
                    </div>

                    <div className="min-w-0">
                      <p
                        className="
                        text-sm sm:text-base
                        font-semibold
                        text-gray-900
                        truncate
                        flex items-center gap-2
                        "
                      >
                        @{post.user?.username}
                        <span
                          className="
                          px-2 py-0.5 rounded-full
                          bg-orange-100
                          text-orange-500
                          text-[10px] font-semibold
                          "
                        >
                          ACTIVE
                        </span>
                      </p>

                      <p className="text-xs text-gray-500 mt-1">
                        {post.createdAt &&
                          new Date(post.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Follow */}
                  {post.user?.id &&
                    Number(post.user.id) !== Number(currentUserId) && (
                      <button
                        disabled={followLoading[post.user.id]}
                        onClick={() => handleFollowToggle(post.user.id)}
                        className={`px-4 py-2 text-xs sm:text-sm rounded-2xl font-semibold transition-all duration-300
                        ${
                          followingStatus[post.user.id]
                            ? `
                              bg-gray-100
                              text-gray-700
                              hover:bg-gray-200
                              `
                            : `
                              bg-gradient-to-r
                              from-blue-500
                              to-blue-800
                              text-white
                              hover:scale-105
                              hover:shadow-lg
                              hover:shadow-orange-200
                              `
                        }`}
                      >
                        {followLoading[post.user.id]
                          ? "..."
                          : followingStatus[post.user.id]
                            ? "Following"
                            : "Follow"}
                      </button>
                    )}
                </div>

                {/* Content */}
                <p
                  className="
                  mt-5 text-sm sm:text-[15px]
                  text-gray-700 leading-relaxed
                  "
                >
                  {post.content}
                </p>

                {/* Image */}
                {post.imageUrl && (
                  <img
                    src={post.imageUrl}
                    alt=""
                    className="
                    mt-5 rounded-[28px]
                    max-h-[520px]
                    object-cover
                    border border-gray-100
                    w-full
                    transition-all duration-500
                    group-hover:scale-[1.01]
                    "
                  />
                )}

                {/* Bottom */}
                <div
                  className="
                  flex items-center justify-between
                  mt-5 pt-5
                  border-t border-gray-100
                  "
                >
                  {/* Left */}
                  <div className="flex items-center gap-5 text-gray-500">
                    {/* Like */}
                    <button
                      onClick={() => handleLike(post.id)}
                      className="
                      flex items-center gap-2
                      text-gray-500
                      hover:text-red-500
                      transition-all duration-300
                      group/like
                      "
                    >
                      <Heart
                        size={19}
                        className={`transition-all duration-300 ${
                          post.liked
                            ? "text-red-500 fill-red-500 scale-110"
                            : "group-hover/like:scale-125"
                        }`}
                      />

                      <span className="text-sm font-medium">
                        {post.likeCount || 0}
                      </span>
                    </button>

                    {/* Comments */}
                    <div className="flex items-center">
                      <CommentSection
                        postId={post.id}
                        currentUserId={currentUserId}
                      />
                    </div>
                  </div>

                  {/* Right */}
                  <div className="flex items-center gap-2">
                    {/* Bookmark */}
                    <button
                      onClick={() => handleBookmark(post.id)}
                      className="
                      p-2.5 rounded-2xl
                      hover:bg-orange-50
                      transition-all duration-300
                      hover:scale-110
                      "
                    >
                      <Bookmark
                        size={20}
                        className={`transition-all duration-300 ${
                          post.bookmarked
                            ? "fill-orange-500 text-orange-500"
                            : "text-gray-500"
                        }`}
                      />
                    </button>

                    {/* Report */}
                    <button
                      onClick={() => {
                        setSelectedPost(post.id);
                        setShowReport(true);
                      }}
                      className="
                      p-2.5 rounded-2xl
                      hover:bg-gray-100
                      transition-all duration-300
                      hover:rotate-90
                      "
                    >
                      <MoreHorizontal size={20} className="text-gray-500" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div
              className="
              bg-white/90 backdrop-blur-xl
              border border-gray-100
              rounded-[32px]
              p-14 text-center
              shadow-sm
              "
            >
              <div
                className="
                w-16 h-16 mx-auto mb-5
                rounded-3xl
                bg-gradient-to-br
                from-orange-400
                to-pink-500
                flex items-center justify-center
                text-white text-2xl font-bold
                shadow-lg
                "
              ></div>

              <h3 className="text-lg font-semibold text-gray-900">
                No posts yet
              </h3>

              <p className="text-sm text-gray-500 mt-2">
                Start sharing something with the community
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Report */}
      <ReportModal
        isOpen={showReport}
        onClose={() => setShowReport(false)}
        targetType="POST"
        targetId={selectedPost}
      />

      {/* Edit */}
      {editingPost && (
        <EditPostModal
          post={editingPost}
          onClose={() => setEditingPost(null)}
          onUpdate={(updated) =>
            setPosts((prev) =>
              prev.map((p) => (p.id === updated.id ? updated : p)),
            )
          }
        />
      )}
    </>
  );
}
