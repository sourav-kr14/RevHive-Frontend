import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { postAPI, followAPI, bookmarkAPI, likeAPI } from "@/services/api";

const DashboardContext = createContext(null);

export function DashboardProvider({ children, profileData }) {
  const [posts, setPosts] = useState([]);
  const [feedType, setFeedType] = useState("forYou");
  const [activeTopic, setActiveTopic] = useState("");
  const [viewMode, setViewMode] = useState("latest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Follow states
  const [followingStatus, setFollowingStatus] = useState({});
  const [followingUsers, setFollowingUsers] = useState([]);
  const [loadingFollowing, setLoadingFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState({});
  const [likeLoading, setLikeLoading] = useState({});

  const isMounted = useRef(false);
  const followingStatusRef = useRef({});

  // Keep ref up to date
  followingStatusRef.current = followingStatus;

  const currentUserId = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user"))?.id;
    } catch {
      return null;
    }
  }, []);

  // Fetch followed users for the sidebar list & count
  const fetchFollowingUsers = useCallback(async () => {
    if (!profileData?.id) return;
    setLoadingFollowing(true);
    try {
      const response = await followAPI.getFollowing(profileData.id, 0, 100);
      const data = response.data?.data || response.data || [];
      setFollowingUsers(Array.isArray(data) ? data : []);

      // Update follow status map based on the fetched list
      const statusMap = {};
      data.forEach((user) => {
        if (user.id) {
          statusMap[user.id] = true;
        }
      });
      setFollowingStatus((prev) => ({ ...prev, ...statusMap }));
    } catch (err) {
      console.error("Error fetching following users:", err);
      setFollowingUsers([]);
    } finally {
      setLoadingFollowing(false);
    }
  }, [profileData?.id]);

  useEffect(() => {
    isMounted.current = true;
    fetchFollowingUsers();
    return () => {
      isMounted.current = false;
    };
  }, [fetchFollowingUsers]);

  // Fetch post feed from the backend
  const fetchFeed = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let response;
      if (feedType === "trending") {
        response = await postAPI.getTrending(0, 20);
      } else {
        // "forYou" or "following" feeds
        // Note: following feed will fetch general feed and filter locally in useMemo
        response = await postAPI.getFeed(0, 20);
      }

      const rawData = response.data?.data?.data;
      const content =
        rawData?.content ||
        response.data?.data?.content ||
        response.data?.content ||
        [];
      const validPosts = content
        .filter((p) => p?.id)
        .map((post) => {
          const username =
            post.username || (post.userId ? `User_${post.userId}` : "Unknown");
          return {
            ...post,
            liked: post.isLikedByCurrentUser || false,
            user: {
              id: post.userId,
              username,
            },
          };
        });

      if (!isMounted.current) return;
      setPosts(validPosts);

      // Check following status for each post author if not cached yet
      if (profileData?.id && validPosts.length > 0) {
        const currentStatus = followingStatusRef.current;
        const newStatuses = {};
        const authorsToFetch = [];

        validPosts.forEach((post) => {
          const authorId = post.user?.id;
          if (
            authorId &&
            authorId !== currentUserId &&
            currentStatus[authorId] === undefined
          ) {
            authorsToFetch.push(authorId);
          }
        });

        if (authorsToFetch.length > 0) {
          await Promise.allSettled(
            authorsToFetch.map(async (authorId) => {
              try {
                const res = await followAPI.isFollowing(
                  profileData.id,
                  authorId,
                );
                newStatuses[authorId] = res.data?.isFollowing ?? false;
              } catch {
                newStatuses[authorId] = false;
              }
            }),
          );
          if (isMounted.current) {
            setFollowingStatus((prev) => ({ ...prev, ...newStatuses }));
          }
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
  }, [feedType, refreshTrigger, profileData?.id, currentUserId]);

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  const searchPosts = useCallback(
    async (query) => {
      if (!query || !query.trim()) {
        await fetchFeed();
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const response = await postAPI.searchPosts(query);
        const rawData = response.data?.data?.data || response.data?.data;
        const content =
          rawData?.content ||
          response.data?.data?.content ||
          response.data?.content ||
          [];
        const validPosts = content
          .filter((p) => p?.id)
          .map((post) => {
            const username =
              post.username ||
              (post.userId ? `User_${post.userId}` : "Unknown");
            return {
              ...post,
              liked: post.isLikedByCurrentUser || false,
              user: {
                id: post.userId,
                username,
              },
            };
          });

        if (!isMounted.current) return;
        setPosts(validPosts);

        // Check following status for each post author if not cached yet
        if (profileData?.id && validPosts.length > 0) {
          const currentStatus = followingStatusRef.current;
          const newStatuses = {};
          const authorsToFetch = [];

          validPosts.forEach((post) => {
            const authorId = post.user?.id;
            if (
              authorId &&
              authorId !== currentUserId &&
              currentStatus[authorId] === undefined
            ) {
              authorsToFetch.push(authorId);
            }
          });

          if (authorsToFetch.length > 0) {
            await Promise.allSettled(
              authorsToFetch.map(async (authorId) => {
                try {
                  const res = await followAPI.isFollowing(
                    profileData.id,
                    authorId,
                  );
                  newStatuses[authorId] = res.data?.isFollowing ?? false;
                } catch {
                  newStatuses[authorId] = false;
                }
              }),
            );
            if (isMounted.current) {
              setFollowingStatus((prev) => ({ ...prev, ...newStatuses }));
            }
          }
        }
      } catch (err) {
        if (isMounted.current) {
          setError(err.message || "Failed to search posts");
        }
      } finally {
        if (isMounted.current) {
          setLoading(false);
        }
      }
    },
    [fetchFeed, profileData?.id, currentUserId],
  );

  // Filtered and sorted posts feed (Memoized)
  const filteredPosts = useMemo(() => {
    let result = [...posts];

    // Filter by Following feed locally
    if (feedType === "following") {
      result = result.filter(
        (post) =>
          followingStatus[post.user?.id] === true ||
          Number(post.user?.id) === Number(currentUserId),
      );
    }

    // Filter by selected hashtag topic
    if (activeTopic) {
      result = result.filter((post) => {
        const text = post.content || "";
        const tags = text.match(/#\w+/g) || [];
        return tags.some(
          (tag) => tag.toLowerCase() === activeTopic.toLowerCase(),
        );
      });
    }

    // Apply active viewMode tabs
    if (viewMode === "latest") {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (viewMode === "popular") {
      result = result
        .filter((post) => /#\w+/.test(post.content || ""))
        .sort((a, b) => {
          const scoreA = (a.likeCount || 0) + (a.commentCount || 0);
          const scoreB = (b.likeCount || 0) + (b.commentCount || 0);
          return scoreB - scoreA;
        });
    } else if (viewMode === "media") {
      result = result.filter((post) => post.imageUrl || post.videoUrl);
    }

    return result;
  }, [posts, feedType, activeTopic, viewMode, followingStatus, currentUserId]);

  // Dynamic Creator Pulse Analytics (calculated from visible filteredPosts)
  const feedInsights = useMemo(() => {
    const total = filteredPosts.length;
    const media = filteredPosts.filter((p) => p.imageUrl || p.videoUrl).length;
    const likes = filteredPosts.reduce((sum, p) => sum + (p.likeCount || 0), 0);
    const comments = filteredPosts.reduce(
      (sum, p) => sum + (p.commentCount || 0),
      0,
    );

    const now = new Date();
    const fresh = filteredPosts.filter((p) => {
      if (!p.createdAt) return false;
      const created = new Date(p.createdAt);
      const diffMs = now.getTime() - created.getTime();
      return diffMs >= 0 && diffMs <= 24 * 60 * 60 * 1000;
    }).length;

    // Extract and count trending hashtags dynamically from visible posts
    const tagsMap = {};
    filteredPosts.forEach((post) => {
      const text = post.content || "";
      const matches = text.match(/#\w+/g) || [];
      const uniqueTags = Array.from(
        new Set(matches.map((t) => t.toLowerCase())),
      );
      uniqueTags.forEach((tagLower) => {
        const originalTag = matches.find((m) => m.toLowerCase() === tagLower);
        if (tagsMap[tagLower]) {
          tagsMap[tagLower].posts += 1;
        } else {
          tagsMap[tagLower] = { tag: originalTag, posts: 1 };
        }
      });
    });

    const trendingTags = Object.values(tagsMap).sort(
      (a, b) => b.posts - a.posts,
    );

    const allTagsMap = {};
    Object.keys(tagsMap).forEach((key) => {
      allTagsMap[tagsMap[key].tag] = tagsMap[key].posts;
    });

    // Calculate Top Creators dynamically based on visible posts
    const creatorsMap = {};
    filteredPosts.forEach((post) => {
      const username =
        post.user?.username || `User_${post.user?.id || "Unknown"}`;
      const userId = post.user?.id;
      if (!username) return;
      if (!creatorsMap[username]) {
        creatorsMap[username] = {
          username,
          userId,
          postCount: 0,
          likes: 0,
          comments: 0,
          engagement: 0,
        };
      }
      creatorsMap[username].postCount += 1;
      creatorsMap[username].likes += post.likeCount || 0;
      creatorsMap[username].comments += post.commentCount || 0;
      creatorsMap[username].engagement +=
        (post.likeCount || 0) + (post.commentCount || 0);
    });

    const topCreators = Object.values(creatorsMap)
      .sort((a, b) => b.engagement - a.engagement || b.postCount - a.postCount)
      .slice(0, 5);

    return {
      totalPosts: total,
      mediaPosts: media,
      totalLikes: likes,
      totalComments: comments,
      freshPosts: fresh,
      trendingTags,
      topCreators,
      allTagsMap,
    };
  }, [filteredPosts]);

  // Synchronized Handlers

  // Optimistic Like synchronization
  const handleLike = useCallback(
    async (postId) => {
      const post = posts.find((p) => p.id === postId);
      if (!post || !currentUserId || likeLoading[postId]) return;

      setLikeLoading((prev) => ({ ...prev, [postId]: true }));
      const previousLiked = post.liked;
      const previousCount = post.likeCount || 0;

      // Optimistic Update
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

        // Fetch actual count to ensure sync with server
        const countResponse = await likeAPI.getLikeCount(postId);
        const newCount = countResponse.data?.likeCount ?? 0;
        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId ? { ...p, likeCount: newCount } : p,
          ),
        );
      } catch (err) {
        console.error("Error toggling like:", err);
        // Rollback
        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId
              ? { ...p, liked: previousLiked, likeCount: previousCount }
              : p,
          ),
        );
      } finally {
        setLikeLoading((prev) => ({ ...prev, [postId]: false }));
      }
    },
    [posts, currentUserId, likeLoading],
  );

  // Real-time Comment Count synchronization
  const updatePostCommentCount = useCallback((postId, newCount) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, commentCount: newCount } : p)),
    );
  }, []);

  // Follow Toggle synchronizing left/right sidebars and feed cards
  const handleFollowToggle = useCallback(
    async (authorId) => {
      if (!authorId || !profileData?.id) return;
      setFollowLoading((prev) => ({ ...prev, [authorId]: true }));
      const currentlyFollowing = followingStatus[authorId];

      try {
        if (currentlyFollowing) {
          await followAPI.unfollowUser(profileData.id, authorId);
        } else {
          await followAPI.followUser(profileData.id, authorId);
        }

        setFollowingStatus((prev) => ({
          ...prev,
          [authorId]: !currentlyFollowing,
        }));
        // Fetch fresh list of online following users
        fetchFollowingUsers();
      } catch (err) {
        console.error("Follow toggling failed:", err);
        alert("Follow operation failed");
      } finally {
        setFollowLoading((prev) => ({ ...prev, [authorId]: false }));
      }
    },
    [profileData?.id, followingStatus, fetchFollowingUsers],
  );

  // Bookmark toggling
  const handleBookmark = useCallback(
    async (postId) => {
      const post = posts.find((p) => p.id === postId);
      if (!post || !profileData?.id) return;
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
        console.error("Bookmark operation failed:", err);
      }
    },
    [posts, profileData?.id],
  );

  const updatePostLocally = useCallback((updatedPost) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === updatedPost.id
          ? {
              ...p,
              ...updatedPost,
            }
          : p,
      ),
    );
  }, []);

  const deletePostLocally = useCallback((postId) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  }, []);

  const triggerRefresh = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  const value = {
    posts,
    filteredPosts,
    feedInsights,
    trendingTags: feedInsights.trendingTags,
    feedType,
    setFeedType,
    activeTopic,
    setActiveTopic,
    viewMode,
    setViewMode,
    loading,
    error,
    refreshTrigger,
    triggerRefresh,
    handleLike,
    updatePostCommentCount,
    handleFollowToggle,
    handleBookmark,
    updatePostLocally,
    deletePostLocally,
    followingStatus,
    followingUsers,
    loadingFollowing,
    followLoading,
    searchPosts,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
};
