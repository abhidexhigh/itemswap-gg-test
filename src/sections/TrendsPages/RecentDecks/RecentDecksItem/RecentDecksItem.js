import React, { memo } from "react";
import ChampionItem from "../../../../components/trends/ChampionItem";

/**
 * RecentDecksItem component that uses the common ChampionItem component
 */
const RecentDecksItem = (props) => {
  return <ChampionItem {...props} />;
};

export default memo(RecentDecksItem);
