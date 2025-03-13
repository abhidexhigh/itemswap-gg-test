import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Pagination from "@components/pagination/Pagination";
import LeaderboardStyleWrapper from "./Leaderboard.style.js";
import ZoneTabs from "./ZoneTabs/index.js";
import LeaderboardCategory from "./LeaderboardCategory/index.js";
import LeaderboardSubcategory from "./LeaderboardSubcategory/index.js";
import LeaderboardContainer from "./LeaderboardContainer/index.js";
const ZoneGraph = dynamic(() => import("./ZoneGraph"), {
  ssr: false, // This line is key to making it only render on the client-side
});
import LeaderboardData from "../../data/leaderboard.json";

const Leaderboard = () => {
  const {
    props: {
      queries: { summonerRankings, tierAvgs },
    },
  } = LeaderboardData;
  // console.log(summonerRankings, tierAvgs);

  const categories = ["Ranked", "Hyper Roll", "Double Up", "Set 3.5"];
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  let subcategories;
  if (activeCategory === "Ranked") {
    subcategories = [
      "All",
      "Master",
      "Diamond",
      "Platinum",
      "Gold",
      "Silver",
      "Bronze",
      "Iron",
    ];
  } else if (activeCategory === "Hyper Roll") {
    subcategories = ["All", "Hyper", "Purple", "Blue", "Green", "Gray"];
  } else if (activeCategory === "Double Up") {
    subcategories = [
      "All",
      "Master",
      "Diamond",
      "Platinum",
      "Gold",
      "Silver",
      "Bronze",
      "Iron",
    ];
  } else if (activeCategory === "Set 3.5") {
    subcategories = [];
  }

  const [activeSubcategory, setActiveSubcategory] = useState(subcategories[0]);
  const [seriesData, setSeriesData] = useState(
    Array.from({ length: 7 }, () => Math.floor(Math.random() * 100))
  );
  console.log(seriesData);
  const zones = [
    "GLOBAL",
    "AU",
    "BR",
    "CA",
    "DE",
    "ES",
    "FR",
    "GB",
    "IN",
    "IT",
    "JP",
    "KR",
  ];
  const [activeZone, setActiveZone] = useState(zones[0]);

  const [leaderboardData, setLeaderboardData] = useState(null);

  const filterLeaderboardData =
    activeSubcategory.toLowerCase() !== "all"
      ? summonerRankings.filter((summoner) => {
          return (
            summoner.tier.toLowerCase() === activeSubcategory.toLowerCase()
          );
        })
      : summonerRankings;

  useEffect(() => {
    setSeriesData(
      Array.from({ length: 7 }, () => Math.floor(Math.random() * 100))
    );
  }, [activeZone]);

  return (
    <LeaderboardStyleWrapper>
      <div>
        {/* <ZoneTabs
          zones={zones}
          activeZone={activeZone}
          setActiveZone={setActiveZone}
        /> */}
        {/* <LeaderboardCategory
          categories={categories}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          setActiveSubcategory={() => setActiveSubcategory(subcategories[0])}
        /> */}

        <LeaderboardSubcategory
          subcategories={subcategories}
          activeSubcategory={activeSubcategory}
          setActiveSubcategory={setActiveSubcategory}
        />
        <LeaderboardContainer
          activeSubcategory={activeSubcategory}
          activeCategory={activeCategory}
          leaderboardData={filterLeaderboardData}
          activeZone={activeZone}
          seriesData={seriesData}
        />
        <Pagination />
      </div>
    </LeaderboardStyleWrapper>
  );
};

export default Leaderboard;
