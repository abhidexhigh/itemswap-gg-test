import { useTranslation } from "react-i18next";
import Emblems from "../../../../../data/emblems.json";
import { useState, useEffect } from "react";

const LeaderboardItemsAll = ({ leaderboardData }) => {
  const { t } = useTranslation();
  const others = t("others");
  const [sortedData, setSortedData] = useState(leaderboardData);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  useEffect(() => {
    let sortableData = [...leaderboardData];
    if (sortConfig !== null) {
      sortableData.sort((a, b) => {
        let aValue, bValue;

        switch (sortConfig.key) {
          case "rating":
            aValue = a.summonerLevel;
            bValue = b.summonerLevel;
            break;
          case "winRate":
            aValue = (a.wins * 100) / a.plays;
            bValue = (b.wins * 100) / b.plays;
            break;
          case "top4":
            aValue = (a.tops * 100) / a.plays;
            bValue = (b.tops * 100) / b.plays;
            break;
          case "games":
            aValue = a.plays;
            bValue = b.plays;
            break;
          case "wins":
            aValue = a.wins;
            bValue = b.wins;
            break;
          case "top4Count":
            aValue = a.tops;
            bValue = b.tops;
            break;
          default:
            return 0;
        }

        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    setSortedData(sortableData);
  }, [leaderboardData, sortConfig]);

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const renderSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "ascending" ? "▲" : "▼";
    }
    return null;
  };

  const getCellClass = (key) => {
    return sortConfig.key === key ? "bg-[#222240] text-[#fff]" : "";
  };

  const getHeaderClass = (key) => {
    return sortConfig.key === key ? "bg-[#33334d]" : "";
  };

  return (
    <div className="bg-[#1a1b2b] rounded-b-lg border border-t-0 border-[#ffffff4d]">
      <div className="overflow-x-auto min-h-[500px]">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="bg-[#2a2a3a] text-white">
              <th className="py-4 px-2 text-left font-medium text-xs sm:text-sm whitespace-nowrap">
                {others?.rank}
              </th>
              <th className="py-4 px-2 text-left font-medium text-xs sm:text-sm whitespace-nowrap">
                {others?.change}
              </th>
              <th className="py-4 px-2 text-left font-medium text-xs sm:text-sm whitespace-nowrap">
                {others?.player}
              </th>
              <th className="py-4 px-2 text-left font-medium text-xs sm:text-sm whitespace-nowrap">
                {others?.tier}
              </th>
              <th
                className={`py-4 px-2 text-center font-medium text-xs sm:text-sm whitespace-nowrap cursor-pointer ${getHeaderClass("rating")}`}
                onClick={() => requestSort("rating")}
              >
                <div className="flex items-center justify-center gap-1">
                  <span>{others?.rating}</span>
                  {renderSortIcon("rating")}
                </div>
              </th>
              <th
                className={`py-4 px-2 text-center font-medium text-xs sm:text-sm whitespace-nowrap cursor-pointer ${getHeaderClass("winRate")}`}
                onClick={() => requestSort("winRate")}
              >
                <div className="flex items-center justify-center gap-1">
                  <span>{others?.winRate}</span>
                  {renderSortIcon("winRate")}
                </div>
              </th>
              <th
                className={`py-4 px-2 text-center font-medium text-xs sm:text-sm whitespace-nowrap cursor-pointer ${getHeaderClass("top4")}`}
                onClick={() => requestSort("top4")}
              >
                <div className="flex items-center justify-center gap-1">
                  <span>{others?.top4}</span>
                  {renderSortIcon("top4")}
                </div>
              </th>
              <th
                className={`py-4 px-2 text-center font-medium text-xs sm:text-sm whitespace-nowrap cursor-pointer ${getHeaderClass("games")}`}
                onClick={() => requestSort("games")}
              >
                <div className="flex items-center justify-center gap-1">
                  <span>{others?.games}</span>
                  {renderSortIcon("games")}
                </div>
              </th>
              <th
                className={`py-4 px-2 text-center font-medium text-xs sm:text-sm whitespace-nowrap cursor-pointer ${getHeaderClass("wins")}`}
                onClick={() => requestSort("wins")}
              >
                <div className="flex items-center justify-center gap-1">
                  <span>{others?.wins}</span>
                  {renderSortIcon("wins")}
                </div>
              </th>
              <th
                className={`py-4 px-2 text-center font-medium text-xs sm:text-sm whitespace-nowrap cursor-pointer ${getHeaderClass("top4Count")}`}
                onClick={() => requestSort("top4Count")}
              >
                <div className="flex items-center justify-center gap-1">
                  <span>{others?.top4}</span>
                  {renderSortIcon("top4Count")}
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedData?.map((data, index) => (
              <tr
                key={index}
                className="border-b border-[#ffffff1a] hover:bg-[#2a2a3a] transition-colors duration-200"
              >
                <td className="py-4 px-2 text-center whitespace-nowrap">
                  {data?.position < 4 ? (
                    <img
                      src={
                        data?.position === 1
                          ? "https://res.cloudinary.com/dg0cmj6su/image/upload/v1723283473/ico-rank-1_ebtyst.svg"
                          : data?.position === 2
                            ? "https://res.cloudinary.com/dg0cmj6su/image/upload/v1723283473/ico-rank-2_g1ozje.svg"
                            : "https://res.cloudinary.com/dg0cmj6su/image/upload/v1723283473/ico-rank-3_wgyren.svg"
                      }
                      className="w-6 h-6 sm:w-8 sm:h-8 mx-auto"
                      alt={`Rank ${data?.position}`}
                    />
                  ) : (
                    <span className="text-white text-sm sm:text-base">
                      {data?.position}
                    </span>
                  )}
                </td>
                <td className="py-4 px-2 text-center text-gray-400 whitespace-nowrap">
                  -
                </td>
                <td className="py-4 px-2 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <img
                      src={data?.profileIconUrl}
                      className="w-8 h-8 sm:w-12 sm:h-12 rounded-full"
                      alt={data?.gameName}
                    />
                    <a
                      href="#"
                      className="text-white hover:text-[#ca9372] transition-colors duration-200 text-sm sm:text-lg"
                    >
                      {data?.gameName}
                    </a>
                  </div>
                </td>
                <td className="py-4 px-2 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <img
                      // src={
                      //   Emblems?.find(
                      //     (emblem) =>
                      //       emblem?.tier?.toLowerCase() ===
                      //       data?.tier.toLowerCase()
                      //   )?.imageUrl
                      // }
                      src="https://res.cloudinary.com/dg0cmj6su/image/upload/v1746779103/Challenger_2_tku4pn.webp"
                      className="w-6 h-6 sm:w-12 sm:h-12"
                      alt={data?.tier}
                    />
                    <span className="text-white text-sm sm:text-base">
                      {data?.tier}
                    </span>
                  </div>
                </td>
                <td
                  className={`py-4 px-2 text-center whitespace-nowrap ${getCellClass("rating")}`}
                >
                  <span className="text-white font-medium text-sm sm:text-base">
                    {data?.summonerLevel} LP
                  </span>
                </td>
                <td
                  className={`py-4 px-2 text-center whitespace-nowrap ${getCellClass("winRate")}`}
                >
                  <span className="text-white text-sm sm:text-base">
                    {((data?.wins * 100) / data?.plays).toFixed(1)}%
                  </span>
                </td>
                <td
                  className={`py-4 px-2 text-center whitespace-nowrap ${getCellClass("top4")}`}
                >
                  <span className="text-white text-sm sm:text-base">
                    {((data?.tops * 100) / data?.plays).toFixed(1)}%
                  </span>
                </td>
                <td
                  className={`py-4 px-2 text-center whitespace-nowrap ${getCellClass("games")}`}
                >
                  <span className="text-white text-sm sm:text-base">
                    {data?.plays}
                  </span>
                </td>
                <td
                  className={`py-4 px-2 text-center whitespace-nowrap ${getCellClass("wins")}`}
                >
                  <span className="text-white text-sm sm:text-base">
                    {data?.wins}
                  </span>
                </td>
                <td
                  className={`py-4 px-2 text-center whitespace-nowrap ${getCellClass("top4Count")}`}
                >
                  <span className="text-white text-sm sm:text-base">
                    {data?.tops}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaderboardItemsAll;
