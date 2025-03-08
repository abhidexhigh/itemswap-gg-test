import RecentDecks from "./RecentDecksItems/RecentDecksItems";
import ProjectsListStyleWrapper from "./RecentDecksList.style";

const RecentDecksList = () => {
  return (
    <ProjectsListStyleWrapper>
      <>
        <div className="my-class"></div>
        <RecentDecks />
      </>
    </ProjectsListStyleWrapper>
  );
};

export default RecentDecksList;
