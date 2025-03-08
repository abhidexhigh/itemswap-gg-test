import ChampionsTrends from "./ChampionsTrendsItems/ChampionsTrendsItems";
import ProjectsListStyleWrapper from "./ProjectsList.style";

const ProjectsList = () => {
  return (
    <ProjectsListStyleWrapper>
      <>
        <div className="my-class"></div>
        <ChampionsTrends />
      </>
    </ProjectsListStyleWrapper>
  );
};

export default ProjectsList;
