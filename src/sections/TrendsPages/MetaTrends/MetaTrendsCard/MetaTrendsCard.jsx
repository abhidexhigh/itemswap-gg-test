import React, { memo, useMemo, useCallback } from "react";
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

const testImages = [
  "https://res.cloudinary.com/dg0cmj6su/image/upload/v1744186286/Succubus-Dark_nfrdtd.png",
  "https://res.cloudinary.com/dg0cmj6su/image/upload/v1744186286/Assasin-Light_l4htzq.png",
  "https://res.cloudinary.com/dg0cmj6su/image/upload/v1744186293/Valkyrie-Dark_fni8h0.png",
];

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

const cardVideos = [
  {
    cardImage:
      "https://res.cloudinary.com/dg0cmj6su/video/upload/v1744361432/9aedb30a-fab7-4836-9a7f-9706824705c1-video_jwavft.mp4",
    cost: 3,
  },
  {
    cardImage:
      "https://res.cloudinary.com/dg0cmj6su/video/upload/v1744361436/5097ea1a-5bfd-4cb8-a907-29f26034bdc0-video_vb9ywx.mp4",
    cost: 3,
  },
  {
    cardImage:
      "https://res.cloudinary.com/dg0cmj6su/video/upload/v1744361436/input_rn0h9o.mp4",
    cost: 3,
  },
  {
    cardImage:
      "https://res.cloudinary.com/dg0cmj6su/video/upload/v1744361436/464769ae-b1f3-4eaa-9dbf-87b821387965-video_ksxvpx.mp4",
    cost: 3,
  },
  {
    cardImage:
      "https://res.cloudinary.com/dg0cmj6su/video/upload/v1744361445/a25ad994-1c3a-4a87-b95d-d7f60349a519-video_b7fiz1.mp4",
    cost: 3,
  },
  {
    cardImage:
      "https://res.cloudinary.com/dg0cmj6su/video/upload/v1744361448/08012b24-5cad-49cc-ae6b-dbf3147ae91f-video_kdejmm.mp4",
    cost: 3,
  },
  {
    cardImage:
      "https://res.cloudinary.com/dg0cmj6su/video/upload/v1744361456/fbc016b9-0d33-4acd-8493-c120735571e6-video_koauwn.mp4",
    cost: 3,
  },
  {
    cardImage:
      "https://res.cloudinary.com/dg0cmj6su/video/upload/v1744366011/d96d4d20-420b-47a8-bd5d-f9a8ed2a9021-video_qkk1kg.mp4",
    cost: 3,
  },
  {
    cardImage:
      "https://res.cloudinary.com/dg0cmj6su/video/upload/v1744366007/559e21a4-1aa5-40b0-b0e8-acbdfe977956-video_qib3sk.mp4",
    cost: 3,
  },
  {
    cardImage:
      "https://res.cloudinary.com/dg0cmj6su/video/upload/v1744366006/22eafd38-1097-4ff4-8402-d9f3354a9788-video_1_eajzve.mp4",
    cost: 3,
  },
  {
    cardImage:
      "https://res.cloudinary.com/dg0cmj6su/video/upload/v1744366005/71dbd655-8a70-48e0-8fd3-91ad4cc0c8e6-video_fnhrxo.mp4",
    cost: 3,
  },
  {
    cardImage:
      "https://res.cloudinary.com/dg0cmj6su/video/upload/v1744366005/1933cac0-8062-4696-b41a-134bca40bf98-video_ihuhga.mp4",
    cost: 3,
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

  // Memoize the renderChampion function
  const renderChampion = useCallback(
    (champion, j) => (
      <MetaTrendsItem
        key={`${champion.key || j}`}
        champion={champion}
        setSelectedChampion={setSelectedChampion}
        index={j}
        forces={forces}
      />
    ),
    [setSelectedChampion, forces]
  );

  return (
    <div
      className="rounded-[4px]"
      // style={{
      //   background: "rgb(0 0 0 / 55%)",
      //   borderRadius: "16px",
      //   boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
      //   backdropFilter: "blur(2px)",
      //   border: "1px solid rgba(255, 255, 255, 0.3)",
      // }}
    >
      {/* <header className="flex flex-col bg-[#27282E]">
        <h5 className="flex justify-center items-center h-[34px] gap-[4px] m-1">
          <span width="12" height="12" className="block h-[14px] w-[14px]">
            <svg
              viewBox="0 0 12 12"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              width="100%"
              height="100%"
            >
              <path
                d="M12 6A6 6 0 1 1 0 6a6 6 0 0 1 12 0Z"
                fill="#FFC528"
              ></path>
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M6 11A5 5 0 1 0 6 1a5 5 0 0 0 0 10Zm0 1A6 6 0 1 0 6 0a6 6 0 0 0 0 12Z"
                fill="#FF8929"
              ></path>
              <path
                d="M6.58 9.5c-.511 0-.985-.076-1.422-.228a3.287 3.287 0 0 1-1.14-.665 3.075 3.075 0 0 1-.746-1.085C3.091 7.091 3 6.592 3 6.027c0-.559.094-1.054.282-1.485.189-.438.444-.808.767-1.112a3.256 3.256 0 0 1 1.14-.693c.436-.158.9-.237 1.39-.237.539 0 .996.088 1.372.264.383.177.696.377.938.602l-.797.857a2.718 2.718 0 0 0-.615-.401c-.222-.11-.504-.164-.847-.164-.309 0-.595.054-.857.164a1.857 1.857 0 0 0-.665.455 2.26 2.26 0 0 0-.434.73c-.1.285-.151.61-.151.975 0 .735.185 1.312.554 1.732.37.413.921.62 1.654.62.182 0 .356-.022.524-.064.169-.043.306-.107.414-.192v-1.33H6.348V5.644H9v3.044c-.255.225-.592.416-1.008.574A3.96 3.96 0 0 1 6.58 9.5Z"
                fill="#FF8929"
              ></path>
            </svg>
          </span>
          <span className="text-[12px] font-semibold leading-none text-[#999]">
            {cost}
          </span>
        </h5>
      </header> */}
      {/* <div className="flex flex-col p-[12px] lg:px-[14px]"> */}
      <div className="grid grid-cols-1 m-2">
        {championsByCost
          .filter((champions, i) => i === 3 || i === 0)
          .map((champions, i) => {
            // Memoize the random characters for each cost level
            const randomChampions = useMemo(() => {
              return getRandomCharacters(champions);
            }, [champions]);

            // Memoize the sorted champions
            const sortedChampions = useMemo(() => {
              return randomChampions.sort((a, b) =>
                a.type?.localeCompare(b.type || "")
              );
            }, [randomChampions]);

            return (
              <React.Fragment key={`cost-${i}`}>
                <header className="flex lg:hidden flex-col bg-[#1a1b30] mb-2 !mx-3">
                  <h5 className="flex justify-center items-center h-[30px] gap-[4px] m-1">
                    <span
                      width="12"
                      height="12"
                      className="block h-[14px] w-[14px]"
                    >
                      <svg
                        viewBox="0 0 12 12"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                        width="100%"
                        height="100%"
                      >
                        <path
                          d="M12 6A6 6 0 1 1 0 6a6 6 0 0 1 12 0Z"
                          fill="#FFC528"
                        ></path>
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
                      {others?.cost} {i + 1}
                    </span>
                  </h5>
                </header>
                <div className="mx-auto w-full">
                  <div
                    className="flex items-center flex-wrap mb-2 justify-center rounded-tl-none rounded-tr-none"
                    style={{
                      gap: "8px",
                    }}
                  >
                    <div className="hidden lg:flex items-center">
                      {i < coinIcons.length && (
                        <div className="flex items-center gap-1">
                          <div className="relative">
                            <OptimizedImage
                              src={coinIcons[i]}
                              className="w-8 md:w-10 2xl:w-12"
                              alt={`Cost ${i + 1} Icon`}
                              width={48}
                              height={48}
                              priority={i < 2}
                            />
                            {/* <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20px] font-semibold leading-none text-[#401d1d] shadow-lg">
                            {i + 1}
                          </span> */}
                          </div>
                          <div className="flex items-center">
                            <motion.div {...arrowAnimation}>
                              <OptimizedImage
                                src="https://res.cloudinary.com/dg0cmj6su/image/upload/v1742540890/Arrow_ieu0xg.png"
                                alt={`Cost ${i + 1} Icon`}
                                width={48}
                                height={48}
                                className="w-2 -mr-0.5"
                                {...(i >= 2
                                  ? { loading: "lazy" }
                                  : { priority: true })}
                              />
                            </motion.div>
                            <motion.div {...arrowAnimation}>
                              <OptimizedImage
                                src="https://res.cloudinary.com/dg0cmj6su/image/upload/v1742540890/Arrow_ieu0xg.png"
                                alt={`Cost ${i + 1} Icon`}
                                width={48}
                                height={48}
                                className="w-3"
                                {...(i >= 2
                                  ? { loading: "lazy" }
                                  : { priority: true })}
                              />
                            </motion.div>
                          </div>
                        </div>
                      )}
                    </div>
                    {sortedChampions
                      // .slice(0, 9)
                      .map((champion, j) => renderChampion(champion, j))}
                  </div>
                </div>
              </React.Fragment>
            );
          })}
      </div>
      <div className="ml-[82px]">
        <div
          className="flex items-center flex-wrap mb-2 rounded-tl-none rounded-tr-none"
          style={{
            gap: "8px",
          }}
        >
          {cardVideos.map((video, j) => renderChampion(video, j))}
        </div>
        <div
          className="flex items-center flex-wrap mb-2 rounded-tl-none rounded-tr-none"
          style={{
            gap: "8px",
          }}
        >
          <>
            <CharacterCard
              image={testImages[1]}
              name={"Champion Image"}
              title={"Champion Title"}
              description={"Champion Description"}
              stats={[]}
            />
            <DarkSuccubusCard
              image={testImages[0]}
              name={"Champion Image"}
              title={"Champion Title"}
              description={"Champion Description"}
              stats={[]}
            />
            <DarkSuccubusCard
              image={testImages[2]}
              name={"Champion Image"}
              title={"Champion Title"}
              description={"Champion Description"}
              stats={[]}
            />
            <IceFrameCard
              image={testImages[1]}
              name={"Champion Image"}
              title={"Champion Title"}
              description={"Champion Description"}
              stats={[]}
            />
            <FireEdgeCard
              image={testImages[1]}
              name={"Champion Image"}
              title={"Champion Title"}
              description={"Champion Description"}
              stats={[]}
            />
            <NeonGlowCard
              image={testImages[1]}
              name={"Champion Image"}
              title={"Champion Title"}
              description={"Champion Description"}
              stats={[]}
            />
            <LightVariantCard
              image={testImages[1]}
              name={"Champion Image"}
              title={"Champion Title"}
              description={"Champion Description"}
              stats={[]}
            />
            <DarkVariantCard
              image={testImages[1]}
              name={"Champion Image"}
              title={"Champion Title"}
              description={"Champion Description"}
              stats={[]}
            />
            <FireVariantCard
              image={testImages[1]}
              name={"Champion Image"}
              title={"Champion Title"}
              description={"Champion Description"}
              stats={[]}
            />
            <StormVariantCard
              image={testImages[1]}
              name={"Champion Image"}
              title={"Champion Title"}
              description={"Champion Description"}
              stats={[]}
            />
            <WaterVariantCard
              image={testImages[1]}
              name={"Champion Image"}
              title={"Champion Title"}
              description={"Champion Description"}
              stats={[]}
            />
            <StormVariantCard2
              image={testImages[1]}
              name={"Champion Image"}
              title={"Champion Title"}
              description={"Champion Description"}
              stats={[]}
            />
            <LightVariantCard2
              image={testImages[1]}
              name={"Champion Image"}
              title={"Champion Title"}
              description={"Champion Description"}
              stats={[]}
            />
            <DarkVariantCard2
              image={testImages[1]}
              name={"Champion Image"}
              title={"Champion Title"}
              description={"Champion Description"}
              stats={[]}
            />
            <WaterVariantCard2
              image={testImages[1]}
              name={"Champion Image"}
              title={"Champion Title"}
              description={"Champion Description"}
              stats={[]}
            />
            <FireVariantCard2
              image={testImages[1]}
              name={"Champion Image"}
              title={"Champion Title"}
              description={"Champion Description"}
              stats={[]}
            />
            <NatureVariantCard2
              image={testImages[1]}
              name={"Champion Image"}
              title={"Champion Title"}
              description={"Champion Description"}
              stats={[]}
            />
            <WaterVariantCenterFocus
              image={testImages[1]}
              name={"Champion Image"}
              title={"Champion Title"}
              description={"Champion Description"}
              stats={[]}
            />
            <WaterVariantWhirlpool
              image={testImages[1]}
              name={"Champion Image"}
              title={"Champion Title"}
              description={"Champion Description"}
              stats={[]}
            />
            <WaterVariantGlacier
              image={testImages[1]}
              name={"Champion Image"}
              title={"Champion Title"}
              description={"Champion Description"}
              stats={[]}
            />
            <FireVariantVolcanic
              image={testImages[1]}
              name={"Champion Image"}
              title={"Champion Title"}
              description={"Champion Description"}
              stats={[]}
            />
            <LightVariantPrism
              image={testImages[1]}
              name={"Champion Image"}
              title={"Champion Title"}
              description={"Champion Description"}
              stats={[]}
            />
            <DarkVariantChaos
              image={testImages[1]}
              name={"Champion Image"}
              title={"Champion Title"}
              description={"Champion Description"}
              stats={[]}
            />
            <NatureVariantJungle
              image={testImages[1]}
              name={"Champion Image"}
              title={"Champion Title"}
              description={"Champion Description"}
              stats={[]}
            />
            <WaterVariantAbyssal
              image={testImages[1]}
              name={"Champion Image"}
              title={"Champion Title"}
              description={"Champion Description"}
              stats={[]}
            />
            <StormVariantTornado
              image={testImages[1]}
              name={"Champion Image"}
              title={"Champion Title"}
              description={"Champion Description"}
              stats={[]}
            />
            <EarthVariantMountain
              image={testImages[1]}
              name={"Champion Image"}
              title={"Champion Title"}
              description={"Champion Description"}
              stats={[]}
            />
            <FireVariantFlame
              image={testImages[1]}
              name={"Champion Image"}
              title={"Champion Title"}
              description={"Champion Description"}
              stats={[]}
            />
            <AirVariantBreeze
              image={testImages[1]}
              name={"Champion Image"}
              title={"Champion Title"}
              description={"Champion Description"}
              stats={[]}
            />
            <EarthVariantCrystal
              image={testImages[1]}
              name={"Champion Image"}
              title={"Champion Title"}
              description={"Champion Description"}
              stats={[]}
            />
            <LightBeamCard
              image={testImages[1]}
              name={"Champion Image"}
              title={"Champion Title"}
              description={"Champion Description"}
              stats={[]}
            />
            <AmbientGlowCard
              image={testImages[1]}
              name={"Champion Image"}
              title={"Champion Title"}
              description={"Champion Description"}
              stats={[]}
            />
            <ShimmeryTrailCard
              image={testImages[1]}
              name={"Champion Image"}
              title={"Champion Title"}
              description={"Champion Description"}
              stats={[]}
            />
            <AuroraCard
              image={testImages[1]}
              name={"Champion Image"}
              title={"Champion Title"}
              description={"Champion Description"}
              stats={[]}
            />
            <DustParticleCard
              image={testImages[1]}
              name={"Champion Image"}
              title={"Champion Title"}
              description={"Champion Description"}
              stats={[]}
            />
            <MistyFlowCard
              image={testImages[1]}
              name={"Champion Image"}
              title={"Champion Title"}
              description={"Champion Description"}
              stats={[]}
            />
            <StarfieldCard
              image={testImages[1]}
              name={"Champion Image"}
              title={"Champion Title"}
              description={"Champion Description"}
              stats={[]}
            />
          </>
        </div>
      </div>
    </div>
  );
};

// Use React.memo to prevent unnecessary re-renders
export default memo(MetaTrendsCard);
