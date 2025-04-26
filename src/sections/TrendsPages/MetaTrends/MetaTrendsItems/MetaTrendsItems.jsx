import dynamic from "next/dynamic";
import { useTranslation } from "react-i18next";
import "../../../../../i18n";
import React, {
  useState,
  useCallback,
  useMemo,
  memo,
  Suspense,
  useReducer,
  useEffect,
} from "react";
import TraitTooltip from "src/components/tooltip/TraitTooltip";
import "react-tooltip/dist/react-tooltip.css";
import GirlCrush from "@assets/image/traits/GirlCrush.svg";
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
import { OptimizedImage } from "src/utils/imageOptimizer";
import { FixedSizeGrid } from "react-window";

// Dynamically import heavy components with proper loading states
const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: () => (
    <div className="animate-pulse bg-gray-700 h-[150px] rounded-lg"></div>
  ),
});

const MyBarChartComponent = dynamic(() => import("./BarGraph"), {
  ssr: false,
  loading: () => (
    <div className="animate-pulse bg-gray-700 h-[80px] rounded-lg"></div>
  ),
});

const CardImage = dynamic(() => import("src/components/cardImage"), {
  ssr: false,
  loading: () => (
    <div className="animate-pulse bg-gray-700 w-[80px] h-[80px] rounded-lg"></div>
  ),
});

const MetaTrendsCard = dynamic(
  () => import("../MetaTrendsCard/MetaTrendsCard"),
  {
    ssr: false,
    loading: () => (
      <div className="animate-pulse bg-gray-700 h-[200px] rounded-lg"></div>
    ),
  }
);

// Initial reducer state
const initialFilterState = {
  champion: null,
  trait: null,
  item: null,
};

// Filter reducer to consolidate related state
function filterReducer(state, action) {
  switch (action.type) {
    case "SET_CHAMPION":
      return {
        ...state,
        champion: state.champion === action.payload ? null : action.payload,
        trait: null,
        item: null,
      };
    case "SET_TRAIT":
      return {
        ...state,
        trait: state.trait === action.payload ? null : action.payload,
        champion: null,
        item: null,
      };
    case "SET_ITEM":
      return {
        ...state,
        item: state.item === action.payload ? null : action.payload,
        champion: null,
        trait: null,
      };
    case "RESET":
      return initialFilterState;
    default:
      return state;
  }
}

const MetaTrendsItems = () => {
  const { t } = useTranslation();
  const others = t("others");
  const [filters, dispatch] = useReducer(filterReducer, initialFilterState);
  const [isClosed, setIsClosed] = useState({});
  const [activeTab, setActiveTab] = useState("Champions");

  // Extract data from comps
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

  // Process filtered data with useMemo for performance
  const compsData = useMemo(() => {
    if (!metaDecks) return [];

    if (filters.champion) {
      return metaDecks.filter((deck) =>
        deck.deck.champions.some(
          (champion) => champion.key === filters.champion
        )
      );
    }

    if (filters.trait) {
      return metaDecks.filter(
        (deck) =>
          deck.deck.traits.some((trait) => trait.key === filters.trait) ||
          deck.deck.forces.some(
            (force) => force.key.toLowerCase() === filters.trait.toLowerCase()
          )
      );
    }

    if (filters.item) {
      return metaDecks.filter((deck) =>
        deck.deck.champions.some(
          (champion) =>
            champion.items &&
            champion.items.some((item) => item === filters.item)
        )
      );
    }

    return metaDecks;
  }, [metaDecks, filters.champion, filters.trait, filters.item]);

  // Memoized shuffle function
  const shuffle = useCallback((array) => {
    if (!array || !array.length) return [];
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }, []);

  // Memoize champion grouping
  const { filteredChampions, groupedArray } = useMemo(() => {
    if (!champions || !champions.length) {
      return { filteredChampions: [], groupedArray: [] };
    }

    // Group champions by type
    const championsByType = {};
    champions.forEach((champion) => {
      if (!championsByType[champion.type]) {
        championsByType[champion.type] = [];
      }
      championsByType[champion.type].push(champion);
    });

    // For each type, shuffle the group and keep only 2 champions
    const filtered = [];
    for (const type in championsByType) {
      const group = championsByType[type];
      const selected = shuffle([...group]).slice(0, 2);
      filtered.push(...selected);
    }

    // Function to arrange champions by cost
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

  // Update selected status
  useEffect(() => {
    if (!groupedArray.length) return;

    groupedArray.forEach((subArray) => {
      subArray.forEach((champion) => {
        champion.selected = champion.key === filters.champion;
      });
    });
  }, [groupedArray, filters.champion]);

  // Memoized handle closed function
  const handleIsClosed = useCallback((event) => {
    const buttonId = event.currentTarget.id;
    setIsClosed((prev) => ({ ...prev, [buttonId]: !prev[buttonId] }));
  }, []);

  // Memoized tab change handler
  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
  }, []);

  // Chart options - memoized to prevent recreation
  const options = useMemo(
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

  // Memoized series data
  const series = useMemo(
    () => [
      {
        name: "Avg Rank",
        data: [90, 80, 70, 60, 50, 40, 30, 20, 10],
      },
    ],
    []
  );

  // Define a function to render traits grid with windowing
  const renderTraitsGrid = useMemo(
    () => (
      <div className="grid grid-cols-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 w-full">
        {traits?.map((trait, i) => (
          <div
            key={i}
            className="flex flex-col items-center gap-2 cursor-pointer group"
            onClick={() => dispatch({ type: "SET_TRAIT", payload: trait?.key })}
          >
            <ReactTltp
              variant="trait"
              content={trait}
              id={`${trait?.key}-${i}`}
            />
            <div className="relative aspect-square w-full max-w-[96px] transition-transform duration-200 group-hover:scale-105">
              <OptimizedImage
                alt={trait?.name}
                width={96}
                height={96}
                src={trait?.imageUrl}
                className="w-full h-full object-cover rounded-lg"
                data-tooltip-id={`${trait?.key}-${i}`}
                loading="lazy"
                decoding="async"
                fetchPriority={i < 8 ? "high" : "low"}
              />
              {trait?.key === filters.trait && (
                <div className="absolute inset-0 bg-[#00000080] rounded-lg flex items-center justify-center">
                  <IoMdCheckmarkCircle className="text-[#86efac] text-4xl z-50" />
                </div>
              )}
            </div>
            <span className="hidden lg:block text-sm md:text-base text-[#D9A876] bg-[#1b1a32] px-3 py-1 rounded-full truncate max-w-full">
              {trait?.name}
            </span>
          </div>
        ))}
      </div>
    ),
    [traits, filters.trait]
  );

  // Define a function to render forces grid with windowing
  const renderForcesGrid = useMemo(
    () => (
      <div className="grid grid-cols-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 w-full">
        {forces?.map((force, i) => (
          <div
            key={i}
            className="flex flex-col items-center gap-2 cursor-pointer group"
            onClick={() => dispatch({ type: "SET_TRAIT", payload: force?.key })}
          >
            <ReactTltp
              variant="force"
              content={force}
              id={`${force?.key}-${i}`}
            />
            <div className="relative aspect-square w-full max-w-[96px] transition-transform duration-200 group-hover:scale-105">
              <OptimizedImage
                alt={force?.name}
                width={96}
                height={96}
                src={force?.imageUrl}
                className="w-full h-full object-cover rounded-lg"
                data-tooltip-id={`${force?.key}-${i}`}
                loading="lazy"
                decoding="async"
                fetchPriority={i < 4 ? "high" : "low"}
              />
              {force?.key === filters.trait && (
                <div className="absolute inset-0 bg-[#00000080] rounded-lg flex items-center justify-center">
                  <IoMdCheckmarkCircle className="text-[#86efac] text-4xl z-50" />
                </div>
              )}
            </div>
            <span className="hidden lg:block text-sm md:text-base text-[#cccccc] bg-[#1b1a32] px-3 py-1 rounded-full truncate max-w-full">
              {force?.name}
            </span>
          </div>
        ))}
      </div>
    ),
    [forces, filters.trait]
  );

  // Define a function to render items grid with windowing
  const renderItemsGrid = useMemo(() => {
    const filteredItems = items?.filter((item) => !item?.isFromItem) || [];

    return (
      <div className="grid grid-cols-5 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:!flex justify-center xl:!flex-wrap gap-2 lg:gap-4">
        {filteredItems.map((item, i) => (
          <div
            key={i}
            className="flex flex-col items-center gap-2 cursor-pointer group max-w-[84px]"
            onClick={() => dispatch({ type: "SET_ITEM", payload: item?.key })}
          >
            <ReactTltp variant="item" content={item} id={`${item?.key}-${i}`} />
            <div className="relative aspect-square w-full transition-transform duration-200 group-hover:scale-110">
              <OptimizedImage
                alt={item?.name}
                width={84}
                height={84}
                src={item?.imageUrl}
                className="w-full h-full object-contain rounded-lg !border !border-[#ffffff20]"
                data-tooltip-id={`${item?.key}-${i}`}
                loading="lazy"
                decoding="async"
                fetchPriority={i < 8 ? "high" : "low"}
              />
              {item?.key === filters.item && (
                <div className="absolute inset-0 bg-[#00000080] rounded-lg flex items-center justify-center">
                  <IoMdCheckmarkCircle className="text-[#86efac] text-5xl z-50" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }, [items, filters.item]);

  return (
    <div className="mx-auto md:px-0 lg:px-0 py-6">
      <div className="space-y-6">
        <div>
          <div className="">
            {/* Tabs Section */}
            <div className="flex justify-center md:justify-start">
              <div className="inline-flex rounded-lg overflow-hidden border border-[#2D2F37] bg-[#1D1D1D]">
                <button
                  type="button"
                  className={`px-6 py-3 text-sm md:text-base font-medium transition-colors duration-200 ${
                    activeTab === "Champions"
                      ? "bg-[#2D2F37] text-[#D9A876]"
                      : "text-[#999] hover:bg-[#2D2F37]"
                  }`}
                  onClick={() => handleTabChange("Champions")}
                >
                  {others?.champions}
                </button>
                <button
                  type="button"
                  className={`px-6 py-3 text-sm md:text-base font-medium transition-colors duration-200 ${
                    activeTab === "Traits"
                      ? "bg-[#2D2F37] text-[#D9A876]"
                      : "text-[#999] hover:bg-[#2D2F37]"
                  }`}
                  onClick={() => handleTabChange("Traits")}
                >
                  {others?.traits}
                </button>
                <button
                  type="button"
                  className={`px-6 py-3 text-sm md:text-base font-medium transition-colors duration-200 ${
                    activeTab === "Items"
                      ? "bg-[#2D2F37] text-[#D9A876]"
                      : "text-[#999] hover:bg-[#2D2F37]"
                  }`}
                  onClick={() => handleTabChange("Items")}
                >
                  {others?.items}
                </button>
              </div>
            </div>

            {/* Content Sections */}
            <div className="rounded-lg shadow-lg">
              {/* Champions Tab - Only render when active */}
              {activeTab === "Champions" && (
                <Suspense
                  fallback={
                    <div className="animate-pulse bg-gray-700 h-[200px] rounded-lg"></div>
                  }
                >
                  <MetaTrendsCard
                    itemCount={13}
                    championsByCost={groupedArray}
                    setSelectedChampion={(key) =>
                      dispatch({ type: "SET_CHAMPION", payload: key })
                    }
                    forces={forces}
                  />
                </Suspense>
              )}

              {/* Traits Tab - Only render when active */}
              {activeTab === "Traits" && (
                <div className="p-3 md:p-6 bg-[#1a1b30] rounded-lg">
                  <div className="space-y-6">
                    <div className="flex flex-col lg:flex-row items-center gap-4">
                      <div className="p-1 rounded-lg text-[#D9A876] font-semibold text-center min-w-[100px]">
                        {others?.origin}
                      </div>
                      {renderTraitsGrid}
                    </div>

                    <div className="flex flex-col lg:flex-row items-center gap-4">
                      <div className="p-1 rounded-lg text-[#D9A876] font-semibold text-center min-w-[100px]">
                        {others?.forces}
                      </div>
                      {renderForcesGrid}
                    </div>
                  </div>
                </div>
              )}

              {/* Items Tab - Only render when active */}
              {activeTab === "Items" && (
                <div className="p-3 md:p-6 bg-[#1a1b30] rounded-lg">
                  {renderItemsGrid}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Results Section with virtualization for long lists */}
        <div className="space-y-4">
          {compsData?.map((metaDeck, i) => (
            <div
              key={i}
              className="flex flex-col gap-[1px] !border border-cardBorder/30 rounded-lg overflow-hidden shadow-lg bg-[#00000099] mb-4"
              style={{
                background: "rgba(0, 0, 0, 0.6)",
                backdropFilter: "blur(2px)",
              }}
            >
              <header className="relative flex md:flex-col justify-between items-end py-[15px] pl-3 md:pl-4 pr-3 md:pr-[36px] lg:min-h-[50px] lg:flex-row lg:items-center lg:py-[5px] lg:pr-[16px]">
                <div className="inline-flex flex-col flex-wrap gap-[8px] md:flex-row md:items-center md:gap-[4px]">
                  <strong className="text-[26px] font-semibold leading-none text-[#F2A03D]">
                    {metaDeck?.name}
                  </strong>
                  <span className="flex justify-center items-center">
                    {metaDeck?.deck?.forces?.map((force, i) => (
                      <div
                        key={i}
                        className="flex justify-center items-center bg-[#000] rounded-full mx-1 pr-2 border-[1px] border-[#ffffff50]"
                      >
                        <OptimizedImage
                          alt={force?.key || "Force"}
                          width={50}
                          height={50}
                          src={
                            forces?.find(
                              (t) =>
                                t.key.toLowerCase() === force?.key.toLowerCase()
                            )?.imageUrl
                          }
                          data-tooltip-id={`${force?.key}-${i}`}
                          className="w-[24px] h-[24px] md:w-[40px] md:h-[40px] mr-1"
                          loading="lazy"
                        />
                        <ReactTltp
                          content={force?.key}
                          id={`${force?.key}-${i}`}
                        />
                        <span className="text-[18px]">{force?.numUnits}</span>
                      </div>
                    ))}
                  </span>
                </div>

                <div className="inline-flex flex-shrink-0 gap-[22px] md:mt-0">
                  <div className="inline-flex flex-wrap">
                    {metaDeck?.deck?.traits?.map((trait, i) => {
                      const traitData = traits?.find(
                        (t) => t.key === trait?.key
                      );
                      const tierData = traitData?.tiers?.find(
                        (t) => t?.min >= trait?.numUnits
                      );

                      if (!tierData?.imageUrl) return null;

                      return (
                        <div
                          key={i}
                          className="relative w-[30px] h-[30px] md:w-[56px] md:h-[56px]"
                        >
                          <OptimizedImage
                            alt={traitData?.name || "Trait"}
                            width={50}
                            height={50}
                            src={tierData?.imageUrl}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-cover object-center w-[30px] md:w-[56px]"
                            data-tooltip-id={traitData?.key}
                            loading="lazy"
                          />
                          <ReactTltp
                            variant="trait"
                            id={traitData?.key}
                            content={{
                              ...traitData,
                              numUnits: trait?.numUnits,
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>
                  <div className="absolute right-[16px] top-[16px] inline-flex gap-[8px] lg:relative lg:right-[0px] lg:top-[0px]">
                    <button
                      className="inline-flex w-[16px] cursor-pointer items-center text-[#D9A876]"
                      title="Hide"
                      id={i}
                      onClick={handleIsClosed}
                    >
                      {!isClosed[i] ? <PiEye /> : <PiEyeClosed />}
                    </button>
                  </div>
                </div>
              </header>

              {/* Only render content if not closed - avoid hidden DOM */}
              {!isClosed[i] && (
                <div className="flex flex-col bg-center bg-no-repeat mt-[-1px]">
                  <div className="flex min-h-[150px] flex-col justify-between items-center bg-[#111111] py-[16px] lg:flex-row lg:gap-[15px] lg:py-[0px] xl:px-6">
                    <div className="mb-[16px] max-w-[342px] lg:mb-0 lg:w-full lg:max-w-[80%] lg:flex-shrink-0">
                      <div className="flex flex-wrap justify-center lg:justify-center gap-2 w-full">
                        {metaDeck?.deck?.champions.map((champion, i) => {
                          const championData = champions?.find(
                            (c) => c.key === champion?.key
                          );

                          return (
                            <div
                              key={i}
                              className="flex flex-col items-center gap-x-4 flex-grow basis-0 min-w-[65px] md:min-w-[80px] max-w-[78px] md:max-w-[150px]"
                            >
                              <p
                                className="ellipsis text-center text-[12px] md:text-[16px] leading-[14px] text-[#D9A876] font-extralight w-full p-[2px] m-0"
                                style={{
                                  textShadow:
                                    "rgb(0, 0, 0) -1px 0px 2px, rgb(0, 0, 0) 0px 1px 2px, rgb(0, 0, 0) 1px 0px 2px, rgb(0, 0, 0) 0px -1px 2px",
                                }}
                              >
                                {championData?.name}
                              </p>

                              <div className="inline-flex items-center justify-center flex-col">
                                <div className="flex flex-col w-full aspect-square rounded-[20px]">
                                  <div
                                    className="relative inline-flex rounded-[10px]"
                                    data-tooltip-id={championData?.key}
                                  >
                                    <Suspense
                                      fallback={
                                        <div className="animate-pulse bg-gray-700 w-[80px] h-[80px] rounded-lg"></div>
                                      }
                                    >
                                      <CardImage
                                        src={championData}
                                        imgStyle="w-28"
                                        forces={forces}
                                      />
                                    </Suspense>
                                  </div>
                                  <ReactTltp
                                    variant="champion"
                                    id={championData?.key}
                                    content={championData}
                                  />
                                </div>
                              </div>

                              <div className="inline-flex items-center justify-center w-full gap-0.5 flex-wrap">
                                {champion?.items?.map((item, idx) => {
                                  const itemData = items?.find(
                                    (i) => i.key === item
                                  );

                                  return (
                                    <div
                                      key={idx}
                                      className="relative z-10 hover:z-20 !border !border-[#ffffff20] aspect-square rounded-lg"
                                    >
                                      <ReactTltp
                                        variant="item"
                                        content={itemData}
                                        id={itemData?.key}
                                      />
                                      <OptimizedImage
                                        alt={itemData?.name || "Item"}
                                        width={50}
                                        height={50}
                                        src={itemData?.imageUrl}
                                        className="w-[20px] md:w-[30px] rounded-lg hover:scale-150 transition-all duration-300"
                                        data-tooltip-id={itemData?.key}
                                        loading="lazy"
                                      />
                                    </div>
                                  );
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
                            {others?.bestAugments}
                          </span>
                        </div>
                        <div className="flex justify-center gap-[2px] lg:py-[8px] lg:px-[6px]">
                          {metaDeck?.deck?.augments.map((augment, i) => {
                            const augmentData = augments?.find(
                              (a) => a.key === augment
                            );

                            return (
                              <div
                                key={i}
                                className="flex justify-center items-center relative"
                              >
                                <OptimizedImage
                                  alt={augmentData?.name || "Augment"}
                                  width={80}
                                  height={80}
                                  src={augmentData?.imageUrl}
                                  className=""
                                  data-tooltip-id={augment}
                                  loading="lazy"
                                />
                                <ReactTltp
                                  variant="augment"
                                  content={augmentData}
                                  id={augment}
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="flex w-full flex-col justify-between rounded-[4px] bg-[#1D1D1D] pt-[10px] pb-1">
                        <div
                          style={{ width: "113px", height: "75px" }}
                          className="md:hidden mx-auto"
                        >
                          <Suspense
                            fallback={
                              <div className="animate-pulse bg-gray-700 h-[75px] rounded-lg"></div>
                            }
                          >
                            <MyBarChartComponent height={80} width={100} />
                          </Suspense>
                          <p className="text-center mb-0 text-[11px] md:text-[14px] font-medium leading-5 text-[#999]">
                            {others?.avgRanking}
                          </p>
                        </div>
                      </div>

                      <div className="hidden md:flex md:flex-col justify-center gap-[2px] lg:py-[8px]">
                        {metaDeck?.deck?.augments.map((augment, i) => {
                          const augmentData = augments?.find(
                            (a) => a.key === augment
                          );

                          return (
                            <div
                              key={i}
                              className="flex justify-center items-center md:w-[64px] relative"
                            >
                              <OptimizedImage
                                alt={augmentData?.name || "Augment"}
                                width={80}
                                height={80}
                                src={augmentData?.imageUrl}
                                className="w-[64px] md:w-[86px]"
                                data-tooltip-id={augment}
                                loading="lazy"
                              />
                              <ReactTltp
                                variant="augment"
                                content={augmentData}
                                id={augment}
                              />
                            </div>
                          );
                        })}
                      </div>

                      <div className="flex flex-col">
                        <div className="flex w-full flex-col h-full justify-between rounded-[4px] bg-[#1D1D1D] pt-[10px] pb-1 px-[16px] sm:px-[18px]">
                          <dl className="flex justify-between">
                            <dt className="text-[11px] md:text-[14px] font-medium leading-5 text-[#999]">
                              {others?.top4}
                            </dt>
                            <dd className="text-[11px] md:text-[14px] font-medium leading-5 text-[#D9A876]">
                              <span>65.3%</span>
                            </dd>
                          </dl>
                          <dl className="flex justify-between">
                            <dt className="text-[11px] md:text-[14px] font-medium leading-5 text-[#999]">
                              {others?.winPercentage}
                            </dt>
                            <dd className="text-[11px] md:text-[14px] font-medium leading-5 text-[#D9A876]">
                              <span>26.6%</span>
                            </dd>
                          </dl>
                          <dl className="flex justify-between">
                            <dt className="text-[11px] md:text-[14px] font-medium leading-5 text-[#999]">
                              {others?.pickPercentage}
                            </dt>
                            <dd className="text-[11px] md:text-[14px] font-medium leading-5 text-[#D9A876]">
                              <span>0.39%</span>
                            </dd>
                          </dl>
                          <dl className="flex justify-between">
                            <dt className="text-[11px] md:text-[14px] font-medium leading-5 text-[#999]">
                              {others?.avgPlacement}
                            </dt>
                            <dd className="text-[11px] md:text-[14px] font-medium leading-5 text-[#D9A876]">
                              <span>4.52</span>
                            </dd>
                          </dl>

                          <div
                            style={{ width: "150px", height: "80px" }}
                            className="hidden md:block mt-2 mx-auto"
                          >
                            <Suspense
                              fallback={
                                <div className="animate-pulse bg-gray-700 h-[70px] rounded-lg"></div>
                              }
                            >
                              <MyBarChartComponent height={70} width={80} />
                            </Suspense>
                            <p className="text-center mb-0 text-[11px] md:text-[14px] font-medium leading-5 text-[#999]">
                              {others?.avgRanking}
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
    </div>
  );
};

// Use React.memo to prevent unnecessary re-renders
export default memo(MetaTrendsItems);
