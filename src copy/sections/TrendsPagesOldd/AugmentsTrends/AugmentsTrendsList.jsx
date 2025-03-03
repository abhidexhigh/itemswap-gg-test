import AugmentsTrends from "./AugmentsTrendsItems/AugmentsTrendsItems";
import ProjectsListStyleWrapper from "./AugmentsTrendsList.style";

const AugmentsTrendsList = () => {
  return (
    <ProjectsListStyleWrapper>
      <>
        <div className="my-class"></div>
        <AugmentsTrends />
      </>
    </ProjectsListStyleWrapper>
  );
};

export default AugmentsTrendsList;
