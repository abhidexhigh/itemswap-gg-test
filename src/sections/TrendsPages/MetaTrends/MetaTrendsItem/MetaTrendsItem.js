import React, { memo } from "react";
import ChampionItem from "../../../../components/trends/ChampionItem";

/**
 * MetaTrendsItem component that uses the common ChampionItem component
 */
const MetaTrendsItem = (props) => {
  return <ChampionItem {...props} />;
};

export default memo(MetaTrendsItem);
