import React from "react";
import Image from "next/image";
import RecentDecksItem from "../RecentDecksItem/RecentDecksItem";

function getRandomCharacters(characters, count = 12) {
  // Shuffle the array using Fisher-Yates algorithm
  let shuffled = characters.slice().sort(() => Math.random() - 0.5);

  // Return the first 'count' elements
  return shuffled.slice(0, count);
}

const RecentDecksCard = ({
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
  const coinIcons = [
    "https://res.cloudinary.com/dg0cmj6su/image/upload/c_crop,w_280/v1720780550/one_v7t2oz.webp",
    "https://res.cloudinary.com/dg0cmj6su/image/upload/c_crop,w_280/v1720780550/two_lq4qkg.webp",
    "https://res.cloudinary.com/dg0cmj6su/image/upload/c_crop,w_280/v1720780550/three_seducd.webp",
    "https://res.cloudinary.com/dg0cmj6su/image/upload/c_crop,w_280/v1720780377/four_nvxjwh.webp",
    "https://res.cloudinary.com/dg0cmj6su/image/upload/c_crop,w_280/v1720780551/five_om2xqr.webp",
  ];

  return (
    <div className="rounded-[4px]">
      <div className="grid grid-cols-1 m-2">
        {championsByCost?.map((champions, i) => (
          <>
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
                <span className="text-[14px] font-semibold font-sans leading-none text-[#999]">
                  Cost {i + 1}
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
                  <Image
                    src={coinIcons[i]}
                    className="w-8 md:w-10 2xl:w-12"
                    alt="Coin Icon"
                    width={48}
                    height={48}
                  />
                </div>
                {champions &&
                  champions.length > 0 &&
                  getRandomCharacters(champions)
                    .sort((a, b) => a.type.localeCompare(b.type))
                    .map((champion, j) => (
                      <RecentDecksItem
                        key={j}
                        champion={champion}
                        setSelectedChampion={setSelectedChampion}
                        index={j}
                        forces={forces}
                      />
                    ))}
              </div>
            </div>
          </>
        ))}
      </div>
    </div>
  );
};

export default RecentDecksCard;
