import LeaderboardCard from "./LeaderboardCard";
import LeaderboardItemsAll from "./LeaderboardItems/Ranked/All";
import LeaderboardItemsChallanger from "./LeaderboardItems/Ranked/Challanger";
import LeaderboardItemsGrandmaster from "./LeaderboardItems/Ranked/Grandmaster";
import LeaderboardItemsMaster from "./LeaderboardItems/Ranked/Master";
import LeaderboardItemsDiamond from "./LeaderboardItems/Ranked/Diamond";
import LeaderboardItemsEmerald from "./LeaderboardItems/Ranked/Emerald";
import LeaderboardItemsPlatinum from "./LeaderboardItems/Ranked/Platinum";
import LeaderboardItemsGold from "./LeaderboardItems/Ranked/Gold";
import LeaderboardItemsSilver from "./LeaderboardItems/Ranked/Silver";
import LeaderboardItemsBronze from "./LeaderboardItems/Ranked/Bronze";
import LeaderboardItemsIron from "./LeaderboardItems/Ranked/Iron";
import LeaderboardItemsAllHyperRoll from "./LeaderboardItems/HyperRoll/All";
import Set3_5 from "./LeaderboardItems/Set3_5";

const LeaderboardContainer = ({
  activeCategory,
  activeSubcategory,
  leaderboardData,
}) => {
  return (
    <>
      <LeaderboardCard />
      <LeaderboardItemsAll leaderboardData={leaderboardData} />
    </>
  );

  return (
    <>
      <LeaderboardCard />
      {activeCategory === "Ranked" && (
        <>
          {activeSubcategory === "All" && <LeaderboardItemsAll />}
          {activeSubcategory === "Challenger" && <LeaderboardItemsChallanger />}
          {activeSubcategory === "Grandmaster" && (
            <LeaderboardItemsGrandmaster />
          )}
          {activeSubcategory === "Master" && <LeaderboardItemsMaster />}
          {activeSubcategory === "Diamond" && <LeaderboardItemsDiamond />}
          {activeSubcategory === "Emerald" && <LeaderboardItemsEmerald />}
          {activeSubcategory === "Platinum" && <LeaderboardItemsPlatinum />}
          {activeSubcategory === "Gold" && <LeaderboardItemsGold />}
          {activeSubcategory === "Silver" && <LeaderboardItemsSilver />}
          {activeSubcategory === "Bronze" && <LeaderboardItemsBronze />}
          {activeSubcategory === "Iron" && <LeaderboardItemsIron />}
        </>
      )}
      {activeCategory === "Hyper Roll" && (
        <>{activeSubcategory === "All" && <LeaderboardItemsAllHyperRoll />}</>
      )}
      {activeCategory === "Double Up" && (
        <>
          {activeSubcategory === "All" && <LeaderboardItemsAll />}
          {activeSubcategory === "Challenger" && <LeaderboardItemsChallanger />}
          {activeSubcategory === "Grandmaster" && (
            <LeaderboardItemsGrandmaster />
          )}
          {activeSubcategory === "Master" && <LeaderboardItemsMaster />}
          {activeSubcategory === "Diamond" && <LeaderboardItemsDiamond />}
          {activeSubcategory === "Emerald" && <LeaderboardItemsEmerald />}
          {activeSubcategory === "Platinum" && <LeaderboardItemsPlatinum />}
          {activeSubcategory === "Gold" && <LeaderboardItemsGold />}
          {activeSubcategory === "Silver" && <LeaderboardItemsSilver />}
          {activeSubcategory === "Bronze" && <LeaderboardItemsBronze />}
          {activeSubcategory === "Iron" && <LeaderboardItemsIron />}
        </>
      )}
      {activeCategory === "Set 3.5" && <Set3_5 />}
    </>
  );
};

export default LeaderboardContainer;
