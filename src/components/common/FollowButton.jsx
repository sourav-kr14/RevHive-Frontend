// // components/common/FollowButton.jsx
// import { motion } from "framer-motion";
// import { UserPlus, UserCheck, Loader } from "lucide-react";
// import { useState, useEffect } from "react";
// import api from "../../services/api"; // Don't import followAPI, use api directly

// export default function FollowButton({ userId, currentUserId, onFollowChange }) {
//   const [isFollowing, setIsFollowing] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [hover, setHover] = useState(false);

//   useEffect(() => {
//     if (userId && currentUserId && userId !== currentUserId) {
//       checkFollowStatus();
//     }
//   }, [userId, currentUserId]);

//   const checkFollowStatus = async () => {
//     try {
//       // Use api directly - NOT with extra /api
//       const response = await api.get('/v1/follows/check', {
//         params: { 
//           followerId: currentUserId, 
//           followingId: userId 
//         }
//       });
//       setIsFollowing(response.data.isFollowing);
//     } catch (error) {
//       console.error("Error checking follow status:", error);
//     }
//   };

// // const handleFollowToggle = async () => {
// //     console.log("Current User ID:", currentUserId);
// //     console.log("Target User ID:", userId);
    
// //     // Make sure IDs are numbers
// //     const followerId = Number(currentUserId);
// //     const followingId = Number(userId);
    
// //     console.log("Sending params:", { followerId, followingId });
    
// //     try {
// //         const response = await api.post('/v1/follows/follow', null, {
// //             params: { 
// //                 followerId: followerId, 
// //                 followingId: followingId 
// //             }
// //         });
// //         console.log("Follow response:", response.data);
// //     } catch (error) {
// //         console.error("Follow error:", error.response?.data);
// //     }
// // };

// const handleFollowToggle = async () => {
//   const followerId = Number(currentUserId);
//   const followingId = Number(userId);

//   setLoading(true);

//   try {

//     if (isFollowing) {

//       await api.delete('/v1/follows/unfollow', {
//         params: {
//           followerId,
//           followingId
//         }
//       });

//       setIsFollowing(false);

//     } else {

//       await api.post('/v1/follows/follow', null, {
//         params: {
//           followerId,
//           followingId
//         }
//       });

//       setIsFollowing(true);
//     }

//     if (onFollowChange) {
//       onFollowChange();
//     }

//   } catch (error) {
//     console.error("Follow toggle error:", error);
//   } finally {
//     setLoading(false);
//   }
// };
//   // if (userId === currentUserId || !currentUserId) {
//   //   return null;
//   // }
//   if (!currentUserId) {
//   return null;
// }

//   return (
//     <motion.button
//       whileHover={{ scale: 1.05 }}
//       whileTap={{ scale: 0.95 }}
//       onClick={handleFollowToggle}
//       disabled={loading}
//       onMouseEnter={() => setHover(true)}
//       onMouseLeave={() => setHover(false)}
//       className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
//         isFollowing
//           ? "bg-white/10 text-gray-300 hover:bg-red-500/20 hover:text-red-400"
//           : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg"
//       } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
//     >
//       {loading ? (
//         <Loader size={16} className="animate-spin" />
//       ) : isFollowing ? (
//         hover ? (
//           <>
//             <UserPlus size={16} />
//             Unfollow
//           </>
//         ) : (
//           <>
//             <UserCheck size={16} />
//             Following
//           </>
//         )
//       ) : (
//         <>
//           <UserPlus size={16} />
//           Follow
//         </>
//       )}
//     </motion.button>
//   );
// }






import { motion } from "framer-motion";
import { UserPlus, UserCheck, Loader } from "lucide-react";
import { useState, useEffect } from "react";
import { followAPI } from "../../services/api";

export default function FollowButton({
  userId,
  currentUserId,
  onFollowChange,
  syncedFollowing,
  size = "md",
}) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hover, setHover] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);

  const isSelf =
    userId && currentUserId && Number(userId) === Number(currentUserId);
  const canShow = !!(currentUserId && userId && !isSelf);

  // Hooks must always run — no early returns before this block
  useEffect(() => {
    if (!canShow) {
      setCheckingStatus(false);
      return;
    }

    let cancelled = false;

    const checkStatus = async () => {
      try {
        setCheckingStatus(true);
        const response = await followAPI.isFollowing(
          Number(currentUserId),
          Number(userId),
        );
        if (!cancelled) setIsFollowing(Boolean(response.data?.isFollowing));
      } catch (error) {
        console.error("Error checking follow status:", error);
        if (!cancelled) setIsFollowing(false);
      } finally {
        if (!cancelled) setCheckingStatus(false);
      }
    };

    checkStatus();
    return () => {
      cancelled = true;
    };
  }, [userId, currentUserId, canShow]);

  // When another card for the same user changes follow state, sync this button too
  useEffect(() => {
    if (syncedFollowing !== undefined && !checkingStatus) {
      setIsFollowing(syncedFollowing);
    }
  }, [syncedFollowing]);

  // Early return is safe here — all hooks already ran above
  if (!canShow) return null;

  const handleFollowToggle = async () => {
    if (loading || checkingStatus) return;

    const wasFollowing = isFollowing;
    const followerId = Number(currentUserId);
    const followingId = Number(userId);

    setLoading(true);

    try {
      if (wasFollowing) {
        await followAPI.unfollowUser(followerId, followingId);
        setIsFollowing(false);
      } else {
        await followAPI.followUser(followerId, followingId);
        setIsFollowing(true);
      }

      if (onFollowChange) {
        onFollowChange({
          action: wasFollowing ? "unfollow" : "follow",
          userId: followingId,
        });
      }
    } catch (error) {
      console.error("Follow toggle error:", error);
      setIsFollowing(wasFollowing);
    } finally {
      setLoading(false);
    }
  };

  const sizeClasses = {
    sm: "px-3 py-2 text-xs whitespace-nowrap min-w-[90px]",
    md: "px-4 py-2 text-sm min-w-[110px]",
  };

  if (checkingStatus) {
    return (
      <div
        className={`${sizeClasses[size]} rounded-lg flex items-center justify-center`}
      >
        <Loader size={16} className="animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleFollowToggle}
      disabled={loading}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`${sizeClasses[size]} rounded-lg font-semibold transition-all flex items-center justify-center gap-1.5 ${
        isFollowing
          ? "bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-500 border border-gray-300"
          : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg"
      } ${loading ? "opacity-50 cursor-not-allowed" : ""} shadow-sm`}
      aria-pressed={isFollowing}
      aria-label={isFollowing ? "Unfollow" : "Follow"}
    >
      {loading ? (
        <Loader size={16} className="animate-spin" />
      ) : isFollowing ? (
        hover ? (
          <>
            <UserPlus size={14} />
            Unfollow
          </>
        ) : (
          <>
            <UserCheck size={14} />
            Following
          </>
        )
      ) : (
        <>
          <UserPlus size={14} />
          Follow
        </>
      )}
    </motion.button>
  );
}
