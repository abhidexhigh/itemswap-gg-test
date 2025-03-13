import React from "react";
import Image from "next/image";
import { Tooltip as Ttip } from "flowbite-react";
import annie from "@assets/image/items/annie.jpeg";
import { IoMdCheckmarkCircle, IoMdCheckmark } from "react-icons/io";
import ReactTltp from "src/components/tooltip/ReactTltp";
import ImageBorders from "../../../../data/newData/costWiseBorders.json";

const RecentDecksItem = ({
  champion,
  title,
  description,
  image,
  link,
  setSelectedChampion,
  index,
  forces,
}) => {
  const handleClick = (key) => {
    setSelectedChampion(key);
    console.log("champion", key);
  };
  return (
    // <Ttip content="Tooltip content" animation="duration-500" arrow={false}>
    <div
      className={`relative inline-flex cursor-pointer [box-shadow:rgba(255,_0,_0)_0px_5px_15px] shadow-none hover:[box-shadow:rgba(255,_0,_0)_0px_54px_55px,_rgba(0,_0,_0,_0.12)_0px_-12px_30px,_rgba(0,_0,_0,_0.12)_0px_4px_6px,_rgba(0,_0,_0,_0.17)_0px_12px_13px,_rgba(0,_0,_0,_0.09)_0px_-3px_5px] hover:-translate-y-0.5 transition-all duration-300 ease-in-out`}
      onClick={() => handleClick(champion?.key)}
    >
      <ReactTltp variant="champion" content={champion} id={champion?.key} />
      <div
        className="relative inline-flex flex-col"
        data-tooltip-id={champion?.key}
      >
        <div className="relative flex flex-col w-[72px] h-[72px] lg:w-[98px] lg:h-[98px]">
          <div
            className={`relative inline-flex rounded-[6px] w-full h-full ${
              champion?.selected
                ? "border-[green]"
                : `border-[${champion?.styles?.borderColor}]`
            } border-[#bbc2c2] border-none bg-cover`}
            style={{
              backgroundImage: `url(${ImageBorders?.find((border) => border?.cost === champion?.cost).imageUrl})`,
            }}
          >
            <Image
              src={champion.cardImage}
              alt="Champion Image"
              className="w-[95%] h-[95%] m-auto"
              width={80}
              height={80}
            />
            <Image
              src={
                forces?.find((force) => force?.key === champion?.variant)
                  ?.imageUrl
              }
              className="absolute -top-[3px] -right-[3px] w-[20px] md:w-[30px]"
              alt="icon"
              width={32}
              height={32}
            />
            {champion?.selected && (
              <IoMdCheckmarkCircle className="absolute top-0 right-0 w-full h-full p-3 bg-[#00000060] text-[#86efaccc]" />
            )}
          </div>
        </div>
      </div>
      {/* <ReactTltp
        key={`${champion?.key}${index}`}
        id={`${champion?.key}${index}`}
        content={"Heellooooooooo"}
      /> */}
      {/* <div className="flex justify-center items-center absolute top-1/2 left-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 bg-[#2322228f] rounded-[6px]">
          <span
            width="14"
            height="15"
            color="#FFFFFF"
            className="IconContainer block h-[14px] w-[14px]"
          >
            <IoMdCheckmarkCircle />
          </span>
        </div> */}
    </div>
    // </Ttip>
  );
};

export default RecentDecksItem;
