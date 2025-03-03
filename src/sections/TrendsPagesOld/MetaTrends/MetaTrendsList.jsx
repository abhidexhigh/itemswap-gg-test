import MetaTrends from "./MetaTrendsItems/MetaTrendsItems";
import ProjectsListStyleWrapper from "./MetaTrendsList.style";

const MetaTrendsList = () => {
  return (
    <ProjectsListStyleWrapper>
      <>
        <div className="my-class"></div>
        <MetaTrends />
      </>
    </ProjectsListStyleWrapper>
  );
};

export default MetaTrendsList;
