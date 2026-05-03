import { motion } from "framer-motion";
import { Heart, Share2, MoreVertical, AlertCircle } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { postAPI, followAPI } from "../../services/api";
import CommentSection from "./CommentSection";
import EditPostModal from "./EditPostModal";

export default function UserFeed({ profileData, refreshTrigger }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedType, setFeedType] = useState("feed");
  const [menuOpen, setMenuOpen] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [followingStatus, setFollowingStatus] = useState({});
  const [followLoading, setFollowLoading] = useState({});

  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    if (profileData?.id) fetchFeed();

    return () => {
      isMounted.current = false;
    };
  }, [feedType, refreshTrigger, profileData?.id]);

  const fetchFeed = async () => {
    setLoading(true);
    setError(null);

    try {
      let response;

      switch (feedType) {
        case "trending":
          response = await postAPI.getTrending(0, 20);
          break;
        case "my":
          response = await postAPI.getMyPosts(0, 20);
          break;
        default:
          response = await postAPI.getFeed(0, 20);
      }

      const validPosts = (response.data.content || []).filter((p) => p?.id);

      if (!isMounted.current) return;
      setPosts(validPosts);

      // ✅ optimized follow status
      if (profileData?.id) {
        const statusMap = {};

        await Promise.all(
          validPosts.map(async (post) => {
            if (post.user?.id && post.user.id !== profileData.id) {
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

        if (isMounted.current) setFollowingStatus(statusMap);
      }
    } catch (err) {
      if (isMounted.current) setError(err.message || "Failed to load feed");
    } finally {
      if (isMounted.current) setLoading(false);
    }
  };

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

  const handleFollowToggle = async (authorId) => {
    if (!authorId || !profileData?.id) return;

    setFollowLoading((prev) => ({ ...prev, [authorId]: true }));

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
      setFollowLoading((prev) => ({ ...prev, [authorId]: false }));
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Delete this post?")) return;

    try {
      await postAPI.deletePost(postId);
      setPosts((prev) => prev.filter((p) => p.id !== postId));
      setMenuOpen(null);
    } catch {
      alert("Delete failed");
    }
  };

  if (loading)
    return <div className="text-center py-16 text-gray-400">Loading...</div>;

  if (error)
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center text-red-400">
        <AlertCircle className="mx-auto mb-2" />
        {error}
      </div>
    );

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {/* Tabs */}
        <div className="flex gap-2 mb-5">
          {["feed", "trending", "my"].map((type) => (
            <button
              key={type}
              onClick={() => setFeedType(type)}
              className={`px-4 py-1.5 text-sm rounded-lg transition ${
                feedType === type
                  ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                  : "bg-white/5 text-gray-400 hover:text-white"
              }`}
            >
              {type === "feed"
                ? "For You"
                : type === "trending"
                  ? "Trending"
                  : "My Posts"}
            </button>
          ))}
        </div>

        {/* Posts */}
        <div className="flex flex-col gap-4">
          {posts.length > 0 ? (
            posts.map((post) => (
              <motion.div
                key={post.id}
                className="bg-white/5 backdrop-blur-xl border border-white/10 
              rounded-2xl p-5"
              >
                {/* Header */}
                <div className="flex justify-between">
                  <div className="flex gap-3">
                    <div
                      className="w-10 h-10 rounded-full 
                  bg-gradient-to-br from-purple-500 to-blue-500 
                  flex items-center justify-center text-white text-sm font-semibold"
                    >
                      {post.user?.username?.slice(0, 2)?.toUpperCase() || "NA"}
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-white">
                        @{post.user?.username}
                      </p>
                      <p className="text-xs text-gray-400">
                        {post.createdAt &&
                          new Date(post.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Follow */}
                  {post.user?.id && post.user.id !== profileData?.id && (
                    <button
                      disabled={followLoading[post.user.id]}
                      onClick={() => handleFollowToggle(post.user.id)}
                      className="px-3 py-1 text-xs rounded-md bg-gradient-to-r from-purple-500 to-blue-500 text-white disabled:opacity-50"
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
                <p className="mt-3 text-sm text-gray-300">{post.content}</p>

                {/* Actions */}
                <div className="flex gap-6 mt-4 pt-3 border-t border-white/10 text-gray-400">
                  <button onClick={() => handleLike(post.id)}>
                    <Heart
                      size={16}
                      className={post.liked ? "text-red-500 fill-red-500" : ""}
                    />
                  </button>

                  <CommentSection
                    postId={post.id}
                    currentUserId={profileData?.id}
                  />

                  <Share2 size={16} />
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-16 text-gray-500">No posts yet</div>
          )}
        </div>
      </motion.div>

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
