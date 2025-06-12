import { useTranslation } from "react-i18next";
import Emblems from "../../../../../data/emblems.json";
import { useState, useEffect } from "react";
import {
  HiArrowSmUp,
  HiArrowSmDown,
  HiChevronDown,
  HiChevronUp,
} from "react-icons/hi";

const LeaderboardItemsAll = ({ leaderboardData }) => {
  const { t } = useTranslation();
  const others = t("others");
  const [sortedData, setSortedData] = useState(leaderboardData);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [mobileFilter, setMobileFilter] = useState("rating");
  const [expandedRows, setExpandedRows] = useState(new Set());

  // Mobile filter options (excluding rank, player, tier)
  const mobileFilterOptions = [
    { key: "rating", label: others?.rating || "Rating" },
    { key: "winRate", label: others?.winRate || "Win Rate" },
    { key: "top4", label: others?.top4 || "Top 4%" },
    { key: "games", label: others?.games || "Games" },
    { key: "wins", label: others?.wins || "Wins" },
    { key: "top4Count", label: "Top 4 Count" },
  ];

  const handleMobileFilterClick = (filterKey) => {
    setMobileFilter(filterKey);

    // If clicking on the same filter, toggle sort direction
    if (mobileFilter === filterKey && sortConfig.key === filterKey) {
      const newDirection =
        sortConfig.direction === "ascending" ? "descending" : "ascending";
      setSortConfig({ key: filterKey, direction: newDirection });
    } else {
      // Auto-sort by the selected filter (default to descending for new selections)
      setSortConfig({ key: filterKey, direction: "descending" });
    }
  };

  const toggleRowExpansion = (index) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(index)) {
      newExpandedRows.delete(index);
    } else {
      newExpandedRows.add(index);
    }
    setExpandedRows(newExpandedRows);
  };

  const renderMobileValue = (item, key) => {
    switch (key) {
      case "rating":
        return `${item.summonerLevel} LP`;
      case "winRate":
        return `${((item.wins * 100) / item.plays).toFixed(1)}%`;
      case "top4":
        return `${((item.tops * 100) / item.plays).toFixed(1)}%`;
      case "games":
        return item.plays.toLocaleString("en-US");
      case "wins":
        return item.wins.toLocaleString("en-US");
      case "top4Count":
        return item.tops.toLocaleString("en-US");
      default:
        return item[key];
    }
  };

  const renderExpandedContent = (item) => {
    const hiddenData = [
      {
        label: others?.rating || "Rating",
        value: `${item.summonerLevel} LP`,
        key: "rating",
      },
      {
        label: others?.winRate || "Win Rate",
        value: `${((item.wins * 100) / item.plays).toFixed(1)}%`,
        key: "winRate",
      },
      {
        label: others?.top4 || "Top 4%",
        value: `${((item.tops * 100) / item.plays).toFixed(1)}%`,
        key: "top4",
      },
      {
        label: others?.games || "Games",
        value: item.plays.toLocaleString("en-US"),
        key: "games",
      },
      {
        label: others?.wins || "Wins",
        value: item.wins.toLocaleString("en-US"),
        key: "wins",
      },
      {
        label: "Top 4 Count",
        value: item.tops.toLocaleString("en-US"),
        key: "top4Count",
      },
    ];

    // Filter out the currently selected mobile filter
    const filteredData = hiddenData.filter((data) => data.key !== mobileFilter);

    return (
      <div className="grid grid-cols-3 gap-3 justify-between text-center px-4 py-3 bg-[#1a1a1a] border-t border-[#2D2F37]">
        {filteredData.map((data, index) => (
          <div key={index} className="flex flex-col">
            <span className="text-xs text-gray-400 mb-1">{data.label}</span>
            <span className="text-sm text-white">{data.value}</span>
          </div>
        ))}
      </div>
    );
  };

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
      return sortConfig.direction === "ascending" ? (
        <HiArrowSmUp className="text-lg" />
      ) : (
        <HiArrowSmDown className="text-lg" />
      );
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
    <div className="bg-[#1d1d1d] rounded-b-lg border border-t-0 border-[#ffffff4d]">
      {/* Mobile Filter Buttons - Only visible on mobile */}
      <div className="block md:hidden px-4 py-3 bg-[#111111]">
        <div className="flex flex-col items-center space-y-2">
          {/* First Row - 4 buttons */}
          <div className="flex">
            {mobileFilterOptions.slice(0, 4).map((option, index) => {
              const isFirst = index === 0;
              const isLast = index === 3;
              const isActive = mobileFilter === option.key;

              return (
                <button
                  key={option.key}
                  onClick={() => handleMobileFilterClick(option.key)}
                  className={`
                    px-3 py-2 text-xs font-medium transition-colors flex items-center space-x-1 border
                    ${isFirst ? "rounded-l-lg" : ""} 
                    ${isLast ? "rounded-r-lg" : ""} 
                    ${!isFirst ? "-ml-px" : ""} 
                    ${
                      isActive
                        ? "bg-[#D9A876] text-black border-[#D9A876] z-10 relative"
                        : "bg-[#2D2F37] text-white border-[#404040] hover:bg-[#3D3F47] hover:border-[#4A4A4A]"
                    }
                  `}
                >
                  <span>{option.label}</span>
                  {isActive && sortConfig.key === option.key && (
                    <span className="ml-1">
                      {sortConfig.direction === "ascending" ? (
                        <HiArrowSmUp className="w-3 h-3" />
                      ) : (
                        <HiArrowSmDown className="w-3 h-3" />
                      )}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Second Row - 2 buttons */}
          <div className="flex">
            {mobileFilterOptions.slice(4).map((option, index) => {
              const isFirst = index === 0;
              const isLast = index === mobileFilterOptions.slice(4).length - 1;
              const isActive = mobileFilter === option.key;

              return (
                <button
                  key={option.key}
                  onClick={() => handleMobileFilterClick(option.key)}
                  className={`
                    px-3 py-2 text-xs font-medium transition-colors flex items-center space-x-1 border
                    ${isFirst ? "rounded-l-lg" : ""} 
                    ${isLast ? "rounded-r-lg" : ""} 
                    ${!isFirst ? "-ml-px" : ""} 
                    ${
                      isActive
                        ? "bg-[#D9A876] text-black border-[#D9A876] z-10 relative"
                        : "bg-[#2D2F37] text-white border-[#404040] hover:bg-[#3D3F47] hover:border-[#4A4A4A]"
                    }
                  `}
                >
                  <span>{option.label}</span>
                  {isActive && sortConfig.key === option.key && (
                    <span className="ml-1">
                      {sortConfig.direction === "ascending" ? (
                        <HiArrowSmUp className="w-3 h-3" />
                      ) : (
                        <HiArrowSmDown className="w-3 h-3" />
                      )}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Desktop Table - Hidden on mobile */}
      <div className="hidden md:block overflow-x-auto min-h-[500px]">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="bg-[#10101080] text-white">
              <th className="py-4 px-2 text-center font-medium text-xs sm:text-sm whitespace-nowrap">
                {others?.rank}
              </th>
              <th className="py-4 px-2 text-left font-medium text-xs sm:text-sm whitespace-nowrap">
                {others?.change}
              </th>
              <th className="py-4 px-2 text-left font-medium text-xs sm:text-sm whitespace-nowrap">
                {others?.player}
              </th>
              <th className="py-4 px-2 text-left font-medium text-xs sm:text-sm whitespace-nowrap">
                <span className="ml-4">{others?.tier}</span>
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
                className="border-b border-[#ffffff1a] hover:bg-[#10101080] transition-colors duration-200"
              >
                <td className="py-2 px-2 text-center whitespace-nowrap">
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
                <td className="py-2 px-2 text-center text-gray-400 whitespace-nowrap">
                  -
                </td>
                <td className="py-2 px-2 whitespace-nowrap">
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
                <td className="py-2 px-2 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <img
                      src={
                        Emblems?.find(
                          (emblem) =>
                            emblem?.tier?.toLowerCase() ===
                            data?.tier.toLowerCase()
                        )?.imageUrl
                      }
                      className="w-10 h-10 sm:w-16 sm:h-16"
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

      {/* Mobile Table - Only visible on mobile */}
      <div className="block md:hidden">
        <div className="bg-[#111111]">
          {/* Mobile Table Header */}
          <div
            className="grid gap-1 p-3 bg-[#1a1a1a] text-white font-semibold text-sm border-b border-[#2D2F37]"
            style={{ gridTemplateColumns: "15% 45% 15% 25%" }}
          >
            <div className="text-center">#</div>
            <div className="text-left">Player</div>
            <div className="text-center">Tier</div>
            <div
              className={`text-center flex items-center justify-center ${mobileFilter === sortConfig.key ? "text-[#D9A876]" : ""}`}
            >
              <span>
                {
                  mobileFilterOptions.find(
                    (option) => option.key === mobileFilter
                  )?.label
                }
              </span>
              {mobileFilter === sortConfig.key && (
                <span className="ml-1">
                  {sortConfig.direction === "ascending" ? (
                    <HiArrowSmUp className="w-3 h-3" />
                  ) : (
                    <HiArrowSmDown className="w-3 h-3" />
                  )}
                </span>
              )}
            </div>
          </div>

          {/* Mobile Table Body */}
          {sortedData?.map((data, index) => (
            <div key={index} className="border-b border-[#2D2F37]">
              {/* Main Row */}
              <div
                className="grid gap-1 p-3 items-center cursor-pointer hover:bg-[#2D2F37] transition-colors duration-200"
                style={{ gridTemplateColumns: "15% 45% 15% 25%" }}
                onClick={() => toggleRowExpansion(index)}
              >
                {/* Rank */}
                <div className="text-center">
                  {data?.position < 4 ? (
                    <img
                      src={
                        data?.position === 1
                          ? "https://res.cloudinary.com/dg0cmj6su/image/upload/v1723283473/ico-rank-1_ebtyst.svg"
                          : data?.position === 2
                            ? "https://res.cloudinary.com/dg0cmj6su/image/upload/v1723283473/ico-rank-2_g1ozje.svg"
                            : "https://res.cloudinary.com/dg0cmj6su/image/upload/v1723283473/ico-rank-3_wgyren.svg"
                      }
                      className="w-5 h-5 mx-auto"
                      alt={`Rank ${data?.position}`}
                    />
                  ) : (
                    <span className="text-white text-sm font-medium">
                      {data?.position}
                    </span>
                  )}
                </div>

                {/* Player Info */}
                <div className="flex items-center space-x-2 min-w-0">
                  <img
                    src={data?.profileIconUrl}
                    className="w-8 h-8 rounded-full flex-shrink-0"
                    alt={data?.gameName}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-white text-sm truncate leading-tight mb-0">
                      {data?.gameName}
                    </p>
                  </div>
                </div>

                {/* Tier (Image Only) */}
                <div className="text-center">
                  <img
                    src={
                      Emblems?.find(
                        (emblem) =>
                          emblem?.tier?.toLowerCase() ===
                          data?.tier.toLowerCase()
                      )?.imageUrl
                    }
                    className="w-8 h-8 mx-auto"
                    alt={data?.tier}
                  />
                </div>

                {/* Selected Filter Value */}
                <div
                  className={`text-center text-sm ${mobileFilter === sortConfig.key ? "text-[#D9A876] font-medium" : "text-white"} flex items-center justify-center space-x-1`}
                >
                  <span>{renderMobileValue(data, mobileFilter)}</span>
                  {expandedRows.has(index) ? (
                    <HiChevronUp className="w-4 h-4" />
                  ) : (
                    <HiChevronDown className="w-4 h-4" />
                  )}
                </div>
              </div>

              {/* Expanded Content */}
              {expandedRows.has(index) && renderExpandedContent(data)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeaderboardItemsAll;
