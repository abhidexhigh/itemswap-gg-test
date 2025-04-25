import React, { memo, useCallback } from "react";
import { IoMdCheckmarkCircle } from "react-icons/io";
import CardImage from "src/components/cardImage";

const MetaTrendsItem = ({
  champion,
  title,
  description,
  image,
  link,
  setSelectedChampion,
  index,
  forces,
}) => {
  // Use useCallback to memoize the click handler
  const handleClick = useCallback(() => {
    if (champion?.key) {
      setSelectedChampion(champion.key);
    }
  }, [champion?.key, setSelectedChampion]);

  // Early return if champion is not provided
  if (!champion) return null;

  return (
    <div
      className={`relative inline-flex cursor-pointer [box-shadow:rgba(255,_0,_0)_0px_5px_15px] shadow-none hover:[box-shadow:rgba(255,_0,_0)_0px_54px_55px,_rgba(0,_0,_0,_0.12)_0px_-12px_30px,_rgba(0,_0,_0,_0.12)_0px_4px_6px,_rgba(0,_0,_0,_0.17)_0px_12px_13px,_rgba(0,_0,_0,_0.09)_0px_-3px_5px] hover:-translate-y-0.5 transition-all duration-300 ease-in-out`}
      onClick={handleClick}
    >
      <div className="relative">
        <div className="w-[72px] h-[72px] lg:w-[104px] lg:h-[104px] relative">
          <div className="w-full h-full">
            <CardImage
              src={champion}
              forces={forces}
              imgStyle="h-full w-auto object-contain"
              identificationImageStyle="w-[20px] md:w-[30px]"
            />
          </div>

          {champion?.selected && (
            <div className="absolute top-0 left-0 w-full h-full bg-[#00000060] flex items-center justify-center z-20">
              <IoMdCheckmarkCircle className="text-[#86efaccc] w-12 h-12" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Use React.memo to prevent unnecessary re-renders
export default memo(MetaTrendsItem);
