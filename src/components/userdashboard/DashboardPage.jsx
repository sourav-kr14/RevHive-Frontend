import DashboardCompose from "./UserCompose";
import UserFeed from "./UserFeed";
import UserSidebar from "./UserSidebar";
import { useOutletContext, useNavigate } from "react-router-dom";
import { useState } from "react";
import DashboardRightSidebar from "./DashboardRightSidebar";
import CommandPalette from "./CommandPalette";

export default function DashboardPage() {
  const { profileData } = useOutletContext();

  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [feedType, setFeedType] = useState("forYou");
  const [activeTopic, setActiveTopic] = useState("");
  const [composeDraft, setComposeDraft] = useState({ id: 0, text: "" });
  const [feedInsights, setFeedInsights] = useState({
    totalPosts: 0,
    mediaPosts: 0,
    totalLikes: 0,
    freshPosts: 0,
    trendingTags: [],
    topCreators: [],
  });

  const navigate = useNavigate();

  const handlePostCreated = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/signin");
  };

  return (
    <>
      <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-[300px_minmax(0,1fr)] xl:grid-cols-[300px_minmax(0,1fr)_340px]">
        <UserSidebar
          feedType={feedType}
          setFeedType={(type) => {
            setFeedType(type);
            setActiveTopic("");
          }}
          profileData={profileData}
          feedInsights={feedInsights}
          activeTopic={activeTopic}
          onTopicSelect={(topic) => {
            setActiveTopic(topic);
            setFeedType("trending");
          }}
          onPromptSelect={(prompt) =>
            setComposeDraft({ id: Date.now(), text: prompt })
          }
          onLogout={handleLogout}
        />

        <main className="min-w-0">
          <DashboardCompose
            key={composeDraft.id}
            profileData={profileData}
            draftText={composeDraft.text}
            onPostCreated={handlePostCreated}
          />

          <div className="mt-6">
            <UserFeed
              profileData={profileData}
              refreshTrigger={refreshTrigger}
              feedType={feedType}
              activeTopic={activeTopic}
              onTopicClear={() => setActiveTopic("")}
              onFeedStatsChange={setFeedInsights}
              onPromptSelect={(prompt) =>
                setComposeDraft({ id: Date.now(), text: prompt })
              }
            />
          </div>
        </main>

        <DashboardRightSidebar
          profileData={profileData}
          insights={feedInsights}
          trends={feedInsights.trendingTags}
          onTopicSelect={(topic) => {
            setActiveTopic(topic);
            setFeedType("trending");
          }}
          onPromptSelect={(prompt) =>
            setComposeDraft({ id: Date.now(), text: prompt })
          }
        />
      </div>

      <CommandPalette
        trends={feedInsights.trendingTags}
        onCreatePost={(prompt) =>
          setComposeDraft({
            id: Date.now(),
            text: prompt || "What are you building today?",
          })
        }
        onFeedChange={(type) => {
          setFeedType(type);
          setActiveTopic("");
        }}
        onTopicSelect={(topic) => {
          setActiveTopic(topic);
          setFeedType("trending");
        }}
      />
    </>
  );
}
