import React, { memo, Suspense } from "react";
import dynamic from "next/dynamic";
import ProjectsListStyleWrapper from "./MetaTrendsList.style";

// Dynamically import MetaTrends with no SSR
const MetaTrends = dynamic(() => import("./MetaTrendsItems/MetaTrendsItems"), {
  ssr: false,
  loading: () => (
    <div className="min-h-[400px] bg-[#1a1b31] flex items-center justify-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  ),
});

const MetaTrendsList = () => {
  return (
    <ProjectsListStyleWrapper>
      <Suspense
        fallback={
          <div className="min-h-[400px] bg-[#1a1b31] flex items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        }
      >
        <MetaTrends />
      </Suspense>
    </ProjectsListStyleWrapper>
  );
};

// Using memo to prevent unnecessary re-renders when parent components update
export default memo(MetaTrendsList);
