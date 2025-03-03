import PatchNotesItems from "./PatchNotesItems/PatchNotesItems";
import ProjectsListStyleWrapper from "./PatchNotes.style";

const PatchNotes = () => {
  return (
    <ProjectsListStyleWrapper>
      <>
        <div className="my-class"></div>
        <PatchNotesItems />
      </>
    </ProjectsListStyleWrapper>
  );
};

export default PatchNotes;
