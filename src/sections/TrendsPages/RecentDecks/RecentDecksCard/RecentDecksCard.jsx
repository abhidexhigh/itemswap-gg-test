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
          <React.Fragment key={i}>
            {/* Mobile header remains unchanged */}
            <header className="flex md:hidden ...">{/* ... */}</header>

            <div className="mx-auto w-full">
              <div
                className="grid gap-2 justify-items-center"
                style={{
                  gridTemplateColumns: "repeat(auto-fit, minmax(80px, 1fr))",
                  width: "100%",
                }}
              >
                <div className="hidden md:flex items-center">
                  <Image
                    src={coinIcons[i]}
                    className="w-8 md:w-10 2xl:w-12"
                    alt="Coin Icon"
                    width={48}
                    height={48}
                  />
                </div>

                {champions?.length > 0 &&
                  getRandomCharacters(champions).map((champion, j) => (
                    <RecentDecksItem
                      key={`${i}-${j}`}
                      champion={champion}
                      setSelectedChampion={setSelectedChampion}
                      forces={forces}
                    />
                  ))}
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default RecentDecksCard;
