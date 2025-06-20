import React, { memo, Suspense } from "react";
import dynamic from "next/dynamic";
import ProjectsListStyleWrapper from "./RecentDecksList.style";

// Dynamically import RecentDecks with no SSR
const RecentDecks = dynamic(
  () => import("./RecentDecksItems/RecentDecksItems"),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[400px] bg-[#111111] flex items-center justify-center"></div>
    ),
  }
);

const RecentDecksList = () => {
  return (
    <ProjectsListStyleWrapper>
      <Suspense
        fallback={
          <div className="min-h-[400px] bg-[#111111] flex items-center justify-center"></div>
        }
      >
        <RecentDecks />
      </Suspense>
    </ProjectsListStyleWrapper>
  );
};

// Using memo to prevent unnecessary re-renders when parent components update
export default memo(RecentDecksList);
