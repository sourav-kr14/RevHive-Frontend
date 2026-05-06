import { motion } from "framer-motion";
import { Heart, Share2, AlertCircle } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { postAPI, followAPI } from "../../services/api";
import CommentSection from "./CommentSection";
import EditPostModal from "./EditPostModal";

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

  const isMounted = useRef(true);

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

      const validPosts = (response.data?.content || []).filter((p) => p?.id);

      if (!isMounted.current) return;

      setPosts(validPosts);

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

  if (loading) {
    return <div className="text-center py-16 text-gray-500">Loading...</div>;
  }

  if (error) {
    return (
      <div
        className="bg-red-50 border border-red-200 
        rounded-2xl p-6 text-center text-red-500"
      >
        <AlertCircle className="mx-auto mb-2" />
        {error}
      </div>
    );
  }

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {/* Title */}
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-black p-2">
            {onlyUserPosts
              ? "My Posts"
              : feedType === "trending"
                ? "Trending Posts"
                : "For You"}
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Explore the latest updates from the community
          </p>
        </div>

        {/* Feed */}
        <div className="flex flex-col gap-5">
          {posts.length > 0 ? (
            posts.map((post) => (
              <motion.div
                key={post.id}
                whileHover={{ y: -2 }}
                className="bg-white border border-gray-200 
                rounded-3xl p-4 sm:p-6 shadow-sm hover:shadow-lg transition-all"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-3 min-w-0">
                    <div
                      className="w-11 h-11 rounded-full 
                      bg-black text-white flex items-center 
                      justify-center text-sm font-semibold shrink-0"
                    >
                      {post.user?.username?.slice(0, 2)?.toUpperCase() || "NA"}
                    </div>

                    <div className="min-w-0">
                      <p
                        className="text-sm sm:text-base 
                        font-semibold text-black truncate"
                      >
                        @{post.user?.username}
                      </p>

                      <p className="text-xs text-gray-500">
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
                      className={`px-4 py-1.5 text-xs sm:text-sm rounded-full font-medium transition
                        ${
                          followingStatus[post.user.id]
                            ? "bg-gray-100 text-black border border-gray-300"
                            : "bg-black text-white"
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
                  className="mt-4 text-sm sm:text-base 
                  text-gray-800 leading-relaxed"
                >
                  {post.content}
                </p>

                {/* Image */}
                {post.imageUrl && (
                  <img
                    src={post.imageUrl}
                    alt=""
                    className="mt-4 rounded-2xl max-h-[500px]
                    object-cover border border-gray-200 w-full"
                  />
                )}

                {/* Actions */}
                <div
                  className="flex items-center gap-6 mt-5 
                  pt-4 border-t border-gray-200 text-gray-600"
                >
                  <button
                    onClick={() => handleLike(post.id)}
                    className="flex items-center gap-2 hover:text-red-500 transition"
                  >
                    <Heart
                      size={18}
                      className={post.liked ? "text-red-500 fill-red-500" : ""}
                    />

                    <span className="text-sm">{post.likeCount || 0}</span>
                  </button>

                  <CommentSection
                    postId={post.id}
                    currentUserId={profileData?.id}
                  />

                  <button className="hover:text-black transition">
                    <Share2 size={18} />
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div
              className="bg-white border border-gray-200 
              rounded-3xl p-12 text-center text-gray-500"
            >
              No posts yet
            </div>
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
