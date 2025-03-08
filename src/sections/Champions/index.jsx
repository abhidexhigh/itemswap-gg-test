import React, { useEffect, useState } from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";
import Link from "next/link";
import "react-tooltip/dist/react-tooltip.css";
import ReactTltp from "src/components/tooltip/ReactTltp.jsx";
import ChampionsStyleWrapper from "./Champions.style.js";
import Set10Tabs from "../set10Tabs/index.js";
import { FaPlus, FaEquals } from "react-icons/fa";
import cloak from "@assets/image/items/basicItems/cloak.png";
import riven from "@assets/image/backgrounds/riven.jpg";
import { HiMiniMagnifyingGlass } from "react-icons/hi2";
import coin from "@assets/image/icons/coin.png";
import attackDistance from "@assets/image/icons/ico_attack_distance.png";
import icoMp from "@assets/image/icons/ico-mp.png";
import icoGold from "@assets/image/icons/ico-gold.svg";
import doller from "@assets/image/icons/doller.svg";
// import compsData from "../../ApiStructure/Comps/Comps.json";
import { IoMdCheckmarkCircle } from "react-icons/io";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import GlobalTooltip from "src/components/tooltip/GlobalTooltip.jsx";
import Comps from "./../../data/compsNew.json";
import { set } from "date-fns";

const Traits = ({ selected }) => {
  const [hoverIndex, setHoverIndex] = useState(null);
  const [tableHover, setTableHover] = useState(false);
  const [space1, setSpace1] = useState(null);
  const [space2, setSpace2] = useState(null);
  const [filtered, setFiltered] = useState("all");

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
  const [championss, setChampionss] = useState(champions);

  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  console.log(dimensions);

  useEffect(() => {
    setChampionss(makeInactive());
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    console.log(championss);
    if (dimensions?.width <= 640 && filtered !== "active") {
      const activeChampions = makeInactive().filter(
        (champion, index) => champion?.isActive
      );

      const pairedArrays = makePairedArrays(activeChampions);

      setChampionss(pairedArrays);
      setFiltered("active");
    }
  }, [dimensions]);

  const inactiveChampions = [
    2, 3, 5, 6, 8, 10, 13, 14, 15, 16, 18, 19, 22, 24, 25, 28, 29, 30, 32, 34,
    35, 36, 38, 39,
  ];

  const selectedChampion = champions?.find(
    (champion) => champion?.key === selected
  );

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

  const handleFilter = (e) => {
    if (e.target.value === "active") {
      setFiltered("active");
      const activeChampions = championss.filter(
        (champion, index) => champion?.isActive
      );

      const pairedArrays = makePairedArrays(activeChampions);

      setChampionss(pairedArrays);
      return;
    } else {
      setFiltered("all");
      setChampionss(makeInactive());
    }
  };

  const handleSearch = (e) => {
    setFiltered("all");
    const search = e.target.value;
    const filteredChampions = makeInactive()?.filter((champion) =>
      champion?.name.toLowerCase().includes(search.toLowerCase())
    );
    console.log("Search", filteredChampions);
    setChampionss(filteredChampions);
  };

  const makePairedArrays = (array) => {
    const data = array.reduce((result, item, index) => {
      // Check if the current index is even
      if (index % 2 === 0) {
        // Start a new pair
        result.push([item]);
      } else {
        // Add to the last pair
        result[result.length - 1].push(item);
      }
      return result;
    }, []);
    return data;
  };

  const [activeTab, setActiveTab] = useState("Champions");
  const tabs = ["Comps", "Champions", "Traits", "Items"];

  return (
    <ChampionsStyleWrapper>
      <div className="container md:!max-w-[95%]">
        <Set10Tabs
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        {/* <div className="">
          <div
            className="grid grid-cols-5 md:gap-4 h-[200px] gap-1 md:h-[290px] md:hover:h-[560px] md:transition md:ease-in-out md:duration-300 md:hover:transition-all md:delay-150"
            style={{
              background: "rgba(0, 0, 0, 0.2)",
              borderRadius: "16px",
              boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
              backdropFilter: "blur(2px)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              padding: "10px",
              overflow: "auto",
            }}
          >
            {imageUrls.map((_, index) => (
              <div class="relative mx-[2px] my-0 mb-3 md:m-0 h-[82px] sm:h-[137px] md:w-[220px] md:h-[260px] overflow-hidden z-[2]">
                <img
                  src={_?.imageUrl}
                  alt={_.name}
                  className="absolute overflow-hidden w-[91%] top-[2px] left-[3px] md:left-2 md:top-2"
                />
                <img
                  src="https://res.cloudinary.com/dg0cmj6su/image/upload/v1719832194/goldFrame_fh0mo7.webp"
                  className="absolute rounded-tl-md"
                />
                <div className="absolute bottom-2.5 md:bottom-[12px] w-full flex justify-between items-center">
                  <p className="text-[7px] md:text-lg font-bold p-0 my-1 ml-1.5 md:ml-4 !text-[#fff]">
                    {_.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div> */}
        <br />
        <div className="flex gap-x-[16px] flex-col md:flex-row">
          <div
            className="flex flex-col !border !border-[#e6e6e650] flex-grow-0 flex-shrink-0 basis-[50%]"
            style={{ backdropFilter: "50px" }}
          >
            <div className="flex justify-center items-center p-2 px-[16px]">
              <div className="relative mx-2 w-full rounded-md">
                <input
                  type="text"
                  placeholder="Search..."
                  className="!border !border-[#ca9372] text-gray-500 block py-[10px] pl-[8px] pr-[22px] w-full text-[14px] rounded-md"
                  onChange={handleSearch}
                />
                <HiMiniMagnifyingGlass className="absolute right-2 bottom-0 top-0 mx-2 my-auto text-[#ffc107] text-[24px]" />
              </div>
              <select
                className={`!border !border-[#ca9372] text-gray-500 block py-[10px] pl-[8px] pr-[22px] w-full text-[14px] rounded-md`}
                onChange={handleFilter}
                disabled={dimensions.width <= 640 ? true : false}
              >
                <option
                  value="all"
                  selected={filtered === "all" ? true : false}
                >
                  All
                </option>
                <option
                  value="active"
                  selected={filtered === "active" ? true : false}
                >
                  Active Champions
                </option>
              </select>
            </div>
            <div className="max-h-96 md:max-h-none overflow-scroll md:!overflow-hidden">
              {filtered === "all" ? (
                <div className="grid grid-cols-3 md:grid-cols-5 gap-2 !gap-y-3 p-3 pt-0 mb-10">
                  {championss.map((champion, index) => (
                    <Link href={`/champions/${champion?.key}`}>
                      <div
                        key={index}
                        className="relative w-full h-auto cursor-pointer"
                      >
                        <img
                          src={champion?.imageUrl}
                          alt={champion?.name}
                          className={`w-[98%] mt-1 md:mt-2 mx-auto h-auto object-cover md:rounded-sm ${
                            !champion?.isActive ? "grayscale opacity-50" : ""
                          }`}
                        />
                        <img
                          src={champion?.borderImageUrl}
                          alt="Frame"
                          className={`absolute top-0 left-0 w-full h-auto ${
                            !champion?.isActive ? "grayscale opacity-50" : ""
                          }`}
                        />
                        {selected === champion?.key && (
                          <IoMdCheckmarkCircle className="absolute top-0 right-0 w-full h-full p-5 bg-[#00000060] text-[#86efaccc]" />
                        )}
                        <img
                          src={champion?.identificationImageUrl}
                          className={`absolute -top-[3px] -right-[3px] w-[20px] md:w-[30px] ${
                            !champion?.isActive ? "opacity-50" : ""
                          }`}
                        />
                        <div
                          className={`absolute bottom-0 text-center w-full p-0.5 ${
                            !champion?.isActive
                              ? "text-[#ffffff80] bg-[linear-gradient(90deg,_rgba(21,27,23,0.1)_0%,_rgba(20,42,25,0.5)_49%,_rgba(14,39,39,0.1)_100%)]"
                              : "text-[#ffffff] bg-[linear-gradient(90deg,_rgba(21,27,23,0.1)_0%,_rgba(20,42,25,1)_49%,_rgba(14,39,39,0.1)_100%)]"
                          } text-[16px] [text-shadow:0px_4px_3px_rgba(0,0,0,0.4),_0px_8px_13px_rgba(0,0,0,0.1),_0px_18px_23px_rgba(0,0,0,0.1)]`}
                        >
                          {champion?.name}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-3 md:grid-cols-5 gap-2 !gap-y-3 p-3 pt-0 mb-10">
                  {championss.map((champion, index) => (
                    <div className="flex flex-col justify-center items-center gap-y-3">
                      <>
                        {/* {console.log("Hiiiiiix", champion)} */}
                        {champion?.length &&
                          champion?.map((champ, index) => (
                            <Link href={`/champions/${champ?.key}`}>
                              <div
                                key={index}
                                className="relative w-full h-auto cursor-pointer"
                              >
                                <img
                                  src={champ?.imageUrl}
                                  alt={champ?.name}
                                  className={`w-[98%] mt-1 md:mt-2 mx-auto h-auto object-cover md:rounded-sm ${
                                    !champ?.isActive
                                      ? "grayscale opacity-50"
                                      : ""
                                  }`}
                                />
                                {selected === champ?.key && (
                                  <IoMdCheckmarkCircle className="absolute top-0 right-0 w-full h-full p-5 bg-[#00000060] text-[#86efaccc]" />
                                )}
                                <img
                                  src={champ?.borderImageUrl}
                                  alt="Frame"
                                  className={`absolute top-0 left-0 w-full h-auto ${
                                    !champ?.isActive
                                      ? "grayscale opacity-50"
                                      : ""
                                  }`}
                                />
                                {index === 3 && (
                                  <IoMdCheckmarkCircle className="absolute top-0 right-0 w-full h-full p-5 bg-[#00000060] text-[#86efaccc]" />
                                )}
                                <img
                                  src={champ?.identificationImageUrl}
                                  className={`absolute -top-[3px] -right-[3px] w-[20px] md:w-[30px] ${
                                    !champ?.isActive ? "opacity-50" : ""
                                  }`}
                                />
                                <div
                                  className={`absolute bottom-0 text-center w-full p-0.5 ${
                                    !champ?.isActive
                                      ? "text-[#ffffff80] bg-[linear-gradient(90deg,_rgba(21,27,23,0.1)_0%,_rgba(20,42,25,0.5)_49%,_rgba(14,39,39,0.1)_100%)]"
                                      : "text-[#ffffff] bg-[linear-gradient(90deg,_rgba(21,27,23,0.1)_0%,_rgba(20,42,25,1)_49%,_rgba(14,39,39,0.1)_100%)]"
                                  } text-[13px] [text-shadow:0px_4px_3px_rgba(0,0,0,0.4),_0px_8px_13px_rgba(0,0,0,0.1),_0px_18px_23px_rgba(0,0,0,0.1)]`}
                                >
                                  {champ?.name}
                                </div>
                              </div>
                            </Link>
                          ))}
                      </>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div
            style={{
              background: "rgba(0, 0, 0, 0.2)",
              boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
              backdropFilter: "blur(2px)",
              border: "1px solid rgba(35, 31, 31, 0.3)",
            }}
            className="flex flex-col w-full"
          >
            <article>
              <dl className="mt-[20px] md:mt-0 relative">
                <dt className="flex h-[98px] py-0 px-[24px] items-center justify-start text-white text-[20px] font-bold relative">
                  <img
                    src={selectedChampion?.splashUrl}
                    className="absolute left-0 top-0 right-0 bottom-0 w-full h-full object-cover"
                  />
                  <span className="z-[1]">{selectedChampion?.name}</span>
                </dt>
                <div className="md:absolute md:top-0 grid md:right-0 grid-cols-3 md:grid-cols-none w-full md:grid-rows-3 py-[10px] px-[20px] md:pt-[16px] md:pr-[20px] md:pb-[8px] md:pl-[22px] md:h-[98px] md:w-[188px] text-white">
                  <dd className="md:flex md:items-center">
                    <strong className="font-normal text-[12px] md:text-[16px] md:font-light !text-white block mb-[10px] md:mb-0 md:basis-[50px]">
                      Cost
                    </strong>
                    <div className="flex items-center text-[12px] md:text-[16px] md:font-light !text-white gap-x-[2px]">
                      <img src={coin.src} className="h-[12px] w-[12px]" />
                      {selectedChampion?.cost[0]}
                    </div>
                    <div className="flex items-center text-[12px] md:text-[16px] md:font-light text-[#a0a0a0] md:m-0 md:ml-[20px]">
                      <img src={doller.src} className="h-[12px] w-[12px]" />
                      &nbsp;
                      {/* Bind the cost array to the component in 2/4/7 format */}
                      {selectedChampion?.cost}
                    </div>
                  </dd>
                  <dd className="md:flex md:items-center">
                    <strong className="font-normal text-[12px] md:text-[16px] md:font-light !text-white block mb-[10px] md:mb-0 md:basis-[50px]">
                      Origin
                    </strong>
                    {selectedChampion?.traits?.map(
                      (trait) =>
                        traits?.find(
                          (item) =>
                            item?.key === trait && item?.type === "ORIGIN"
                        ) && (
                          <div className="flex items-center text-[12px] md:text-[16px] md:font-light !text-white gap-x-[2px] md:m-0">
                            <img
                              src={
                                traits?.find((item) => item?.key === trait)
                                  ?.imageUrl
                              }
                              className="h-[12px] w-[12px]"
                            />
                            {traits?.find((item) => item?.key === trait)?.name}
                          </div>
                        )
                    )}
                  </dd>
                  <dd className="md:flex md:items-center">
                    <strong className="font-normal text-[12px] md:text-[16px] md:font-light !text-white block mb-[10px] md:mb-0 md:basis-[50px]">
                      Class
                    </strong>
                    {selectedChampion?.traits?.map(
                      (trait) =>
                        traits?.find(
                          (item) =>
                            item?.key === trait && item?.type === "CLASS"
                        ) && (
                          <div className="flex items-center text-[12px] md:text-[16px] md:font-light !text-white gap-x-[2px] md:m-0">
                            <img
                              src={
                                traits?.find((item) => item?.key === trait)
                                  ?.imageUrl
                              }
                              className="h-[12px] w-[12px]"
                            />
                            {traits?.find((item) => item?.key === trait)?.name}
                          </div>
                        )
                    )}
                  </dd>
                </div>
              </dl>
              <ul className="p-4 grid grid-cols-4 gap-y-4 border bg-[#333232] border-l-0 border-[#e6e6e650] md:grid-cols-4">
                <li className="text-[11px]">
                  <strong className="text-gray-400 font-normal md:text-[14px]">
                    Health
                  </strong>
                  <div className="mt-[6px]">
                    <p className="m-0 hidden md:block md:text-[14px]">
                      {selectedChampion?.health}
                    </p>
                    <div className="md:hidden">
                      <p className="m-0 md:hidden md:text-[14px]">
                        {selectedChampion?.health[0]}
                      </p>
                      <p className="m-0 md:hidden text-gray-400 md:text-[14px]">
                        {selectedChampion?.health}
                      </p>
                    </div>
                  </div>
                </li>
                <li className="text-[11px]">
                  <strong className="text-gray-400 font-normal md:text-[14px]">
                    AD
                  </strong>
                  <div className="mt-[6px]">
                    <p className="m-0 hidden md:block md:text-[14px]">
                      {selectedChampion?.attackDamage}
                    </p>
                    <div className="md:hidden">
                      <p className="m-0 md:hidden md:text-[14px]">
                        {selectedChampion?.attackDamage[0]}
                      </p>
                      <p className="m-0 md:hidden text-gray-400 md:text-[14px]">
                        {selectedChampion?.attackDamage}
                      </p>
                    </div>
                  </div>
                </li>
                <li className="text-[11px]">
                  <strong className="text-gray-400 font-normal md:text-[14px]">
                    DPS
                  </strong>
                  <div className="mt-[6px]">
                    <p className="m-0 hidden md:block md:text-[14px]"></p>
                    <div className="md:hidden">
                      <p className="m-0 md:hidden text-gray-400 md:text-[14px]"></p>
                    </div>
                  </div>
                </li>
                <li className="text-[11px]">
                  <strong className="text-gray-400 font-normal md:text-[14px]">
                    Health
                  </strong>
                  <div className="mt-[6px]">
                    <img src={attackDistance.src} className="" />
                  </div>
                </li>
                <li className="text-[11px]">
                  <strong className="text-gray-400 font-normal md:text-[14px]">
                    AS
                  </strong>
                  <div className="mt-[6px]">
                    <p className="m-0 hidden md:block md:text-[14px]">
                      {selectedChampion?.attackSpeed}
                    </p>
                  </div>
                </li>
                <li className="text-[11px]">
                  <strong className="text-gray-400 font-normal md:text-[14px]">
                    Armor
                  </strong>
                  <div className="mt-[6px]">
                    <p className="m-0 hidden md:block md:text-[14px]">
                      {selectedChampion?.armor}
                    </p>
                  </div>
                </li>
                <li className="text-[11px]">
                  <strong className="text-gray-400 font-normal md:text-[14px]">
                    Magic Resistence
                  </strong>
                  <div className="mt-[6px]">
                    <p className="m-0 hidden md:block md:text-[14px]">
                      {selectedChampion?.magicalResistance}
                    </p>
                  </div>
                </li>
              </ul>
              {selectedChampion?.skills?.map((skill, index) => (
                <figure className="flex py-[21px] px-[24px] border-t-0 border border-[#e6e6e650] bg-white">
                  <img
                    src={skill?.imageUrl}
                    className="w-[96px] h-[96px] rounded-md border-[#848999] border-2 overflow-hidden inline-flex shrink-0"
                  />
                  <figcaption className="pl-6 text-xs">
                    <strong className="text-[14px] md:text-lg font-bold">
                      {skill?.name}
                    </strong>
                    <div className="flex items-center gap-x-2 md:text-[14px]">
                      <span>Active</span>|
                      <div className="flex items-center gap-x-1">
                        <img src={icoMp.src} className="w-[14px] h-[14px]" />
                        <span>
                          Mana: {skill?.startingMana}/{skill?.skillMana}
                        </span>
                      </div>
                    </div>
                    <div
                      className="text-[14px]"
                      dangerouslySetInnerHTML={{
                        __html: skill?.desc,
                      }}
                    />
                    <div className="flex flex-col mt-2">
                      {skill?.stats?.map((stat, index) => (
                        <span className="text-[#ffc107] font-normal">
                          {stat}
                        </span>
                      ))}
                    </div>
                  </figcaption>
                </figure>
              ))}
            </article>
            <article className="mt-2">
              <h5 className="bg-[#333232] text-white text-sm font-bold h-10 leading-10 px-4 py-0 mb-0">
                Traits
              </h5>
              <table className="w-full table-fixed">
                <colgroup>
                  <col width="120px" />
                  <col />
                </colgroup>
                <tbody>
                  {selectedChampion?.traits?.map((trait, index) => (
                    <tr>
                      <td className="border-[#dfdfdf3f] border-1 !border-l-0 border-solid">
                        <div className="gap-x-0.5 items-center justify-center">
                          <div className="w-16 h-16 flex justify-center items-center shrink-0 !mx-auto">
                            <img
                              src={
                                traits?.find((item) => item?.key === trait)
                                  ?.imageUrl
                              }
                              className="h-16 w-16"
                            />
                          </div>
                          <div className="mx-auto w-fit">
                            <p className="text-[rgb(254,254,255)] !mx-auto !px-auto w-auto">
                              {
                                traits?.find((item) => item?.key === trait)
                                  ?.name
                              }
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="bg-white border-b border-[#dfdfdf3f]">
                        <div className="flex items-center justify-start flex-col gap-y-2.5 p-4">
                          {/* <div className="flex gap-2 flex-wrap self-start">
                            {Array(6)
                              .fill(0)
                              .map((_, index) => (
                                <a href="#" className="flex">
                                  <div className="relative inline-flex flex-col">
                                    <div className="relative flex flex-col rounded-[6px] w-[50px] h-[50px]">
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
                                </a>
                              ))}
                          </div> */}
                          <strong className="text-white text-sm md:text-base font-light self-start">
                            <div
                              dangerouslySetInnerHTML={{
                                __html: traits?.find(
                                  (item) => item?.key === trait
                                )?.desc,
                              }}
                            />
                          </strong>
                          {/* {Object.keys(
                            traits?.find((item) => item?.key === trait)?.stats
                          ).map((statLevel) => (
                            <div className="self-start">
                              <div className="font-light text-[#dad8d8] text-xs md:text-sm gap-x-1.5 mb-1.5">
                                <div className="bg-slate-700 w-[18px] h-[18px] rounded text-white inline-flex justify-center items-center text-center shrink-0 mr-1">
                                  {statLevel}:
                                </div>
                                <span>
                                  {
                                    traits?.find((item) => item?.key === trait)
                                      ?.stats[statLevel]
                                  }
                                </span>
                              </div>
                            </div>
                          ))} */}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </article>
            {/* <article className="mt-2">
              <h5 className="[background:rgb(202,147,114)] text-white text-sm font-bold h-10 leading-10 px-4 py-0 mb-0">
                Recommended Items
              </h5>

              <div className="flex gap-2 flex-wrap [align-self:start] [background:rgb(255,255,255)] px-4 py-2 border-b-[#ffffff14] border-x-[rgb(230,230,230)] border-l border-solid border-r border-b">
                <a className="flex">
                  <div className="relative inline-flex flex-col">
                    <div className="relative flex flex-col w-[50px] h-[50px]">
                      <div className="relative w-full h-full overflow-hidden inline-flex">
                        <img
                          src={
                            "https://res.cloudinary.com/dc1bqtn7t/image/upload/v1717487112/skills/wizard/Wizard_level_3_light_qoyba9.png"
                          }
                          className="w-[120%] max-w-[120%] h-[120%] -ml-[10%] -mr-[10%] object-center object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </a>
                <a className="flex">
                  <div className="relative inline-flex flex-col">
                    <div className="relative flex flex-col w-[50px] h-[50px]">
                      <div className="relative w-full h-full overflow-hidden inline-flex">
                        <img
                          src={
                            "https://res.cloudinary.com/dc1bqtn7t/image/upload/v1717487112/skills/wizard/Wizard_level_3_fire_orj8ss.png"
                          }
                          className="w-[120%] max-w-[120%] h-[120%] -ml-[10%] -mr-[10%] object-center object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </a>
                <a className="flex">
                  <div className="relative inline-flex flex-col">
                    <div className="relative flex flex-col w-[50px] h-[50px]">
                      <div className="relative w-full h-full overflow-hidden inline-flex">
                        <img
                          src={
                            "https://res.cloudinary.com/dc1bqtn7t/image/upload/v1717487117/skills/wizard/Wizard_level_2_bzyoum.png"
                          }
                          className="w-[120%] max-w-[120%] h-[120%] -ml-[10%] -mr-[10%] object-center object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </a>
                <a className="flex">
                  <div className="relative inline-flex flex-col">
                    <div className="relative flex flex-col w-[50px] h-[50px]">
                      <div className="relative w-full h-full overflow-hidden inline-flex">
                        <img
                          src={
                            "https://res.cloudinary.com/dc1bqtn7t/image/upload/v1717487119/skills/wizard/Wizard_level_3_dark_zlex2d.png"
                          }
                          className="w-[120%] max-w-[120%] h-[120%] -ml-[10%] -mr-[10%] object-center object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </a>
                <a className="flex">
                  <div className="relative inline-flex flex-col">
                    <div className="relative flex flex-col w-[50px] h-[50px]">
                      <div className="relative w-full h-full overflow-hidden inline-flex">
                        <img
                          src={
                            "https://res.cloudinary.com/dc1bqtn7t/image/upload/v1717487129/skills/wizard/Wizard_level_3_water_az2ikl.png"
                          }
                          className="w-[120%] max-w-[120%] h-[120%] -ml-[10%] -mr-[10%] object-center object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </a>
              </div>
            </article> */}
            <article className="mt-2 overflow-auto">
              <div className="bg-[#333232] text-[#fff] text-lg font-bold h-10 leading-10 px-2 py-0 mb-0">
                Item Build
              </div>
              <table className="w-full table-fixed text-[#212529] overflow-auto">
                <colgroup>
                  <col />
                  <col />
                  <col />
                  <col />
                  <col />
                </colgroup>
                <thead className="h-[43px] md:text-[16px] bg-[#696868] text-[#fff] border-b border-[#e6e6e650]">
                  <tr>
                    <th className="text-center py-0 md:px-4 md:w-[45%]">
                      Item
                    </th>
                    <th className="text-center py-0 md:px-4">Avg.Rank</th>
                    <th className="text-center py-0 md:px-4">Pick%</th>
                    <th className="text-center py-0 md:px-4">TOP4</th>
                    <th className="text-center py-0 md:px-4">Win%</th>
                  </tr>
                </thead>
                <tbody>
                  {Array(5)
                    .fill(0)
                    .map((_, index) => (
                      <tr className="h-[49px]">
                        <td className="text-[#212529] text-[12px] text-center py-0 md:px-3 bg-white border-b border-[#e6e6e650]">
                          <div className="flex md:gap-x-2 ">
                            {Array(3)
                              .fill(0)
                              .map((_, index) => (
                                <div className="">
                                  <img
                                    src={cloak.src}
                                    className="h-auto md:w-[72px] md:h-[72px]"
                                  />
                                </div>
                              ))}
                          </div>
                        </td>
                        <td className="!text-white text-[12px] md:text-[16px] text-center py-0 px-3 border-b border-[#e6e6e650]">
                          #4.25
                        </td>
                        <td className="!text-white text-[12px] md:text-[16px] text-center py-0 px-3 bg-gray-700 border-b border-[#e6e6e650]">
                          0.38%
                        </td>
                        <td className="!text-white text-[12px] md:text-[16px] text-center py-0 px-3 border-b border-[#e6e6e650]">
                          54.20%
                        </td>
                        <td className="!text-white text-[12px] md:text-[16px] text-center py-0 px-3 border-b border-[#e6e6e650]">
                          11.02%
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </article>
          </div>
        </div>
        <article className="hidden overflow-auto mt-5">
          <h5 className="text-xl font-semibold leading-5 mb-2.5">Champions</h5>
          <table className="table-fixed w-full min-w-[375px] border-t border-l border-r border-[#e6e6e650]">
            <thead>
              <tr className="font-bold text-[12px] cursor-pointer text-left bg-[#333232]">
                <th className="w-[16%] md:w-[180px] pl-2 text-[8px] md:text-[14px]">
                  Name
                </th>
                <th className="w-[5%] md:w-[50px] pl-2 text-[8px] md:text-[14px]">
                  Cost
                </th>
                <th className="pl-2 md:w-[10%] text-[8px] md:text-[14px]">
                  Origin
                </th>
                <th className="pl-2 text-[8px] md:text-[14px]">Class</th>
                <th className="pl-2 text-[8px] md:text-[14px]">Health</th>
                <th className="pl-2 text-[8px] md:text-[14px]">Armor</th>
                <th className="pl-2 text-[8px] md:text-[14px]">AD</th>
                <th className="pl-2 text-[8px] md:text-[14px]">Attack Range</th>
                <th className="pl-2 text-[8px] md:text-[14px]">AS</th>
                <th className="pl-2 text-[8px] md:text-[14px]">DPS</th>
                <th className="pl-2 text-[8px] md:text-[14px]">Skill</th>
                <th className="w-[14%] md:w-[80px] pl-2 text-[8px] md:text-[14px]">
                  Mana
                </th>
              </tr>
            </thead>
            <tbody>
              {champions?.map(
                (champion, index) =>
                  champion?.cost[0] !== 0 && (
                    <tr>
                      <td className="text-left align-middle text-white text-xs font-normal pl-2 py-1 border-b-[#ffffff14] border-b border-solid">
                        <div className="flex justify-center items-center md:justify-start">
                          <a className="flex justify-center items-center gap-x-2">
                            <div className="relative inline-flex flex-col">
                              <div className="flex flex-col w-10 h-10 rounded-md">
                                <div className="relative inline-flex overflow-hidden rounded-md border-0">
                                  <img
                                    src={champion?.imageUrl}
                                    className="h-full object-cover object-center w-[120%] max-w-[120%] -ml-[10%]"
                                  />
                                </div>
                              </div>
                            </div>
                            <span className="hidden md:inline-block md:text-left md:text-[14px]">
                              {champion?.name}
                            </span>
                          </a>
                        </div>
                      </td>
                      <td className="text-center align-middle text-xs font-normal py-1 border-b-[#ffffff14] border-b border-solid">
                        <div className="flex flex-wrap gap-x-[2px] justify-center ">
                          <img src={icoGold.src} />
                          <span className="md:text-[14px]">
                            {champion?.cost[0]}
                          </span>
                        </div>
                      </td>
                      <td className="text-center align-middle text-[rgb(33,37,41)] text-xs font-normal py-1 border-b-[#ffffff14] border-b border-solid">
                        <div className="flex justify-center items-center flex-wrap md:flex-col md:justify-start md:items-start md:gap-y-1 md:pl-2">
                          {champion?.traits?.map(
                            (trait) =>
                              traits?.find(
                                (item) =>
                                  item?.key === trait && item?.type === "ORIGIN"
                              ) && (
                                <div className="md:flex md:flex-row md:items-center md:gap-x-1">
                                  <div className="[background:url('//cdn.dak.gg/tft/images2/icon/ico-trait-darken.svg')_50%_center_/_cover_no-repeat] w-6 h-6 flex justify-center items-center shrink-0">
                                    <img
                                      src={
                                        traits?.find(
                                          (item) => item?.key === trait
                                        )?.imageUrl
                                      }
                                      className="h-3.5 w-3.5"
                                    />
                                  </div>
                                  <span className="hidden md:inline !text-white md:text-[14px]">
                                    <>
                                      {
                                        traits?.find(
                                          (item) => item?.key === trait
                                        )?.name
                                      }
                                    </>
                                  </span>
                                </div>
                              )
                          )}
                        </div>
                      </td>
                      <td className="text-center align-middle text-[rgb(33,37,41)] text-xs font-normal py-1 border-b-[#ffffff14] border-b border-solid">
                        <div className="flex justify-center items-center flex-wrap md:flex-col md:justify-start md:items-start md:gap-y-1 md:pl-2">
                          {champion?.traits?.map(
                            (trait) =>
                              traits?.find(
                                (item) =>
                                  item?.key === trait && item?.type === "CLASS"
                              ) && (
                                <div className="md:flex md:flex-row md:items-center md:gap-x-1">
                                  <div className="[background:url('//cdn.dak.gg/tft/images2/icon/ico-trait-darken.svg')_50%_center_/_cover_no-repeat] w-6 h-6 flex justify-center items-center shrink-0">
                                    <img
                                      src={
                                        traits?.find(
                                          (item) => item?.key === trait
                                        )?.imageUrl
                                      }
                                      className="h-3.5 w-3.5"
                                    />
                                  </div>
                                  <span className="hidden md:inline !text-white md:text-[14px]">
                                    <>
                                      {
                                        traits?.find(
                                          (item) => item?.key === trait
                                        )?.name
                                      }
                                    </>
                                  </span>
                                </div>
                              )
                          )}
                        </div>
                      </td>
                      <td className="text-center align-middle !text-white text-xs font-normal py-1 border-b-[#ffffff14] border-b border-solid md:text-[14px]">
                        {champion?.health[0]}
                      </td>
                      <td className="text-center align-middle !text-white text-xs font-normal py-1 border-b-[#ffffff14] border-b border-solid md:text-[14px]">
                        {champion?.armor}
                      </td>
                      <td className="text-center align-middle !text-white text-xs font-normal py-1 border-b-[#ffffff14] border-b border-solid md:text-[14px]">
                        {champion?.attackDamage[0]}
                      </td>
                      <td className="text-center align-middle !text-white text-xs font-normal py-1 border-b-[#ffffff14] border-b border-solid md:text-[14px]">
                        <div className="mt-[6px]">
                          <img src={attackDistance.src} className="" />
                        </div>
                      </td>
                      <td className="text-center align-middle !text-white text-xs font-normal py-1 border-b-[#ffffff14] border-b border-solid md:text-[14px]">
                        {champion?.attackSpeed}
                      </td>
                      <td className="text-center align-middle !text-white text-xs font-normal py-1 border-b-[#ffffff14] border-b border-solid md:text-[14px]"></td>
                      <td className="text-center align-middle !text-white text-xs font-normal py-1 border-b-[#ffffff14] border-b border-solid md:text-[14px]">
                        <div className="flex justify-center items-center">
                          <img
                            src={champion?.skill?.imageUrl}
                            className="w-[28px] h-[28px]"
                          />
                        </div>
                      </td>
                      <td className="text-center align-middle !text-white text-xs font-normal py-1 border-b-[#ffffff14] border-b border-solid">
                        <div className="flex justify-center items-center flex-wrap">
                          <img
                            src={icoMp.src}
                            className="w-[14px] h-[14px] md:w-[20px] md:h-[20px]"
                          />
                          <span>
                            {champion?.skill?.startingMana}/
                            {champion?.skill?.skillMana}
                          </span>
                        </div>
                      </td>
                    </tr>
                  )
              )}
            </tbody>
          </table>
        </article>
      </div>
    </ChampionsStyleWrapper>
  );
};

export default Traits;
