import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { MdKeyboardDoubleArrowDown } from "react-icons/md";
import Link from "next/link.js";
import { GiBattleGear } from "react-icons/gi";
import ChampionsStyleWrapper from "./User.style.js";
import Comps from "../../data/compsNew.json";
import PlayerInfo from "../../data/user/playerInfo.json";
import matchHistory from "../../data/user/matchHistory.json";
import ReactTltp from "src/components/tooltip/ReactTltp.jsx";
import moment from "moment/moment.js";
import CardImage from "src/components/cardImage/index.js";
import MatchHistory from "./MatchHistory.jsx";
import TrendFilters from "src/components/trendFilters/index.js";
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
  const router = useRouter();
  const { user, matchId } = router.query;

  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
  const [activeTab, setActiveTab] = useState("Match History");
  const tabs = ["Comps", "Champions", "Traits", "Items"];

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
      <div className="">
        <div className="flex flex-col md:flex-row md:gap-2.5">
          <div className="md:w-4/12 w-full p-4 bg-glass">
            <div>
              <div className="flex flex-wrap justify-center items-center">
                <div className="relative w-40 h-40 flex-[0_0_10rem] mt-2 mx-[1.2rem]">
                  <span>
                    <div className="mt-0 ml-0 w-full h-full rounded-[50%] border-2 border-red-400 overflow-hidden">
                      <span className="block w-full h-full rounded-[50%] overflow-hidden relative">
                        <img
                          src="https://res.cloudinary.com/dg0cmj6su/image/upload/v1740809634/29_jaowdd.webp"
                          className="block w-full h-full rounded-[50%] scale-[1.15]"
                        />
                      </span>
                    </div>
                  </span>
                </div>
                <div className="tracking-[0.015rem] flex flex-wrap items-center justify-center w-full text-[2.4rem] leading-[3.6rem]">
                  <h1 className="m-0 overflow-ellipsis whitespace-nowrap overflow-hidden [font:500_2.4rem_/_3.6rem_Roboto,_sans-serif] tracking-[0.015rem]">
                    {playerInfo?.name}
                  </h1>
                  <span className="overflow-ellipsis whitespace-nowrap overflow-hidden text-gray-200 ml-1">
                    #{playerInfo?.tag}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-center flex-wrap gap-[8px] mt-[0.8rem] mx-[auto] mb-0 max-w-[27.6rem]">
                <div className="items-center justify-center inline-flex [text-shadow:rgba(0,_0,_0,_0.5)_0px_0px_1px] tracking-[0.025rem] px-[8px] py-[4px] rounded-lg bg-[#ffffff0d] text-[#ffffff] text-sm">
                  <span>
                    {playerInfo?.rankedLeague[0]} {playerInfo?.rankedLeague[1]}
                    LP
                  </span>
                </div>
                <div className="items-center justify-center inline-flex [text-shadow:rgba(0,_0,_0,_0.5)_0px_0px_1px] tracking-[0.025rem] px-[8px] py-[4px] rounded-lg bg-[#ffffff0d] text-[#ffffff] text-sm">
                  <span>
                    Top {(playerInfo?.localRank[1] * 100).toFixed(2)}%{" "}
                    {playerInfo?.tag}
                  </span>
                </div>
              </div>
              <br />
              <div className="flex flex-col items-center">
                <div className="grid gap-3 grid-cols-4">
                  <div className="font-montserrat font-medium flex flex-col items-center !border !border-[#ffffff40] shadow-md bg-[#222231] p-[11px] rounded-md w-[74px] lg:w-[80px]">
                    <div className="flex items-center pb-[5px] leading-none text-[25px] font-semibold">
                      <div>{seasonStats?.top4}</div>
                    </div>
                    <div className="text-[14px] lg:text-[15px] font-montserrat">
                      Top 4
                    </div>
                  </div>
                  <div className="font-montserrat font-medium flex flex-col items-center !border !border-[#ffffff40] shadow-md bg-[#222231] p-[11px] rounded-md w-[74px] lg:w-[80px]">
                    <div className="flex items-center pb-[5px] leading-none text-[25px] font-semibold">
                      <div>
                        {(
                          (seasonStats?.top4 * 100) /
                          seasonStats?.games
                        ).toFixed(1)}
                      </div>
                    </div>
                    <div className="text-[14px] lg:text-[15px] font-montserrat">
                      Top 4%
                    </div>
                  </div>
                  <div className="font-montserrat font-medium flex flex-col items-center !border !border-[#ffffff40] shadow-md bg-[#222231] p-[11px] rounded-md w-[74px] lg:w-[80px]">
                    <div className="flex items-center pb-[5px] leading-none text-[25px] font-semibold">
                      <div>{seasonStats?.win}</div>
                    </div>
                    <div className="text-[14px] lg:text-[15px] font-montserrat">
                      Won
                    </div>
                  </div>
                  <div className="font-montserrat font-medium flex flex-col items-center !border !border-[#ffffff40] shadow-md bg-[#222231] p-[11px] rounded-md w-[74px] lg:w-[80px]">
                    <div className="flex items-center pb-[5px] leading-none text-[25px] font-semibold">
                      <div>
                        {(
                          (seasonStats?.win * 100) /
                          seasonStats?.games
                        ).toFixed(1)}
                      </div>
                    </div>
                    <div className="text-[14px] lg:text-[15px] font-montserrat">
                      Won %
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="md:w-8/12 w-full md:p-6 bg-glass">
            <div>
              <div className="min-w-[20rem] rounded-[0.6rem] relative grid grid-cols-[calc(100%_-_var(--team-comps-items-size))_var(--team-comps-items-size)] max-w-[86rem] w-full">
                <div className="">
                  <header className="tracking-[0.025rem] bg-gradient-to-r from-[#22223100] via-[#222231] to-[#22223100] uppercase relative flex justify-between items-center px-[1.2rem] py-[0.6rem]">
                    <span className="text-center mx-auto !text-white">
                      Performance Overview
                    </span>
                  </header>
                  <div className="tracking-[0.025rem] pt-[1.2rem] px-[1.2rem] pb-[1.6rem] flex items-center flex-wrap -mx-[0.6rem] -my-[0.4rem]">
                    <div className="relative flex items-center flex-col flex-[1_0_auto] mx-[6px] my-[4px] rounded-lg w-[8.8rem] h-[8.8rem] p-[1.2rem] bg-[#222231] justify-end">
                      <div className="uppercase text-center text-[2.2rem] leading-[4.8rem]">
                        {seasonStats?.games}
                      </div>
                      <div className="tracking-[0.025rem] text-center h-16 overflow-hidden">
                        Games
                      </div>
                    </div>
                    <div className="relative flex items-center flex-col flex-[1_0_auto] mx-[6px] my-[4px] rounded-lg w-[8.8rem] h-[8.8rem] p-[1.2rem] bg-[#222231] justify-end">
                      <a className="inline-flex flex-col items-center h-auto relative">
                        <div className="relative">
                          <div className="block rounded-lg [filter:drop-shadow(rgba(0,_0,_0,_0.1)_0px_0px_0px)] !border !border-[solid] !border-[#ffffff] w-14 mb-2">
                            <span className="block w-full h-full rounded-lg border-[1px] border-[solid] border-[#151136] overflow-hidden relative">
                              <img
                                src={
                                  items?.find(
                                    (i) => i?.key === playerInfo?.fevoriteItem
                                  )?.imageUrl
                                }
                                className="block w-full h-full rounded-lg"
                              />
                            </span>
                          </div>
                        </div>
                      </a>
                      <div className="tracking-[0.025rem] text-center h-16 overflow-hidden leading-5">
                        Favorite Item
                      </div>
                    </div>
                    <div className="relative flex items-center flex-col flex-[1_0_auto] mx-[6px] my-[4px] rounded-lg w-[8.8rem] h-[8.8rem] p-[1.2rem] bg-[#222231] justify-end">
                      <a className="inline-flex flex-col items-center h-auto relative">
                        <div className="relative">
                          <div className="block rounded-lg [filter:drop-shadow(rgba(0,_0,_0,_0.1)_0px_0px_0px)] !border !border-[solid] !border-[#ffffff] w-14 mb-2">
                            <span className="block w-full h-full rounded-lg border-[1px] border-[solid] border-[#151136] overflow-hidden relative">
                              <img
                                src={
                                  champions?.find(
                                    (i) =>
                                      i?.key === playerInfo?.fevoriteChampion
                                  )?.cardImage
                                }
                                className="block w-full h-full rounded-lg"
                              />
                            </span>
                          </div>
                        </div>
                      </a>
                      <div className="tracking-[0.025rem] text-center h-16 overflow-hidden leading-5">
                        Favorite Champion
                      </div>
                    </div>
                    <div className="relative flex items-center flex-col flex-[1_0_auto] mx-[6px] my-[4px] rounded-lg w-[8.8rem] h-[8.8rem] p-[1.2rem] bg-[#222231] justify-end">
                      <div className="uppercase text-center text-[2.2rem] leading-[4.8rem]">
                        212
                      </div>
                      <div className="tracking-[0.025rem] text-center h-16 overflow-hidden">
                        Damage Dealt
                      </div>
                    </div>
                    <div className="relative flex items-center flex-col flex-[1_0_auto] mx-[6px] my-[4px] rounded-lg w-[8.8rem] h-[8.8rem] p-[1.2rem] bg-[#222231] justify-end">
                      <div className="uppercase text-center text-[2.2rem] leading-[4.8rem]">
                        {seasonStats?.avgPlace.toFixed(2)}
                      </div>
                      <div className="tracking-[0.025rem] text-center h-16 overflow-hidden">
                        Average
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <br />
              <div className="min-w-[20rem] rounded-[0.6rem] !border-[#ffffff40] !border [box-shadow:rgba(21,_11,_37,_0.5)_0px_2px_10px_0px] relative grid grid-cols-[calc(100%_-_var(--team-comps-items-size))_var(--team-comps-items-size)] max-w-[86rem] w-full bg-[#222231]">
                <div className="flex flex-col items-center py-3 hover:text-inherit">
                  <header className="flex items-end text-xl font-montserrat font-medium leading-none pb-2">
                    <div>Recent 20 Matches</div>
                    <div className="pl-[4px] pb-[1px] text-base leading-none">
                      {" "}
                      (Ranked)
                    </div>
                  </header>
                  <div className="px-2 flex flex-col sm:flex-row items-start sm:items-center gap-x-4">
                    <div className="grid gap-[5px] grid-cols-10">
                      {recentMatches.map((match, i) => (
                        <div>
                          <div
                            className={`rounded-xl rounded-tl-none bg-gradient-to-r from-[#FDF496] to-[#6D4600] p-[1px] ${match?.rank == 1 ? "text-[#FDF496] from-[#FDF496] to-[#6D4600]" : match?.rank == 2 ? "text-[#ab70eb] from-[#ab70eb] to-[#6607cb]" : match?.rank == 3 ? "text-[#ef884b] from-[#ef884b] to-[#92480c]" : "text-[#70cfeb] from-[#70cfeb] to-[#0c90b6]"}`}
                          >
                            <p
                              className={`rounded-xl rounded-tl-none px-2 mb-0 text-center bg-[#222231]`}
                            >
                              {match.rank}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Link href={`/user/${user}`} className="hover:text-inherit">
                      <div
                        className="font-montserrat flex flex-col items-center bg-[#5e56f7a7] hover:!border-2 hover:-translate-y-0.5 border-[#8884d8] !border shadow-lg hover:shadow-xl transition-all ease-in-out duration-300 justify-center rounded-md w-[66px] h-[66px]"
                        data-tooltip-id="allMatches"
                        data-tooltip-content="All Matches"
                      >
                        <div className="flex items-center font-semibold mb-0 css-kvo27r">
                          All
                        </div>
                      </div>
                      <ReactTltp id="allMatches" />
                    </Link>
                    <div className="flex justify-evenly items-center pt-3 md:!pt-0 w-full sm:w-auto gap-[10px]">
                      <div className="font-montserrat flex flex-col items-center bg-[#ffffff0d] py-[5px] rounded-md w-[66px] !border !border-[#ffffff40] shadow-xl">
                        <div className="flex items-center font-semibold pb-[4px] css-kvo27r">
                          <div>4.60</div>
                        </div>
                        <div className="text-[15px]">Avg.</div>
                      </div>
                      <div className="font-montserrat flex flex-col items-center bg-[#ffffff0d] py-[5px] rounded-md w-[66px] !border !border-[#ffffff40] shadow-xl">
                        <div className="flex items-center font-semibold pb-[4px] css-kvo27r">
                          <div>10</div>
                        </div>
                        <div className="text-[15px]">Top 4</div>
                      </div>
                      <div className="font-montserrat flex flex-col items-center bg-[#ffffff0d] py-[5px] rounded-md w-[66px] !border !border-[#ffffff40] shadow-xl">
                        <div className="flex items-center font-semibold pb-[4px] css-kvo27r">
                          <div>1</div>
                        </div>
                        <div className="text-[15px]">Won</div>
                      </div>
                      <div className="font-montserrat flex flex-col items-center bg-[#ffffff0d] py-[5px] rounded-md w-[66px] !border !border-[#ffffff40] shadow-xl">
                        <div className="flex items-center font-semibold pb-[4px] css-kvo27r">
                          <div>0</div>
                        </div>
                        <div className="text-[15px]">LP</div>
                      </div>
                    </div>
                  </div>
                </div>
                <Link href={`/user/${user}`} className="hover:text-inherit">
                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="p-1 absolute -bottom-8 left-1/2 -translate-x-1/2 rounded-full"
                  >
                    <MdKeyboardDoubleArrowDown className="text-2xl !text-white" />
                  </motion.div>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <nav className="">
          <ul className="flex flex-wrap pl-0 mb-4 list-none bg-[#222231]">
            {/* <li
              className={`flex-auto flex-grow-1 p-4 text-center !border-r !border-[#ffffff14] rounded-none font-black -mb-[1px] text-[12px] cursor-pointer px-[12px] md:p-0 ${
                activeTab === "Set 10" ? "!bg-[#ca9372]" : ""
              }`}
              onClick={() => setActiveTab("Set 10")}
            >
              <a>Set 10</a>
            </li> */}
            {/* <li
              className={`flex-auto flex-grow-1 p-4 text-center !border-r !border-[#ffffff14] rounded-none font-black -mb-[1px] text-[12px] cursor-pointer px-[12px] md:p-0 ${
                activeTab === "Match History" ? "!bg-[#ca9372]" : ""
              }`}
              onClick={() => setActiveTab("Match History")}
            >
              <a>Match History</a>
            </li> */}
            {/* <li
              className={`flex-auto flex-grow-1 p-4 text-center !border-r !border-[#ffffff14] rounded-none font-black -mb-[1px] text-[12px] cursor-pointer px-[12px] md:p-0 ${
                activeTab === "LP History" ? "!bg-[#ca9372]" : ""
              }`}
              onClick={() => setActiveTab("LP History")}
            >
              <a>LP History</a>
            </li> */}
          </ul>
        </nav>
        {activeTab === "Set 10" ? (
          <>aaaaa</>
        ) : activeTab === "Match History" ? (
          <div className="mt-2">
            {isLoading ? (
              <Loader />
            ) : (
              <>
                {matches?.length ? (
                  matches?.map((match, i) => (
                    <MatchHistory
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
                  <div className="w-full flex justify-center items-center">
                    <span className="text-xl">No matches found</span>
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          <>ccc</>
        )}
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
