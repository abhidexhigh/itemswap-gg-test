import SkillTreeItems from "./SkillTreeItems/SkillTreeItems";
import ProjectsListStyleWrapper from "./SkillTreeList.style";

const SkillTreeList = () => {
  return (
    <ProjectsListStyleWrapper>
      <>
        <div className="my-class"></div>
        <SkillTreeItems />
      </>
    </ProjectsListStyleWrapper>
  );
};

export default SkillTreeList;
