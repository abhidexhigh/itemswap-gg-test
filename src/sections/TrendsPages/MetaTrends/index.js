import dynamic from "next/dynamic";

// Dynamically import MetaTrendsList with preloading for better performance
const MetaTrendsList = dynamic(() => import("./MetaTrendsList"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-[#111111] flex items-center justify-center"></div>
  ),
});

// Preload the component
if (typeof window !== "undefined") {
  const preloadMetaTrendsList = () => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "script";
    link.href = "/_next/static/chunks/pages/metaTrends.js";
    document.head.appendChild(link);
  };

  // Preload after initial page load
  window.addEventListener("load", preloadMetaTrendsList);
}

// Export the component directly to avoid unnecessary re-exports
export default MetaTrendsList;
