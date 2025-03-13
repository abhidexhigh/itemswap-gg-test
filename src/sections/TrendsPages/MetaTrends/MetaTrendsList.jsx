import React, { memo } from "react";
import MetaTrends from "./MetaTrendsItems/MetaTrendsItems";
import ProjectsListStyleWrapper from "./MetaTrendsList.style";

const MetaTrendsList = () => {
  return (
    <ProjectsListStyleWrapper>
      <MetaTrends />
    </ProjectsListStyleWrapper>
  );
};

// Using memo to prevent unnecessary re-renders when parent components update
export default memo(MetaTrendsList);
