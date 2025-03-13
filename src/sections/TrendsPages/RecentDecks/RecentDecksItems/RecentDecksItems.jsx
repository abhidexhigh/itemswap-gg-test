import dynamic from "next/dynamic";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import "../../../../../i18n";
import React, { useState, useCallback, useMemo, memo } from "react";
import Image from "next/image";
import { Tooltip } from "react-tooltip";
import moment from "moment";
import TraitTooltip from "src/components/tooltip/TraitTooltip";
import "react-tooltip/dist/react-tooltip.css";
import GirlCrush from "@assets/image/traits/GirlCrush.svg";
import RecentDecksCard from "../RecentDecksCard/RecentDecksCard";
import augment from "@assets/image/augments/1.png";
import arrowRight from "@assets/image/icons/arrow-right.svg";
import { PiEye, PiEyeClosed } from "react-icons/pi";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import { IoMdCheckmarkCircle } from "react-icons/io";
import Comps from "../../../../data/compsNew.json";
import RecentDecksHistory from "../../../../data/newData/recentDecksHistory.json";
import MatchHistory from "../../../../data/user/matchHistory.json";
import ReactTltp from "src/components/tooltip/ReactTltp";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
const MyBarChartComponent = dynamic(() => import("./BarGraph"), { ssr: false });

const RecentDecksItems = () => {
  const { t } = useTranslation();
  const others = t("others");
  const [selectedChampion, setSelectedChampion] = useState(null);
  const [selectedTrait, setSelectedTrait] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isClosed, setIsClosed] = useState({});
  const [height, setHeight] = useState("auto");
  const [activeTab, setActiveTab] = useState("Champions");
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

  const {
    props: {
      pageProps: {
        dehydratedState: {
          queries: { data },
        },
      },
    },
  } = Comps;
  const { metaDecks } = RecentDecksHistory;
  const { champions } = data?.refs;
  const { items } = data?.refs;
  const { traits } = data?.refs;
  const { augments } = data?.refs;
  const { forces } = data?.refs;
  const [compsData, setCompsData] = useState(metaDecks);

  const shuffle = useCallback((array) => {
    if (!array || !array.length) return [];
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }, []);

  const { filteredChampions, groupedArray } = useMemo(() => {
    if (!champions || !champions.length) {
      return { filteredChampions: [], groupedArray: [] };
    }

    const championsByType = {};
    champions.forEach((champion) => {
      if (!championsByType[champion.type]) {
        championsByType[champion.type] = [];
      }
      championsByType[champion.type].push(champion);
    });

    const filtered = [];
    for (const type in championsByType) {
      const group = championsByType[type];
      const selected = shuffle([...group]).slice(0, 2);
      filtered.push(...selected);
    }

    const groupedByCost = filtered.reduce((acc, champion) => {
      const { cost } = champion;
      if (!acc[cost]) {
        acc[cost] = [];
      }
      acc[cost].push(champion);
      return acc;
    }, {});

    return {
      filteredChampions: filtered,
      groupedArray: Object.values(groupedByCost),
    };
  }, [champions, shuffle]);

  useMemo(() => {
    if (!groupedArray.length) return;

    groupedArray.forEach((subArray) => {
      subArray.forEach((champion) => {
        champion.selected = champion.key === selectedChampion;
      });
    });
  }, [groupedArray, selectedChampion]);

  const handleFilterChange = useCallback(
    (type, key) => {
      if (!metaDecks) return;

      if (type === "trait") {
        if (selectedTrait === key) {
          setSelectedTrait(null);
          setCompsData(metaDecks);
        } else {
          setSelectedTrait(key);
          const filteredTraits = metaDecks.filter((deck) =>
            deck.deck.traits.some((trait) => trait.key === key)
          );
          setCompsData(filteredTraits);
        }
        setSelectedChampion(null);
        setSelectedItem(null);
      } else if (type === "force") {
        if (selectedTrait === key) {
          setSelectedTrait(null);
          setCompsData(metaDecks);
        } else {
          setSelectedTrait(key);
          const filteredTraits = metaDecks.filter((deck) =>
            deck.deck.forces.some(
              (force) => force.key.toLowerCase() === key.toLowerCase()
            )
          );
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
    },
    [metaDecks, selectedChampion, selectedItem, selectedTrait]
  );

  const toggleHeight = useCallback(() => {
    setHeight((previous) => (previous === "auto" ? "200px" : "auto"));
  }, []);

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
  }, []);

  const handleIsClosed = useCallback((event) => {
    const buttonId = event.currentTarget.id;
    setIsClosed((prev) => ({ ...prev, [buttonId]: !prev[buttonId] }));
  }, []);

  const chartOptions = useMemo(
    () => ({
      chart: {
        type: "bar",
        height: 350,
        toolbar: { show: false },
        padding: { left: 0, right: 0, top: 0, bottom: 0 },
        margin: { left: 0, right: 0, top: 0, bottom: 0 },
      },
      grid: { show: false },
      plotOptions: {
        bar: {
          horizontal: false,
          barHeight: "100%",
          distributed: false,
        },
      },
      dataLabels: { enabled: false },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
      },
      xaxis: {
        labels: { show: false },
        axisTicks: { show: false },
        axisBorder: { show: false },
        floating: true,
      },
      yaxis: {
        labels: { show: false },
        axisTicks: { show: false },
        axisBorder: { show: false },
        floating: true,
      },
      tooltip: {
        custom: function ({ series, seriesIndex, dataPointIndex }) {
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
      fill: { opacity: 1 },
    }),
    []
  );

  const chartSeries = useMemo(
    () => [
      {
        name: "Avg Rank",
        data: [90, 80, 70, 60, 50, 40, 30, 20, 10],
      },
    ],
    []
  );

  return (
    <div className="mx-auto md:px-6 lg:px-8 py-6">
      <div className="space-y-6">
        <div className="flex justify-center md:justify-start">
          <div className="inline-flex rounded-lg overflow-hidden border border-[#ffffff20] bg-[#1a1b30]">
            <button
              type="button"
              className={`px-6 py-3 text-sm md:text-base font-medium transition-colors duration-200 ${
                activeTab === "Champions"
                  ? "bg-[#ffffff] text-[#1a1b30]"
                  : "text-white hover:bg-[#ffffff20]"
              }`}
              onClick={() => handleTabChange("Champions")}
            >
              {others?.champions || "Champions"}
            </button>
            <button
              type="button"
              className={`px-6 py-3 text-sm md:text-base font-medium transition-colors duration-200 ${
                activeTab === "Traits"
                  ? "bg-[#ffffff] text-[#1a1b30]"
                  : "text-white hover:bg-[#ffffff20]"
              }`}
              onClick={() => handleTabChange("Traits")}
            >
              {others?.traits || "Traits"}
            </button>
            <button
              type="button"
              className={`px-6 py-3 text-sm md:text-base font-medium transition-colors duration-200 ${
                activeTab === "Items"
                  ? "bg-[#ffffff] text-[#1a1b30]"
                  : "text-white hover:bg-[#ffffff20]"
              }`}
              onClick={() => handleTabChange("Items")}
            >
              {others?.items || "Items"}
            </button>
          </div>
        </div>

        <div className="bg-[#1a1b30] md:bg-transparent rounded-lg shadow-lg">
          <div className={`${activeTab === "Champions" ? "block" : "hidden"}`}>
            <RecentDecksCard
              itemCount={13}
              championsByCost={groupedArray}
              setSelectedChampion={(key) => handleFilterChange("champion", key)}
              forces={forces}
            />
          </div>

          <div
            className={`${activeTab === "Traits" ? "block" : "hidden"} p-3 md:p-6 bg-[#1a1b30] rounded-lg`}
          >
            <div className="space-y-6">
              <div className="flex flex-col lg:flex-row items-center gap-4">
                <div className="text-[#ffffff]">{others?.origin}</div>
                <div className="grid grid-cols-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 w-full">
                  {traits?.map((trait, i) => (
                    <div
                      key={i}
                      className="flex flex-col items-center gap-2 cursor-pointer group"
                      onClick={() => handleFilterChange("trait", trait?.key)}
                    >
                      <ReactTltp
                        variant="trait"
                        content={trait}
                        id={trait?.imageUrl}
                      />
                      <div className="relative aspect-square w-full max-w-[96px] transition-transform duration-200 group-hover:scale-105">
                        <Image
                          alt={trait?.name}
                          width={96}
                          height={96}
                          src={trait?.imageUrl}
                          className="w-full h-full object-cover rounded-lg"
                          data-tooltip-id={trait?.key}
                        />
                        {trait?.key === selectedTrait && (
                          <div className="absolute inset-0 bg-[#00000080] rounded-lg flex items-center justify-center">
                            <IoMdCheckmarkCircle className="text-[#86efac] text-4xl" />
                          </div>
                        )}
                      </div>
                      <span className="hidden lg:block text-sm md:text-base text-white bg-[#1b1a32] px-3 py-1 rounded-full truncate max-w-full">
                        {trait?.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col lg:flex-row items-center gap-4">
                <div className="text-[#ffffff]">{others?.forces}</div>
                <div className="grid grid-cols-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 w-full">
                  {forces?.map((force, i) => (
                    <div
                      key={i}
                      className="flex flex-col items-center gap-2 cursor-pointer group"
                      onClick={() => handleFilterChange("force", force?.key)}
                    >
                      <ReactTltp
                        variant="force"
                        content={force}
                        id={force?.imageUrl}
                      />
                      <div className="relative aspect-square w-full max-w-[96px] transition-transform duration-200 group-hover:scale-105">
                        <Image
                          alt={force?.name}
                          width={96}
                          height={96}
                          src={force?.imageUrl}
                          className="w-full h-full object-cover rounded-lg"
                          data-tooltip-id={force?.key}
                        />
                        {force?.key === selectedTrait && (
                          <div className="absolute inset-0 bg-[#00000080] rounded-lg flex items-center justify-center">
                            <IoMdCheckmarkCircle className="text-[#86efac] text-4xl" />
                          </div>
                        )}
                      </div>
                      <span className="hidden lg:block text-sm md:text-base text-[#cccccc] bg-[#1b1a32] px-3 py-1 rounded-full truncate max-w-full">
                        {force?.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div
            className={`${activeTab === "Items" ? "block" : "hidden"} p-3 md:p-6 bg-[#1a1b30] rounded-lg`}
          >
            <div className="grid grid-cols-5 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:!flex justify-center xl:!flex-wrap gap-2 lg:gap-4">
              {items
                ?.filter((item) => !item?.isFromItem)
                ?.map((item, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center gap-2 cursor-pointer group max-w-[84px]"
                    onClick={() => handleFilterChange("item", item?.key)}
                  >
                    <ReactTltp variant="item" content={item} id={item?.key} />
                    <div className="relative aspect-square w-full transition-transform duration-200 group-hover:scale-110">
                      <Image
                        alt={item?.name}
                        width={84}
                        height={84}
                        src={item?.imageUrl}
                        className="w-full h-full object-contain  rounded-lg !border !border-[#ffffff20]"
                        data-tooltip-id={item?.key}
                      />
                      {item?.key === selectedItem && (
                        <div className="absolute inset-0 bg-[#00000080] rounded-lg flex items-center justify-center">
                          <IoMdCheckmarkCircle className="text-[#86efac] text-3xl" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-[16px]">
          <div>
            {compsData?.map((metaDeck, i) => (
              <div
                key={`deck-${i}`}
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
                        <div
                          key={`force-${i}`}
                          className="flex justify-center items-center bg-[#000] rounded-full mx-1 pr-2 border-[1px] border-[#ffffff50]"
                        >
                          {forces && (
                            <Image
                              alt={force?.key || "Force"}
                              width={50}
                              height={50}
                              src={
                                forces?.find(
                                  (t) =>
                                    t.key.toLowerCase() ===
                                    force?.key.toLowerCase()
                                )?.imageUrl || ""
                              }
                              data-tooltip-id={force?.key}
                              className="w-[24px] h-[24px] md:w-[40px] md:h-[40px] mr-1"
                            />
                          )}
                          <ReactTltp content={force?.key} id={force?.key} />
                          <span className="text-[18px]">{force?.numUnits}</span>
                        </div>
                      ))}
                    </span>
                  </div>
                  <div className="inline-flex flex-shrink-0 gap-[22px] md:mt-0">
                    <div className="inline-flex flex-wrap">
                      {metaDeck?.deck?.traits?.map((trait, i) => {
                        const traitInfo = traits?.find(
                          (t) => t.key === trait?.key
                        );
                        const tierInfo = traitInfo?.tiers?.find(
                          (t) => t?.min >= trait?.numUnits
                        );

                        return tierInfo?.imageUrl ? (
                          <div
                            key={`trait-${i}`}
                            className="relative w-[30px] h-[30px] md:w-[56px] md:h-[56px]"
                          >
                            <Image
                              alt={traitInfo?.name || "Trait"}
                              width={50}
                              height={50}
                              src={tierInfo?.imageUrl}
                              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-cover object-center w-[30px] md:w-[56px]"
                              data-tooltip-id={traitInfo?.key}
                            />
                            <ReactTltp
                              variant="trait"
                              id={traitInfo?.key}
                              content={{
                                ...traitInfo,
                                numUnits: trait?.numUnits,
                              }}
                            />
                          </div>
                        ) : null;
                      })}
                    </div>
                    <div className="absolute right-[16px] top-[16px] inline-flex gap-[8px] lg:relative lg:right-[0px] lg:top-[0px]">
                      <button
                        className="inline-flex w-[16px] cursor-pointer items-center text-white"
                        title={isClosed[i] ? "Show" : "Hide"}
                        id={i}
                        onClick={handleIsClosed}
                      >
                        {!isClosed[i] ? <PiEye /> : <PiEyeClosed />}
                      </button>
                    </div>
                  </div>
                </header>

                {!isClosed[i] && (
                  <div className="flex flex-col bg-center bg-no-repeat mt-[-1px]">
                    <div className="flex min-h-[150px] flex-col justify-between items-center bg-[#27282E90] py-[16px] lg:flex-row lg:gap-[15px] lg:py-[0px] xl:px-6">
                      <div className="mb-[16px] max-w-[342px] lg:mb-0 lg:w-full lg:max-w-[80%] lg:flex-shrink-0">
                        <div className="flex flex-wrap justify-center lg:justify-center gap-2 w-full">
                          {metaDeck?.deck?.champions?.map((champion, i) => {
                            const championInfo = champions?.find(
                              (c) => c.key === champion?.key
                            );
                            return (
                              <div
                                key={`champion-${i}`}
                                className="flex flex-col items-center gap-x-4 flex-grow basis-0 min-w-[65px] md:min-w-[80px] max-w-[78px] md:max-w-[150px]"
                              >
                                <p
                                  className="ellipsis text-center text-[12px] md:text-[16px] leading-[14px] text-[#fff] font-extralight w-full p-[2px] m-0"
                                  style={{
                                    textShadow:
                                      "rgb(0, 0, 0) -1px 0px 2px, rgb(0, 0, 0) 0px 1px 2px, rgb(0, 0, 0) 1px 0px 2px, rgb(0, 0, 0) 0px -1px 2px",
                                  }}
                                >
                                  {championInfo?.name || ""}
                                </p>

                                <div className="inline-flex items-center justify-center flex-col">
                                  <div className="flex flex-col w-full aspect-square rounded-[20px]">
                                    <div
                                      className="relative inline-flex rounded-[10px] border-2 [box-shadow:rgba(255,_0,_0,_0.8)_0px_7px_29px_0px]"
                                      data-tooltip-id={championInfo?.key}
                                    >
                                      {championInfo?.cardImage && (
                                        <Image
                                          alt={championInfo?.name || "Champion"}
                                          width={100}
                                          height={100}
                                          src={championInfo?.cardImage}
                                          className="h-full w-28 object-cover object-center rounded-[10px]"
                                        />
                                      )}

                                      {championInfo?.variant && forces && (
                                        <Image
                                          alt={
                                            championInfo?.variant || "Variant"
                                          }
                                          width={20}
                                          height={20}
                                          src={
                                            forces?.find(
                                              (f) =>
                                                f.key === championInfo?.variant
                                            )?.imageUrl || ""
                                          }
                                          className="absolute -top-[3px] -right-[3px] w-[16px] md:w-[24px]"
                                        />
                                      )}
                                    </div>
                                    <ReactTltp
                                      variant="champion"
                                      id={championInfo?.key}
                                      content={championInfo}
                                    />
                                  </div>
                                </div>

                                <div className="inline-flex items-center justify-center w-full gap-1 flex-wrap">
                                  {champion?.items?.map((item, idx) => {
                                    const itemInfo = items?.find(
                                      (i) => i.key === item
                                    );
                                    return itemInfo ? (
                                      <div
                                        key={`item-${idx}`}
                                        className="relative z-10 hover:z-20"
                                      >
                                        <ReactTltp
                                          variant="item"
                                          content={itemInfo}
                                          id={itemInfo?.key}
                                        />
                                        <Image
                                          alt={itemInfo?.name || "Item"}
                                          width={50}
                                          height={50}
                                          src={itemInfo?.imageUrl || ""}
                                          className="w-[20px] h-[20px] md:w-[30px] md:h-[30px] hover:scale-150 transition-all duration-300"
                                          data-tooltip-id={itemInfo?.key}
                                        />
                                      </div>
                                    ) : null;
                                  })}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="mb-[12px] grid w-full grid-cols-3 md:grip-cols-4 gap-[12px] sm:w-auto md:mb-0 md:!flex md:items-center">
                        <div className="md:!hidden flex h-[98px] flex-col justify-between rounded-[4px] bg-[#1D1D1D] py-[12px] sm:w-[126px] sm:px-[6px] lg:w-[130px]">
                          <div className="flex justify-center gap-[2px]">
                            <span className="text-[12px] leading-none text-[#999]">
                              {others?.bestAugments || "Best Augments"}
                            </span>
                          </div>
                          <div className="flex justify-center gap-[2px] lg:py-[8px] lg:px-[6px]">
                            {metaDeck?.deck?.augments?.map((augment, i) => {
                              const augmentInfo = augments?.find(
                                (a) => a.key === augment
                              );
                              return augmentInfo ? (
                                <div
                                  key={`augment-${i}`}
                                  className="flex justify-center items-center relative"
                                >
                                  <Image
                                    alt={augmentInfo?.name || "Augment"}
                                    width={80}
                                    height={80}
                                    src={augmentInfo?.imageUrl || ""}
                                    className=""
                                    data-tooltip-id={augment}
                                  />
                                  <ReactTltp
                                    variant="augment"
                                    content={augmentInfo}
                                    id={augment}
                                  />
                                </div>
                              ) : null;
                            })}
                          </div>
                        </div>

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
                              {others?.avgRanking || "Avg Ranking"}
                            </p>
                          </div>
                        </div>

                        <div className="hidden md:flex md:flex-col justify-center gap-[2px] lg:py-[8px]">
                          {metaDeck?.deck?.augments?.map((augment, i) => {
                            const augmentInfo = augments?.find(
                              (a) => a.key === augment
                            );
                            return augmentInfo ? (
                              <div
                                key={`augment-desktop-${i}`}
                                className="flex justify-center items-center md:w-[64px] relative"
                              >
                                <Image
                                  alt={augmentInfo?.name || "Augment"}
                                  width={80}
                                  height={80}
                                  src={augmentInfo?.imageUrl || ""}
                                  className="w-[64px] md:w-[86px]"
                                  data-tooltip-id={`desktop-${augment}`}
                                />
                                <ReactTltp
                                  variant="augment"
                                  content={augmentInfo}
                                  id={`desktop-${augment}`}
                                />
                              </div>
                            ) : null;
                          })}
                        </div>

                        <div className="flex flex-col">
                          <div className="flex w-full flex-col h-full justify-between rounded-[4px] bg-[#1D1D1D] pt-[10px] pb-1 px-[16px] sm:px-[18px]">
                            <dl className="flex justify-between">
                              <dt className="text-[11px] md:text-[14px] font-medium leading-5 text-[#999]">
                                {others?.top4 || "Top 4"}
                              </dt>
                              <dd className="text-[11px] md:text-[14px] font-medium leading-5 text-white">
                                <span>
                                  {metaDeck?.stats?.top4Rate || "65.3%"}
                                </span>
                              </dd>
                            </dl>
                            <dl className="flex justify-between">
                              <dt className="text-[11px] md:text-[14px] font-medium leading-5 text-[#999]">
                                {others?.winPercentage || "Win %"}
                              </dt>
                              <dd className="text-[11px] md:text-[14px] font-medium leading-5 text-white">
                                <span>
                                  {metaDeck?.stats?.winRate || "26.6%"}
                                </span>
                              </dd>
                            </dl>
                            <dl className="flex justify-between">
                              <dt className="text-[11px] md:text-[14px] font-medium leading-5 text-[#999]">
                                {others?.pickPercentage || "Pick %"}
                              </dt>
                              <dd className="text-[11px] md:text-[14px] font-medium leading-5 text-white">
                                <span>
                                  {metaDeck?.stats?.pickRate || "0.39%"}
                                </span>
                              </dd>
                            </dl>
                            <dl className="flex justify-between">
                              <dt className="text-[11px] md:text-[14px] font-medium leading-5 text-[#999]">
                                {others?.avgPlacement || "Avg Placement"}
                              </dt>
                              <dd className="text-[11px] md:text-[14px] font-medium leading-5 text-white">
                                <span>
                                  {metaDeck?.stats?.avgPlacement || "4.52"}
                                </span>
                              </dd>
                            </dl>

                            <div
                              style={{
                                width: "150px",
                                height: "80px",
                              }}
                              className="hidden md:block mt-2 mx-auto"
                            >
                              <MyBarChartComponent height={70} width={80} />
                              <p className="text-center mb-0 text-[11px] md:text-[14px] font-medium leading-5 text-[#999]">
                                {others?.avgRanking || "Avg Ranking"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
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
  );
};

export default memo(RecentDecksItems);
