import dynamic from "next/dynamic";
import { useTranslation } from "react-i18next";
import "../../../../../i18n";
import React, { useState } from "react";
import Image from "next/image";
import { Tooltip } from "react-tooltip";
import TraitTooltip from "src/components/tooltip/TraitTooltip";
import "react-tooltip/dist/react-tooltip.css";
import GirlCrush from "@assets/image/traits/GirlCrush.svg";
import MetaTrendsCard from "../MetaTrendsCard/MetaTrendsCard";
import augment from "@assets/image/augments/1.png";
import arrowRight from "@assets/image/icons/arrow-right.svg";
import { PiEye } from "react-icons/pi";
import { PiEyeClosed } from "react-icons/pi";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import { IoMdCheckmarkCircle } from "react-icons/io";
import Comps from "../../../../data/compsNew.json";
import ReactTltp from "src/components/tooltip/ReactTltp";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
const MyBarChartComponent = dynamic(() => import("./BarGraph"), { ssr: false });

const ProjectItems = () => {
  const { t } = useTranslation();
  const others = t("others");
  const [selectedChampion, setSelectedChampion] = React.useState(null);
  const [selectedTrait, setSelectedTrait] = React.useState(null);
  const [selectedItem, setSelectedItem] = React.useState(null);
  // const { data } = projectsData;
  const [isClosed, setIsClosed] = useState({});
  const [height, setHeight] = useState("auto");
  const [activeTab, setActiveTab] = useState("Champions"); // [Tier 1, Tier 2, Tier 3, Tier 4, Tier 5
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

  const chartData = {
    labels: ["", "", "", "", "", "", "", "", ""],
    datasets: [
      {
        label: "",
        data: [12, 19, 3, 5, 2, 3, 7, 9, 8],
        backgroundColor: "rgb(26 27 49)", // Uniform color for all bars
        borderColor: "rgb(43 49 163)", // Uniform color for all bar borders
        borderWidth: 1,
      },
    ],
  };

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
  const { augments } = data?.refs;
  const { forces } = data?.refs;
  const [compsData, setCompsData] = useState(metaDecks);

  const handleFilterChange = (type, key) => {
    console.log("Type", type, key);
    if (type === "trait") {
      if (selectedTrait === key) {
        console.log("hi");
        setSelectedTrait(null);
        setCompsData(metaDecks);
      } else {
        setSelectedTrait(key);
        console.log(metaDecks);
        const filteredTraits = metaDecks.filter((deck) =>
          deck.deck.traits.some((trait) => trait.key === key)
        );
        console.log("Trait", key, selectedTrait, filteredTraits);
        setCompsData(filteredTraits);
      }
      setSelectedChampion(null);
      setSelectedItem(null);
    } else if (type === "force") {
      if (selectedTrait === key) {
        console.log("hi");
        setSelectedTrait(null);
        setCompsData(metaDecks);
      } else {
        setSelectedTrait(key);
        const filteredTraits = metaDecks.filter((deck) =>
          deck.deck.forces.some(
            (force) => force.key.toLowerCase() === key.toLowerCase()
          )
        );
        // console.log("Trait", key, selectedTrait, filteredTraits);
        setCompsData(filteredTraits);
      }
      setSelectedChampion(null);
      setSelectedItem(null);
    } else if (type === "champion") {
      if (selectedChampion === key) {
        setSelectedChampion(null);
        setCompsData(metaDecks);
      } else {
        setSelectedChampion(key);
        const filteredChampions = metaDecks.filter((deck) =>
          deck.deck.champions.some((champion) => champion.key === key)
        );
        setCompsData(filteredChampions);
      }
      setSelectedTrait(null);
      setSelectedItem(null);
    } else if (type === "item") {
      if (selectedItem === key) {
        setSelectedItem(null);
        setCompsData(metaDecks);
      } else {
        setSelectedItem(key);
        const filteredItems = metaDecks.filter((deck) =>
          deck.deck.champions.some(
            (champion) =>
              champion.items && champion.items.some((item) => item === key)
          )
        );
        setCompsData(filteredItems);
      }
      setSelectedChampion(null);
      setSelectedTrait(null);
    }
  };

  // Function to arrange champions by cost start
  const groupedByCost = champions.reduce((acc, champion) => {
    const { cost } = champion;
    if (!acc[cost]) {
      acc[cost] = [];
    }
    acc[cost].push(champion);
    return acc;
  }, {});
  const groupedArray = Object.values(groupedByCost);

  // if (selectedChampion !== null) {
  groupedArray.forEach((subArray) => {
    // Traverse through each object in the sub-array
    subArray.forEach((champion) => {
      // Check if the key of the champion matches the selectedChampion
      if (champion.key === selectedChampion) {
        // Set the 'selected' property to true
        champion.selected = true;
      } else {
        // Set the 'selected' property to false
        champion.selected = false;
      }
    });
  });
  // }

  // Function to arrange champions by cost end
  const filteredDecks = metaDecks.filter((deck) =>
    deck.deck.champions.some((champion) => champion.key === selectedChampion)
  );

  const series = [
    {
      name: "Avg Rank",
      data: [90, 80, 70, 60, 50, 40, 30, 20, 10],
    },
  ];
  const options = {
    chart: {
      type: "bar",
      height: 350,
      toolbar: {
        show: false, // This hides the menu button
      },
      padding: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      },
      margin: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      },
    },
    grid: {
      show: false, // This hides the background grid lines
    },
    plotOptions: {
      bar: {
        horizontal: false,
        barHeight: "100%", // Makes bars fill the entire vertical space
        distributed: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      labels: {
        show: false, // Hides x-axis labels
      },
      axisTicks: {
        show: false, // Hides x-axis ticks
      },
      axisBorder: {
        show: false, // Hides x-axis line
      },
      floating: true, // This ensures the axis doesn't take up space
    },
    yaxis: {
      labels: {
        show: false, // Hides y-axis labels
      },
      axisTicks: {
        show: false, // Hides y-axis ticks
      },
      axisBorder: {
        show: false, // Hides y-axis line
      },
      floating: true, // This ensures the axis doesn't take up space
    },
    plotOptions: {
      bar: {
        horizontal: false,
        barHeight: "100%", // Makes bars fill the entire vertical space
        distributed: false,
      },
    },
    tooltip: {
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        return (
          '<div class="apexcharts-tooltip-series">' +
          '<span class="apexcharts-tooltip-text-y-label">Avg Rank: </span>' +
          '<span class="apexcharts-tooltip-text-y-value">' +
          series[seriesIndex][dataPointIndex] +
          "</span>" +
          "</div>"
        );
      },
    },
    fill: {
      opacity: 1,
    },
    // tooltip: {
    //   y: {
    //     formatter: function (val) {
    //       return "$ " + val + " thousands";
    //     },
    //   },
    // },
  };

  return (
    // <ProjectItemsStyleWrapper>
    <>
      <div className="">
        {/* <br />
        <TrendFilters
          dropdown1={["v14.2", "v14.1"]}
          dropdown2={[
            "All Ranks",
            "Iron",
            "Bronze",
            "Silver",
            "Gold",
            "Platinum",
            "Diamond",
            "Master",
            "Grandmaster",
            "Challenger",
          ]}
        /> */}
        <div className="projects-row md pt-3">
          <div>
            {/* TABS START */}
            <div className="!py-2 lg:flex lg:items-center md:ml-[104px]">
              <div
                className="inline-flex shadow-sm rounded-md overflow-hidden mx-1 !bg-[#222231] !border !border-[#ffffff90]"
                role="group"
              >
                <button
                  type="button"
                  className={`border border-gray-200 text-md font-medium px-4 py-2 text-[#fff] hover:bg-gray-200 hover:text-gray-900 focus:z-10 focus:ring-blue-700 focus:text-blue-700 ${activeTab === "Champions" ? "bg-[#fff] rounded-l-sm text-gray-900" : ""}`}
                  onClick={() => setActiveTab("Champions")}
                >
                  {others?.champions}
                </button>
                <button
                  type="button"
                  className={`border border-gray-200 text-md font-medium px-4 py-2 text-[#fff] hover:bg-gray-200 hover:text-gray-900 focus:z-10 focus:ring-blue-700 focus:text-blue-700 ${activeTab === "Traits" ? "bg-[#fff] text-gray-900" : ""}`}
                  onClick={() => setActiveTab("Traits")}
                >
                  {others?.traits}
                </button>
                <button
                  type="button"
                  className={`border border-gray-200 text-md font-medium px-4 py-2 text-[#fff] hover:bg-gray-200 hover:text-gray-900 focus:z-10 focus:ring-blue-700 focus:text-blue-700 ${activeTab === "Items" ? "bg-[#fff] rounded-r-sm text-gray-900" : ""}`}
                  onClick={() => setActiveTab("Items")}
                >
                  {others?.items}
                </button>
              </div>
            </div>
            {/* TABS END */}
            <div className="">
              <div
                className={`${
                  activeTab === "Champions" ? "flex flex-col gap-4" : "hidden"
                }`}
              >
                <div>
                  <div
                    className="relative flex flex-col sm:!h-auto sm:!pb-0 pb-[34px]"
                    // style={{ height: height }}
                  >
                    <div className="flex flex-col py-[4px] lg:px-[5px]">
                      {/* <div className="grid grid-cols-1 gap-[6px] sm:grid-cols-3 lg:min-h-[220px] lg:grid-cols-5"> */}
                      <MetaTrendsCard
                        itemCount={13}
                        championsByCost={groupedArray}
                        setSelectedChampion={(key) =>
                          handleFilterChange("champion", key)
                        }
                        forces={forces}
                      />
                      {/* <MetaTrendsCard cost="Cost 2" itemCount={13} />
                        <MetaTrendsCard cost="Cost 3" itemCount={13} />
                        <MetaTrendsCard cost="Cost 4" itemCount={13} />
                        <MetaTrendsCard cost="Cost 5" itemCount={8} /> */}
                      {/* </div> */}
                    </div>
                    {/* <div className="absolute bottom-0 left-0 w-full sm:hidden">
                      <div
                        className={`flex flex-col justify-end ${
                          height !== "auto" ? "pb-[4px] h-auto" : "!p-0 h-auto"
                        }`}
                        style={{
                          background:
                            height !== "auto"
                              ? "linear-gradient(0deg, rgb(42, 44, 51) 36.91%, rgba(42, 44, 51, 0) 112.5%)"
                              : "none",
                        }}
                      >
                        <button
                          className="flex-center h-[34px]"
                          onClick={() =>
                            setHeight((previous) =>
                              previous === "auto" ? "200px" : "auto"
                            )
                          }
                        >
                          <span className="flex-center gap-[8px] text-[16px] font-semibold leading-none text-[#CA9372]">
                            {height === "auto" ? (
                              <FaAngleUp className="mx-auto" />
                            ) : (
                              <FaAngleDown className="mx-auto" />
                            )}
                          </span>
                        </button>
                      </div>
                    </div> */}
                  </div>
                </div>
              </div>
              <div
                className={` ${
                  activeTab === "Traits"
                    ? "relative flex flex-col sm:!h-auto sm:!pb-0"
                    : "hidden"
                } `}
              >
                <div
                  className="relative flex flex-col sm:!h-auto sm:!pb-0 pb-[34px]"
                  style={{ height: height }}
                >
                  <div className="flex pt-[4px] lg:py-[24px] lg:px-[16px]">
                    <div className="flex flex-col lg:gap-[24px]">
                      <div className="flex flex-col lg:flex-row items-center">
                        <div className="md:mr-4">
                          <div className="flex flex-col bg-[#27282E] p-[9px] text-center text-[16px] font-semibold leading-none text-white lg:w-[70px] lg:rounded-[4px] lg:p-[10px] mb-0">
                            {others?.origin}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-y-[16px] py-[16px] px-[4px] sm:px-[8px] md:px-[10px] lg:p-0 justify-center">
                          {traits?.map((trait, i) => (
                            <div
                              className="inline-flex justify-center items-center flex-col gap-[4px] mx-2 cursor-pointer"
                              onClick={() => {
                                handleFilterChange("trait", trait?.key);
                              }}
                            >
                              <ReactTltp
                                variant="trait"
                                content={trait}
                                id={trait?.imageUrl}
                              />
                              <div
                                className="relative"
                                data-tooltip-id={trait?.imageUrl}
                              >
                                <div
                                  className={`relative w-[96px] h-[96px]`}
                                  // style={{
                                  //   backgroundImage: `url(${traitBg.src})`,
                                  //   backgroundSize: "cover",
                                  // }}
                                >
                                  <Image
                                    alt="Image"
                                    width={80}
                                    height={80}
                                    src={trait?.imageUrl}
                                    className="w-[96px] h-[96px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-cover object-center"
                                  />
                                  {trait?.key === selectedTrait && (
                                    <IoMdCheckmarkCircle className="absolute top-0 p-3 right-0 w-full h-full text-[#86efaccc]" />
                                  )}
                                </div>
                              </div>
                              <span className="ellipsis !w-full text-center text-[16px] leading-none text-[#ffffff] bg-[#1b1a32] px-2 py-1 rounded-md">
                                {trait?.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col lg:flex-row items-center">
                        <div className="md:mr-4">
                          <div className="flex flex-col bg-[#27282E] p-[9px] text-center text-[16px] font-semibold leading-none text-white lg:w-[70px] lg:rounded-[4px] lg:p-[10px] mb-0">
                            {others?.forces}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-y-[16px] gap-x-4 py-[16px] px-[4px] sm:px-[8px] md:px-[10px] lg:p-0">
                          {forces?.map((trait, i) => (
                            <div
                              className="inline-flex justify-center items-center flex-col gap-[4px] cursor-pointer"
                              onClick={() => {
                                handleFilterChange("force", trait?.key);
                              }}
                            >
                              {/* <ReactTltp
                                content={trait?.name}
                                id={trait?.key}
                              /> */}
                              <div
                                className="relative"
                                // data-tooltip-id={trait?.key}
                              >
                                <div
                                  className={`relative w-[96px] h-[96px]`}
                                  // style={{
                                  //   backgroundImage: `url(${traitBg.src})`,
                                  //   backgroundSize: "cover",
                                  // }}
                                >
                                  <Image
                                    alt="Image"
                                    width={80}
                                    height={80}
                                    src={trait?.imageUrl}
                                    className="w-[96px] h-[96px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-cover object-center"
                                  />
                                  {trait?.key === selectedTrait && (
                                    <IoMdCheckmarkCircle className="absolute top-0 p-3 right-0 w-full h-full text-[#86efaccc]" />
                                  )}
                                </div>
                              </div>
                              <span className="ellipsis !w-full text-center text-[16px] leading-none text-[#cccccc] bg-[#1b1a32] px-2 py-1 rounded-md">
                                {trait?.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* <div className="absolute bottom-0 left-0 w-full sm:hidden">
                    <div
                      className={`flex flex-col justify-end ${
                        height !== "auto" ? "pb-[4px] h-auto" : "!p-0 h-auto"
                      }`}
                      style={{
                        background:
                          height !== "auto"
                            ? "linear-gradient(0deg, rgb(42, 44, 51) 36.91%, rgba(42, 44, 51, 0) 112.5%)"
                            : "none",
                      }}
                    >
                      <button
                        className="flex-center h-[34px]"
                        onClick={() =>
                          setHeight((previous) =>
                            previous === "auto" ? "200px" : "auto"
                          )
                        }
                      >
                        <span className="flex-center gap-[8px] text-[16px] font-semibold leading-none text-[#CA9372]">
                          {height === "auto" ? (
                            <FaAngleUp className="mx-auto" />
                          ) : (
                            <FaAngleDown className="mx-auto" />
                          )}
                        </span>
                      </button>
                    </div>
                  </div> */}
                </div>
              </div>
              {/* Items */}
              <div
                className={` ${
                  activeTab === "Items"
                    ? "relative flex flex-col sm:!h-auto sm:!pb-0"
                    : "hidden"
                } `}
              >
                <div
                  className="relative flex flex-col sm:!h-auto sm:!pb-0 pb-[34px]"
                  style={{ height: height }}
                >
                  <div className="flex pt-[4px] lg:py-[24px] lg:px-[16px]">
                    <div className="flex flex-col lg:gap-[24px]">
                      <div className="flex flex-col lg:flex-row">
                        <div className="flex flex-wrap gap-y-[16px] py-[16px] px-[4px] sm:px-[8px] md:px-[10px] lg:p-0 justify-center">
                          {items
                            ?.filter((item) => !item?.isFromItem)
                            ?.map((item, i) => (
                              <div
                                className="inline-flex justify-center items-center flex-col mx-1 gap-[4px] cursor-pointer"
                                onClick={() => {
                                  handleFilterChange("item", item?.key);
                                }}
                              >
                                <ReactTltp
                                  variant="item"
                                  content={item}
                                  id={item?.key}
                                />
                                <div
                                  className="relative"
                                  data-tooltip-id={item?.key}
                                >
                                  <div
                                    className={`relative w-[44px] md:w-[84px] h-[44px] md:h-[84px]`}
                                  >
                                    <Image
                                      alt="Image"
                                      width={80}
                                      height={80}
                                      src={item?.imageUrl}
                                      className="w-[48px] md:w-[84px] h-[48px] md:h-[84px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-cover object-center"
                                    />
                                    {item?.key === selectedItem && (
                                      <IoMdCheckmarkCircle className="absolute top-0 right-0 w-full h-full bg-[#00000060] text-[#86efaccc]" />
                                    )}
                                  </div>
                                </div>
                                {/* <span className="hidden md:block ellipsis !w-full text-center text-[12px] leading-none text-[#cccccc]">
                                  {item?.name}
                                </span> */}
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* <div className="absolute bottom-0 left-0 w-full sm:hidden">
                    <div
                      className={`flex flex-col justify-end ${
                        height !== "auto" ? "pb-[4px] h-auto" : "!p-0 h-auto"
                      }`}
                      style={{
                        background:
                          height !== "auto"
                            ? "linear-gradient(0deg, rgb(42, 44, 51) 36.91%, rgba(42, 44, 51, 0) 112.5%)"
                            : "none",
                      }}
                    >
                      <button
                        className="flex-center h-[34px]"
                        onClick={() =>
                          setHeight((previous) =>
                            previous === "auto" ? "200px" : "auto"
                          )
                        }
                      >
                        <span className="flex-center gap-[8px] text-[16px] font-semibold leading-none text-[#CA9372]">
                          {height === "auto" ? (
                            <FaAngleUp className="mx-auto" />
                          ) : (
                            <FaAngleDown className="mx-auto" />
                          )}
                        </span>
                      </button>
                    </div>
                  </div> */}
                </div>
              </div>
            </div>
            <br />
            <div className="flex flex-col gap-[16px]">
              <div>
                {compsData?.map((metaDeck, i) => (
                  <div
                    className="flex flex-col gap-[1px] border border-[#323232] bg-[#323232] mb-4"
                    style={{
                      background: "rgba(0, 0, 0, 0.2)",
                      backdropFilter: "blur(2px)",
                    }}
                  >
                    <header className="relative flex md:flex-col justify-between items-end bg-[#1a1b30] py-[15px] pl-3 md:pl-4 pr-3 md:pr-[36px] lg:min-h-[50px] lg:flex-row lg:items-center lg:py-[5px] lg:pr-[16px]">
                      <div className="inline-flex flex-col flex-wrap gap-[8px] md:flex-row md:items-center md:gap-[4px]">
                        <strong className="text-[26px] font-semibold leading-none text-[#ffffff]">
                          {metaDeck?.name}
                        </strong>
                        <span className="flex justify-center items-center">
                          {metaDeck?.deck?.forces?.map((force, i) => (
                            <>
                              <div className="flex justify-center items-center bg-[#000] rounded-full mx-1 pr-2 border-[1px] border-[#ffffff50]">
                                <Image
                                  alt="Image"
                                  width={50}
                                  height={50}
                                  src={
                                    forces?.find(
                                      (t) =>
                                        t.key.toLowerCase() ===
                                        force?.key.toLowerCase()
                                    )?.imageUrl
                                  }
                                  data-tooltip-id={force?.key}
                                  className="w-[24px] h-[24px] md:w-[40px] md:h-[40px] mr-1"
                                />
                                <ReactTltp
                                  content={force?.key}
                                  id={force?.key}
                                />
                                <span className="text-[18px]">
                                  {force?.numUnits}
                                </span>
                              </div>
                            </>
                          ))}
                        </span>
                      </div>
                      <div className="inline-flex flex-shrink-0 gap-[22px] md:mt-0">
                        <div className="inline-flex flex-wrap">
                          {metaDeck?.deck?.traits?.map((trait, i) => (
                            <>
                              {traits
                                ?.find((t) => t.key === trait?.key)
                                ?.tiers?.find((t) => t?.min >= trait?.numUnits)
                                ?.imageUrl && (
                                <div
                                  className="relative w-[30px] h-[30px] md:w-[56px] md:h-[56px]"
                                  // style={{
                                  //   backgroundImage: `url(${traitBg.src})`,
                                  //   width: "48px",
                                  //   height: "48px",
                                  // }}
                                >
                                  <Image
                                    alt="Image"
                                    width={50}
                                    height={50}
                                    src={
                                      traits
                                        ?.find((t) => t.key === trait?.key)
                                        ?.tiers?.find(
                                          (t) => t?.min >= trait?.numUnits
                                        )?.imageUrl
                                    }
                                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-cover object-center w-[30px] md:w-[56px]"
                                    data-tooltip-id={
                                      traits?.find((t) => t.key === trait?.key)
                                        ?.key
                                    }
                                  />
                                  <ReactTltp
                                    variant="trait"
                                    id={
                                      traits?.find((t) => t.key === trait?.key)
                                        ?.key
                                    }
                                    content={{
                                      ...traits?.find(
                                        (t) => t.key === trait?.key
                                      ),
                                      numUnits: trait?.numUnits,
                                    }}
                                  />
                                </div>
                              )}
                            </>
                          ))}
                        </div>
                        <div className="absolute right-[16px] top-[16px] inline-flex gap-[8px] lg:relative lg:right-[0px] lg:top-[0px]">
                          <button
                            className="inline-flex w-[16px] cursor-pointer items-center text-white"
                            title="Hide"
                            id={i}
                            onClick={handleIsClosed}
                          >
                            {!isClosed[i] ? <PiEye /> : <PiEyeClosed />}
                          </button>
                        </div>
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
                        <div className="flex min-h-[150px] flex-col justify-between items-center bg-[#27282E90] py-[16px] lg:flex-row lg:gap-[15px] lg:py-[0px] xl:px-6">
                          <div className="mb-[16px] max-w-[342px] lg:mb-0 lg:w-full lg:max-w-[80%] lg:flex-shrink-0">
                            <div className="flex flex-wrap justify-center lg:justify-center gap-2 w-full">
                              {metaDeck?.deck?.champions
                                // ?.slice(0, 8)
                                .map((champion, i) => (
                                  <div
                                    key={i}
                                    className="flex flex-col items-center gap-x-4 flex-grow basis-0 min-w-[65px] md:min-w-[80px] max-w-[78px] md:max-w-[150px]"
                                  >
                                    <p
                                      className="ellipsis text-center text-[12px] md:text-[16px] leading-[14px] text-[#fff] font-extralight w-full p-[2px] m-0"
                                      style={{
                                        textShadow:
                                          "rgb(0, 0, 0) -1px 0px 2px, rgb(0, 0, 0) 0px 1px 2px, rgb(0, 0, 0) 1px 0px 2px, rgb(0, 0, 0) 0px -1px 2px",
                                      }}
                                    >
                                      {
                                        champions?.find(
                                          (c) => c.key === champion?.key
                                        )?.name
                                      }
                                    </p>

                                    <div className="inline-flex items-center justify-center flex-col">
                                      <div className="flex flex-col w-full aspect-square rounded-[20px]">
                                        <div
                                          className="relative inline-flex rounded-[10px] border-2 [box-shadow:rgba(255,_0,_0,_0.8)_0px_7px_29px_0px]"
                                          data-tooltip-id={
                                            champions?.find(
                                              (c) => c.key === champion?.key
                                            )?.key
                                          }
                                        >
                                          <Image
                                            alt="Image"
                                            width={100}
                                            height={100}
                                            src={
                                              champions?.find(
                                                (c) => c.key === champion?.key
                                              )?.cardImage
                                            }
                                            className="h-full w-28 object-cover object-center rounded-[10px]"
                                          />
                                          <Image
                                            alt="Image"
                                            width={20}
                                            height={20}
                                            src={
                                              forces?.find(
                                                (f) =>
                                                  f.key ===
                                                  champions?.find(
                                                    (c) =>
                                                      c.key === champion?.key
                                                  )?.variant
                                              )?.imageUrl
                                            }
                                            className="absolute -top-[3px] -right-[3px] w-[16px] md:w-[24px]"
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

                                    <div className="inline-flex items-center justify-center w-full gap-1 flex-wrap">
                                      {champion?.items &&
                                        champion?.items.map((item, idx) => (
                                          <div
                                            key={idx}
                                            className="relative z-10 hover:z-20"
                                          >
                                            <ReactTltp
                                              variant="item"
                                              content={items?.find(
                                                (i) => i.key === item
                                              )}
                                              id={
                                                items?.find(
                                                  (i) => i.key === item
                                                )?.key
                                              }
                                            />
                                            <Image
                                              alt="Image"
                                              width={50}
                                              height={50}
                                              src={
                                                items?.find(
                                                  (i) => i.key === item
                                                )?.imageUrl
                                              }
                                              className="w-[20px] h-[20px] md:w-[30px] md:h-[30px] hover:scale-150 transition-all duration-300"
                                              data-tooltip-id={
                                                items?.find(
                                                  (i) => i.key === item
                                                )?.key
                                              }
                                            />
                                          </div>
                                        ))}
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                          <div className="mb-[12px] grid w-full grid-cols-3 md:grip-cols-4 gap-[12px] sm:w-auto md:mb-0 md:!flex md:items-center">
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
                                {metaDeck?.deck?.augments.map((augment, i) => (
                                  <div className="flex justify-center items-center relative">
                                    <Image
                                      alt="Image"
                                      width={80}
                                      height={80}
                                      src={
                                        augments?.find((a) => a.key === augment)
                                          .imageUrl
                                      }
                                      className=""
                                      data-tooltip-id={augment}
                                    />
                                    <ReactTltp
                                      variant="augment"
                                      content={augments?.find(
                                        (a) => a.key === augment
                                      )}
                                      id={augment}
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
                                    <div className="flex w-[4px] flex-col-reverse bg-[#2D2F37]">
                                      <div
                                        className="w-full"
                                        style={{
                                          backgroundColor: "rgb(17, 178, 136)",
                                          height: "100%",
                                        }}
                                      ></div>
                                    </div>
                                    <div className="flex w-[4px] flex-col-reverse bg-[#2D2F37]">
                                      <div
                                        className="w-full"
                                        style={{
                                          backgroundColor: "rgb(32, 122, 199)",
                                          height: "82.7%",
                                        }}
                                      ></div>
                                    </div>
                                    <div className="flex w-[4px] flex-col-reverse bg-[#2D2F37]">
                                      <div
                                        className="w-full"
                                        style={{
                                          backgroundColor: "rgb(32, 122, 199)",
                                          height: "62.3%",
                                        }}
                                      ></div>
                                    </div>
                                    <div className="flex w-[4px] flex-col-reverse bg-[#2D2F37]">
                                      <div
                                        className="w-full"
                                        style={{
                                          backgroundColor: "rgb(32, 122, 199)",
                                          height: "43.9%",
                                        }}
                                      ></div>
                                    </div>
                                    <div className="flex w-[4px] flex-col-reverse bg-[#2D2F37]">
                                      <div
                                        className="w-full"
                                        style={{
                                          backgroundColor: "rgb(160, 160, 160)",
                                          height: "34.8%",
                                        }}
                                      ></div>
                                    </div>
                                    <div className="flex w-[4px] flex-col-reverse bg-[#2D2F37]">
                                      <div
                                        className="w-full"
                                        style={{
                                          backgroundColor: "rgb(160, 160, 160)",
                                          height: "25.3%",
                                        }}
                                      ></div>
                                    </div>
                                    <div className="flex w-[4px] flex-col-reverse bg-[#2D2F37]">
                                      <div
                                        className="w-full"
                                        style={{
                                          backgroundColor: "rgb(160, 160, 160)",
                                          height: "17.4%",
                                        }}
                                      ></div>
                                    </div>
                                    <div className="flex w-[4px] flex-col-reverse bg-[#2D2F37]">
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
                            {/* <div
                              id="chart"
                              className="md:hidden md:-mt-[20px] bg-[#1d1d1d] md:-z-10"
                            >
                              <Chart
                                options={options}
                                series={series}
                                type="bar"
                                height={20}
                              />
                            </div> */}
                            <div className="flex w-full flex-col justify-between rounded-[4px] bg-[#1D1D1D] pt-[10px] pb-1">
                              <div
                                style={{
                                  width: "113px",
                                  height: "75px",
                                }}
                                className="md:hidden mx-auto"
                              >
                                <MyBarChartComponent height={80} width={100} />
                                <p className="text-center mb-0 text-[11px] md:text-[14px] font-medium leading-5 text-[#999]">
                                  Avg Ranking
                                </p>
                              </div>
                            </div>
                            <div className="hidden md:flex md:flex-col justify-center gap-[2px] lg:py-[8px]">
                              {metaDeck?.deck?.augments.map((augment, i) => (
                                <div className="flex justify-center items-center md:w-[64px] relative">
                                  <Image
                                    alt="Image"
                                    width={80}
                                    height={80}
                                    src={
                                      augments?.find((a) => a.key === augment)
                                        .imageUrl
                                    }
                                    className="w-[64px] md:w-[86px]"
                                    data-tooltip-id={augment}
                                  />
                                  <ReactTltp
                                    variant="augment"
                                    content={augments?.find(
                                      (a) => a.key === augment
                                    )}
                                    id={augment}
                                  />
                                </div>
                              ))}
                            </div>
                            {/* This is a navigation button which is hidden on Medium Screen */}
                            <div className="flex flex-col">
                              <div className="flex w-full flex-col h-full justify-between rounded-[4px] bg-[#1D1D1D] pt-[10px] pb-1 px-[16px] sm:px-[18px]">
                                <dl className="flex justify-between">
                                  <dt className="text-[11px] md:text-[14px] font-medium leading-5 text-[#999]">
                                    {others?.top4}
                                  </dt>
                                  <dd className="text-[11px] md:text-[14px] font-medium leading-5 text-white">
                                    <span>65.3%</span>
                                  </dd>
                                </dl>
                                <dl className="flex justify-between">
                                  <dt className="text-[11px] md:text-[14px] font-medium leading-5 text-[#999]">
                                    {others?.winPercentage}
                                  </dt>
                                  <dd className="text-[11px] md:text-[14px] font-medium leading-5 text-white">
                                    <span>26.6%</span>
                                  </dd>
                                </dl>
                                <dl className="flex justify-between">
                                  <dt className="text-[11px] md:text-[14px] font-medium leading-5 text-[#999]">
                                    {others?.pickPercentage}
                                  </dt>
                                  <dd className="text-[11px] md:text-[14px] font-medium leading-5 text-white">
                                    <span>0.39%</span>
                                  </dd>
                                </dl>
                                <dl className="flex justify-between">
                                  <dt className="text-[11px] md:text-[14px] font-medium leading-5 text-[#999]">
                                    {others?.avgPlacement}
                                  </dt>
                                  <dd className="text-[11px] md:text-[14px] font-medium leading-5 text-white">
                                    <span>4.52</span>
                                  </dd>
                                </dl>

                                <div
                                  style={{
                                    width: "150px",
                                    height: "80px",
                                    // margin: "10px",
                                  }}
                                  className="hidden md:block mt-2 mx-auto"
                                >
                                  <MyBarChartComponent height={70} width={80} />
                                  <p className="text-center mb-0 text-[11px] md:text-[14px] font-medium leading-5 text-[#999]">
                                    Avg Ranking
                                  </p>
                                </div>
                              </div>
                              <div className="hidden justify-center gap-[2px] lg:py-[8px]">
                                {Array(3)
                                  .fill()
                                  .map((_, i) => (
                                    <div className="flex justify-center items-center relative">
                                      <Image
                                        alt="Image"
                                        width={20}
                                        height={20}
                                        src={augment.src}
                                        className="w-[64px]"
                                      />
                                    </div>
                                  ))}
                              </div>
                              {/* <div
                                id="chart"
                                className="hidden md:block md:-mt-[20px] bg-[#1d1d1d] md:-z-10"
                              >
                                <Chart
                                  options={options}
                                  series={series}
                                  type="bar"
                                  height={20}
                                />
                              </div> */}
                            </div>
                            {/* This is a navigation button which is hidden for now */}
                            <div className="ml-[26px] hidden items-center justify-center">
                              <a
                                target="_blank"
                                className="hidden flex-shrink-0 cursor-pointer lg:inline-flex"
                                href="#"
                              >
                                <Image
                                  alt="Image"
                                  width={20}
                                  height={20}
                                  src={arrowRight.src}
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

export default ProjectItems;
