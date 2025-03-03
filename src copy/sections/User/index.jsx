import React, { useState } from "react";
import dynamic from "next/dynamic";
import ChampionsStyleWrapper from "./User.style.js";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
const TierGraph = dynamic(() => import("./TierGraph"), {
  ssr: false, // This line is key to making it only render on the client-side
});
import Comps from "../../data/compsNew.json";
import PlayerInfo from "../../data/user/playerInfo.json";
import matchHistory from "../../data/user/matchHistory.json";
import ReactTltp from "src/components/tooltip/ReactTltp.jsx";
import moment from "moment/moment.js";
import CardImage from "src/components/cardImage/index.js";

const User = () => {
  const {
    props: {
      pageProps: {
        dehydratedState: {
          queries: { data },
        },
      },
    },
  } = Comps;

  const { matches, playerInfo, rankHistory, seasonStats } = PlayerInfo;
  const { info: matchHistoryInfo, id, ranks } = matchHistory;

  const { metaDecks } = data?.metaDeckList;
  const { champions } = data?.refs;
  const { items } = data?.refs;
  const { traits } = data?.refs;

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
  const [expandedHistory, setExpandedHistory] = useState(null);

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
      <div className="container md:!max-w-[95%]">
        <div className="flex flex-col md:flex-row md:gap-2.5">
          <div className="md:w-4/12 w-full p-4 bg-glass">
            <div>
              <div className="flex flex-wrap justify-center items-center">
                <div className="relative w-40 h-40 flex-[0_0_10rem] mt-2 mx-[1.2rem]">
                  <span>
                    <div className="mt-0 ml-0 w-full h-full rounded-[50%] border-2 border-red-400 overflow-hidden">
                      <span className="block w-full h-full rounded-[50%] overflow-hidden relative">
                        <img
                          src="https://cdn.mobalytics.gg/assets/lol/images/dd/summoner-icons/29.png?1"
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
                <div className="items-center justify-center inline-flex [text-shadow:rgba(0,_0,_0,_0.5)_0px_0px_1px] tracking-[0.025rem] px-[8px] py-[4px] rounded-[3px] bg-[#ffffff0d] text-[#ffffff] text-sm">
                  <span>
                    {playerInfo?.rankedLeague[0]} {playerInfo?.rankedLeague[1]}
                    LP
                  </span>
                </div>
                <div className="items-center justify-center inline-flex [text-shadow:rgba(0,_0,_0,_0.5)_0px_0px_1px] tracking-[0.025rem] px-[8px] py-[4px] rounded-[3px] bg-[#ffffff0d] text-[#ffffff] text-sm">
                  <span>
                    Top {(playerInfo?.localRank[1] * 100).toFixed(2)}%{" "}
                    {playerInfo?.tag}
                  </span>
                </div>
              </div>
              <br />
              <div className="flex flex-col items-center">
                <div className="grid gap-3 grid-cols-4">
                  <div className="font-montserrat font-medium flex flex-col items-center bg-[#222231] p-[11px] rounded-md w-[74px] lg:w-[80px]">
                    <div className="flex items-center pb-[5px] leading-none text-[25px] font-semibold">
                      <div>{seasonStats?.top4}</div>
                    </div>
                    <div className="text-[14px] lg:text-[15px] font-montserrat">
                      Top 4
                    </div>
                  </div>
                  <div className="font-montserrat font-medium flex flex-col items-center bg-[#222231] p-[11px] rounded-md w-[74px] lg:w-[80px]">
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
                  <div className="font-montserrat font-medium flex flex-col items-center bg-[#222231] p-[11px] rounded-md w-[74px] lg:w-[80px]">
                    <div className="flex items-center pb-[5px] leading-none text-[25px] font-semibold">
                      <div>{seasonStats?.win}</div>
                    </div>
                    <div className="text-[14px] lg:text-[15px] font-montserrat">
                      Won
                    </div>
                  </div>
                  <div className="font-montserrat font-medium flex flex-col items-center bg-[#222231] p-[11px] rounded-md w-[74px] lg:w-[80px]">
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
              <div className="min-w-[20rem] rounded-[0.6rem] [box-shadow:rgba(21,_11,_37,_0.5)_0px_2px_10px_0px] relative grid grid-cols-[calc(100%_-_var(--team-comps-items-size))_var(--team-comps-items-size)] max-w-[86rem] w-full">
                <div className="">
                  <header className="tracking-[0.025rem] uppercase relative flex justify-between items-center px-[1.2rem] py-[0.6rem]">
                    Performance Overview
                  </header>
                  <div className="tracking-[0.025rem] pt-[1.2rem] px-[1.2rem] pb-[1.6rem] flex items-center flex-wrap -mx-[0.6rem] -my-[0.4rem]">
                    <div className="relative flex items-center flex-col flex-[1_0_auto] mx-[6px] my-[4px] rounded-[3px] w-[8.8rem] h-[8.8rem] p-[1.2rem] bg-[#222231] justify-end">
                      <div className="uppercase text-center text-[2.2rem] leading-[4.8rem]">
                        {seasonStats?.games}
                      </div>
                      <div className="tracking-[0.025rem] text-center h-16 overflow-hidden">
                        Games
                      </div>
                    </div>
                    <div className="relative flex items-center flex-col flex-[1_0_auto] mx-[6px] my-[4px] rounded-[3px] w-[8.8rem] h-[8.8rem] p-[1.2rem] bg-[#222231] justify-end">
                      <div>
                        <img
                          src="https://cdn.mobalytics.gg/assets/tft/images/game-items/set11/guardbreaker.png?v=59"
                          className="opacity-100 bg-transparent [transition:opacity_0.4s] block overflow-hidden border-[1px] border-[solid] border-[#f2bf43] w-[3.2rem] h-[3.2rem]"
                        />
                      </div>
                      <div className="tracking-[0.025rem] text-center h-16 overflow-hidden">
                        Favorite Combined Item
                      </div>
                    </div>
                    <div className="relative flex items-center flex-col flex-[1_0_auto] mx-[6px] my-[4px] rounded-[3px] w-[8.8rem] h-[8.8rem] p-[1.2rem] bg-[#222231] justify-end">
                      <a className="inline-flex flex-col items-center h-auto relative mb-[0.8rem]">
                        <div className="relative">
                          <div className="block rounded-[50%] [filter:drop-shadow(rgba(0,_0,_0,_0.1)_0px_0px_0px)] border-[2px] border-[solid] border-[#1bc660] w-[40px] h-[40px]">
                            <span className="block w-full h-full rounded-[50%] border-[1px] border-[solid] border-[#151136] overflow-hidden relative">
                              <img
                                src="https://cdn.mobalytics.gg/assets/tft/images/champions/icons/set11/neeko.png?v=59"
                                className="block w-full h-full rounded-[50%] scale-[1.15]"
                              />
                            </span>
                          </div>
                        </div>
                      </a>
                      <div className="tracking-[0.025rem] text-center h-16 overflow-hidden">
                        Favorite Champion
                      </div>
                    </div>
                    <div className="relative flex items-center flex-col flex-[1_0_auto] mx-[6px] my-[4px] rounded-[3px] w-[8.8rem] h-[8.8rem] p-[1.2rem] bg-[#222231] justify-end">
                      <div className="uppercase text-center text-[2.2rem] leading-[4.8rem]">
                        212
                      </div>
                      <div className="tracking-[0.025rem] text-center h-16 overflow-hidden">
                        Damage Dealt
                      </div>
                    </div>
                    <div className="relative flex items-center flex-col flex-[1_0_auto] mx-[6px] my-[4px] rounded-[3px] w-[8.8rem] h-[8.8rem] p-[1.2rem] bg-[#222231] justify-end">
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
              <div className="min-w-[20rem] rounded-[0.6rem] [box-shadow:rgba(21,_11,_37,_0.5)_0px_2px_10px_0px] border-[solid] relative grid grid-cols-[calc(100%_-_var(--team-comps-items-size))_var(--team-comps-items-size)] max-w-[86rem] w-full bg-[#222231]">
                <div className="flex flex-col items-center py-3">
                  <header className="flex items-end text-xl font-montserrat font-medium leading-none pb-2">
                    <div>Recent 20 Matches</div>
                    <div className="pl-[4px] pb-[1px] text-base leading-none">
                      {" "}
                      (Ranked)
                    </div>
                  </header>
                  <div className="px-2 flex flex-col sm:flex-row items-start sm:items-center">
                    <div className="grid gap-[5px] grid-cols-10">
                      {Array(20)
                        .fill(0)
                        .map((_, i) => (
                          <div>
                            <p className="border !border-solid !border-gray-300 !rounded-md px-1 mb-0 text-center">
                              {i + 1}
                            </p>
                          </div>
                        ))}
                    </div>
                    <div className="flex justify-evenly items-center pt-3 md:!pt-0 sm:pl-5 w-full sm:w-auto gap-[10px]">
                      <div className="font-montserrat flex flex-col items-center bg-[#ffffff0d] py-[10px] rounded-md w-[66px]">
                        <div className="flex items-center font-semibold pb-[4px] css-kvo27r">
                          <div>4.60</div>
                        </div>
                        <div className="text-[15px]">Avg.</div>
                      </div>
                      <div className="font-montserrat flex flex-col items-center bg-[#ffffff0d] py-[10px] rounded-md w-[66px]">
                        <div className="flex items-center font-semibold pb-[4px] css-kvo27r">
                          <div>10</div>
                        </div>
                        <div className="text-[15px]">Top 4</div>
                      </div>
                      <div className="font-montserrat flex flex-col items-center bg-[#ffffff0d] py-[10px] rounded-md w-[66px]">
                        <div className="flex items-center font-semibold pb-[4px] css-kvo27r">
                          <div>1</div>
                        </div>
                        <div className="text-[15px]">Won</div>
                      </div>
                      <div className="font-montserrat flex flex-col items-center bg-[#ffffff0d] py-[10px] rounded-md w-[66px]">
                        <div className="flex items-center font-semibold pb-[4px] css-kvo27r">
                          <div>0</div>
                        </div>
                        <div className="text-[15px]">LP</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <nav className="mb-5">
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
          <div>
            {matches?.map((match, i) => (
              <div className=" mb-4">
                <div className="flex flex-col gap-[1px] border border-[#323232] bg-[#323232] bg-glass rounded-bl-xl rounded-br-xl">
                  <header className="relative flex flex-col justify-between bg-[#222231] py-[5px] px-4 lg:min-h-[50px] lg:flex-row lg:items-center lg:py-[5px] lg:pr-[16px]">
                    <div className="inline-flex flex-col flex-wrap gap-[8px] md:flex-row mt-2 md:mt-0 items-center md:gap-[4px]">
                      <img src={match?.info?.imageUrl} className="w-12" />
                      <strong className="text-[16px] font-semibold text-center leading-none text-[#ffffff] md:mr-2">
                        {match?.gameType}
                      </strong>
                      <span className="text-[14px] leading-none text-center text-[#999]">
                        {moment(match?.dateTime).fromNow()} • {match?.duration}
                      </span>
                      <div className="flex justify-center items-center gap-x-1 ml-2">
                        <img
                          src="https://res.cloudinary.com/dg0cmj6su/image/upload/v1722934556/coin_6369589_wbb7uk.png"
                          className="w-4"
                        />
                        <span className="text-[12px]">
                          {" "}
                          {match?.info?.coins}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-center items-center">
                      {match?.info?.traits?.map((trait, i) => (
                        <div className="">
                          <img
                            src={
                              traits
                                ?.find((t) => t?.key === trait?.name)
                                ?.styles.find(
                                  (style) =>
                                    style?.min <= trait?.numUnits &&
                                    style?.max >= trait?.numUnits
                                )?.imageUrl
                            }
                            className="w-14"
                          />
                        </div>
                      ))}
                    </div>
                  </header>
                  <div>
                    <div
                      className="flex flex-col bg-center bg-no-repeat mt-[-1px] rounded-bl-xl rounded-br-xl border-[1px] border-[#ffffff30] bg-[#222231]"
                      // style={{
                      //   backgroundImage: `url(${cardBg.src})`,
                      //   backgroundSize: "cover",
                      // }}
                    >
                      <div className="flex flex-col justify-between items-center bg-[#27282E] py-[16px] lg:flex-row lg:gap-[15px] lg:bg-transparent lg:py-[0px] xl:pr-[24px]">
                        <div className="mb-[16px] lg:mb-0 lg:w-full lg:flex-shrink-0">
                          <div className="md:flex flex-wrap justify-between items-center gap-2 py-4">
                            <div className="md:w-[5%] flex items-center justify-center relative flex-col ml-5">
                              <div className="relative flex flex-col justify-center items-center rounded-[20px] mx-auto">
                                <p className="mb-0 font-bold text-[36px] leading-none">
                                  {match?.info?.placement}
                                </p>
                                <p className="mb-0 font-bold text-lg">Place</p>
                              </div>
                            </div>
                            <div className="md:w-[20%]">
                              <div className="flex flex-wrap items-center justify-center gap-1 mb-3 md:mb-0 bg-glass py-3 rounded-md">
                                <img
                                  src="https://res.cloudinary.com/dg0cmj6su/image/upload/v1717820773/Amazon_level_3_dark_rbwllv.png"
                                  className="w-12 md:w-16"
                                />
                                <img
                                  src="https://res.cloudinary.com/dg0cmj6su/image/upload/v1717820777/Assassin_Level_3_wind_f_ql7pkk.png"
                                  className="w-12 md:w-16"
                                />
                                <img
                                  src="https://res.cloudinary.com/dg0cmj6su/image/upload/v1717820798/Dwarf_level_3_dark_z1zhmd.png"
                                  className="w-12 md:w-16"
                                />
                              </div>
                            </div>
                            <div className="md:w-[70%]">
                              <div className="flex flex-wrap items-center justify-center gap-1">
                                {match?.info?.units
                                  ?.slice(0, 7)
                                  ?.map((unit, i) => (
                                    <div>
                                      <CardImage
                                        src={champions?.find(
                                          (champion) =>
                                            champion?.key === unit?.key
                                        )}
                                        imgStyle="w-[68px] md:w-[112px]"
                                        identificationImageStyle="w=[16px] md:w-[32px]"
                                        textStyle="text-[10px] md:text-[16px]"
                                      />
                                      <div className="flex justify-center items-center md:min-h-[32px] min-h-[24px]">
                                        {unit?.items?.map((item, i) => (
                                          <div>
                                            <img
                                              src={
                                                items?.find(
                                                  (i) => i?.key === item
                                                )?.imageUrl
                                              }
                                              className="w-[24px] md:w-[32px]"
                                              data-tooltip-id={
                                                items?.find(
                                                  (i) => i?.key === item
                                                )?.imageUrl
                                              }
                                            />
                                            <ReactTltp
                                              content={
                                                items?.find(
                                                  (i) => i?.key === item
                                                )?.name
                                              }
                                              id={
                                                items?.find(
                                                  (i) => i?.key === item
                                                )?.imageUrl
                                              }
                                            />
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  ))}
                                {match?.info?.units?.length > 8 && (
                                  <div>
                                    <div className="w-[72px] md:w-24 h-[72px] md:h-24 bg-glass rounded-lg relative">
                                      <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 text-center text-2xl">
                                        +{match?.info?.units?.length - 8}
                                      </div>
                                    </div>
                                    <div className="flex justify-center items-center md:min-h-[32px] min-h-[24px]"></div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={`bg-glass md:mx-3 rounded-bl-xl rounded-br-xl`}>
                  <div
                    className={`overflow-scroll md:!overflow-auto  transition-all duration-500 ease-out ${expandedHistory === i ? "max-h-expanded opacity-100" : "max-h-0 opacity-0"}`}
                  >
                    <div className="px-3 pt-4 w-[950px] md:w-full">
                      {/* <div className="flex justify-between items-center">
                        <div className="w-[3%]">#</div>
                        <div className="w-[15%]">Summoner</div>
                        <div className="w-[7%]">Round</div>
                        <div className="w-[20%]">Augments</div>
                        <div className="w-[45%]">Champions</div>
                        <div className="w-[10%]">Stat</div>
                      </div> */}
                      {matchHistoryInfo?.participants?.map((participant, i) => (
                        <div className=" shadow-lg p-3 rounded-md">
                          <div className="flex flex-wrap justify-between items-center gap-1 bg-gradient-to-r from-[#22223120] from-80% to-[#ffffff0d]">
                            <div className="flex justify-center items-center flex-wrap">
                              <div className="mr-4 text-lg">
                                {participant?.name}
                              </div>
                              <div>
                                <div
                                  data-tooltip-id={participant?.name}
                                  className="bg-[#262626] rounded-md px-2"
                                >
                                  6-1
                                </div>
                                <ReactTltp
                                  content={"Round"}
                                  id={participant?.name}
                                />
                              </div>
                            </div>
                            <div className="flex flex-wrap justify-end">
                              {participant?.traits?.map((trait, i) => (
                                <img
                                  src={
                                    traits
                                      ?.find((t) => t?.key === trait?.name)
                                      ?.styles.find(
                                        (style) =>
                                          style?.min <= trait?.numUnits &&
                                          style?.max >= trait?.numUnits
                                      )?.imageUrl
                                  }
                                  className="w-8"
                                />
                              ))}
                            </div>
                          </div>
                          <div className="flex flex-wrap justify-between items-center">
                            <div className="w-[5%]">
                              <div className="relative">
                                <img
                                  src={participant?.imageUrl}
                                  className="w-12 relative"
                                />
                                <div className="absolute bottom-0 right-2 px-2 rounded-full bg-[#444]">
                                  {participant?.level}
                                </div>
                              </div>
                            </div>
                            <div className="w-[15%]">
                              <div className="flex items-center gap-1">
                                <img
                                  src="https://res.cloudinary.com/dg0cmj6su/image/upload/v1717820773/Amazon_level_3_dark_rbwllv.png"
                                  className="w-12 md:w-16"
                                />
                                <img
                                  src="https://res.cloudinary.com/dg0cmj6su/image/upload/v1717820777/Assassin_Level_3_wind_f_ql7pkk.png"
                                  className="w-12 md:w-16"
                                />
                                <img
                                  src="https://res.cloudinary.com/dg0cmj6su/image/upload/v1717820798/Dwarf_level_3_dark_z1zhmd.png"
                                  className="w-12 md:w-16"
                                />
                              </div>
                            </div>
                            <div className="w-[74%]">
                              <div className="flex items-center justify-center gap-1">
                                {participant?.units?.map((unit, i) => (
                                  <div>
                                    <CardImage
                                      src={champions?.find(
                                        (champion) =>
                                          champion?.key === unit?.key
                                      )}
                                      imgStyle="w-[68px] md:w-[112px]"
                                      identificationImageStyle="w=[16px] md:w-[32px]"
                                      textStyle="text-[10px] md:text-[16px]"
                                    />
                                    <div className="flex justify-center items-center md:min-h-[37px] min-h-[24px]">
                                      {unit?.items?.map((item, i) => (
                                        <div>
                                          <img
                                            src={
                                              items?.find(
                                                (i) => i?.key === item
                                              )?.imageUrl
                                            }
                                            className="w-[24px] md:w-[37px]"
                                            data-tooltip-id={
                                              items?.find(
                                                (i) => i?.key === item
                                              )?.imageUrl
                                            }
                                          />
                                          <ReactTltp
                                            content={
                                              items?.find(
                                                (i) => i?.key === item
                                              )?.name
                                            }
                                            id={
                                              items?.find(
                                                (i) => i?.key === item
                                              )?.imageUrl
                                            }
                                          />
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {expandedHistory === i ? (
                    <div
                      className="w-full p-0.5 bg-[#13131370] shadow-lg cursor-pointer rounded-bl-xl rounded-br-xl"
                      onClick={() =>
                        expandedHistory === i ? setExpandedHistory(null) : null
                      }
                    >
                      <IoIosArrowUp className="mx-auto text-center" size={16} />
                    </div>
                  ) : (
                    <div
                      className="w-full p-0.5 bg-[#13131370] shadow-lg cursor-pointer rounded-bl-xl rounded-br-xl"
                      onClick={() =>
                        expandedHistory !== i ? setExpandedHistory(i) : null
                      }
                    >
                      <IoIosArrowDown
                        className="mx-auto text-center"
                        size={16}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
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
