import React, { memo, Suspense } from "react";
import dynamic from "next/dynamic";
import ProjectsListStyleWrapper from "./MetaTrendsList.style";

// Dynamically import MetaTrends with no SSR
const MetaTrends = dynamic(() => import("./MetaTrendsItems/MetaTrendsItems"), {
  ssr: false,
  loading: () => (
    <div className="min-h-[400px] bg-[#111111] flex items-center justify-center"></div>
  ),
});

const MetaTrendsList = () => {
  return (
    <ProjectsListStyleWrapper>
      <Suspense
        fallback={
          <div className="min-h-[400px] bg-[#111111] flex items-center justify-center"></div>
        }
      >
        <MetaTrends />
      </Suspense>
    </ProjectsListStyleWrapper>
  );
};

// Using memo to prevent unnecessary re-renders when parent components update
export default memo(MetaTrendsList);
