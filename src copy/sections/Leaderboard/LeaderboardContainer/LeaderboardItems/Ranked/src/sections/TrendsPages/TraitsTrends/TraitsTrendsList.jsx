import TraitsTrends from "./TraitsTrendsItems/TraitsTrendsItems";
import ProjectsListStyleWrapper from "./ItemsTrendsList.style";

const TraitsTrendsList = () => {
  return (
    <ProjectsListStyleWrapper>
      <>
        <div className="my-class"></div>
        <TraitsTrends />
      </>
    </ProjectsListStyleWrapper>
  );
};

export default TraitsTrendsList;
