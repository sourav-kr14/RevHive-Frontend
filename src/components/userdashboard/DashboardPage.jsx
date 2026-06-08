import DashboardCompose from "./UserCompose";
import UserFeed from "./UserFeed";
import UserSidebar from "./UserSidebar";
import { useOutletContext, useNavigate } from "react-router-dom";
import { useState } from "react";
import DashboardRightSidebar from "./DashboardRightSidebar";
import CommandPalette from "./CommandPalette";
import { DashboardProvider, useDashboard } from "./DashboardContext";

export default function DashboardPage() {
  const { profileData } = useOutletContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/signin");
  };

  return (
    <DashboardProvider profileData={profileData}>
      <DashboardContent profileData={profileData} onLogout={handleLogout} />
    </DashboardProvider>
  );
}

function DashboardContent({ profileData, onLogout }) {
  const {
    feedType,
    setFeedType,
    activeTopic,
    setActiveTopic,
    feedInsights,
    trendingTags,
    triggerRefresh,
  } = useDashboard();

  const [composeDraft, setComposeDraft] = useState({ id: 0, text: "" });

  const handlePostCreated = () => {
    triggerRefresh();
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
          onLogout={onLogout}
        />

        <main className="min-w-0">
          <DashboardCompose
            key={composeDraft.id}
            profileData={profileData}
            draftText={composeDraft.text}
            onPostCreated={handlePostCreated}
          />

          <div className="mt-6">
            <UserFeed profileData={profileData} />
          </div>
        </main>

        <DashboardRightSidebar
          profileData={profileData}
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
        trends={trendingTags}
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

