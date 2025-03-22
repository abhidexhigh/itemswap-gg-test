import dynamic from "next/dynamic";

// Dynamically import RecentDecksList with no SSR for better performance
const RecentDecksList = dynamic(() => import("./RecentDecksList"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-[#1a1b31] flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  ),
});

export default RecentDecksList;
