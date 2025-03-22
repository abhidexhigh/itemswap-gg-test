import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { MdKeyboardDoubleArrowDown } from "react-icons/md";
import Link from "next/link.js";
import ChampionsStyleWrapper from "./User.style.js";
import Comps from "../../data/compsNew.json";
import PlayerInfo from "../../data/user/playerInfo.json";
import matchHistory from "../../data/user/matchHistory.json";
import moment from "moment/moment.js";
import ModernMatchHistory from "./ModernMatchHistory.jsx";
import Loader from "src/components/loader/index.js";

// Array of objects for recent 20 matches with rank and average data
// Rank should be between random number between 1-8
// Average should be between 1-5 in decimal

const recentMatchesDataGenerator = () => {
  const recentMatches = [];
  for (let i = 0; i < 20; i++) {
    recentMatches.push({
      rank: Math.floor(Math.random() * 8) + 1,
      average: (Math.random() * 5).toFixed(2),
    });
  }
  return recentMatches;
};

const recentMatches = recentMatchesDataGenerator();

const User = () => {
  const { t } = useTranslation();
  const others = t("others");
  const router = useRouter();
  const { user, matchId } = router.query;

  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Match History");

  const {
    props: {
      pageProps: {
        dehydratedState: {
          queries: { data },
        },
      },
    },
  } = Comps;

  const {
    matches: matchess,
    playerInfo,
    rankHistory,
    seasonStats,
  } = PlayerInfo;
  const { info: matchHistoryInfo, id, ranks } = matchHistory;

  const { metaDecks } = data?.metaDeckList;
  const { augments } = data?.refs;
  const { champions } = data?.refs;
  const { items } = data?.refs;
  const { traits } = data?.refs;
  const { forces } = data?.refs;

  const handleButtonClick = (button) => {
    router.push(`/user/${user}}`);
  };

  useEffect(() => {
    if (!router.isReady) return; // Don't do anything until router is ready

    if (matchId) {
      setIsLoading(true); // Show loader while fetching match data
      const match = matchess.find((m) => m.key === matchId);
      match ? setMatches([match]) : setMatches([]);
    } else {
      setMatches(matchess);
    }
    setIsLoading(false); // Data is loaded
  }, [router.isReady, matchId]);

  // const items = [
  //   "https://cdn.lolchess.gg/upload/images/items/BFSword_1658364277-1038.png",
  //   "https://cdn.lolchess.gg/upload/images/items/RecurveBow_1640058784.png",
  //   "https://cdn.lolchess.gg/upload/images/items/ChainVest_1640058945.png",
  //   "https://cdn.lolchess.gg/upload/images/items/NegatronCloak_1640059073.png",
  //   "https://cdn.lolchess.gg/upload/images/items/NeedlesslyLargeRod_1640059008.png",
  //   "https://cdn.lolchess.gg/upload/images/items/Tearofthegoddess_1640059037.png",
  //   "https://cdn.lolchess.gg/upload/images/items/GiantsBelt_1658368751-1011.png",
  //   "https://cdn.lolchess.gg/upload/images/items/SparringGloves_1640059055.png",
  //   "https://cdn.lolchess.gg/upload/images/items/Spatula_1658364227-4403.png",
  // ];
  const tabs = [
    "Match History",
    "LP History",
    "Comps",
    "Champions",
    "Traits",
    "Items",
  ];

  const tooltipData = {
    title: "Lillia",
    mana: {
      current: 70,
      max: 130,
    },
    abilities: [
      {
        name: "Magic Damage",
        values: [180, 270, 400],
      },
      {
        name: "Heal Amount",
        values: [180, 220, 260],
      },
      {
        name: "Ally Heal Amount",
        values: [90, 110, 130],
      },
    ],
  };

  const backgroundStyle = {
    backgroundImage: "url(//cdn.dak.gg/tft/images2/profile/level-bg.png)",
    backgroundRepeat: "no-repeat",
    // You can add more CSS properties here as needed, like backgroundSize or backgroundPosition
  };

  return (
    <ChampionsStyleWrapper>
      <div className="mx-auto">
        {/* Profile Header Section */}
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Profile Card */}
          <div className="w-full lg:w-4/12 bg-gradient-to-br from-[#222231] to-[#1e1e2c] rounded-xl sm:rounded-2xl shadow-xl overflow-hidden border border-white/5">
            {/* Cover Picture as Background */}
            <div className="relative">
              <div className="absolute inset-0 h-72 bg-gradient-to-br from-purple-600/10 to-blue-600/10">
                <img
                  src="https://res.cloudinary.com/dg0cmj6su/image/upload/v1742621144/360_F_413751967_FE4v2GLkAjYLhf8UzvTgjO3kex80FlwL_ukx0wy.jpg"
                  className="w-full h-full object-cover"
                  alt="Cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#222231]/80 to-[#222231]"></div>
              </div>
              <div className="relative p-4 sm:p-6">
                {/* Profile Image and Name */}
                <div className="flex flex-col items-center">
                  <div className="relative w-24 h-24 sm:w-32 sm:h-32 mb-3 sm:mb-4">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 animate-pulse-slow opacity-70"></div>
                    <div className="absolute inset-1 rounded-full overflow-hidden border-2 border-white/20">
                      <img
                        src="https://res.cloudinary.com/dg0cmj6su/image/upload/v1740809634/29_jaowdd.webp"
                        className="w-full h-full object-cover"
                        alt={playerInfo?.name}
                      />
                    </div>
                  </div>

                  <div className="text-center mb-3 sm:mb-4">
                    <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 flex flex-wrap items-center justify-center">
                      <span className="mr-1">{playerInfo?.name}</span>
                      <span className="text-gray-300 text-lg sm:text-xl">
                        #{playerInfo?.tag}
                      </span>
                    </h1>

                    <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
                      <div className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-gradient-to-r from-purple-600/40 to-blue-600/40 backdrop-blur-sm text-white text-xs sm:text-sm font-medium">
                        {playerInfo?.rankedLeague[0]}{" "}
                        {playerInfo?.rankedLeague[1]}LP
                      </div>
                      <div className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-gradient-to-r from-blue-600/40 to-purple-600/40 backdrop-blur-sm text-white text-xs sm:text-sm font-medium">
                        Top {(playerInfo?.localRank[1] * 100).toFixed(2)}%
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-4 sm:mt-6">
                  <motion.div
                    whileHover={{ y: -5, scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                    className="bg-[#2d2d42] rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/10 shadow-lg"
                  >
                    <div className="text-xl sm:text-3xl font-bold text-center text-white">
                      {seasonStats?.top4}
                    </div>
                    <div className="text-xs sm:text-sm text-center text-gray-300 mt-1">
                      Top 4
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ y: -5, scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                    className="bg-[#2d2d42] rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/10 shadow-lg"
                  >
                    <div className="text-xl sm:text-3xl font-bold text-center text-white">
                      {((seasonStats?.top4 * 100) / seasonStats?.games).toFixed(
                        1
                      )}
                      %
                    </div>
                    <div className="text-xs sm:text-sm text-center text-gray-300 mt-1">
                      Top 4 Rate
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ y: -5, scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                    className="bg-[#2d2d42] rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/10 shadow-lg"
                  >
                    <div className="text-xl sm:text-3xl font-bold text-center text-white">
                      {seasonStats?.win}
                    </div>
                    <div className="text-xs sm:text-sm text-center text-gray-300 mt-1">
                      Wins
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ y: -5, scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                    className="bg-[#2d2d42] rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/10 shadow-lg"
                  >
                    <div className="text-xl sm:text-3xl font-bold text-center text-white">
                      {((seasonStats?.win * 100) / seasonStats?.games).toFixed(
                        1
                      )}
                      %
                    </div>
                    <div className="text-xs sm:text-sm text-center text-gray-300 mt-1">
                      Win Rate
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Overview */}
          <div className="w-full lg:w-8/12 bg-gradient-to-br from-[#222231] to-[#1e1e2c] rounded-xl sm:rounded-2xl shadow-xl overflow-hidden border border-white/5">
            <div className="p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 border-b border-white/10 pb-2 sm:pb-3">
                {others?.performanceOverview}
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4">
                <motion.div
                  whileHover={{ y: -5, scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  className="bg-[#2d2d42] rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/10 shadow-lg flex flex-col items-center justify-center"
                >
                  <div className="text-xl sm:text-3xl font-bold text-white">
                    {seasonStats?.games}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-300 mt-1">
                    Games
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ y: -5, scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  className="bg-[#2d2d42] rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/10 shadow-lg flex flex-col items-center justify-center"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 mb-1 rounded-lg overflow-hidden border border-white/20">
                    <img
                      src={
                        items?.find((i) => i?.key === playerInfo?.fevoriteItem)
                          ?.imageUrl
                      }
                      className="w-full h-full object-cover"
                      alt="Favorite Item"
                    />
                  </div>
                  <div className="text-xs sm:text-sm text-gray-300 mt-1">
                    {others?.fevoriteItem}
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ y: -5, scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  className="bg-[#2d2d42] rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/10 shadow-lg flex flex-col items-center justify-center"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 mb-1 rounded-lg overflow-hidden border border-white/20">
                    <img
                      src={
                        champions?.find(
                          (i) => i?.key === playerInfo?.fevoriteChampion
                        )?.cardImage
                      }
                      className="w-full h-full object-cover"
                      alt="Favorite Champion"
                    />
                  </div>
                  <div className="text-xs sm:text-sm text-gray-300 mt-1">
                    {others?.favoriteChampion}
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ y: -5, scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  className="bg-[#2d2d42] rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/10 shadow-lg flex flex-col items-center justify-center"
                >
                  <div className="text-xl sm:text-3xl font-bold text-white">
                    212
                  </div>
                  <div className="text-xs sm:text-sm text-gray-300 mt-1">
                    {others?.damageDealt}
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ y: -5, scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  className="bg-[#2d2d42] rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/10 shadow-lg flex flex-col items-center justify-center"
                >
                  <div className="text-xl sm:text-3xl font-bold text-white">
                    {seasonStats?.avgPlace.toFixed(2)}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-300 mt-1">
                    {others?.avgPlacement}
                  </div>
                </motion.div>
              </div>

              {/* Recent Matches Section */}
              <div className="mt-6 sm:mt-8">
                <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 border-b border-white/10 pb-2 sm:pb-3 flex items-center justify-between">
                  <span>
                    {others?.recent20Matches}{" "}
                    <span className="text-xs sm:text-sm font-normal text-gray-400">
                      ({others?.ranked})
                    </span>
                  </span>
                  <Link href={`/user/${user}`} className="hover:text-inherit">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center gap-1 text-xs sm:text-sm text-blue-400 hover:text-blue-300"
                    >
                      <span>{others?.viewAll}</span>
                      <MdKeyboardDoubleArrowDown className="rotate-270" />
                    </motion.div>
                  </Link>
                </h2>

                <div className="p-3">
                  <div className="relative h-48 flex items-end justify-between gap-1">
                    {/* Horizontal grid lines */}
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                      {[...Array(8)].map((_, i) => (
                        <div
                          key={i}
                          className="w-full h-px bg-white/10 flex items-center"
                        >
                          <span className="text-[10px] text-gray-500 pr-2">
                            {i + 1}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Bars */}
                    {recentMatches.slice(0, 20).map((match, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${(match.rank / 8) * 100}%` }}
                        transition={{ duration: 0.5, delay: i * 0.05 }}
                        className="group relative flex-1 min-w-0 cursor-pointer"
                      >
                        <div
                          className={`w-full rounded-t-sm ${
                            match.rank === 1
                              ? "bg-yellow-500"
                              : match.rank === 2
                                ? "bg-indigo-500"
                                : match.rank === 3
                                  ? "bg-orange-500"
                                  : match.rank <= 4
                                    ? "bg-sky-500"
                                    : "bg-slate-500"
                          } h-full`}
                        ></div>

                        {/* Rank number at the top of the bar */}
                        <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 text-xs font-bold text-white">
                          {match.rank}
                        </div>

                        {/* Tooltip on hover */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-6 w-28 bg-[#1a1a2e] text-white text-xs rounded-lg p-2 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 pointer-events-none">
                          <div className="text-center">
                            <div className="font-semibold">
                              Rank: {match.rank}
                            </div>
                            <div className="text-gray-300">
                              Avg: {match.average}
                            </div>
                            <div className="text-gray-400 text-[10px] mt-1">
                              Game #{i + 1}
                            </div>
                          </div>
                          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-[#1a1a2e]"></div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* X-axis labels */}
                  <div className="flex justify-between mt-6 px-2">
                    <div className="text-xs text-gray-400">20 games ago</div>
                    <div className="text-xs text-gray-400">Recent</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="hidden mb-4 sm:mb-6">
          <div className="flex overflow-x-auto scrollbar-hide">
            <div className="flex space-x-1 p-1 bg-[#222231]/80 backdrop-blur-sm rounded-xl w-full">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-all duration-200 ${
                    activeTab === tab
                      ? "bg-gradient-to-r from-[#3b3b5e] to-[#4b4b7a] text-white shadow-lg"
                      : "text-gray-300 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-gradient-to-br from-[#22223180] to-[#1e1e2c80] backdrop-blur-lg rounded-xl sm:rounded-2xl shadow-xl overflow-hidden border border-white/5">
          {activeTab === "Match History" ? (
            <div className="p-1 sm:p-2">
              {isLoading ? (
                <div className="flex justify-center items-center py-8 sm:py-12">
                  <Loader />
                </div>
              ) : (
                <>
                  {matches?.length ? (
                    matches?.map((match, i) => (
                      <ModernMatchHistory
                        match={match}
                        key={i}
                        traits={traits}
                        items={items}
                        champions={champions}
                        augments={augments}
                        forces={forces}
                        matchHistoryInfo={matchHistoryInfo}
                        matchId={matchId}
                      />
                    ))
                  ) : (
                    <div className="w-full flex justify-center items-center py-8 sm:py-12">
                      <span className="text-lg sm:text-xl text-gray-400">
                        No matches found
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
          ) : activeTab === "LP History" ? (
            <div className="p-6 sm:p-8 flex justify-center items-center">
              <span className="text-lg sm:text-xl text-gray-400">
                LP History coming soon
              </span>
            </div>
          ) : (
            <div className="p-6 sm:p-8 flex justify-center items-center">
              <span className="text-lg sm:text-xl text-gray-400">
                {activeTab} content coming soon
              </span>
            </div>
          )}
        </div>
      </div>
    </ChampionsStyleWrapper>
  );
};

const FormatTime = ({ minutes }) => {
  // Calculate the total seconds from minutes
  const totalSeconds = minutes * 60;

  // Create a moment duration from the total seconds
  const duration = moment.duration(totalSeconds, "seconds");

  // Format the duration into hours and minutes
  const formattedTime = moment.utc(duration.asMilliseconds()).format("HH:mm");

  return <span>{formattedTime}</span>;
};

export default User;
