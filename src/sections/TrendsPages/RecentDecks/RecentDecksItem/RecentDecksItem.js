import React from "react";
import Image from "next/image";
import { IoMdCheckmarkCircle, IoMdCheckmark } from "react-icons/io";
import ReactTltp from "src/components/tooltip/ReactTltp";
import ImageBorders from "../../../../data/newData/costWiseBorders.json";

const RecentDecksItem = ({ champion, setSelectedChampion, forces }) => {
  const handleClick = (key) => {
    setSelectedChampion(key);
    console.log("champion", key);
  };
  return (
    <div
      className={`relative inline-block w-full cursor-pointer transition-all duration-300 ease-in-out
        hover:[box-shadow:rgba(255,_0,_0)_0px_54px_55px,_rgba(0,_0,_0,_0.12)_0px_-12px_30px,_rgba(0,_0,_0,_0.12)_0px_4px_6px,_rgba(0,_0,_0,_0.17)_0px_12px_13px,_rgba(0,_0,_0,_0.09)_0px_-3px_5px]
        hover:-translate-y-0.5`}
      onClick={() => handleClick(champion?.key)}
    >
      <ReactTltp content={champion?.name} id={champion?.key} />
      <div className="relative w-full" data-tooltip-id={champion?.key}>
        <div className="relative w-full pb-[100%]">
          {" "}
          {/* Aspect ratio container */}
          <div
            className={`absolute inset-0 rounded-[6px] overflow-hidden ${
              champion?.selected ? "border-2 border-green-500" : "border-none"
            }`}
            style={{
              backgroundImage: `url(${
                ImageBorders.find((border) => border?.cost === champion?.cost)
                  ?.imageUrl
              })`,
            }}
          >
            <div className="relative w-full h-full p-1">
              <Image
                src={champion.cardImage}
                alt="Champion Image"
                layout="fill"
                objectFit="cover"
                className="rounded-[4px]"
              />
            </div>

            {/* Force icon */}
            <div className="absolute top-0 right-0 w-[25%] h-[25%]">
              <Image
                src={
                  forces?.find((force) => force?.key === champion?.variant)
                    ?.imageUrl
                }
                layout="fill"
                objectFit="contain"
                alt="force icon"
              />
            </div>

            {champion?.selected && (
              <IoMdCheckmarkCircle className="absolute top-0 right-0 w-full h-full p-3 bg-[#00000060] text-[#86efaccc]" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentDecksItem;
