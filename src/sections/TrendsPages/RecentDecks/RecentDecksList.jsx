import React, { memo } from "react";
import RecentDecks from "./RecentDecksItems/RecentDecksItems";
import ProjectsListStyleWrapper from "./RecentDecksList.style";

const RecentDecksList = () => {
  return (
    <ProjectsListStyleWrapper>
      <RecentDecks />
    </ProjectsListStyleWrapper>
  );
};

// Using memo to prevent unnecessary re-renders when parent components update
export default memo(RecentDecksList);
