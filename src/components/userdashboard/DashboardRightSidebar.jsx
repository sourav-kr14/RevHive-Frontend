import {
  BarChart3,
  Clock3,
  Crown,
  Flame,
  Heart,
  Image,
  Target,
  Trophy,
  UserPlus,
  MessageSquare,
} from "lucide-react";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { followAPI } from "@/services/api";
import { toast } from "sonner";
import { useDashboard } from "./DashboardContext";

const formatCount = (value) => {
  const count = Number(value) || 0;
  if (count >= 1000)
    return `${(count / 1000).toFixed(count >= 10000 ? 0 : 1)}k`;
  return String(count);
};

export default function DashboardRightSidebar({
  profileData,
  onTopicSelect,
  onPromptSelect,
}) {
  const navigate = useNavigate();
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [creators, setCreators] = useState([]);

  // Consume dashboard context values
  const {
    feedInsights,
    trendingTags,
    setActiveTopic,
    setFeedType,
  } = useDashboard();

  const handleTopicClick = (tag) => {
    if (onTopicSelect) {
      onTopicSelect(tag);
    } else {
      setActiveTopic(tag);
      setFeedType("trending");
    }
  };

  const visibleTrends = useMemo(() => {
    const defaults = [
      { tag: "#RevHiveDaily", posts: 0 },
      { tag: "#CreatorMode", posts: 0 },
      { tag: "#CampusBuzz", posts: 0 },
    ];

    const mergedTrends = trendingTags && trendingTags.length > 0 ? [...trendingTags] : [];
    const trendsSet = new Set(mergedTrends.map((t) => t.tag));

    defaults.forEach((def) => {
      if (!trendsSet.has(def.tag)) {
        const count = feedInsights?.allTagsMap?.[def.tag] || 0;
        mergedTrends.push({ tag: def.tag, posts: count });
      }
    });

    mergedTrends.sort((a, b) => b.posts - a.posts);
    return mergedTrends.slice(0, 3);
  }, [trendingTags, feedInsights]);

  const username = profileData?.username || "User";
  const avatarUrl = profileData?.avatarUrl || profileData?.avatar || "";
  const totalPosts = feedInsights?.totalPosts || 0;
  const totalLikes = feedInsights?.totalLikes || 0;
  const totalComments = feedInsights?.totalComments || 0;
  const mediaPosts = feedInsights?.mediaPosts || 0;
  const freshPosts = feedInsights?.freshPosts || 0;
  const engagementRate =
    totalPosts > 0 ? Math.round((totalLikes / totalPosts) * 10) / 10 : 0;

  const missions = [
    {
      label: "Publish your first post",
      done: totalPosts > 0,
      action: () => onPromptSelect?.("Today I want to share "),
    },
    {
      label: "Add media to your story",
      done: mediaPosts > 0,
      action: () => onPromptSelect?.("A quick visual update from me: "),
    },
    {
      label: "Build your network",
      done: followingCount >= 5,
      action: () => null,
    },
    {
      label: "Complete your profile",
      done: Boolean(
        profileData?.bio && (profileData?.avatarUrl || profileData?.avatar),
      ),
      action: () => navigate("/user/settings"),
    },
  ];
  const completedMissions = missions.filter((mission) => mission.done).length;
  const token = localStorage.getItem("token");
  let jwtPremium = false;
  if (
    token &&
    token !== "undefined" &&
    token !== "null" &&
    token.trim() !== ""
  ) {
    try {
      const base64Url = token.split(".")[1];
      if (base64Url) {
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const pad = base64.length % 4;
        const padded = pad ? base64 + "=".repeat(4 - pad) : base64;
        const payload = JSON.parse(atob(padded));
        jwtPremium = payload.premium === true;
      }
    } catch (e) {
      console.log("Error decoding token in sidebar:", e);
    }
  }
  const isPremiumUser =
    jwtPremium ||
    profileData?.premium === true ||
    profileData?.ispremium === true ||
    profileData?.isPremium === true;

  // Followers + Following Count
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const followersRes = await followAPI.getFollowersCount(profileData?.id);
        const followingRes = await followAPI.getFollowingCount(profileData?.id);
        setFollowersCount(followersRes.data?.followersCount || 0);
        setFollowingCount(followingRes.data?.followingCount || 0);
      } catch (err) {
        console.log(err);
      }
    };

    if (profileData?.id) {
      fetchCounts();
    }
  }, [profileData?.id]);

  // Who To Follow
  useEffect(() => {
    const fetchCreators = async () => {
      try {
        const currentUserId = JSON.parse(localStorage.getItem("user"))?.id;

        // FETCH USERS FROM DB
        const usersRes = await api.get("/users/search?query=a");

        // USERS YOU FOLLOW
        const followingRes = await followAPI.getFollowing(currentUserId);

        // ALL USERS
        const allUsers = usersRes.data?.data || usersRes.data || [];

        // FOLLOWING IDS
        const followingData = followingRes.data?.data || [];

        const followingIds = followingData.map((u) => Number(u.id || u));

        // FILTER USERS
        const filteredUsers = allUsers.filter(
          (user) =>
            Number(user.id) !== Number(currentUserId) &&
            !followingIds.includes(Number(user.id)),
        );

        setCreators(filteredUsers.slice(0, 3));
      } catch (err) {
        console.log("FETCH CREATORS ERROR:", err);
      }
    };

    fetchCreators();
  }, []);

  // Handle Follow Button click
  const handleFollow = async (creatorId) => {
    if (!creatorId || !profileData?.id) return;

    try {
      await followAPI.followUser(profileData.id, creatorId);
      toast.success("Successfully followed user");
      // Remove followed creator from list
      setCreators((prev) => prev.filter((c) => c.id !== creatorId));
    } catch (err) {
      toast.error(err.response?.data?.message || "Follow failed");
    }
  };

  return (
    <aside className="hidden xl:block w-[340px] shrink-0">
      <div className="sticky top-24 h-[calc(100vh-112px)] overflow-y-auto pr-1 right-panel-scroll">
        <div className="space-y-4">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
          >
            <div className="h-24 bg-gradient-to-r from-fuchsia-500 via-violet-500 to-cyan-400" />

            <div className="px-5 pb-5">
              <div className="-mt-8 flex items-end justify-between">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={username}
                    className="h-16 w-16 rounded-2xl border-4 border-white object-cover shadow-sm"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-4 border-white bg-slate-950 text-lg font-black text-white shadow-sm">
                    {username.charAt(0).toUpperCase()}
                  </div>
                )}

                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600">
                  Online
                </span>
              </div>

              <div className="mt-3">
                <p className="text-lg font-extrabold text-slate-950">
                  @{username}
                </p>

                <p className="text-sm text-slate-500">
                  {profileData?.bio || "Building your RevHive presence"}
                </p>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-lg font-black text-slate-950">
                    {followersCount}
                  </p>

                  <p className="text-xs font-semibold text-slate-500">
                    Followers
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-lg font-black text-slate-950">
                    {followingCount}
                  </p>

                  <p className="text-xs font-semibold text-slate-500">
                    Following
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Premium */}
          {!isPremiumUser && (
            <div className="rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50 to-orange-50 p-5 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400 text-white">
                  <Crown size={18} />
                </div>

                <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-amber-700">
                  Premium
                </span>
              </div>

              <p className="text-sm font-extrabold text-slate-950">
                Unlock creator insights
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-600">
                See profile reach, trending windows, engagement quality, and
                smarter AI content suggestions.
              </p>

              <button
                type="button"
                onClick={() => navigate("/premium")}
                className="mt-4 w-full rounded-xl bg-slate-950 py-2.5 text-xs font-extrabold text-white transition hover:bg-slate-800"
              >
                Explore premium
              </button>
            </div>
          )}

          {/* Creator Pulse Analytics */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-extrabold text-slate-950">
                Creator pulse
              </p>
              <BarChart3 size={16} className="text-cyan-600" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  label: "Posts",
                  value: formatCount(totalPosts),
                  icon: Trophy,
                  tone: "bg-violet-50 text-violet-700",
                },
                {
                  label: "Total Likes",
                  value: formatCount(totalLikes),
                  icon: Heart,
                  tone: "bg-rose-50 text-rose-700",
                },
                {
                  label: "Comments",
                  value: formatCount(totalComments),
                  icon: MessageSquare,
                  tone: "bg-amber-50 text-amber-700",
                },
                {
                  label: "Likes/post",
                  value: engagementRate,
                  icon: Flame,
                  tone: "bg-fuchsia-50 text-fuchsia-700",
                },
                {
                  label: "Media",
                  value: formatCount(mediaPosts),
                  icon: Image,
                  tone: "bg-sky-50 text-sky-700",
                },
                {
                  label: "Fresh today",
                  value: formatCount(freshPosts),
                  icon: Clock3,
                  tone: "bg-emerald-50 text-emerald-700",
                },
              ].map((metric) => {
                const Icon = metric.icon;
                return (
                  <div
                    key={metric.label}
                    className="rounded-xl bg-slate-50 p-3"
                  >
                    <div
                      className={`mb-2 flex h-8 w-8 items-center justify-center rounded-lg ${metric.tone}`}
                    >
                      <Icon size={15} />
                    </div>
                    <p className="text-lg font-black text-slate-950">
                      {metric.value}
                    </p>
                    <p className="text-[11px] font-bold text-slate-500">
                      {metric.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Growth Missions */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-extrabold text-slate-950">
                  Growth missions
                </p>
                <p className="mt-0.5 text-xs font-semibold text-slate-500">
                  {completedMissions}/{missions.length} completed
                </p>
              </div>
              <Target size={16} className="text-emerald-600" />
            </div>

            <div className="space-y-2">
              {missions.map((mission) => (
                <button
                  key={mission.label}
                  type="button"
                  onClick={mission.action}
                  className="flex w-full items-center justify-between gap-3 rounded-xl bg-slate-50 px-3 py-3 text-left transition hover:bg-emerald-50"
                >
                  <span className="text-xs font-extrabold text-slate-700">
                    {mission.label}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
                      mission.done
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-white text-slate-500"
                    }`}
                  >
                    {mission.done ? "DONE" : "NEXT"}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Who To Follow */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-extrabold text-slate-950">
                Who to follow
              </p>

              <UserPlus size={16} className="text-fuchsia-600" />
            </div>

            {creators.length === 0 ? (
              <p className="text-sm text-slate-500">No users found</p>
            ) : (
              <div className="space-y-4">
                {creators.map((creator) => (
                  <div
                    key={creator.id}
                    className="flex items-center justify-between gap-3"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      {/* Avatar */}
                      <div
                        className="
                          flex h-10 w-10 shrink-0
                          items-center justify-center
                          rounded-xl
                          bg-gradient-to-br
                          from-fuchsia-500 to-violet-500
                          text-sm font-black text-white
                        "
                      >
                        {creator.username?.charAt(0).toUpperCase()}
                      </div>

                      {/* User Info */}
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-slate-900">
                          {creator.username}
                        </p>

                        <p className="truncate text-xs text-slate-500">
                          @{creator.username}
                        </p>
                      </div>
                    </div>

                    {/* Follow Button */}
                    <button
                      type="button"
                      onClick={() => handleFollow(creator.id)}
                      className="rounded-full bg-fuchsia-50 px-3 py-1.5 text-xs font-extrabold text-fuchsia-700 transition hover:bg-fuchsia-600 hover:text-white hover:cursor-pointer"
                    >
                      Follow
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Top Creators (Dynamic display from currently active posts) */}
          {feedInsights?.topCreators?.length > 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-extrabold text-slate-950">
                  Top creators
                </p>
                <Crown size={16} className="text-yellow-500" />
              </div>

              <div className="space-y-3">
                {feedInsights.topCreators.slice(0, 3).map((creator, index) => {
                  const initials = creator.username.slice(0, 2).toUpperCase();
                  const color = [
                    "from-yellow-400 to-amber-500",
                    "from-fuchsia-400 to-pink-500",
                    "from-cyan-400 to-sky-500",
                  ][index % 3];

                  return (
                    <div
                      key={creator.username}
                      className="flex items-center justify-between gap-3"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div
                          className={`
                            flex h-9 w-9 shrink-0
                            items-center justify-center
                            rounded-xl
                            bg-gradient-to-br ${color}
                            text-xs font-black text-white shadow-sm
                          `}
                        >
                          {initials}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-slate-900">
                            @{creator.username}
                          </p>

                          <p className="truncate text-[11px] text-slate-500 font-semibold">
                            {creator.postCount} {creator.postCount === 1 ? "post" : "posts"} · {formatCount(creator.likes + creator.comments)} engagement
                          </p>
                        </div>
                      </div>

                      <span className="text-xs font-black text-amber-500">
                        #{index + 1}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Trending Topics */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-extrabold text-slate-950">
                Trending topics
              </p>

              <Flame size={16} className="text-orange-500" />
            </div>

            <div className="space-y-3">
              {visibleTrends.map((trend, index) => (
                <button
                  key={trend.tag}
                  type="button"
                  onClick={() => handleTopicClick(trend.tag)}
                  className="flex w-full items-center justify-between rounded-xl bg-slate-50 px-3 py-3 text-left transition hover:bg-orange-50"
                >
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      {trend.tag}
                    </p>

                    <p className="text-xs text-slate-500">
                      {formatCount(trend.posts)} posts
                    </p>
                  </div>

                  <span className="text-xs font-black text-orange-500">
                    #{index + 1}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .right-panel-scroll::-webkit-scrollbar {
          width: 6px;
        }

        .right-panel-scroll::-webkit-scrollbar-track {
          background: transparent;
        }

        .right-panel-scroll::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 999px;
        }

        .right-panel-scroll::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </aside>
  );
}
