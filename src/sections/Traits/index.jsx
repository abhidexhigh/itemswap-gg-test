import dynamic from "next/dynamic";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import React, { useState, useEffect } from "react";
import { Tooltip } from "react-tooltip";
import TraitTooltip from "src/components/tooltip/TraitTooltip";
import "react-tooltip/dist/react-tooltip.css";
import GirlCrush from "@assets/image/traits/GirlCrush.svg";
import augment from "@assets/image/augments/1.png";
import arrowRight from "@assets/image/icons/arrow-right.svg";
import { PiEye } from "react-icons/pi";
import { PiEyeClosed } from "react-icons/pi";
import Comps from "../../data/compsNew.json";
import ReactTltp from "src/components/tooltip/ReactTltp";
import { tr } from "date-fns/locale";

const Traits = () => {
  const [selectedChampion, setSelectedChampion] = React.useState(null);
  const [selectedTrait, setSelectedTrait] = React.useState(null);
  const [selectedItem, setSelectedItem] = React.useState(null);
  // const { data } = projectsData;
  const [isClosed, setIsClosed] = useState({});
  const [height, setHeight] = useState("auto");
  const [activeTab, setActiveTab] = useState("Champions"); // [Tier 1, Tier 2, Tier 3, Tier 4, Tier 5
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

  const handleIsClosed = (event) => {
    // Accessing the id of the clicked button
    const buttonId = event.currentTarget.id;
    // Updating the state
    setIsClosed({ ...isClosed, [buttonId]: !isClosed[buttonId] });
  };

  const {
    props: {
      pageProps: {
        dehydratedState: {
          queries: { data },
        },
      },
    },
  } = Comps;
  const { metaDecks } = data?.metaDeckList;
  const { champions } = data?.refs;
  const { items } = data?.refs;
  const { traits } = data?.refs;
  const { forces } = data?.refs;
  const [compsData, setCompsData] = useState(metaDecks);

  const [championss, setChampionss] = useState(champions);

  const inactiveChampions = [
    2, 3, 5, 6, 8, 10, 13, 14, 15, 16, 18, 19, 22, 24, 25, 28, 29, 30, 32, 34,
    35, 36, 38, 39,
  ];

  const makeInactive = () => {
    const champs = champions.map((champion, index) => {
      if (inactiveChampions.includes(index + 1)) {
        return {
          ...champion,
          isActive: false,
        };
      } else {
        return {
          ...champion,
          isActive: true,
        };
      }
    });
    return champs;
  };

  useEffect(() => {
    setChampionss(makeInactive().filter((champion) => champion.isActive));
  }, []);

  console.log(championss);

  return (
    // <ProjectItemsStyleWrapper>
    <>
      <div className="container md:!max-w-[100%]">
        <div className="projects-row overflow-auto md:overflow-hidden mt-3">
          <div>
            <div className="flex flex-col gap-[16px]">
              <div>
                {traits?.map((trait, i) => (
                  <div
                    className="flex flex-col gap-[1px] !border border-[#ffffff40] bg-[#323232] mb-4 rounded-md"
                    style={{
                      background: "rgba(0, 0, 0, 0.2)",
                      // borderRadius: "16px",
                      boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
                      backdropFilter: "blur(50px)",
                      // border: "1px solid rgba(255, 255, 255, 0.3)",
                      padding: "10px",
                      overflow: "auto",
                    }}
                  >
                    <header className="relative flex flex-col justify-between bg-[#2D2F37] py-[5px] pl-[16px] pr-[54px] lg:min-h-[50px] lg:flex-row lg:items-center lg:py-[5px] lg:pr-[16px]">
                      <div className="inline-flex flex-col flex-wrap gap-[4px] md:flex-row md:items-center md:gap-[4px]">
                        <strong className="text-[26px] font-semibold leading-none text-[#ffffff]">
                          {trait?.name}
                        </strong>
                        <span className="flex justify-center items-center">
                          {trait?.forces?.map((force, i) => (
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
                                <ReactTltp
                                  variant="trait"
                                  content={force}
                                  id={force?.key}
                                />
                                <span className="text-[18px]">
                                  {force?.numUnits}
                                </span>
                                <ReactTltp
                                  content={force?.name}
                                  id={force?.key}
                                />
                              </div>
                            </>
                          ))}
                        </span>
                      </div>
                    </header>
                    <div className={`${isClosed[i] ? "hidden" : ""}`}>
                      <div
                        className="flex flex-col bg-center bg-no-repeat mt-[-1px]"
                        // style={{
                        //   backgroundImage: `url(${cardBg.src})`,
                        //   backgroundSize: "cover",
                        // }}
                      >
                        <div className="flex min-h-[150px] flex-col justify-between items-center bg-[#27282E] py-[16px] lg:flex-row lg:gap-[15px] lg:bg-transparent lg:py-[0px] xl:pr-[24px]">
                          <div className="mb-[16px] lg:mb-0 lg:w-full lg:flex-shrink-0 px-4">
                            <div
                              className="md:flex flex-wrap justify-between items-center"
                              style={{ gap: "6px" }}
                            >
                              <div className="flex items-center justify-center relative flex-col">
                                <div className="relative flex flex-col w-[96px] h-[96px] md:w-[125px] md:h-[125px] rounded-[20px] mx-auto">
                                  <div className="inline-flex rounded-[10px]">
                                    <img
                                      src={trait?.imageUrl}
                                      className="h-full w-full object-cover object-center"
                                      data-tooltip-id={trait?.key}
                                    />
                                    <ReactTltp
                                      variant="trait"
                                      content={trait}
                                      id={trait?.key}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="border-b-2 my-2 md:border-r-2 md:mx-4 md:py-16 border-[#cccccc50] border-double"></div>
                              <div className="flex flex-wrap justify-center items-center gap-2 md:w-[42%] 2xl:w-[40%] mt-2.5">
                                {champions
                                  ?.filter(
                                    (champion) =>
                                      champion?.traits?.includes(trait?.key) &&
                                      // champion?.isActive &&
                                      champion?.variant === "Light"
                                  )
                                  ?.map((champion, i) => (
                                    <div
                                      className="inline-flex flex-col items-center"
                                      style={{ gap: "4px" }}
                                    >
                                      {/* {console.log("trait", trait)} */}
                                      {trait.key === "Chaos"
                                        ? console.log("champion", champion)
                                        : ""}
                                      <div className="inline-flex items-center justify-center relative flex-col">
                                        <div className="relative inline-flex flex-col">
                                          <div className="relative flex flex-col w-[72px] h-[72px] md:w-[108px] md:h-[108px] rounded-[20px]">
                                            <div
                                              className="inline-flex rounded-[5px] border-2 border-[#ffffff95] [box-shadow:rgba(255,_0,_0,_0.8)_0px_7px_29px_0px]"
                                              data-tooltip-id={champion?.key}
                                            >
                                              <img
                                                src={champion?.cardImage}
                                                className="h-full w-full object-cover object-center"
                                              />
                                              <img
                                                src={
                                                  forces?.find(
                                                    (f) =>
                                                      f.key ===
                                                      champion?.variant
                                                  )?.imageUrl
                                                }
                                                className="absolute -top-[3px] -right-[3px] w-[20px] md:w-[30px]"
                                              />
                                            </div>
                                            <ReactTltp
                                              variant="champion"
                                              content={champion}
                                              id={champion?.key}
                                            />
                                          </div>
                                          <p
                                            className="ellipsis text-center text-[13px] md:text-[17px] leading-[14px] text-[#808080] font-extralight absolute bottom-1
                                           left-0 w-full p-[2px] m-0 text-[#ffffff80] bg-[linear-gradient(90deg,_rgba(21,27,23,0.1)_0%,_rgba(20,42,25,0.5)_49%,_rgba(14,39,39,0.1)_100%)]"
                                            style={{
                                              color: "rgb(255, 255, 255)",
                                              textShadow:
                                                "rgb(0, 0, 0) -1px 0px 2px, rgb(0, 0, 0) 0px 1px 2px, rgb(0, 0, 0) 1px 0px 2px, rgb(0, 0, 0) 0px -1px 2px",
                                            }}
                                          >
                                            {champion?.name}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                              </div>
                              <div className="border-b-2 my-2 md:border-r-2 md:mx-4 md:py-16 border-[#cccccc50] border-double"></div>
                              <div className="md:w-[20%] text-center">
                                {trait?.desc}
                              </div>
                              <div className="border-b-2 my-2 md:border-r-2 md:py-16 border-[#cccccc50] border-double"></div>
                              <div className="md:w-[19%] text-center">
                                {trait.stats ? (
                                  Object.entries(trait.stats).map(
                                    ([key, value]) => (
                                      <div className="mb-3" key={key}>
                                        <span className="px-2 py-1 rounded-full bg-[#a97322]">
                                          {key}
                                        </span>
                                        : {value}
                                      </div>
                                    )
                                  )
                                ) : (
                                  <p className="text-sm mb-0">
                                    (3) Per Combat 15 or loss streak 35
                                    <br />
                                    (4) Per Combat 15 or loss streak 50
                                    <br />
                                    (5) Per Combat 20 or loss streak 70
                                    <br />
                                    (6) Per Combat 20 or loss streak 90
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Tooltip
              id="my-tooltip"
              effect="solid"
              style={{
                zIndex: 999,
                backgroundColor: "#333",
                opacity: "1 !important",
                border: "1px solid red",
                borderRadius: "10px",
              }}
            >
              <TraitTooltip
                title="Lillia"
                icon={GirlCrush.src}
                description={{
                  title: "Confetti Bloom",
                  text: "Deal magic damage to adjacent enemies. Heal Lillia and her nearest ally.",
                }}
                magicDamage="180 / 270 / 400"
                healAmount="180 / 220 / 260"
                allyHealAmount="90 / 110 / 130"
                rangeFilled={70}
              />
            </Tooltip>
          </div>
        </div>
      </div>
    </>
    // </ProjectItemsStyleWrapper>
  );
};

export default Traits;
