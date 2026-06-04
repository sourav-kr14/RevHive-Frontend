import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  Compass,
  Crown,
  Hash,
  LayoutDashboard,
  MessageCircle,
  Plus,
  Search,
  Settings,
  Sparkles,
  User,
  Users,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CommandPalette({
  trends = [],
  onCreatePost,
  onFeedChange,
  onTopicSelect,
}) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((current) => !current);
      }

      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const commands = useMemo(
    () => [
      {
        id: "compose",
        label: "Create a new post",
        hint: "Start writing",
        icon: Plus,
        action: () => onCreatePost?.(""),
      },
      {
        id: "for-you",
        label: "Open For You feed",
        hint: "Dashboard",
        icon: Sparkles,
        action: () => onFeedChange?.("forYou"),
      },
      {
        id: "following",
        label: "Open Following feed",
        hint: "People you follow",
        icon: Users,
        action: () => onFeedChange?.("following"),
      },
      {
        id: "profile",
        label: "View profile",
        hint: "Public presence",
        icon: User,
        action: () => navigate("/user/profile"),
      },
      {
        id: "messages",
        label: "Open messages",
        hint: "Inbox",
        icon: MessageCircle,
        action: () => navigate("/messages"),
      },
      {
        id: "notifications",
        label: "Open notifications",
        hint: "Activity",
        icon: Bell,
        action: () => navigate("/user/notifications"),
      },
      {
        id: "settings",
        label: "Edit settings",
        hint: "Profile and preferences",
        icon: Settings,
        action: () => navigate("/user/settings"),
      },
      {
        id: "premium",
        label: "Explore premium",
        hint: "Creator tools",
        icon: Crown,
        action: () => navigate("/premium"),
      },
      ...trends.slice(0, 5).map((trend) => ({
        id: `trend-${trend.tag}`,
        label: `Explore ${trend.tag}`,
        hint: `${trend.posts || 0} posts`,
        icon: Hash,
        action: () => onTopicSelect?.(trend.tag),
      })),
    ],
    [navigate, onCreatePost, onFeedChange, onTopicSelect, trends],
  );

  const filteredCommands = commands.filter((command) =>
    `${command.label} ${command.hint}`
      .toLowerCase()
      .includes(query.trim().toLowerCase()),
  );

  const runCommand = (command) => {
    command.action();
    setOpen(false);
    setQuery("");
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-40 hidden items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-extrabold text-slate-700 shadow-xl shadow-slate-200/70 transition hover:-translate-y-0.5 hover:text-slate-950 lg:flex"
      >
        <Compass size={17} />
        Command
        <span className="rounded-lg bg-slate-100 px-2 py-0.5 text-[11px] text-slate-500">
          Ctrl K
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[120] flex items-start justify-center px-4 pt-24">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.98 }}
              className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
            >
              <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3">
                <Search size={18} className="text-slate-400" />
                <input
                  autoFocus
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search actions, pages, and trends"
                  className="h-10 flex-1 bg-transparent text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  aria-label="Close command palette"
                >
                  <X size={17} />
                </button>
              </div>

              <div className="max-h-[420px] overflow-y-auto p-2">
                {filteredCommands.length > 0 ? (
                  filteredCommands.map((command) => {
                    const Icon = command.icon;
                    return (
                      <button
                        key={command.id}
                        type="button"
                        onClick={() => runCommand(command)}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-slate-50"
                      >
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white">
                          <Icon size={17} />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-extrabold text-slate-950">
                            {command.label}
                          </span>
                          <span className="block truncate text-xs font-semibold text-slate-500">
                            {command.hint}
                          </span>
                        </span>
                      </button>
                    );
                  })
                ) : (
                  <div className="px-5 py-10 text-center">
                    <LayoutDashboard className="mx-auto text-slate-300" />
                    <p className="mt-3 text-sm font-bold text-slate-600">
                      No commands found
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
