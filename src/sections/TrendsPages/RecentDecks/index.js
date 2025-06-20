import dynamic from "next/dynamic";

// Dynamically import RecentDecksList with no SSR for better performance
const RecentDecksList = dynamic(() => import("./RecentDecksList"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-[#111111] flex items-center justify-center"></div>
  ),
});

export default RecentDecksList;
