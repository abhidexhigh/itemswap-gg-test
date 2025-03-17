import React, { memo, useMemo } from "react";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import MetaTrendsItem from "../MetaTrendsItem/MetaTrendsItem";

// Memoize the getRandomCharacters function to avoid unnecessary recalculations
const getRandomCharacters = (characters, count = 12) => {
  if (!characters || characters.length === 0) return [];

  // Shuffle the array using Fisher-Yates algorithm
  const shuffled = [...characters].sort(() => Math.random() - 0.5);

  // Return the first 'count' elements
  return shuffled.slice(0, count);
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
  const coin =
    "https://res.cloudinary.com/dg0cmj6su/image/upload/v1727238375/selling_coins_sjs6so.webp";
  const coinIcons = [
    "https://res.cloudinary.com/dg0cmj6su/image/upload/c_crop,w_280/v1720780550/one_v7t2oz.webp",
    "https://res.cloudinary.com/dg0cmj6su/image/upload/c_crop,w_280/v1720780550/two_lq4qkg.webp",
    "https://res.cloudinary.com/dg0cmj6su/image/upload/c_crop,w_280/v1720780550/three_seducd.webp",
    "https://res.cloudinary.com/dg0cmj6su/image/upload/c_crop,w_280/v1720780377/four_nvxjwh.webp",
    "https://res.cloudinary.com/dg0cmj6su/image/upload/c_crop,w_280/v1720780551/five_om2xqr.webp",
  ];

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
        {championsByCost?.map((champions, i) => {
          // Memoize the random characters for each cost level
          const randomChampions = useMemo(() => {
            return getRandomCharacters(champions);
          }, [champions]);

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
                      <Image
                        src={coinIcons[i]}
                        className="w-8 md:w-10 2xl:w-12"
                        alt={`Cost ${i + 1} Icon`}
                        width={48}
                        height={48}
                      />
                    )}
                  </div>
                  {randomChampions &&
                    randomChampions.length > 0 &&
                    randomChampions
                      .sort((a, b) => a.type?.localeCompare(b.type || ""))
                      .map((champion, j) => (
                        <MetaTrendsItem
                          key={`${champion.key || j}`}
                          champion={champion}
                          setSelectedChampion={setSelectedChampion}
                          index={j}
                          forces={forces}
                        />
                      ))}
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

// Use React.memo to prevent unnecessary re-renders
export default memo(MetaTrendsCard);
