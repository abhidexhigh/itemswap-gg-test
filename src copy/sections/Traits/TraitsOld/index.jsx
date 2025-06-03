import React, { useState } from "react";
import Link from "next/link";
import TraitStyleWrapper from "./Trait.style.js";
import Set10Tabs from "../set10Tabs/index.js";
import { FaPlus, FaEquals } from "react-icons/fa";
import bigShot from "@assets/image/icons/big-shot.svg";
import cloak from "@assets/image/items/basicItems/cloak.png";
import chaos from "@assets/image/traits/chaos.svg";
import jsonData from "../../ApiStructure/Comps/Comps.json";
import ReactTltp from "src/components/tooltip/ReactTltp.jsx";

const Traits = () => {
  const [hoverIndex, setHoverIndex] = useState(null);
  const [tableHover, setTableHover] = useState(false);
  const [space1, setSpace1] = useState(null);
  const [space2, setSpace2] = useState(null);

  const {
    props: {
      pageProps: {
        dehydratedState: { queries: data },
      },
    },
  } = jsonData;
  const {
    state: {
      data: { champions },
    },
  } = data?.find((item) => item?.queryKey.includes("championRefs"));
  const {
    state: {
      data: { items },
    },
  } = data?.find((item) => item?.queryKey.includes("itemRefs"));
  const {
    state: {
      data: { traits },
    },
  } = data?.find((item) => item?.queryKey.includes("traitsRefs"));
  const {
    state: {
      data: { guideDecks: comps },
    },
  } = data?.find((item) => item?.queryKey.includes("getGuideDecks"));

  const [activeTab, setActiveTab] = useState("Traits");
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

  return (
    <TraitStyleWrapper>
      <div className="container">
        <Set10Tabs
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <article
          className="hidden md:block"
          style={{
            background: "rgba(0, 0, 0, 0.2)",
            boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
            backdropFilter: "blur(2px)",
            border: "1px solid rgba(35, 31, 31, 0.3)",
          }}
        >
          <table className="my-0 mx-auto w-full border border-[#333] overflow-hidden font-[12px]">
            <thead>
              <tr>
                <th className="bg-[#27282e] border-b border-l border-[#333] border-t-0 leading-[1.2] text-white py-[12px] px-[2px] text-center align-middle"></th>
                {Array(13)
                  .fill(0)
                  .map((_, index) => (
                    <th className="bg-[#27282e] border-b border-l border-[#333] border-t-0 leading-[1.2] text-white py-[12px] px-[2px] text-center align-middle">
                      <div className="flex flex-col justify-center items-center">
                        <div className="block">
                          <img
                            src={bigShot.src}
                            className="inline-block mr-[2px] w-[14px] h-[14px] "
                          />
                          <small>Big Shot</small>
                        </div>
                        <small className="text-[#808080]">2/4/6</small>
                      </div>
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody>
              <th className="bg-[#27282e] border-b border-l border-[#333] border-t-0 leading-[1.2] text-white py-[12px] px-[2px] text-center align-middle">
                <div className="flex flex-col justify-center items-center">
                  <div className="block">
                    <img
                      src={bigShot.src}
                      className="inline-block mr-[2px] w-[14px] h-[14px] "
                    />
                    <small>Big Shot</small>
                  </div>
                  <small className="text-[#808080]">2/4/6</small>
                </div>
              </th>
              <th className="border-b border-l border-[#333] py-[8px] px-[4px]">
                <div className="flex flex-wrap justify-center items-center gap-x-[4px] ">
                  <div className="relative inline-flex flex-col">
                    <div className="relative flex flex-col rounded-[6px] w-[40px] h-[40px]">
                      <div className="relative w-full h-full border-[#848999] rounded-[6px] border-2 overflow-hidden inline-flex">
                        <img
                          src={cloak.src}
                          className="w-[120%] max-w-[120%] h-[120%] -ml-[10%] -mr-[10%] object-center object-cover"
                        />
                        <span
                          className="inline-flex-center absolute right-0 top-0 h-[12px] w-[18px] text-center text-[9px] text-white bg-[#848999]"
                          style={{
                            backgroundColor:
                              "rgb(0, 0, 0) -1px 0px 2px, rgb(0, 0, 0) 0px 1px 2px, rgb(0, 0, 0) 1px 0px 2px, rgb(0, 0, 0) 0px -1px 2px",
                          }}
                        >
                          $1
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </th>
              <th className="border-b border-l border-[#333] py-[8px] px-[4px]"></th>
              <th className="border-b border-l border-[#333] py-[8px] px-[4px]"></th>
              <th className="border-b border-l border-[#333] py-[8px] px-[4px]"></th>
              <th className="border-b border-l border-[#333] py-[8px] px-[4px]"></th>
              <th className="border-b border-l border-[#333] py-[8px] px-[4px]">
                <div className="flex flex-wrap justify-center items-center gap-x-[4px] ">
                  <div className="relative inline-flex flex-col">
                    <div className="relative flex flex-col rounded-[6px] w-[40px] h-[40px]">
                      <div className="relative w-full h-full border-[#848999] rounded-[6px] border-2 overflow-hidden inline-flex">
                        <img
                          src={cloak.src}
                          className="w-[120%] max-w-[120%] h-[120%] -ml-[10%] -mr-[10%] object-center object-cover"
                        />
                        <span
                          className="inline-flex-center absolute right-0 top-0 h-[12px] w-[18px] text-center text-[9px] text-white bg-[#848999]"
                          style={{
                            backgroundColor:
                              "rgb(0, 0, 0) -1px 0px 2px, rgb(0, 0, 0) 0px 1px 2px, rgb(0, 0, 0) 1px 0px 2px, rgb(0, 0, 0) 0px -1px 2px",
                          }}
                        >
                          $1
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </th>
              <th className="border-b border-l border-[#333] py-[8px] px-[4px]"></th>
              <th className="border-b border-l border-[#333] py-[8px] px-[4px]"></th>
              <th className="border-b border-l border-[#333] py-[8px] px-[4px]"></th>
              <th className="border-b border-l border-[#333] py-[8px] px-[4px]">
                <div className="flex flex-wrap justify-center items-center gap-x-[4px] ">
                  <div className="relative inline-flex flex-col">
                    <div className="relative flex flex-col rounded-[6px] w-[40px] h-[40px]">
                      <div className="relative w-full h-full border-[#848999] rounded-[6px] border-2 overflow-hidden inline-flex">
                        <img
                          src={cloak.src}
                          className="w-[120%] max-w-[120%] h-[120%] -ml-[10%] -mr-[10%] object-center object-cover"
                        />
                        <span
                          className="inline-flex-center absolute right-0 top-0 h-[12px] w-[18px] text-center text-[9px] text-white bg-[#848999]"
                          style={{
                            backgroundColor:
                              "rgb(0, 0, 0) -1px 0px 2px, rgb(0, 0, 0) 0px 1px 2px, rgb(0, 0, 0) 1px 0px 2px, rgb(0, 0, 0) 0px -1px 2px",
                          }}
                        >
                          $1
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </th>
              <th className="border-b border-l border-[#333] py-[8px] px-[4px]">
                <div className="flex flex-wrap justify-center items-center gap-x-[4px] ">
                  <div className="relative inline-flex flex-col">
                    <div className="relative flex flex-col rounded-[6px] w-[40px] h-[40px]">
                      <div className="relative w-full h-full border-[#848999] rounded-[6px] border-2 overflow-hidden inline-flex">
                        <img
                          src={cloak.src}
                          className="w-[120%] max-w-[120%] h-[120%] -ml-[10%] -mr-[10%] object-center object-cover"
                        />
                        <span
                          className="inline-flex-center absolute right-0 top-0 h-[12px] w-[18px] text-center text-[9px] text-white bg-[#848999]"
                          style={{
                            backgroundColor:
                              "rgb(0, 0, 0) -1px 0px 2px, rgb(0, 0, 0) 0px 1px 2px, rgb(0, 0, 0) 1px 0px 2px, rgb(0, 0, 0) 0px -1px 2px",
                          }}
                        >
                          $1
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </th>
              <th className="border-b border-l border-[#333] py-[8px] px-[4px]"></th>
              <th className="border-b border-l border-[#333] py-[8px] px-[4px]"></th>
            </tbody>
          </table>
        </article>
        <article className="flex flex-col gap-y-[1rem] text-[#fff8e8] mt-[60px]">
          <h5 className="text-[26px] font-bold text-left pl-[4px] mb-0">
            Origins
          </h5>
          <div className="flex flex-col md:flex-row md:flex-wrap md:justify-between gap-y-[16px] gap-x-[8px]">
            {traits
              ?.filter((trait) => trait.type === "ORIGIN")
              ?.map((trait) => (
                <div
                  className="basis-[32%] border-0"
                  style={{
                    background: "rgba(0, 0, 0, 0.2)",
                    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
                    backdropFilter: "blur(2px)",
                    border: "1px solid rgba(35, 31, 31, 0.3)",
                  }}
                >
                  <div className="flex justify-between md:justify-center bg-[#27282e] text-[12px] p-[8px] border-t border-r border-l border-[#333] text-[#fff8e8]">
                    <div className="flex gap-x-[4px] justify-start items-center md:text-[14px] font-bold">
                      <img
                        src={trait?.imageUrl}
                        className="w-[24px] h-[24px] md:w-[36px] md:h-[36px]"
                      />
                      <h6 className="p-0 m-0 md:text-[16px]">{trait?.name}</h6>
                    </div>
                  </div>
                  <figure className="flex flex-col m-0 border-l border-r border-b border-t-0 border-[#333] p-[6px] md:min-h-[375px]">
                    <div className="flex gap-x-[6px] justify-start sm:items-center sm:flex-wrap md:justify-center overflow-hidden">
                      {champions
                        ?.filter((champion) =>
                          champion?.traits.includes(trait?.key)
                        )
                        ?.map((champion) => (
                          <Link
                            href={`/champions/${champion?.key}`}
                            className="mb-[0.35rem]"
                          >
                            <div
                              className="relative inline-flex flex-col"
                              data-tooltip-id={champion?.key}
                            >
                              <div className="relative flex flex-col rounded-[6px] w-[40px] h-[40px] md:w-[96px] md:h-[96px]">
                                <div className="relative w-full h-full rounded-[6px] border-[#848999] inline-flex overflow-hidden">
                                  <img
                                    src={champion?.imageUrl}
                                    className="w-[120%] max-w-[120%] h-[120%] -ml-[10%] -mr-[10%] object-center object-cover"
                                  />
                                  <span
                                    className="inline-flex-center absolute right-0 top-0 h-[12px] w-[18px] text-center text-[9px] text-white bg-[#848999]"
                                    style={{
                                      backgroundColor:
                                        "rgb(0, 0, 0) -1px 0px 2px, rgb(0, 0, 0) 0px 1px 2px, rgb(0, 0, 0) 1px 0px 2px, rgb(0, 0, 0) 0px -1px 2px",
                                    }}
                                  >
                                    ${champion?.cost[0]}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <ReactTltp
                              content={champion?.name}
                              id={champion?.key}
                            />
                          </Link>
                        ))}
                    </div>
                    <figcaption className="flex flex-col justify-start sm:gap-x-[6px] sm:items-center sm:flex-wrap md:justify-center">
                      <div
                        className="font-normal text-[12px] md:text-[14px] leading-[18px] m-1"
                        dangerouslySetInnerHTML={{
                          __html: trait?.desc,
                        }}
                      />
                      <div>
                        {Object.keys(trait?.stats).map((statLevel) => (
                          <div
                            className="text-[#ffc107] text-[11px] md:text-[13px] md:font-normal leading-[14px] mb-1"
                            dangerouslySetInnerHTML={{
                              __html: `(${statLevel}): ${trait?.stats[statLevel]}`,
                            }}
                          />
                        ))}
                      </div>
                    </figcaption>
                  </figure>
                </div>
              ))}
          </div>
        </article>
        <article className="flex flex-col gap-y-[1rem] text-[#fff8e8] mt-[60px]">
          <h5 className="text-[26px] font-bold text-left pl-[4px] mb-0">
            Classes
          </h5>
          <div className="flex flex-col md:flex-row md:flex-wrap md:justify-between gap-y-[16px] gap-x-[8px]">
            {traits
              ?.filter((trait) => trait.type === "CLASS")
              ?.map((trait) => (
                <div
                  className="basis-[32%] border-0"
                  style={{
                    background: "rgba(0, 0, 0, 0.2)",
                    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
                    backdropFilter: "blur(2px)",
                    border: "1px solid rgba(35, 31, 31, 0.3)",
                  }}
                >
                  <div className="flex justify-between md:justify-center bg-[#27282e] text-[12px] p-[8px] border-t border-r border-l border-[#333] text-[#fff8e8]">
                    <div className="flex gap-x-[4px] justify-start items-center md:text-[14px] font-bold">
                      <img
                        src={trait?.imageUrl}
                        className="w-[24px] h-[24px] md:w-[36px] md:h-[36px]"
                      />
                      <h6 className="p-0 m-0 md:text-[16px]">{trait?.name}</h6>
                    </div>
                  </div>
                  <figure className="flex flex-col m-0 border-l border-r border-b border-t-0 border-[#333] p-[6px] md:min-h-[375px]">
                    <div className="flex gap-x-[6px] justify-start sm:items-center sm:flex-wrap md:justify-center overflow-hidden">
                      {champions
                        ?.filter((champion) =>
                          champion?.traits.includes(trait?.key)
                        )
                        ?.map((champion) => (
                          <Link
                            href={`/champions/${champion?.key}`}
                            className="mb-[0.35rem]"
                          >
                            <div
                              className="relative inline-flex flex-col"
                              data-tooltip-id={champion?.key}
                            >
                              <div className="relative flex flex-col rounded-[6px] w-[40px] h-[40px] md:w-[96px] md:h-[96px]">
                                <div className="relative w-full h-full rounded-[6px] border-[#848999] inline-flex overflow-hidden">
                                  <img
                                    src={champion?.imageUrl}
                                    className="w-[120%] max-w-[120%] h-[120%] -ml-[10%] -mr-[10%] object-center object-cover"
                                  />
                                  <span
                                    className="inline-flex-center absolute right-0 top-0 h-[12px] w-[18px] text-center text-[9px] text-white bg-[#848999]"
                                    style={{
                                      backgroundColor:
                                        "rgb(0, 0, 0) -1px 0px 2px, rgb(0, 0, 0) 0px 1px 2px, rgb(0, 0, 0) 1px 0px 2px, rgb(0, 0, 0) 0px -1px 2px",
                                    }}
                                  >
                                    ${champion?.cost[0]}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <ReactTltp
                              content={champion?.name}
                              id={champion?.key}
                            />
                          </Link>
                        ))}
                    </div>
                    <figcaption className="flex flex-col justify-start sm:gap-x-[6px] sm:items-center sm:flex-wrap md:justify-center">
                      <div
                        className="font-normal text-[12px] md:text-[14px] leading-[18px] m-1"
                        dangerouslySetInnerHTML={{
                          __html: trait?.desc,
                        }}
                      />
                      <div>
                        {Object.keys(trait?.stats).map((statLevel) => (
                          <div
                            className="text-[#ffc107] text-[11px] md:text-[13px] md:font-normal leading-[14px] mb-1"
                            dangerouslySetInnerHTML={{
                              __html: `(${statLevel}): ${trait?.stats[statLevel]}`,
                            }}
                          />
                        ))}
                      </div>
                    </figcaption>
                  </figure>
                </div>
              ))}
          </div>
        </article>
      </div>
    </TraitStyleWrapper>
  );
};

export default Traits;
