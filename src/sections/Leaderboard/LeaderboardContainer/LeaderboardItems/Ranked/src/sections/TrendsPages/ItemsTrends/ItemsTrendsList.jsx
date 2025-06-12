import ItemsTrends from "./ItemsTrendsItems/ItemsTrendsItems";
import ProjectsListStyleWrapper from "./ItemsTrendsList.style";

const ItemsTrendsList = () => {
  return (
    <ProjectsListStyleWrapper>
      <>
        <div className="my-class"></div>
        <ItemsTrends />
      </>
    </ProjectsListStyleWrapper>
  );
};

export default ItemsTrendsList;
