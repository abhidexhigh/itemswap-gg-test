import React, {
  memo,
  useMemo,
  useCallback,
  useState,
  useEffect,
  useRef,
} from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import MetaTrendsItem from "../MetaTrendsItem/MetaTrendsItem";
import { OptimizedImage } from "src/utils/imageOptimizer";
import CharacterCard from "src/components/card/CharacterCard";
import DarkSuccubusCard from "src/components/card/DarkCharacterCard";
import GlitchEffectCard from "src/components/card/GlitchEffectCard";
import IceFrameCard from "src/components/card/IceFrameCard";
import FireEdgeCard from "src/components/card/FireEdgeCard";
import NeonGlowCard from "src/components/card/NeonGlowCard";
import LightVariantCard from "src/components/card/LightVariantCard";
import DarkVariantCard from "src/components/card/DarkVariantCard";
import FireVariantCard from "src/components/card/FireVariantCard";
import StormVariantCard from "src/components/card/StormVariantCard";
import WaterVariantCard from "src/components/card/WaterVariantCard";
import StormVariantCard2 from "src/components/card/StormVariantCard2";
import LightVariantCard2 from "src/components/card/LightVariantCard2";
import DarkVariantCard2 from "src/components/card/DarkVariantCard2";
import WaterVariantCard2 from "src/components/card/WaterVariantCard2";
import FireVariantCard2 from "src/components/card/FireVariantCard2";
import NatureVariantCard2 from "src/components/card/NatureVariantCard2";
import WaterVariantCenterFocus from "src/components/card/WaterVariantCenterFocus";
import WaterVariantWhirlpool from "src/components/card/WaterVariantWhirlpool";
import WaterVariantGlacier from "src/components/card/WaterVariantGlacier";
import FireVariantVolcanic from "src/components/card/FireVariantVolcanic";
import LightVariantPrism from "src/components/card/LightVariantPrism";
import DarkVariantChaos from "src/components/card/DarkVariantChaos";
import NatureVariantJungle from "src/components/card/NatureVariantJungle";
import WaterVariantAbyssal from "src/components/card/WaterVariantAbyssal";
import StormVariantTornado from "src/components/card/StormVariantTornado";
import EarthVariantMountain from "src/components/card/EarthVariantMountain";
import FireVariantFlame from "src/components/card/FireVariantFlame";
import AirVariantBreeze from "src/components/card/AirVariantBreeze";
import EarthVariantCrystal from "src/components/card/EarthVariantCrystal";
import LightBeamCard from "src/components/card/LightBeamCard";
import AmbientGlowCard from "src/components/card/AmbientGlowCard";
import ShimmeryTrailCard from "src/components/card/ShimmeryTrailCard";
import AuroraCard from "src/components/card/AuroraCard";
import DustParticleCard from "src/components/card/DustParticleCard";
import MistyFlowCard from "src/components/card/MistyFlowCard";
import StarfieldCard from "src/components/card/StarfieldCard";
import NewCard from "src/components/card/NewCard";

// Memoize the getRandomCharacters function to avoid unnecessary recalculations
const getRandomCharacters = (characters, count = 12) => {
  if (!characters || characters.length === 0) return [];

  // Shuffle the array using Fisher-Yates algorithm
  const shuffled = [...characters].sort(() => Math.random() - 0.5);

  // Return the first 'count' elements
  return shuffled.slice(0, count);
};

// Memoize the coin icons array
const coinIcons = [
  "https://res.cloudinary.com/dg0cmj6su/image/upload/v1742550115/01_uwt4jg.png",
  "https://res.cloudinary.com/dg0cmj6su/image/upload/v1742550115/02_wnemuc.png",
  "https://res.cloudinary.com/dg0cmj6su/image/upload/v1742550114/03_pfqvqc.png",
  "https://res.cloudinary.com/dg0cmj6su/image/upload/v1742550114/04_m1yxes.png",
  "https://res.cloudinary.com/dg0cmj6su/image/upload/v1742550114/05_zqb2ji.png",
];

// Video data for cards
const cardVideos = [
  {
    cardImage:
      "https://res.cloudinary.com/dg0cmj6su/video/upload/v1744868503/1933cac0-8062-4696-b41a-134bca40bf98-video_rmayyd.mp4",
    cost: 3,
    variant: "Dark",
  },
  {
    cardImage:
      "https://res.cloudinary.com/dg0cmj6su/video/upload/v1744868501/13b835f5-d24a-4402-a34d-b50601a7c631-video_knnfr4.mp4",
    cost: 3,
    variant: "Light",
  },
  {
    cardImage:
      "https://res.cloudinary.com/dg0cmj6su/video/upload/v1744868500/2d50e1d5-8615-4744-91a0-7945b1e34d09-video_o5nvkl.mp4",
    cost: 3,
    variant: "Light",
  },
  {
    cardImage:
      "https://res.cloudinary.com/dg0cmj6su/video/upload/v1744868499/22eafd38-1097-4ff4-8402-d9f3354a9788-video_1_mvu75e.mp4",
    cost: 3,
    variant: "Fire",
  },
  {
    cardImage:
      "https://res.cloudinary.com/dg0cmj6su/video/upload/v1744868498/439a71ec-c196-4808-aaeb-6ad03134b0ff-video_ejdrvh.mp4",
    cost: 3,
    variant: "Dark",
  },
  {
    cardImage:
      "https://res.cloudinary.com/dg0cmj6su/video/upload/v1744868496/4ea41363-2129-496c-a0c3-1ccb41bec28b-video_bmudfc.mp4",
    cost: 3,
    variant: "Dark",
  },
  {
    cardImage:
      "https://res.cloudinary.com/dg0cmj6su/video/upload/v1744868495/69699059-1e5c-4186-a60a-e12fb430c65f-video_inlinx.mp4",
    cost: 3,
    variant: "Water",
  },
  {
    cardImage:
      "https://res.cloudinary.com/dg0cmj6su/video/upload/v1744868495/71dbd655-8a70-48e0-8fd3-91ad4cc0c8e6-video_h3ufhj.mp4",
    cost: 3,
    variant: "Storm",
  },
  {
    cardImage:
      "https://res.cloudinary.com/dg0cmj6su/video/upload/v1744868495/92399a4e-cba1-44f4-88ec-8e30042c9cff-video_1_srinly.mp4",
    cost: 3,
    variant: "Fire",
  },
  {
    cardImage:
      "https://res.cloudinary.com/dg0cmj6su/video/upload/v1744868494/a3f2338b-7f00-4305-95fd-74e21472bb45-video_ivx5bs.mp4",
    cost: 3,
    variant: "Dark",
  },
  {
    cardImage:
      "https://res.cloudinary.com/dg0cmj6su/video/upload/v1744868493/baed9284-49df-4b12-8b41-84d2b04732d9-video_wdk76c.mp4",
    cost: 3,
    variant: "Storm",
  },
  {
    cardImage:
      "https://res.cloudinary.com/dg0cmj6su/video/upload/v1744868494/9c22f9ac-e4d8-46e2-8c5d-a9706bd4f88c-video_g39dxn.mp4",
    cost: 3,
    variant: "Storm",
  },
  {
    cardImage:
      "https://res.cloudinary.com/dg0cmj6su/video/upload/v1744868493/e2566afc-c3ea-44a6-994c-5f2f3c73f41d-video_nrnl6b.mp4",
    cost: 3,
    variant: "Fire",
  },
  {
    cardImage:
      "https://res.cloudinary.com/dg0cmj6su/video/upload/v1744868492/input_f3pien.mp4",
    cost: 3,
    variant: "Water",
  },
];

// Memoize the arrow animation variants
const arrowAnimation = {
  animate: {
    x: [0, 8, 0],
    opacity: [1, 0.5, 1],
  },
  transition: {
    duration: 1.5,
    repeat: Infinity,
    ease: "easeInOut",
  },
  initial: false,
  whileInView: {
    x: [0, 8, 0],
    opacity: [1, 0.5, 1],
  },
  viewport: { once: true },
};

// Extracted arrow icon component to reduce rerenders
const ArrowIcon = memo(() => (
  <motion.div {...arrowAnimation}>
    <OptimizedImage
      src="https://res.cloudinary.com/dg0cmj6su/image/upload/v1742540890/Arrow_ieu0xg.png"
      alt="Arrow icon"
      width={48}
      height={48}
      className="w-3"
      priority={true}
    />
  </motion.div>
));

// Extracted CoinIcon component to improve performance
const CoinIcon = memo(({ index, priority = false }) => {
  if (index >= coinIcons.length) return null;

  return (
    <div className="flex items-center gap-1">
      <div className="relative">
        <OptimizedImage
          src={coinIcons[index]}
          className="w-8 md:w-10 2xl:w-12"
          alt={`Cost ${index + 1} Icon`}
          width={48}
          height={48}
          priority={priority}
        />
      </div>
      <div className="flex items-center">
        <motion.div {...arrowAnimation}>
          <OptimizedImage
            src="https://res.cloudinary.com/dg0cmj6su/image/upload/v1742540890/Arrow_ieu0xg.png"
            alt={`Arrow icon`}
            width={48}
            height={48}
            className="w-2 -mr-0.5"
            priority={priority}
          />
        </motion.div>
        <ArrowIcon />
      </div>
    </div>
  );
});

// Extracted CostHeader component to improve performance
const CostHeader = memo(({ costLevel, others }) => (
  <header className="flex lg:hidden flex-col bg-[#1a1b30] mb-2 !mx-3">
    <h5 className="flex justify-center items-center h-[30px] gap-[4px] m-1">
      <span width="12" height="12" className="block h-[14px] w-[14px]">
        <svg
          viewBox="0 0 12 12"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
        >
          <path d="M12 6A6 6 0 1 1 0 6a6 6 0 0 1 12 0Z" fill="#FFC528"></path>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M6 11A5 5 0 1 0 6 1a5 5 0 0 0 0 10Zm0 1A6 6 0 1 0 6 0a6 6 0 0 0 0 12Z"
            fill="#FF8929"
          ></path>
          <path
            d="M6.58 9.5c-.511 0-.985-.076-1.422-.228a3.287 3.287 0 0 1-1.14-.665 3.075 3.075 0 0 1-.746-1.085C3.091 7.091 3 6.592 3 6.027c0-.559.094-1.054.282-1.485.189-.438.444-.808.767-1.112a3.256 3.256 0 0 1 1.14-.693c.436-.158.9-.237 1.39-.237.539 0 .996.088 1.372.264.383.177.696.377.938.602l-.797.857a2.718 2.718 0 0 0-.615-.401c-.222-.11-.504-.164-.847-.164-.309 0-.595.054-.857.164a1.857 1.857 0 0 0-.665.455 2.26 2.26 0 0 0-.434.73c-.1.285-.151.61-.151.975 0 .735.185 1.312.554 1.732.37.413.921.62 1.654.62.182 0 .356-.022.524-.064.169-.043.306-.107.414-.192v-1.33H6.348V5.644H9v3.044c-.255.225-.592.416-1.008.574A3.96 3.96 0 0 1 6.58 9.5Z"
            fill="#FF8929"
          ></path>
        </svg>
      </span>
      <span className="text-[14px] font-semibold font-sans leading-none text-[#999]">
        {others?.cost} {costLevel + 1}
      </span>
    </h5>
  </header>
));

// ChampionsCostSection component to handle champions display per cost
const ChampionsCostSection = memo(
  ({
    champions,
    costIndex,
    setSelectedChampion,
    forces,
    others,
    selectedChampion,
  }) => {
    // Start all sections as visible for immediate loading
    const sectionRef = useRef(null);
    const [isVisible, setIsVisible] = useState(true); // All sections visible immediately

    // Store the processed champions to prevent reshuffling
    const processedChampionsRef = useRef(null);

    // Remove intersection observer - no longer needed for visibility
    // Keep ref for potential future optimizations
    useEffect(() => {
      // Optional: Add intersection observer for analytics or other optimizations
      // but don't use it to control visibility
      const observer = new IntersectionObserver(
        ([entry]) => {
          // Can track visibility for analytics or other purposes
          // but don't change isVisible state
        },
        { threshold: 0.1, rootMargin: "100px" }
      );

      if (sectionRef.current) {
        observer.observe(sectionRef.current);
      }

      return () => {
        if (sectionRef.current) observer.unobserve(sectionRef.current);
      };
    }, []);

    // Process champions only once and store in ref
    const sortedChampions = useMemo(() => {
      // If we already have processed these champions, return them
      if (processedChampionsRef.current) {
        return processedChampionsRef.current;
      }

      if (!champions || champions.length === 0) return [];

      // Sort once by type
      const sorted = [...champions].sort((a, b) =>
        (a.type || "").localeCompare(b.type || "")
      );

      // Store result in ref to prevent future reshuffling
      processedChampionsRef.current = sorted;

      return sorted;
    }, [champions]);

    // Memoize the renderChampion function
    const renderChampion = useCallback(
      (champion, j) => (
        <MetaTrendsItem
          key={`${champion.key || j}`}
          champion={{
            ...champion,
            selected: champion.key === selectedChampion,
          }}
          setSelectedChampion={setSelectedChampion}
          index={j}
          forces={forces}
        />
      ),
      [setSelectedChampion, forces, selectedChampion]
    );

    // Always render content immediately
    return (
      <React.Fragment>
        {/* <CostHeader costLevel={costIndex} others={others} /> */}
        <div className="mx-auto w-full" ref={sectionRef}>
          <div
            className="flex items-center flex-wrap mb-2 justify-center rounded-tl-none rounded-tr-none"
            style={{
              gap: "8px",
            }}
          >
            <div className="hidden lg:flex items-center">
              {costIndex < coinIcons.length && (
                <CoinIcon index={costIndex} priority={true} />
              )}
            </div>
            {sortedChampions.map((champion, j) => renderChampion(champion, j))}
          </div>
        </div>
      </React.Fragment>
    );
  }
);

const MetaTrendsCard = ({
  title,
  description,
  image,
  link,
  cost,
  itemCount,
  championsByCost,
  setSelectedChampion,
  selectedChampion,
  forces,
}) => {
  const { t } = useTranslation();
  const others = t("others");

  // State for mobile tabs
  const [activeTab, setActiveTab] = useState(0);

  // Tab button component for mobile
  const TabButton = memo(({ index, isActive, onClick, championCount }) => (
    <button
      onClick={() => onClick(index)}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
        isActive
          ? "bg-[#2d2f37] text-[#FFC528] border border-[#FFC528]"
          : "bg-[#1D1D1D] text-gray-400 hover:bg-[#2D2F37] border border-gray-600"
      }`}
    >
      {index < coinIcons.length && (
        <OptimizedImage
          src={coinIcons[index]}
          className="w-6 h-6"
          alt={`Cost ${index + 1} Icon`}
          width={24}
          height={24}
          priority={true}
        />
      )}
    </button>
  ));

  // Mobile tabs navigation
  const MobileTabsNav = memo(() => (
    <div className="lg:hidden mx-3">
      <div className="flex gap-2 overflow-x-auto pb-2 pt-2 justify-center">
        {championsByCost.map((champions, index) => (
          <TabButton
            key={`tab-${index}`}
            index={index}
            isActive={activeTab === index}
            onClick={setActiveTab}
            championCount={champions?.length}
          />
        ))}
      </div>
    </div>
  ));

  return (
    <div className="rounded-[4px]">
      {/* Mobile Tabs Navigation */}
      <MobileTabsNav />

      <div className="grid grid-cols-1 m-2">
        {console.log("championsByCost", championsByCost)}

        {/* Mobile View - Show only active tab */}
        <div className="lg:hidden">
          {championsByCost[activeTab] && (
            <ChampionsCostSection
              key={`mobile-cost-${activeTab}`}
              champions={championsByCost[activeTab]}
              costIndex={activeTab}
              setSelectedChampion={setSelectedChampion}
              forces={forces}
              others={others}
              selectedChampion={selectedChampion}
            />
          )}
        </div>

        {/* Desktop View - Show all sections */}
        <div className="hidden lg:block">
          {championsByCost.map((champions, i) => (
            <ChampionsCostSection
              key={`desktop-cost-${i}`}
              champions={champions}
              costIndex={i}
              setSelectedChampion={setSelectedChampion}
              forces={forces}
              others={others}
              selectedChampion={selectedChampion}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Use React.memo to prevent unnecessary re-renders
export default memo(MetaTrendsCard);
