// components/userdashboard/UserFeed.jsx
import { motion } from "framer-motion";
import { Sparkles, Heart, MessageCircle, Share2, MoreVertical, Edit2, Trash2, UserPlus, UserCheck, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { postAPI, followAPI } from "../../services/api";
import CommentSection from "./CommentSection";
import EditPostModal from "./EditPostModal";
import FollowButton from "../common/FollowButton";

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
      
      // Handle the response properly
      const postsData = response.data.content || [];
      setPosts(postsData);
      
      // Check follow status for each post's author
      if (profileData?.id) {
        for (const post of postsData) {
          if (post.user?.id && post.user.id !== profileData.id) {
            try {
              const followCheck = await followAPI.isFollowing(profileData.id, post.user.id);
              setFollowingStatus(prev => ({
                ...prev,
                [post.user.id]: followCheck.data.isFollowing
              }));
            } catch (error) {
              console.error("Error checking follow status:", error);
            }
          }
        }
      }
      
    } catch (error) {
      console.error("Error fetching feed:", error);
      setError(error.message || "Failed to load feed");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      const post = posts.find(p => p.id === postId);
      if (post?.liked) {
        await postAPI.unlikePost(postId);
      } else {
        await postAPI.likePost(postId);
      }
      
      setPosts(posts.map(p => 
        p.id === postId 
          ? { ...p, liked: !p.liked, likeCount: (p.likeCount || 0) + (p.liked ? -1 : 1) }
          : p
      ));
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await postAPI.deletePost(postId);
        setPosts(posts.filter(p => p.id !== postId));
        setMenuOpen(null);
      } catch (error) {
        console.error("Error deleting post:", error);
        alert("Failed to delete post");
      }
    }
  };

  const handleFollowToggle = async (authorId) => {
    if (!profileData?.id) return;
    
    try {
      if (followingStatus[authorId]) {
        await followAPI.unfollowUser(profileData.id, authorId);
        setFollowingStatus({ ...followingStatus, [authorId]: false });
      } else {
        await followAPI.followUser(profileData.id, authorId);
        setFollowingStatus({ ...followingStatus, [authorId]: true });
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
      alert("Failed to update follow status");
    }
  };

  const handleUpdatePost = (updatedPost) => {
    setPosts(posts.map(p => p.id === updatedPost.id ? updatedPost : p));
  };

  // Loading State
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-gray-400">Loading feed...</div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center">
        <AlertCircle className="mx-auto mb-3 text-red-400" size={48} />
        <h3 className="text-lg font-semibold text-red-400 mb-2">Something went wrong</h3>
        <p className="text-gray-400 mb-4">{error}</p>
        <button
          onClick={fetchFeed}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:shadow-lg transition-all"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Feed Tabs */}
        <div className="flex gap-2 mb-5 border-b border-white/10 pb-3">
          <button
            onClick={() => setFeedType("feed")}
            className={`px-4 py-2 rounded-lg text-sm transition-all ${
              feedType === "feed" 
                ? "bg-blue-600/20 text-blue-400 border-b-2 border-blue-400" 
                : "text-gray-400 hover:text-white"
            }`}
          >
            For You
          </button>
          <button
            onClick={() => setFeedType("trending")}
            className={`px-4 py-2 rounded-lg text-sm transition-all ${
              feedType === "trending" 
                ? "bg-purple-600/20 text-purple-400 border-b-2 border-purple-400" 
                : "text-gray-400 hover:text-white"
            }`}
          >
            Trending
          </button>
          <button
            onClick={() => setFeedType("my")}
            className={`px-4 py-2 rounded-lg text-sm transition-all ${
              feedType === "my" 
                ? "bg-green-600/20 text-green-400 border-b-2 border-green-400" 
                : "text-gray-400 hover:text-white"
            }`}
          >
            My Posts
          </button>
        </div>

        {/* Posts */}
        {posts.length > 0 ? (
          <div className="flex flex-col gap-4">
            {posts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all"
              >
                {/* Post Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold">
                      {post.user?.username?.slice(0, 2).toUpperCase() || "US"}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-white">@{post.user?.username}</p>
                        <p className="text-xs text-gray-500">
                          {post.createdAt ? new Date(post.createdAt).toLocaleString() : "Recently"}
                        </p>
                      </div>
                      <p className="text-gray-300 mt-2 whitespace-pre-wrap">{post.content}</p>
                      {post.imageUrl && (
                        <img 
                          src={post.imageUrl} 
                          alt="Post" 
                          className="mt-3 rounded-xl max-h-96 object-cover"
                          onError={(e) => e.target.style.display = 'none'}
                        />
                      )}
                    </div>
                  </div>

                  {/* Follow Button for other users */}
                  {post.user?.id && post.user.id !== profileData?.id && (
                    <button
                      onClick={() => handleFollowToggle(post.user.id)}
                      className={`px-3 py-1 rounded-lg text-xs flex items-center gap-1 transition-all ${
                        followingStatus[post.user.id]
                          ? "bg-white/10 text-gray-300 hover:bg-white/20"
                          : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg"
                      }`}
                    >
                      {followingStatus[post.user.id] ? (
                        <>
                          <UserCheck size={12} />
                          Following
                        </>
                      ) : (
                        <>
                          <UserPlus size={12} />
                          Follow
                        </>
                      )}
                    </button>
                  )}

                  {/* ✅ FOLLOW BUTTON - Add this right here */}
                  {post.user?.id !== profileData?.id && (
                    <FollowButton
                      userId={post.user?.id}
                      currentUserId={profileData?.id}
                      onFollowChange={() => {
                        // Optional: Refresh stats or feed without page reload
                        fetchFeed();
                      }}
                    />
                  )}

                  {/* Edit/Delete Menu for own posts */}
                  {post.user?.id === profileData?.id && (
                    <div className="relative">
                      <button
                        onClick={() => setMenuOpen(menuOpen === post.id ? null : post.id)}
                        className="p-2 rounded-lg hover:bg-white/10"
                      >
                        <MoreVertical size={16} />
                      </button>
                      {menuOpen === post.id && (
                        <div className="absolute right-0 mt-2 w-40 bg-gray-800 border border-white/10 rounded-lg shadow-xl z-10">
                          <button
                            onClick={() => {
                              setEditingPost(post);
                              setMenuOpen(null);
                            }}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-white/10 flex items-center gap-2"
                          >
                            <Edit2 size={14} />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2"
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Post Actions */}
                <div className="flex items-center gap-6 mt-4 pt-3 border-t border-white/10">
                  <button 
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-2 transition-colors ${
                      post.liked ? "text-red-400" : "text-gray-400 hover:text-red-400"
                    }`}
                  >
                    <Heart size={18} fill={post.liked ? "currentColor" : "none"} />
                    <span className="text-sm">{post.likeCount || 0}</span>
                  </button>
                  
                  {post.id && profileData?.id && (
                    <CommentSection 
                      postId={post.id}
                      currentUserId={profileData.id}
                      onCommentAdded={() => fetchFeed()}
                    />
                  )}
                  
                  <button className="flex items-center gap-2 text-gray-400 hover:text-green-400 transition-colors">
                    <Share2 size={18} />
                    <span className="text-sm">{post.shareCount || 0}</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <EmptyState feedType={feedType} />
        )}
      </motion.div>

      {/* Edit Post Modal */}
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

const EmptyState = ({ feedType }) => (
  <div className="text-center py-20 bg-white/5 backdrop-blur-xl border border-white/10 border-dashed rounded-2xl">
    <div className="text-6xl mb-4">🐝</div>
    <p className="text-lg font-semibold text-gray-200 mb-1">
      {feedType === "my" ? "No posts yet" : "The hive is quiet"}
    </p>
    <p className="text-gray-500 text-sm">
      {feedType === "my" 
        ? "Share your first post to get started" 
        : "Follow creators or share your first post"}
    </p>
  </div>
);