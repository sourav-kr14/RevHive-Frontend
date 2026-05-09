import {
  Crown,
  TrendingUp,
  UserPlus,
  CalendarDays,
  Zap,
  MessageCircle,
  Flame,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";

export default function DashboardRightSidebar({ profileData }) {
  const creators = [
    {
      name: "Aarav",
      handle: "@aarav.creates",
      color: "from-fuchsia-500 to-pink-500",
    },
    {
      name: "Maya",
      handle: "@maya.social",
      color: "from-cyan-500 to-sky-500",
    },
    {
      name: "Riya",
      handle: "@riya.life",
      color: "from-orange-500 to-amber-500",
    },
  ];

  const trends = [
    { tag: "#RevHiveDaily", posts: "18.4k" },
    { tag: "#CreatorMode", posts: "11.2k" },
    { tag: "#CampusBuzz", posts: "8.7k" },
  ];

  const username = profileData?.username || "User";
  const avatarUrl = profileData?.avatarUrl || profileData?.avatar || "";

  return (
    <aside className="hidden xl:block w-[340px] shrink-0">
      <div className="sticky top-24 h-[calc(100vh-112px)] overflow-y-auto pr-1 right-panel-scroll">
        <div className="space-y-4">
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
                    {profileData?.followersCount || 0}
                  </p>
                  <p className="text-xs font-semibold text-slate-500">
                    Followers
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-lg font-black text-slate-950">
                    {profileData?.followingCount || 0}
                  </p>
                  <p className="text-xs font-semibold text-slate-500">
                    Following
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

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
              className="mt-4 w-full rounded-xl bg-slate-950 py-2.5 text-xs font-extrabold text-white transition hover:bg-slate-800"
            >
              Explore premium
            </button>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-extrabold text-slate-950">
                Who to follow
              </p>
              <UserPlus size={16} className="text-fuchsia-600" />
            </div>

            <div className="space-y-4">
              {creators.map((creator) => (
                <div
                  key={creator.handle}
                  className="flex items-center justify-between gap-3"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${creator.color} text-sm font-black text-white`}
                    >
                      {creator.name.charAt(0)}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-slate-900">
                        {creator.name}
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        {creator.handle}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="rounded-full bg-fuchsia-50 px-3 py-1.5 text-xs font-extrabold text-fuchsia-700 transition hover:bg-fuchsia-600 hover:text-white"
                  >
                    Follow
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-extrabold text-slate-950">
                Trending topics
              </p>
              <Flame size={16} className="text-orange-500" />
            </div>

            <div className="space-y-3">
              {trends.map((trend, index) => (
                <button
                  key={trend.tag}
                  type="button"
                  className="flex w-full items-center justify-between rounded-xl bg-slate-50 px-3 py-3 text-left transition hover:bg-orange-50"
                >
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      {trend.tag}
                    </p>
                    <p className="text-xs text-slate-500">
                      {trend.posts} posts
                    </p>
                  </div>

                  <span className="text-xs font-black text-orange-500">
                    #{index + 1}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-extrabold text-slate-950">
                Today on RevHive
              </p>
              <CalendarDays size={16} className="text-cyan-600" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 rounded-xl bg-cyan-50 p-3">
                <TrendingUp size={17} className="text-cyan-600" />
                <p className="text-xs font-bold text-slate-700">
                  Best posting window: 6 PM - 9 PM
                </p>
              </div>

              <div className="flex items-center gap-3 rounded-xl bg-fuchsia-50 p-3">
                <MessageCircle size={17} className="text-fuchsia-600" />
                <p className="text-xs font-bold text-slate-700">
                  14 conversations are active now
                </p>
              </div>

              <div className="flex items-center gap-3 rounded-xl bg-emerald-50 p-3">
                <CheckCircle2 size={17} className="text-emerald-600" />
                <p className="text-xs font-bold text-slate-700">
                  Your profile reach is growing
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-slate-950 to-slate-800 p-5 text-white shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-extrabold">Daily challenge</p>
              <Zap size={16} className="text-yellow-300" />
            </div>

            <p className="text-sm leading-6 text-white/75">
              Post one photo that describes your day and tag it with
              #RevHiveDaily.
            </p>

            <button
              type="button"
              className="mt-4 rounded-xl bg-white px-4 py-2.5 text-xs font-extrabold text-slate-950 transition hover:bg-yellow-100"
            >
              Join challenge
            </button>
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
