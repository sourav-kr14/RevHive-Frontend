// components/userdashboard/UserFeed.jsx
import { motion } from "framer-motion";
import { Heart, Share2, MoreVertical, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { postAPI, followAPI } from "../../services/api";
import CommentSection from "./CommentSection";
import EditPostModal from "./EditPostModal";

export default function DashboardFeed({ profileData, refreshTrigger }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedType, setFeedType] = useState("feed");
  const [menuOpen, setMenuOpen] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [followingStatus, setFollowingStatus] = useState({});

  useEffect(() => {
    fetchFeed();
  }, [feedType, refreshTrigger]);

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

      const postsData = response.data.content || [];

      // ✅ FIX: remove invalid posts
      const validPosts = postsData.filter((p) => p && p.id);

      setPosts(validPosts);

      if (profileData?.id) {
        for (const post of validPosts) {
          if (post.user?.id && post.user.id !== profileData.id) {
            const followCheck = await followAPI.isFollowing(
              profileData.id,
              post.user.id,
            );
            setFollowingStatus((prev) => ({
              ...prev,
              [post.user.id]: followCheck.data.isFollowing,
            }));
          }
        }
      }
    } catch (err) {
      setError(err.message || "Failed to load feed");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    try {
      if (post.liked) await postAPI.unlikePost(postId);
      else await postAPI.likePost(postId);

      setPosts(
        posts.map((p) =>
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

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Delete this post?")) return;

    try {
      await postAPI.deletePost(postId);
      setPosts(posts.filter((p) => p.id !== postId));
      setMenuOpen(null);
    } catch {
      alert("Delete failed");
    }
  };

  const handleFollowToggle = async (authorId) => {
    if (!authorId) return; // ✅ FIX

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
      alert("Follow update failed");
    }
  };

  const handleUpdatePost = (updatedPost) => {
    setPosts(posts.map((p) => (p.id === updatedPost.id ? updatedPost : p)));
  };

  if (loading)
    return (
      <div className="text-center py-16 text-gray-500">Loading feed...</div>
    );

  if (error)
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <AlertCircle className="mx-auto mb-2 text-red-500" />
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchFeed}
          className="mt-3 px-4 py-2 bg-gray-900 text-white rounded-md"
        >
          Retry
        </button>
      </div>
    );

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {/* Tabs */}
        <div className="flex gap-2 mb-4 border-b border-gray-200 pb-2">
          {["feed", "trending", "my"].map((type) => (
            <button
              key={type}
              onClick={() => setFeedType(type)}
              className={`px-3 py-1.5 text-sm rounded-md ${
                feedType === type
                  ? "bg-gray-900 text-white"
                  : "text-gray-600 hover:bg-gray-100"
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
        {posts.length > 0 ? (
          <div className="flex flex-col gap-4">
            {posts.map((post) => (
              <motion.div
                key={post.id}
                className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
              >
                {/* Header */}
                <div className="flex justify-between">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold">
                      {post.user?.username?.slice(0, 2)?.toUpperCase() || "NA"}
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        @{post.user?.username || "unknown"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {post.createdAt
                          ? new Date(post.createdAt).toLocaleString()
                          : ""}
                      </p>
                    </div>
                  </div>

                  {post.user?.id && post.user.id !== profileData?.id && (
                    <button
                      onClick={() => handleFollowToggle(post.user?.id)}
                      className={`px-3 py-1 text-xs rounded-md ${
                        followingStatus[post.user?.id]
                          ? "bg-gray-100"
                          : "bg-gray-900 text-white"
                      }`}
                    >
                      {followingStatus[post.user?.id] ? "Following" : "Follow"}
                    </button>
                  )}

                  {post.user?.id === profileData?.id && (
                    <div className="relative">
                      <button
                        onClick={() =>
                          setMenuOpen(menuOpen === post.id ? null : post.id)
                        }
                      >
                        <MoreVertical size={16} />
                      </button>

                      {menuOpen === post.id && (
                        <div className="absolute right-0 mt-2 bg-white border rounded-md shadow-md">
                          <button
                            onClick={() => setEditingPost(post)}
                            className="block px-3 py-2 text-sm hover:bg-gray-100"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            className="block px-3 py-2 text-sm text-red-500 hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Content */}
                <p className="mt-3 text-sm text-gray-700">{post.content}</p>

                {post.imageUrl && (
                  <img
                    src={post.imageUrl}
                    className="mt-3 rounded-lg max-h-80 object-cover border"
                  />
                )}

                {/* Actions */}
                <div className="flex gap-5 mt-3 pt-3 border-t border-gray-200">
                  <button onClick={() => handleLike(post.id)}>
                    <Heart size={16} fill={post.liked ? "red" : "none"} />
                  </button>

                  <CommentSection
                    postId={post.id}
                    currentUserId={profileData?.id}
                  />

                  <button>
                    <Share2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border rounded-xl bg-white">
            No posts yet
          </div>
        )}
      </motion.div>

      {editingPost && (
        <EditPostModal
          post={editingPost}
          onClose={() => setEditingPost(null)}
          onUpdate={handleUpdatePost}
        />
      )}
    </>
  );
}
