import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import ChampionsStyleWrapper from "./CompsDetails.style.js";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import Comps from "../../data/compsNew.json";
import augment from "@assets/image/augments/1.png";
import arrowRight from "@assets/image/icons/arrow-right.svg";
import PlayerInfo from "../../data/user/playerInfo.json";
import ReactTltp from "src/components/tooltip/ReactTltp.jsx";
import moment from "moment/moment.js";
import CardImage from "src/components/cardImage/index.js";
import { FaStar } from "react-icons/fa";
import CompsData from "../../data/compsDetails.json";

const CompsDetails = () => {
  const {
    pageProps: {
      data: {
        metaDeck: {
          matchRefs,
          metaDecks,
          championStats,
          itemStats,
          augmentStyleStats,
        },
        refs: { champions, items, traits, augments, matches, summoners },
      },
    },
  } = CompsData;

  //   console.log("test", metaDecks, champions, items, traits, augments, matches);

  const { t } = useTranslation();
  const others = t("others");
  const {
    props: {
      pageProps: {
        dehydratedState: {
          queries: { data },
        },
      },
    },
  } = Comps;
  const compsInfo = matchRefs.map((ref) => {
    const match = matches.find((match) => match.key === ref.matchId);
    return {
      ...ref,
      ...match,
    };
  });
  const [compsData, setCompsData] = useState(compsInfo);
  const [selectedChampion, setSelectedChampion] = useState(
    championStats?.[0]?.key
  );
  const [selectedItem, setSelectedItem] = useState(items?.[0]?.key);
  const [expandedHistory, setExpandedHistory] = useState(null);

  const [activeTab, setActiveTab] = useState("Match History");
  const tabs = ["Comps", "Champions", "Traits", "Items"];

  const backgroundStyle = {
    backgroundImage: "url(//cdn.dak.gg/tft/images2/profile/level-bg.png)",
    backgroundRepeat: "no-repeat",
    // You can add more CSS properties here as needed, like backgroundSize or backgroundPosition
  };

  return (
    <ChampionsStyleWrapper>
      <div className="container md:!max-w-[95%]">
        <div className="flex flex-col md:gap-2.5">
          <div
            className="flex flex-col gap-[1px] border border-[#323232] bg-[#323232] mb-4"
            style={{
              background: "rgba(0, 0, 0, 0.2)",
              backdropFilter: "blur(2px)",
            }}
          >
            <header className="relative md:flex flex-col justify-between bg-[#1a1b30] py-[15px] pl-[16px] pr-[54px] lg:min-h-[50px] lg:flex-row lg:items-center lg:py-[5px] lg:pr-[16px]">
              <div className="inline-flex flex-col flex-wrap gap-[8px] md:flex-row md:items-center md:gap-[4px]">
                <strong className="text-[26px] font-semibold leading-none text-[#ffffff]">
                  Girl Crush
                </strong>
                <span className="flex justify-center items-center">
                  {metaDecks
                    ?.find(
                      (deck) => deck?.key === "e44075ab3a2447dd513fbb8adb1e50b3"
                    )
                    ?.deck?.forces?.map((force, i) => (
                      <>
                        <div className="flex justify-center items-center bg-[#000] rounded-full mx-1 pr-2 border-[1px] border-[#ffffff50]">
                          <img
                            src={
                              traits?.find(
                                (t) =>
                                  t.key.toLowerCase() ===
                                  force?.key.toLowerCase()
                              )?.imageUrl
                            }
                            data-tooltip-id={force?.key}
                            alt=""
                            className="w-[24px] h-[24px] md:w-[40px] md:h-[40px] mr-1"
                          />
                          <ReactTltp content={force?.key} id={force?.key} />
                          <span className="text-[18px]">{force?.numUnits}</span>
                        </div>
                      </>
                    ))}
                </span>
              </div>
              <div className="inline-flex flex-shrink-0 gap-[22px] mt-2 md:mt-0">
                <div className="inline-flex flex-wrap">
                  {metaDecks
                    ?.find(
                      (deck) => deck?.key === "e44075ab3a2447dd513fbb8adb1e50b3"
                    )
                    ?.deck?.traits?.map((trait, i) => (
                      <>
                        {traits
                          ?.find((t) => t.key === trait?.key)
                          ?.styles?.find(
                            (s) =>
                              s?.min >= trait?.numUnits &&
                              s?.max <= trait?.numUnits
                          )?.imageUrl && (
                          <div
                            className="relative w-[24px] h-[24px] md:w-[56px] md:h-[56px]"
                            // style={{
                            //   backgroundImage: `url(${traitBg.src})`,
                            //   width: "48px",
                            //   height: "48px",
                            // }}
                          >
                            <img
                              src={
                                traits
                                  ?.find((t) => t.key === trait?.key)
                                  ?.styles?.find(
                                    (s) =>
                                      s?.min >= trait?.numUnits &&
                                      s?.max <= trait?.numUnits
                                  )?.imageUrl
                              }
                              alt=""
                              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-cover object-center w-[24px] md:w-[56px]"
                              data-tooltip-id={
                                traits?.find((t) => t.key === trait?.key)?.key
                              }
                            />
                            <ReactTltp
                              variant="trait"
                              id={
                                traits?.find((t) => t.key === trait?.key)?.key
                              }
                              content={{
                                ...traits?.find((t) => t.key === trait?.key),
                                numUnits: trait?.numUnits,
                              }}
                            />
                          </div>
                        )}
                      </>
                    ))}
                </div>
              </div>
            </header>
            <div>
              <div
                className="flex flex-col bg-center bg-no-repeat mt-[-1px]"
                // style={{
                //   backgroundImage: `url(${cardBg.src})`,
                //   backgroundSize: "cover",
                // }}
              >
                <div className="flex min-h-[150px] flex-col justify-between items-center bg-[#27282E] py-[16px] lg:flex-row lg:gap-[15px] bg-transparent lg:py-[0px] xl:pr-[24px]">
                  <div className="mb-[16px] max-w-[342px] lg:mb-0 lg:w-full lg:max-w-[80%] lg:flex-shrink-0">
                    <div
                      className="flex flex-wrap justify-center"
                      style={{ gap: "6px" }}
                    >
                      {metaDecks
                        ?.find(
                          (deck) =>
                            deck?.key === "e44075ab3a2447dd513fbb8adb1e50b3"
                        )
                        ?.deck?.champions?.slice(0, 8)
                        .map((champion, i) => (
                          <div
                            className="inline-flex flex-col items-center"
                            style={{ gap: "4px" }}
                          >
                            <p
                              className="ellipsis text-center text-[13px] md:text-[18px] leading-[14px] text-[#808080] font-extralight
                                           w-full p-[2px] m-0"
                              style={{
                                color: "rgb(255, 255, 255)",
                                textShadow:
                                  "rgb(0, 0, 0) -1px 0px 2px, rgb(0, 0, 0) 0px 1px 2px, rgb(0, 0, 0) 1px 0px 2px, rgb(0, 0, 0) 0px -1px 2px",
                              }}
                            >
                              {
                                champions?.find((c) => c.key === champion?.key)
                                  ?.name
                              }
                            </p>
                            <div className="inline-flex items-center justify-center flex-col">
                              <div className="inline-flex flex-col">
                                <div className="flex flex-col w-[72px] h-[72px] md:w-[125px] md:h-[125px] rounded-[20px]">
                                  <div
                                    className="relative inline-flex rounded-[10px] border-2 [box-shadow:rgba(255,_0,_0,_0.8)_0px_7px_29px_0px]"
                                    data-tooltip-id={
                                      champions?.find(
                                        (c) => c.key === champion?.key
                                      )?.key
                                    }
                                  >
                                    <img
                                      src={
                                        champions?.find(
                                          (c) => c.key === champion?.key
                                        )?.imageUrl
                                      }
                                      className="h-full w-full object-cover object-center"
                                    />
                                    <img
                                      src={
                                        champions?.find(
                                          (c) => c.key === champion?.key
                                        )?.identificationImageUrl
                                      }
                                      className="absolute -top-[3px] -right-[3px] w-[20px] md:w-[30px]"
                                    />
                                  </div>
                                  <ReactTltp
                                    variant="champion"
                                    id={
                                      champions?.find(
                                        (c) => c.key === champion?.key
                                      )?.key
                                    }
                                    content={champions?.find(
                                      (c) => c.key === champion?.key
                                    )}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="inline-flex items-center justify-center w-full">
                              {champion?.items &&
                                champion?.items.length &&
                                champion?.items.map((item, i) => (
                                  <div className="relative z-10 hover:z-20">
                                    <ReactTltp
                                      variant="item"
                                      content={items?.find(
                                        (i) => i.key === item
                                      )}
                                      id={
                                        items?.find((i) => i.key === item)?.key
                                      }
                                    />
                                    <img
                                      src={
                                        items?.find((i) => i.key === item)
                                          ?.imageUrl
                                      }
                                      alt=""
                                      className="md:w-[40px] md:h-[40px] w-[22px] h-[22px] hover:scale-150 transition-all duration-300"
                                      key={i}
                                      data-tooltip-id={
                                        items?.find((i) => i.key === item)?.key
                                      }
                                    />
                                  </div>
                                ))}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                  <div className="mb-[12px] mt-[12px] grid w-full grid-cols-2 md:grip-cols-4 gap-[4px] sm:w-auto md:mb-0 md:!flex md:items-center">
                    <div className="md:!hidden flex h-[98px] flex-col justify-between rounded-[4px] bg-[#1D1D1D] py-[12px] sm:w-[126px] sm:px-[6px] lg:w-[130px]">
                      <div className="flex justify-center gap-[2px]">
                        <span className="text-[12px] leading-none text-[#999]">
                          Best Augments
                        </span>
                        <div>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 13 13"
                            width="13"
                            height="13"
                            fill="currentColor"
                            color="#999"
                          >
                            <path d="M6.5.688C3.29.688.687 3.313.687 6.5A5.811 5.811 0 0 0 6.5 12.313c3.188 0 5.813-2.602 5.813-5.813C12.313 3.312 9.687.687 6.5.687Zm0 10.5A4.671 4.671 0 0 1 1.812 6.5 4.686 4.686 0 0 1 6.5 1.812 4.701 4.701 0 0 1 11.188 6.5 4.686 4.686 0 0 1 6.5 11.188Zm0-7.922a.975.975 0 0 0-.984.984c0 .563.421.984.984.984.54 0 .984-.421.984-.984a.99.99 0 0 0-.984-.984Zm1.313 5.953v-.563c0-.14-.141-.281-.282-.281H7.25V6.031c0-.14-.14-.281-.281-.281h-1.5a.285.285 0 0 0-.282.281v.563a.27.27 0 0 0 .282.281h.281v1.5h-.281a.285.285 0 0 0-.282.281v.563a.27.27 0 0 0 .282.281H7.53c.14 0 .282-.117.282-.281Z"></path>
                          </svg>
                        </div>
                      </div>
                      <div className="flex justify-center gap-[2px] lg:py-[8px] lg:px-[6px]">
                        {Array(3)
                          .fill()
                          .map((_, i) => (
                            <div className="flex justify-center items-center relative">
                              <img
                                src={augment.src}
                                alt=""
                                className=""
                                width={34}
                                height={34}
                              />
                            </div>
                          ))}
                      </div>
                    </div>
                    {/* This is a navigation button which is hidden on Medium Screen */}
                    <div className="hidden md:hidden h-[98px] flex-col justify-between rounded-[4px] bg-[#1D1D1D] py-[12px] sm:w-[126px]">
                      <p className="flex justify-center gap-[4px] text-center text-[12px] leading-none m-0">
                        <span className="text-[#999]">AvgPl.</span>{" "}
                        <span className="text-white">#3.06</span>
                      </p>
                      <div className="flex justify-center">
                        <div className="inline-flex h-[50px] gap-[6px]">
                          <div className="inline-flex h-[50px] gap-[6px]">
                            <div className="flex w-[4px] flex-col-reverse bg-[#1A1B30]">
                              <div
                                className="w-full"
                                style={{
                                  backgroundColor: "rgb(17, 178, 136)",
                                  height: "100%",
                                }}
                              ></div>
                            </div>
                            <div className="flex w-[4px] flex-col-reverse bg-[#1A1B30]">
                              <div
                                className="w-full"
                                style={{
                                  backgroundColor: "rgb(32, 122, 199)",
                                  height: "82.7%",
                                }}
                              ></div>
                            </div>
                            <div className="flex w-[4px] flex-col-reverse bg-[#1A1B30]">
                              <div
                                className="w-full"
                                style={{
                                  backgroundColor: "rgb(32, 122, 199)",
                                  height: "62.3%",
                                }}
                              ></div>
                            </div>
                            <div className="flex w-[4px] flex-col-reverse bg-[#1A1B30]">
                              <div
                                className="w-full"
                                style={{
                                  backgroundColor: "rgb(32, 122, 199)",
                                  height: "43.9%",
                                }}
                              ></div>
                            </div>
                            <div className="flex w-[4px] flex-col-reverse bg-[#1A1B30]">
                              <div
                                className="w-full"
                                style={{
                                  backgroundColor: "rgb(160, 160, 160)",
                                  height: "34.8%",
                                }}
                              ></div>
                            </div>
                            <div className="flex w-[4px] flex-col-reverse bg-[#1A1B30]">
                              <div
                                className="w-full"
                                style={{
                                  backgroundColor: "rgb(160, 160, 160)",
                                  height: "25.3%",
                                }}
                              ></div>
                            </div>
                            <div className="flex w-[4px] flex-col-reverse bg-[#1A1B30]">
                              <div
                                className="w-full"
                                style={{
                                  backgroundColor: "rgb(160, 160, 160)",
                                  height: "17.4%",
                                }}
                              ></div>
                            </div>
                            <div className="flex w-[4px] flex-col-reverse bg-[#1A1B30]">
                              <div
                                className="w-full"
                                style={{
                                  backgroundColor: "rgb(160, 160, 160)",
                                  height: "8.9%",
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="hidden md:flex md:flex-col justify-center gap-[2px] lg:py-[8px]">
                      {Array(3)
                        .fill()
                        .map((_, i) => (
                          <div className="flex justify-center items-center md:w-[64px] relative">
                            <img
                              src={augment.src}
                              alt=""
                              className="w-[64px] md:w-[86px]"
                            />
                          </div>
                        ))}
                    </div>
                    {/* This is a navigation button which is hidden on Medium Screen */}
                    <div className="flex flex-col">
                      <div className="flex h-[98px] w-full flex-col justify-between rounded-[4px] bg-[#1D1D1D] py-[12px] px-[16px] sm:px-[18px]">
                        <dl className="flex justify-between">
                          <dt className="text-[11px] md:text-[16px] font-bold leading-none text-[#999]">
                            {others?.top4}
                          </dt>
                          <dd className="text-[11px] md:text-[16px] font-bold leading-none text-white">
                            <span>65.3%</span>
                          </dd>
                        </dl>
                        <dl className="flex justify-between">
                          <dt className="text-[11px] md:text-[16px] font-bold leading-none text-[#999]">
                            {others?.winPercentage}
                          </dt>
                          <dd className="text-[11px] md:text-[16px] font-bold leading-none text-white">
                            <span>26.6%</span>
                          </dd>
                        </dl>
                        <dl className="flex justify-between">
                          <dt className="text-[11px] md:text-[16px] font-bold leading-none text-[#999]">
                            {others?.pickPercentage}
                          </dt>
                          <dd className="text-[11px] md:text-[16px] font-bold leading-none text-white">
                            <span>0.39%</span>
                          </dd>
                        </dl>
                        <dl className="flex justify-between">
                          <dt className="text-[11px] md:text-[16px] font-bold leading-none text-[#999]">
                            {others?.avgPlacement}
                          </dt>
                          <dd className="text-[11px] md:text-[16px] font-bold leading-none text-white">
                            <span>4.52</span>
                          </dd>
                        </dl>
                      </div>
                      <div className="hidden justify-center gap-[2px] lg:py-[8px]">
                        {Array(3)
                          .fill()
                          .map((_, i) => (
                            <div className="flex justify-center items-center relative">
                              <img
                                src={augment.src}
                                alt=""
                                className="w-[64px]"
                              />
                            </div>
                          ))}
                      </div>
                    </div>
                    {/* This is a navigation button which is hidden for now */}
                    <div className="ml-[26px] hidden items-center justify-center">
                      <a
                        target="_blank"
                        className="hidden flex-shrink-0 cursor-pointer lg:inline-flex"
                        href="#"
                      >
                        <img
                          src={arrowRight.src}
                          alt=""
                          width="40"
                          height="40"
                        />
                      </a>
                    </div>
                    {/* This is a navigation button which is hidden for now */}
                  </div>
                  <div className="hidden flex w-full flex-col items-center lg:hidden">
                    <a
                      target="_blank"
                      className="flex h-[28px] w-full max-w-[330px] items-center justify-center rounded-[4px] !border !border-[#CA9372] bg-transparent text-center text-[12px] leading-none text-[#CA9372] lg:hidden"
                      href="#"
                      rel="noopener"
                    >
                      More
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <nav className="mb-5">
          <ul className="flex flex-wrap pl-0 mb-4 list-none bg-[#222231]">
            <li
              className={`flex-auto flex-grow-1 p-4 text-center !border-r !border-[#ffffff14] rounded-none font-black -mb-[1px] text-[18px] cursor-pointer px-[12px] md:p-0 ${
                activeTab === "Match History" ? "!bg-[#FFFFFF] !text-black" : ""
              }`}
              onClick={() => setActiveTab("Match History")}
            >
              <a>Match History</a>
            </li>
            <li
              className={`flex-auto flex-grow-1 p-4 text-center !border-r !border-[#ffffff14] rounded-none font-black -mb-[1px] text-[18px] cursor-pointer px-[12px] md:p-0 ${
                activeTab === "Champions" ? "!bg-[#FFFFFF] !text-black" : ""
              }`}
              onClick={() => setActiveTab("Champions")}
            >
              <a>Champions</a>
            </li>
            <li
              className={`flex-auto flex-grow-1 p-4 text-center !border-r !border-[#ffffff14] rounded-none font-black -mb-[1px] text-[18px] cursor-pointer px-[12px] md:p-0 ${
                activeTab === "Items" ? "!bg-[#FFFFFF] !text-black" : ""
              }`}
              onClick={() => setActiveTab("Items")}
            >
              <a>Items</a>
            </li>
            <li
              className={`flex-auto flex-grow-1 p-4 text-center !border-r !border-[#ffffff14] rounded-none font-black -mb-[1px] text-[18px] cursor-pointer px-[12px] md:p-0 ${
                activeTab === "Augments" ? "!bg-[#FFFFFF] !text-black" : ""
              }`}
              onClick={() => setActiveTab("Augments")}
            >
              <a>Augments</a>
            </li>
          </ul>
        </nav>
        {activeTab === "Match History" ? (
          <div>
            {compsData?.map((match, i) => (
              <div className=" mb-4">
                <div className="flex flex-col gap-[1px] border border-[#323232] bg-[#323232] bg-glass rounded-bl-xl rounded-br-xl">
                  <div>
                    <div
                      className="flex flex-col bg-center bg-no-repeat mt-[-1px] rounded-bl-xl rounded-br-xl border-[1px] border-[#ffffff30] bg-[#1A1B30]"
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
                                  {match?.placement}
                                </p>
                                <p className="mb-0 font-bold text-lg">Place</p>
                              </div>
                            </div>
                            <div className="md:w-[20%]">
                              <div className="flex flex-wrap items-center justify-center gap-1 mb-3 md:mb-0 bg-glass py-3 rounded-md">
                                <img
                                  src={
                                    summoners?.find(
                                      (s) =>
                                        s.puuid ===
                                        match.participants?.find(
                                          (p) =>
                                            p.placement === match?.placement
                                        )?.puuid
                                    )?.profileIconUrl
                                  }
                                  className="w-12 md:w-16"
                                />
                              </div>
                            </div>
                            <div className="md:w-[70%]">
                              <div className="flex flex-wrap items-center justify-center gap-1">
                                {match?.participants
                                  ?.find(
                                    (p) => p.placement === match?.placement
                                  )
                                  ?.champions?.slice(0, 7)
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
                <div
                  className={`bg-[#1a1b30] md:mx-3 rounded-bl-xl rounded-br-xl`}
                >
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
                      {match?.participants?.map((participant, i) => (
                        <div className=" shadow-lg p-3 rounded-md">
                          <div className="flex flex-wrap justify-between items-center gap-1 bg-gradient-to-l from-[#1a1b3020] from-80% to-[#ffffff0d]">
                            <div className="flex justify-center items-center flex-wrap">
                              <div className="mr-4 text-lg">
                                <div className="flex justify-start items-center gap-x-2">
                                  <img
                                    src={
                                      summoners?.find(
                                        (s) => s.puuid === participant?.puuid
                                      )?.profileIconUrl
                                    }
                                    className="w-8 h-8 rounded-full"
                                  />
                                  <span>
                                    {
                                      summoners?.find(
                                        (s) => s.puuid === participant?.puuid
                                      )?.gameName
                                    }
                                  </span>
                                </div>
                              </div>
                              <div>
                                <div
                                  data-tooltip-id={participant?.name}
                                  className="bg-[#262626] rounded-md px-2"
                                >
                                  {participant?.round}
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
                          <div className="flex flex-wrap justify-between items-center gap-x-2">
                            <div className="w-[5%]">
                              <div className="">
                                <div className="px-3 py-2 text-center text-[20px] rounded-full bg-[#444]">
                                  {participant?.placement}
                                </div>
                              </div>
                            </div>
                            <div className="w-[25%]">
                              <div className="flex items-center gap-1 flex-wrap">
                                {participant?.traits?.map((trait, i) => (
                                  <img
                                    src={
                                      traits?.find((t) => t.key === trait?.key)
                                        ?.imageUrl
                                    }
                                    className="w-6 md:w-12 p-1 border-[1px] border-[#ffffff50] rounded-full"
                                  />
                                ))}
                              </div>
                            </div>
                            <div className="w-[65%]">
                              <div className="flex items-center justify-center gap-1">
                                {participant?.champions?.map((unit, i) => (
                                  <div>
                                    <CardImage
                                      src={champions?.find(
                                        (champion) =>
                                          champion?.key === unit?.key
                                      )}
                                      imgStyle="w-[34px] md:w-[72px]"
                                      identificationImageStyle="w=[16px] md:w-[32px]"
                                      textStyle="text-[10px] md:text-[12px]"
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
                                            className="w-[15px] md:w-[24px]"
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
        ) : activeTab === "Champions" ? (
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
            {/* Champion Pick Rate */}
            <div class="">
              <div className="bg-[#090822]">
                <div className="p-4 text-[18px]">{others.championPickRate}</div>
              </div>
              <div className="bg-[#24223e] overflow-auto h-[300px] md:h-full">
                {championStats?.map((champion, i) => (
                  <div
                    className="flex justify-start items-center px-4 py-1 cursor-pointer"
                    onClick={() => setSelectedChampion(champion?.key)}
                  >
                    <div className="group relative w-[10%]" tooltip={"abc"}>
                      <img
                        src={
                          champions?.find((c) => c.key === champion?.key)
                            ?.imageUrl
                        }
                        className="w-full rounded-md"
                      />
                      <span class="absolute top-10 scale-0 transition-all rounded text-center bg-gray-800 p-2 text-xs text-white group-hover:scale-100 w-full z-[999]">
                        {champions?.find((c) => c.key === champion?.key)?.name}
                      </span>
                    </div>
                    <div className="w-[90%] mx-2">
                      <div className="flex justify-left items-center gap-x-2">
                        <div
                          className={`h-10 hover:!bg-[#ffffff50]`}
                          style={{
                            width: `${(champion?.pickRate * 100).toFixed(1)}%`,
                            background: `${i === 0 ? "#ca9372" : i === 1 ? "#938a7e" : "#555555"}`,
                          }}
                        ></div>
                        <div className="flex flex-col justify-center items-start w-[15%]">
                          <div className="leading-5 text-[14px]">
                            {champion?.pickRate * 100 === 100
                              ? champion?.pickRate * 100
                              : (champion?.pickRate * 100).toFixed(1)}
                            %
                          </div>
                          <div className="leading-5 text-[14px]">
                            #{champion?.avgPlacement}
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* <div className="w-[8%]"></div> */}
                  </div>
                ))}
              </div>
            </div>
            {/* Champion Information */}
            <div class="">
              <div>
                <div className="bg-[#090822]">
                  <div className="p-4 text-[18px]">
                    {others.championInformation}
                  </div>
                </div>
                <div className="bg-[#24223e]">
                  <div className="grid grid-cols-2 justify-between items-center p-2 md:!p-10">
                    <div className="">
                      <div className="flex justify-center items-center gap-2">
                        <div className="">
                          <img
                            src={
                              champions?.find((c) => c.key === selectedChampion)
                                ?.imageUrl
                            }
                            className="w-12 md:w-24 rounded-md"
                          />
                        </div>
                        <div className="text-[#ffffff] md:text-[20px] text-[16px]">
                          {
                            champions?.find((c) => c.key === selectedChampion)
                              ?.name
                          }
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center">
                        <div className="">Cost</div>
                        <div className="flex justify-between items-center">
                          <div className="flex justify-between items-center mr-4 gap-x-1">
                            <img
                              src="https://res.cloudinary.com/dg0cmj6su/image/upload/v1722934556/coin_6369589_wbb7uk.png"
                              className="w-4"
                            />
                            <span>
                              {
                                champions?.find(
                                  (c) => c.key === selectedChampion
                                )?.cost
                              }
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="">Origin</div>
                        <div className="flex justify-between items-center gap-x-1">
                          {/* <img
                            src="https://res.cloudinary.com/dg0cmj6su/image/upload/v1722934556/coin_6369589_wbb7uk.png"
                            className="w-4"
                          /> */}
                          {champions
                            ?.find((c) => c.key === selectedChampion)
                            ?.traits?.map((trait, i) => (
                              <span>
                                {traits?.find((t) => trait === t.key)?.name},{" "}
                              </span>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Champion Tier */}
              <div class="mt-2">
                <div className="bg-[#090822]">
                  <div className="p-4 text-[18px]">{others.championTier}</div>
                </div>
                <div className="bg-[#24223e]">
                  {championStats
                    ?.find((champion) => champion?.key == selectedChampion)
                    ?.championTierStats?.map((champion, i) => (
                      <div className="flex justify-start items-center px-4 py-1">
                        <div className="w-[10%]">
                          <div className="flex justify-center items-center gap-x-1">
                            {Array.from({ length: champion?.key }).map(
                              (_, i) => (
                                <FaStar className="w-3" />
                              )
                            )}
                          </div>
                        </div>
                        <div className="w-[90%] mx-2">
                          <div className="flex justify-left items-center gap-x-2">
                            <div
                              className={`h-10 hover:bg-[#ffffff50]`}
                              style={{
                                width: `${(champion?.pickRate * 100).toFixed(1)}%`,
                                background: `${i === 0 ? "#ca9372" : "#555555"}`,
                              }}
                            ></div>
                            <div className="flex flex-col justify-center items-start w-[15%]">
                              <div className="leading-5 text-[14px]">
                                {champion?.pickRate * 100 === 100
                                  ? champion?.pickRate * 100
                                  : (champion?.pickRate * 100).toFixed(1)}
                                %
                              </div>
                              <div className="leading-5 text-[14px]">
                                #{champion?.avgPlacement}
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* <div className="w-[8%]"></div> */}
                      </div>
                    ))}
                </div>
              </div>
              {/* Item Used */}
              <div class="mt-2">
                <div className="bg-[#090822]">
                  <div className="p-4 text-[18px]">{others.itemUsed}</div>
                </div>
                <div className="bg-[#24223e]">
                  {championStats
                    ?.find((champion) => champion?.key == selectedChampion)
                    ?.championItemCountStats?.map((champion, i) => (
                      <div className="flex justify-start items-center px-4 py-1">
                        <div className="w-[10%]">
                          <div className="flex justify-center items-center gap-x-1">
                            {champion?.key}
                          </div>
                        </div>
                        <div className="w-[90%] mx-2">
                          <div className="flex justify-left items-center gap-x-2">
                            <div
                              className={`h-10 hover:bg-[#ffffff50]`}
                              style={{
                                width: `${(champion?.pickRate * 100).toFixed(1)}%`,
                                background: `${i === 0 ? "#ca9372" : "#555555"}`,
                              }}
                            ></div>
                            <div className="flex flex-col justify-center items-start w-[15%]">
                              <div className="leading-5 text-[14px]">
                                {champion?.pickRate * 100 === 100
                                  ? champion?.pickRate * 100
                                  : (champion?.pickRate * 100).toFixed(1)}
                                %
                              </div>
                              <div className="leading-5 text-[14px]">
                                #{champion?.avgPlacement}
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* <div className="w-[8%]"></div> */}
                      </div>
                    ))}
                </div>
              </div>
              {/* Items of great effect with this champion */}
              <div class="mt-2">
                <div className="bg-[#090822]">
                  <div className="p-4 text-[18px]">
                    {others.itemsOfGreatEffectWithThisChampion}
                  </div>
                </div>
                <div className="bg-[#24223e]">
                  {championStats
                    ?.find((champion) => champion?.key == selectedChampion)
                    ?.championItemStats?.map((champion, i) => (
                      <div className="flex justify-start items-center px-4 py-1">
                        <div className="w-[10%]">
                          <div className="flex justify-center items-center gap-x-1">
                            <img
                              src={
                                items?.find((i) => i.key === champion?.key)
                                  ?.imageUrl
                              }
                              className="w-full rounded-md"
                            />
                          </div>
                        </div>
                        <div className="w-[90%] mx-2">
                          <div className="flex justify-left items-center gap-x-2">
                            <div
                              className={`h-10 hover:bg-[#ffffff50]`}
                              style={{
                                width: `${(champion?.pickRate * 100).toFixed(1)}%`,
                                background: `${i === 0 ? "#ca9372" : "#555555"}`,
                              }}
                            ></div>
                            <div className="flex flex-col justify-center items-start w-[15%]">
                              <div className="leading-5 text-[14px]">
                                {champion?.pickRate * 100 === 100
                                  ? champion?.pickRate * 100
                                  : (champion?.pickRate * 100).toFixed(1)}
                                %
                              </div>
                              <div className="leading-5 text-[14px]">
                                #{champion?.avgPlacement}
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* <div className="w-[8%]"></div> */}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        ) : activeTab === "Items" ? (
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
            {/* Item Pick Rate */}
            <div class="">
              <div className="bg-[#090822]">
                <div className="p-4 text-[18px]">{others.itemPickRate}</div>
              </div>
              <div className="bg-[#24223e] overflow-auto h-[300px] md:h-full">
                {itemStats?.map((item, i) => (
                  <div
                    className="flex justify-start items-center px-4 py-1 cursor-pointer"
                    onClick={() => setSelectedItem(item?.key)}
                  >
                    <div className="group relative w-[10%]" tooltip={"abc"}>
                      <img
                        src={items?.find((i) => i.key === item?.key)?.imageUrl}
                        className="w-full rounded-md"
                      />
                      <span class="absolute top-10 scale-0 transition-all rounded text-center bg-gray-800 p-2 text-xs text-white group-hover:scale-100 w-full z-[999]">
                        {items?.find((i) => i.key === item?.key)?.name}
                      </span>
                    </div>
                    <div className="w-[90%] mx-2">
                      <div className="flex justify-left items-center gap-x-2">
                        <div
                          className={`h-10 hover:bg-[#ffffff50]`}
                          style={{
                            width: `${(item?.pickRate * 100).toFixed(1)}%`,
                            background: `${i === 0 ? "#ca9372" : i === 1 ? "#938a7e" : "#555555"}`,
                          }}
                        ></div>
                        <div className="flex flex-col justify-center items-start w-[15%]">
                          <div className="leading-5 text-[14px]">
                            {item?.pickRate * 100 === 100
                              ? item?.pickRate * 100
                              : (item?.pickRate * 100).toFixed(1)}
                            %
                          </div>
                          <div className="leading-5 text-[14px]">
                            #{item?.avgPlacement}
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* <div className="w-[8%]"></div> */}
                  </div>
                ))}
              </div>
            </div>
            {/* Item Information */}
            <div class="">
              <div>
                <div className="bg-[#090822]">
                  <div className="p-4 text-[18px]">
                    {others.itemInformation}
                  </div>
                </div>
                <div className="bg-[#24223e]">
                  <div className="flex justify-between items-center p-2 md:!p-10">
                    <div className="">
                      <div className="flex justify-center items-center gap-2">
                        <div className="">
                          <img
                            src={
                              items?.find((i) => i.key === selectedItem)
                                ?.imageUrl
                            }
                            className="w-24 rounded-md"
                          />
                        </div>
                        <div>
                          <div className="text-[#ffffff] md:text-[20px] text-[16px]">
                            {items?.find((i) => i.key === selectedItem)?.name}
                          </div>
                          <div className="text-[#ffffff] md:text-[16px] text-[12px]">
                            Gain 12% max health.
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="bg-[#090822] p-4 rounded-md">
                        <div className="">Base Items</div>
                        <div className="flex justify-center items-center gap-x-4">
                          {items
                            ?.find((i) => i.key === selectedItem)
                            ?.compositions?.map((item, i) => (
                              <img
                                src={
                                  items?.find((i) => i.key === item)?.imageUrl
                                }
                                className="w-8 md:w-12 rounded"
                              />
                            ))}
                          {/* <span>+</span>
                          <img
                            src="https://res.cloudinary.com/dg0cmj6su/image/upload/v1719999771/00646-609178461_fcxp2m.webp"
                            className="w-8 md:w-12 rounded"
                          /> */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Effective items to use together */}
              <div class="mt-2">
                <div className="bg-[#090822]">
                  <div className="p-4 text-[18px]">
                    {others.effectiveItemsToUseTogether}
                  </div>
                </div>
                <div className="bg-[#24223e]">
                  <div className="flex justify-center items-center px-4 py-4 gap-x-4">
                    {itemStats
                      ?.find((item) => item?.key == selectedItem)
                      ?.itemSynergyStats?.map((item, i) => (
                        <div className="flex flex-col items-center justify-center">
                          <img
                            src={
                              items?.find((i) => i.key === item?.key)?.imageUrl
                            }
                            className="w-8 md:w-12 rounded"
                          />
                          <span className="text-center">
                            {items?.find((i) => i.key === item?.key)?.name}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
              {/* Champions of great effect with this champion */}
              <div class="mt-2">
                <div className="bg-[#090822]">
                  <div className="p-4 text-[18px]">
                    {others.championsOfGreatEffectWithThisItem}
                  </div>
                </div>
                <div className="bg-[#24223e]">
                  {itemStats
                    ?.find((item) => item?.key == selectedItem)
                    ?.itemChampionStats?.map((item, i) => (
                      <div className="flex justify-start items-center px-4 py-1">
                        <div className="w-[10%]">
                          <div className="flex justify-center items-center gap-x-1">
                            <img
                              src={
                                champions?.find((c) => c.key === item?.key)
                                  ?.imageUrl
                              }
                              className="w-full rounded-md"
                            />
                          </div>
                        </div>
                        <div className="w-[90%] mx-2">
                          <div className="flex justify-left items-center gap-x-2">
                            <div
                              className={`h-10 hover:bg-[#ffffff50]`}
                              style={{
                                width: `${(item?.pickRate * 100).toFixed(1)}%`,
                                background: `${i === 0 ? "#ca9372" : "#555555"}`,
                              }}
                            ></div>
                            <div className="flex flex-col justify-center items-start w-[15%]">
                              <div className="leading-5 text-[14px]">
                                {item?.pickRate * 100 === 100
                                  ? item?.pickRate * 100
                                  : (item?.pickRate * 100).toFixed(1)}
                                %
                              </div>
                              <div className="leading-5 text-[14px]">
                                #{item?.avgPlacement}
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* <div className="w-[8%]"></div> */}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        ) : activeTab === "Augments" ? (
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            {augmentStyleStats?.map((augment, i) => (
              <div class="">
                <div className="bg-[#090822]">
                  <div className="p-4 text-[18px]">
                    {augment.key === 1
                      ? others.silver
                      : augment.key === 2
                        ? others.gold
                        : others.prismatic}
                  </div>
                </div>
                <div className="bg-[#24223e]">
                  {augment?.augmentStats?.map((augment, i) => (
                    <div className="flex justify-start items-center px-4 py-1 cursor-pointer">
                      <div className="group relative w-[10%]" tooltip={"abc"}>
                        <img
                          src={
                            augments?.find((a) => a.key === augment?.key)
                              ?.imageUrl
                          }
                          className="w-full rounded-md"
                        />
                        <span class="absolute top-10 scale-0 transition-all rounded text-center bg-gray-800 p-2 text-xs text-white group-hover:scale-100 w-full z-[999]">
                          {augments?.find((a) => a.key === augment?.key)?.name}
                        </span>
                      </div>
                      <div className="w-[90%] mx-2">
                        <div className="flex justify-left items-center gap-x-2">
                          <div
                            className={`h-10 hover:bg-[#ffffff50]`}
                            style={{
                              width: `${(augment?.pickRate * 1000).toFixed(1)}%`,
                              background: `${i === 0 ? "#ca9372" : i === 1 ? "#938a7e" : "#555555"}`,
                            }}
                          ></div>
                          <div className="flex flex-col justify-center items-start w-[15%]">
                            <div className="leading-5 text-[14px]">
                              {augment?.pickRate * 100 === 100
                                ? augment?.pickRate * 100
                                : (augment?.pickRate * 100).toFixed(1)}
                              %
                            </div>
                            <div className="leading-5 text-[14px]">
                              #{augment?.avgPlacement}
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* <div className="w-[8%]"></div> */}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>eee</div>
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

export default CompsDetails;
