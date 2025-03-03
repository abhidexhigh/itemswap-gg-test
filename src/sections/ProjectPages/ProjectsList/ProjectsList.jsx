import ProjectItems from "./ProjectItems/ProjectItems";
import ProjectsListStyleWrapper from "./ProjectsList.style";

const ProjectsList = () => {
  return (
    <ProjectsListStyleWrapper>
      <>
        <div className="my-class"></div>
        <ProjectItems />
      </>
    </ProjectsListStyleWrapper>
  );
};

export default ProjectsList;
