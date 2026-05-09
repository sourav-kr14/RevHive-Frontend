// UserSidebar.jsx

import {
  LogOut,
  Sparkles,
  Flame,
  Users,
  Compass,
  Hash,
  MessageCircle,
  UserPlus,
  CheckCircle2,
  Zap,
  Camera,
  Music,
  Gamepad2,
  BookOpen,
} from "lucide-react";
import { motion } from "framer-motion";
import UserSearch from "./UserSearch";

export default function UserSidebar({ feedType, setFeedType, onLogout }) {
  const feedItems = [
    {
      id: "forYou",
      label: "For You",
      icon: Sparkles,
      count: "Live",
      active:
        "bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-lg shadow-sky-100",
      hover: "hover:bg-sky-50 hover:text-sky-700",
    },
    {
      id: "trending",
      label: "Trending",
      icon: Flame,
      count: "24",
      active:
        "bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-lg shadow-orange-100",
      hover: "hover:bg-orange-50 hover:text-orange-700",
    },
    {
      id: "following",
      label: "Following",
      icon: Users,
      count: "128",
      active:
        "bg-gradient-to-r from-fuchsia-600 to-violet-600 text-white shadow-lg shadow-fuchsia-100",
      hover: "hover:bg-fuchsia-50 hover:text-fuchsia-700",
    },
    {
      id: "discover",
      label: "Discover",
      icon: Compass,
      count: "New",
      active:
        "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-100",
      hover: "hover:bg-emerald-50 hover:text-emerald-700",
    },
  ];

  const trendingTags = [
    { tag: "#CampusTalk", posts: "24k", color: "bg-fuchsia-500" },
    { tag: "#TechCreators", posts: "18k", color: "bg-sky-500" },
    { tag: "#WeekendPlans", posts: "12k", color: "bg-orange-500" },
  ];

  const onlineFriends = [
    { name: "Aarav", color: "from-fuchsia-500 to-pink-500" },
    { name: "Maya", color: "from-cyan-500 to-sky-500" },
    { name: "Riya", color: "from-orange-500 to-amber-500" },
  ];

  const communities = [
    {
      name: "Photography",
      icon: Camera,
      members: "18k",
      hover: "hover:bg-pink-50 hover:text-pink-700 hover:border-pink-200",
      iconBg: "bg-pink-100 text-pink-600",
    },
    {
      name: "Music Room",
      icon: Music,
      members: "9k",
      hover: "hover:bg-violet-50 hover:text-violet-700 hover:border-violet-200",
      iconBg: "bg-violet-100 text-violet-600",
    },
    {
      name: "Gaming Hub",
      icon: Gamepad2,
      members: "14k",
      hover: "hover:bg-cyan-50 hover:text-cyan-700 hover:border-cyan-200",
      iconBg: "bg-cyan-100 text-cyan-600",
    },
    {
      name: "Book Circle",
      icon: BookOpen,
      members: "6k",
      hover:
        "hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200",
      iconBg: "bg-emerald-100 text-emerald-600",
    },
  ];

  return (
    <aside className="hidden lg:block w-[300px] shrink-0">
      <div className="sticky top-24 h-[calc(100vh-112px)]">
        <motion.div
          initial={{ opacity: 0, x: -18 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="text-lg font-extrabold tracking-tight text-slate-950">
              Explore
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Find people, posts, and trends
            </p>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 sidebar-scroll">
            <UserSearch />

            <div className="mt-4 space-y-1">
              {feedItems.map((item) => {
                const Icon = item.icon;
                const isActive = feedType === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFeedType(item.id)}
                    className={`group flex w-full items-center justify-between rounded-xl px-3 py-3 text-sm font-bold transition-all duration-300 ${
                      isActive
                        ? item.active
                        : `text-slate-600 ${item.hover} hover:translate-x-1`
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Icon
                        size={17}
                        className={
                          isActive
                            ? "text-white"
                            : "transition group-hover:scale-110"
                        }
                      />
                      {item.label}
                    </span>

                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-extrabold ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-slate-100 text-slate-500 group-hover:bg-white"
                      }`}
                    >
                      {item.count}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 rounded-2xl bg-gradient-to-br from-indigo-600 via-fuchsia-600 to-rose-500 p-4 text-white shadow-lg shadow-fuchsia-100">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-extrabold">Today’s prompt</p>
                <Zap size={16} className="text-yellow-200" />
              </div>

              <p className="text-sm leading-5 text-white/85">
                What is one thing you discovered this week?
              </p>

              <button
                type="button"
                className="mt-4 rounded-xl bg-white/95 px-4 py-2 text-xs font-extrabold text-fuchsia-700 transition hover:bg-yellow-100 hover:text-slate-950"
              >
                Create post
              </button>
            </div>

            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-extrabold text-slate-950">
                  Trending now
                </p>
                <Hash size={16} className="text-fuchsia-500" />
              </div>

              <div className="space-y-2">
                {trendingTags.map((item) => (
                  <button
                    key={item.tag}
                    type="button"
                    className="group flex w-full items-center justify-between rounded-xl px-2 py-2 text-left transition hover:bg-white hover:shadow-sm"
                  >
                    <div>
                      <p className="text-sm font-bold text-slate-800 transition group-hover:text-fuchsia-700">
                        {item.tag}
                      </p>
                      <p className="text-xs text-slate-500">
                        {item.posts} posts
                      </p>
                    </div>

                    <span
                      className={`h-2.5 w-2.5 rounded-full ${item.color} opacity-80 group-hover:scale-125 transition`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-extrabold text-slate-950">
                  Online friends
                </p>

                <span className="rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-bold text-emerald-600">
                  93 online
                </span>
              </div>

              <div className="space-y-3">
                {onlineFriends.map((friend) => (
                  <div
                    key={friend.name}
                    className="flex items-center justify-between rounded-xl p-1 transition hover:bg-slate-50"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${friend.color} text-xs font-bold text-white shadow-sm`}
                      >
                        {friend.name.charAt(0)}
                        <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
                      </div>

                      <div>
                        <p className="text-sm font-bold text-slate-800">
                          {friend.name}
                        </p>
                        <p className="text-xs text-slate-500">Active now</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600 transition hover:bg-cyan-500 hover:text-white"
                    >
                      <MessageCircle size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-extrabold text-slate-950">
                  Communities
                </p>
                <UserPlus size={16} className="text-orange-500" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                {communities.map((community) => {
                  const Icon = community.icon;

                  return (
                    <button
                      key={community.name}
                      type="button"
                      className={`rounded-xl border border-white bg-white p-3 text-left shadow-sm transition-all duration-300 hover:-translate-y-0.5 ${community.hover}`}
                    >
                      <div
                        className={`mb-2 flex h-8 w-8 items-center justify-center rounded-lg ${community.iconBg}`}
                      >
                        <Icon size={16} />
                      </div>

                      <p className="text-xs font-extrabold">{community.name}</p>
                      <p className="text-[11px] opacity-60">
                        {community.members}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-fuchsia-100 bg-gradient-to-br from-fuchsia-50 to-cyan-50 p-4">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-extrabold text-slate-950">
                  Profile strength
                </p>
                <span className="text-xs font-extrabold text-fuchsia-700">
                  72%
                </span>
              </div>

              <div className="h-2 rounded-full bg-white">
                <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-400" />
              </div>

              <button
                type="button"
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-white py-2.5 text-xs font-extrabold text-slate-950 shadow-sm transition hover:bg-gradient-to-r hover:from-fuchsia-500 hover:to-cyan-500 hover:text-white"
              >
                <CheckCircle2 size={15} />
                Complete profile
              </button>
            </div>
          </div>

          <div className="border-t border-slate-100 p-4">
            <button
              type="button"
              onClick={onLogout}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 py-3 text-sm font-bold text-red-500 transition hover:bg-gradient-to-r hover:from-red-500 hover:to-rose-500 hover:text-white hover:shadow-lg hover:shadow-red-100"
            >
              <LogOut size={17} />
              Sign out
            </button>
          </div>
        </motion.div>
      </div>

      <style>{`
        .sidebar-scroll::-webkit-scrollbar {
          width: 6px;
        }

        .sidebar-scroll::-webkit-scrollbar-track {
          background: transparent;
        }

        .sidebar-scroll::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 999px;
        }

        .sidebar-scroll::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </aside>
  );
}
