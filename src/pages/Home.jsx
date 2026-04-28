// import { motion } from "framer-motion";

// export default function Home() {
//   return (
//     <div className="min-h-screen bg-[#070b1a] text-white overflow-hidden relative">
//       {/* Background Glow */}
//       <div className="absolute top-[-120px] left-[-120px] w-[400px] h-[400px] bg-purple-600/30 blur-[150px] rounded-full"></div>
//       <div className="absolute bottom-[-120px] right-[-120px] w-[400px] h-[400px] bg-blue-600/30 blur-[150px] rounded-full"></div>

//       <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center min-h-screen">
//         {/* LEFT TEXT */}
//         <motion.div
//           initial={{ opacity: 0, y: 40 }}
//           animate={{ opacity: 1, y: 0 }}
//         >
//           <h1 className="text-5xl md:text-6xl font-bold leading-tight">
//             Connect. <br />
//             Share. <br />
//             <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
//               Thrive.
//             </span>
//           </h1>

//           <p className="text-gray-400 mt-6 max-w-md">
//             Revhive is your space to connect, share ideas, and grow real
//             relationships in a modern social ecosystem.
//           </p>

//           <button className="mt-8 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold hover:scale-105 transition">
//             Join Revhive →
//           </button>
//         </motion.div>

//         {/* RIGHT SIDE - CODED ILLUSTRATION */}
//         <div className="relative flex justify-center items-center">
//           {/* Main Card (like social post) */}
//           <motion.div
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             className="bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-2xl w-[260px] shadow-2xl"
//           >
//             <div className="flex items-center gap-3 mb-3">
//               <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
//               <div>
//                 <p className="text-sm font-semibold">Jane Cooper</p>
//                 <p className="text-xs text-gray-400">2h ago</p>
//               </div>
//             </div>

//             <p className="text-sm mb-3 text-gray-300">
//               Just enjoying the vibes ✨
//             </p>

//             <div className="grid grid-cols-3 gap-2 mb-3">
//               <div className="h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-md"></div>
//               <div className="h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-md"></div>
//               <div className="h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-md"></div>
//             </div>

//             <div className="flex justify-between text-xs text-gray-400">
//               ❤️ 1.2K 💬 128
//             </div>
//           </motion.div>

//           {/* Floating Like */}
//           <motion.div
//             animate={{ y: [0, -10, 0] }}
//             transition={{ repeat: Infinity, duration: 3 }}
//             className="absolute top-10 left-0 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-sm"
//           >
//             👍 Like
//           </motion.div>

//           {/* Floating Comment */}
//           <motion.div
//             animate={{ y: [0, 10, 0] }}
//             transition={{ repeat: Infinity, duration: 4 }}
//             className="absolute bottom-10 right-0 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-sm"
//           >
//             💬 Comment
//           </motion.div>

//           {/* Floating Add Friend Card */}
//           <motion.div
//             animate={{ x: [0, 10, 0] }}
//             transition={{ repeat: Infinity, duration: 5 }}
//             className="absolute right-[-40px] top-1/2 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10"
//           >
//             <p className="text-sm mb-2">People you may know</p>
//             <div className="flex items-center justify-between text-xs">
//               <span>Alex</span>
//               <button className="text-blue-400">+</button>
//             </div>
//           </motion.div>
//         </div>
//       </div>
//     </div>
//   );
// }
