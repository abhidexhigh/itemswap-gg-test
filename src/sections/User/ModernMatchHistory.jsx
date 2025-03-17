"use client";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import moment from "moment";
import { motion } from "framer-motion";
import Image from "next/image";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import CardImage from "../../components/cardImage";
import ReactTltp from "../../components/tooltip/ReactTltp";

const ModernMatchHistory = ({
  match,
  traits,
  champions,
  items,
  augments,
  forces,
  matchHistoryInfo,
  matchId,
}) => {
  const { t } = useTranslation();
  const others = t("others");
  const [expandedHistory, setExpandedHistory] = useState(null);

  useEffect(() => {
    if (matchId && matchId === match?.key) {
      setExpandedHistory(matchId);
    }
  }, [matchId, match?.key]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-6"
    >
      <div className="flex flex-col overflow-hidden border border-white/5 bg-gradient-to-br from-[#222231] to-[#1e1e2c] rounded-xl shadow-lg">
        {/* Match Header */}
        <header className="relative flex flex-col justify-between bg-gradient-to-br from-[#2d2d42] to-[#252538] py-2 px-4 lg:flex-row lg:items-center border-b border-white/10">
          <div className="flex flex-col md:flex-row items-center gap-3">
            <Image
              src={match?.info?.imageUrl}
              alt="Match type"
              width={48}
              height={48}
              className="w-12 rounded-lg shadow-md"
            />
            <div className="flex flex-col md:flex-row items-center gap-2">
              <strong className="text-base font-semibold text-white">
                {match?.gameType}
              </strong>
              <span className="text-sm text-gray-300">
                {moment(match?.dateTime).fromNow()} • {match?.duration}
              </span>
            </div>
            <div className="flex items-center gap-x-1 px-2 py-1 bg-[#ffffff10] rounded-lg">
              <Image
                src="https://res.cloudinary.com/dg0cmj6su/image/upload/v1722934556/coin_6369589_wbb7uk.png"
                width={16}
                height={16}
                className="w-4"
                alt="Coins"
              />
              <span className="text-xs text-yellow-300">
                {match?.info?.coins}
              </span>
            </div>
          </div>

          <div className="flex justify-center lg:mt-0">
            {match?.info?.traits
              ?.filter((trait) => trait?.numUnits > 1)
              ?.map((trait, i) => (
                <motion.div
                  key={i}
                  className="mx-1"
                  whileHover={{ scale: 1.1 }}
                >
                  <Image
                    src={
                      traits
                        ?.find(
                          (t) =>
                            t?.key.toLowerCase() === trait?.name.toLowerCase()
                        )
                        ?.tiers.find((tier) => tier?.min >= trait?.numUnits)
                        ?.imageUrl
                    }
                    width={48}
                    height={48}
                    className="w-12 rounded-md shadow-md"
                    alt={trait?.name}
                    data-tooltip-id={`trait-${trait?.name}-${i}`}
                  />
                  <ReactTltp
                    variant="trait"
                    content={traits?.find(
                      (t) => t?.key.toLowerCase() === trait?.name.toLowerCase()
                    )}
                    id={`trait-${trait?.name}-${i}`}
                  />
                </motion.div>
              ))}
          </div>
        </header>

        {/* Match Content */}
        <div className="p-1 md:p-4 bg-gradient-to-br from-[#222231] to-[#1e1e2c] border-t border-white/10">
          <div className="flex flex-col lg:flex-row items-center gap-4">
            {/* Placement */}
            <div className="flex items-center justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className={`flex flex-col items-center justify-center p-4 rounded-xl ${
                  match?.info?.placement === 1
                    ? "bg-gradient-to-r from-yellow-300/20 to-yellow-600/20 border border-yellow-400"
                    : match?.info?.placement === 2
                      ? "bg-gradient-to-r from-purple-400/20 to-purple-700/20 border border-purple-400"
                      : match?.info?.placement === 3
                        ? "bg-gradient-to-r from-orange-400/20 to-orange-700/20 border border-orange-400"
                        : match?.info?.placement <= 4
                          ? "bg-gradient-to-r from-blue-400/20 to-blue-700/20 border border-blue-400"
                          : "bg-gradient-to-r from-gray-400/20 to-gray-700/20 border border-gray-400"
                }`}
              >
                <span
                  className={`text-4xl font-bold ${
                    match?.info?.placement === 1
                      ? "text-yellow-300"
                      : match?.info?.placement === 2
                        ? "text-purple-400"
                        : match?.info?.placement === 3
                          ? "text-orange-400"
                          : match?.info?.placement <= 4
                            ? "text-blue-400"
                            : "text-gray-400"
                  }`}
                >
                  {match?.info?.placement}
                </span>
                <span className="text-sm text-gray-300 mt-1">Place</span>
              </motion.div>
            </div>

            {/* Augments */}
            <div className="w-full lg:w-auto">
              <div className="flex justify-center gap-2 p-3 bg-[#00000030] rounded-xl">
                {match?.info?.augments?.map((augment, i) => (
                  <motion.div
                    key={i}
                    className="flex flex-col"
                    whileHover={{ scale: 1.1 }}
                  >
                    <Image
                      src={augments?.find((a) => a?.key === augment)?.imageUrl}
                      width={80}
                      height={80}
                      className="w-20 rounded-lg shadow-md"
                      data-tooltip-id={augment}
                      alt={augment}
                    />
                    <ReactTltp
                      variant="augment"
                      content={augments?.find((a) => a?.key === augment)}
                      id={augment}
                    />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Champions */}
            <div className="w-full">
              <div className="flex flex-wrap justify-center gap-2 p-2 rounded-xl">
                {match?.info?.units?.slice(0, 7)?.map((unit, i) => (
                  <motion.div
                    key={i}
                    className="flex flex-col"
                    whileHover={{ scale: 1.05 }}
                  >
                    <CardImage
                      src={champions?.find(
                        (champion) => champion?.key === unit?.key
                      )}
                      imgStyle="w-[72px] md:w-20 rounded-lg shadow-md"
                      identificationImageStyle="w-[16px] md:w-[28px]"
                      textStyle="text-[10px] md:text-[14px]"
                      forces={forces}
                    />
                    <div className="flex justify-center gap-1 items-center min-h-[24px] md:min-h-[32px] mt-1">
                      {unit?.items?.map((item, i) => (
                        <motion.div key={i} whileHover={{ scale: 1.1 }}>
                          <Image
                            src={items?.find((i) => i?.key === item)?.imageUrl}
                            width={20}
                            height={20}
                            className="w-[20px] md:w-[28px] rounded-lg border border-white/20 shadow-md"
                            data-tooltip-id={
                              items?.find((i) => i?.key === item)?.imageUrl
                            }
                            alt={item}
                          />
                          <ReactTltp
                            variant="item"
                            content={items?.find((i) => i?.key === item)}
                            id={items?.find((i) => i?.key === item)?.imageUrl}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ))}

                {match?.info?.units?.length > 8 && (
                  <motion.div whileHover={{ scale: 1.05, y: -5 }}>
                    <div
                      className="w-[68px] md:w-20 h-[68px] md:h-20 rounded-lg bg-[#00000040] border border-white/20 shadow-md flex items-center justify-center cursor-pointer"
                      onClick={() =>
                        setExpandedHistory(
                          expandedHistory !== match?.key ? match?.key : null
                        )
                      }
                    >
                      <span className="text-xl font-bold text-white">
                        +{match?.info?.units?.length - 8}
                      </span>
                    </div>
                    <div className="min-h-[24px] md:min-h-[32px]"></div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Match Details */}
      <div
        className={`bg-gradient-to-br from-[#222231] to-[#1e1e2c] mt-2 rounded-xl shadow-lg border border-white/5 overflow-hidden ${expandedHistory === match?.key ? "block" : "hidden"}`}
      >
        <div className="p-4">
          <h3 className="text-lg font-semibold text-white mb-4">
            {others?.matchDetails}
          </h3>

          <div className="overflow-x-auto -mx-4">
            <div className="min-w-[1200px] pb-2">
              {matchHistoryInfo?.participants?.map((participant, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.05 }}
                  className="mb-3 bg-[#2d2d42] rounded-lg border border-white/10 shadow-md"
                >
                  <div className="p-3 grid grid-cols-12 gap-2 items-center">
                    {/* Placement Column */}
                    <div className="col-span-1">
                      <div
                        className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg ${
                          participant?.placement === 1
                            ? "bg-yellow-300/20 border border-yellow-400"
                            : participant?.placement === 2
                              ? "bg-purple-400/20 border border-purple-400"
                              : participant?.placement === 3
                                ? "bg-orange-400/20 border border-orange-400"
                                : participant?.placement <= 4
                                  ? "bg-blue-400/20 border border-blue-400"
                                  : "bg-gray-400/20 border border-gray-400"
                        }`}
                      >
                        <span
                          className={`text-xl sm:text-2xl font-bold ${
                            participant?.placement === 1
                              ? "text-yellow-300"
                              : participant?.placement === 2
                                ? "text-purple-400"
                                : participant?.placement === 3
                                  ? "text-orange-400"
                                  : participant?.placement <= 4
                                    ? "text-blue-400"
                                    : "text-gray-400"
                          }`}
                        >
                          {participant?.placement}
                        </span>
                      </div>
                    </div>

                    {/* Player Info Column */}
                    <div className="col-span-2">
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <Image
                            src={participant?.imageUrl}
                            width={48}
                            height={48}
                            className="w-10 sm:w-12 rounded-lg shadow-md"
                            alt={participant?.name}
                          />
                          <div className="absolute bottom-0 right-0 px-1.5 sm:px-2 rounded-full bg-[#444] text-[10px] sm:text-xs">
                            {participant?.level}
                          </div>
                        </div>
                        <div>
                          <div className="font-medium text-white text-sm sm:text-base truncate max-w-[80px] sm:max-w-[100px]">
                            {participant?.name}
                          </div>
                          <div className="text-xs sm:text-base text-gray-300">
                            {matchHistoryInfo?.duration}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Augments & Traits Column */}
                    <div className="col-span-2">
                      <div className="flex flex-col gap-1 sm:gap-2">
                        {/* Augments */}
                        <div className="flex flex-wrap gap-1 bg-[#00000020] rounded-md p-1 w-fit">
                          {participant?.augments?.map((augment, i) => {
                            const augmentData = augments?.find(
                              (a) => a.key === augment
                            );
                            return augmentData?.imageUrl ? (
                              <div key={i} className="relative">
                                <Image
                                  src={augmentData.imageUrl}
                                  width={20}
                                  height={20}
                                  className="w-6 h-6 sm:w-8 sm:h-8 rounded-md"
                                  data-tooltip-id={`part-aug-${participant?.name}-${i}`}
                                  alt={augment}
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src =
                                      "https://res.cloudinary.com/dg0cmj6su/image/upload/v1722934556/coin_6369589_wbb7uk.png";
                                  }}
                                />
                                <ReactTltp
                                  variant="augment"
                                  content={augmentData}
                                  id={`part-aug-${participant?.name}-${i}`}
                                />
                              </div>
                            ) : null;
                          })}
                        </div>

                        {/* Traits */}
                        <div className="flex flex-wrap gap-1 bg-[#00000030] rounded-md p-1 w-fit">
                          {participant?.traits?.slice(0, 3)?.map((trait, i) => {
                            const traitData = traits?.find(
                              (t) => t.key === trait.name
                            );
                            const tierImage = traitData?.tiers.find(
                              (tier) => tier.min <= trait.numUnits
                            )?.imageUrl;

                            return tierImage ? (
                              <div key={i} className="relative">
                                <Image
                                  src={tierImage}
                                  width={20}
                                  height={20}
                                  className="w-6 h-6 sm:w-8 sm:h-8 rounded-md"
                                  data-tooltip-id={`part-trait-${participant?.name}-${i}`}
                                  alt={trait.name}
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src =
                                      "https://res.cloudinary.com/dg0cmj6su/image/upload/v1722934556/coin_6369589_wbb7uk.png";
                                  }}
                                />
                                <ReactTltp
                                  variant="trait"
                                  content={traitData}
                                  id={`part-trait-${participant?.name}-${i}`}
                                />
                              </div>
                            ) : null;
                          })}
                          {participant?.traits?.length > 3 && (
                            <div
                              className="w-6 h-6 sm:w-8 sm:h-8 bg-[#00000040] rounded-full border border-white/20 flex items-center justify-center cursor-pointer"
                              data-tooltip-id={`more-traits-${participant?.name}`}
                            >
                              <span className="text-[10px] sm:text-xs text-white">
                                +{participant?.traits?.length - 3}
                              </span>
                            </div>
                          )}
                          <ReactTltp
                            content={participant?.traits}
                            id={`more-traits-${participant?.name}`}
                            variant="otherTraits"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Units & Items Column */}
                    <div className="col-span-7">
                      <div className="flex flex-wrap gap-1 justify-start">
                        {participant?.units?.map((unit, i) => (
                          <div key={i} className="flex flex-col">
                            <CardImage
                              src={champions?.find(
                                (champion) => champion.key === unit.key
                              )}
                              imgStyle="w-[48px] sm:w-[52px] md:w-[60px] rounded-lg shadow-md"
                              identificationImageStyle="w-[10px] sm:w-[12px] md:w-[16px]"
                              textStyle="text-[8px] md:text-[10px]"
                              forces={forces}
                            />
                            <div className="flex justify-center gap-[2px] mt-1">
                              {unit?.items?.map((item, j) => {
                                const itemData = items?.find(
                                  (i) => i.key === item
                                );
                                return itemData?.imageUrl ? (
                                  <div key={j} className="relative">
                                    <Image
                                      src={itemData.imageUrl}
                                      width={20}
                                      height={20}
                                      className="w-[14px] sm:w-[16px] md:w-[20px] rounded-md border border-white/20"
                                      data-tooltip-id={`part-item-${participant?.name}-${unit.key}-${j}`}
                                      alt={item}
                                      onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src =
                                          "https://res.cloudinary.com/dg0cmj6su/image/upload/v1722934556/coin_6369589_wbb7uk.png";
                                      }}
                                    />
                                    <ReactTltp
                                      variant="item"
                                      content={itemData}
                                      id={`part-item-${participant?.name}-${unit.key}-${j}`}
                                    />
                                  </div>
                                ) : null;
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Toggle Button */}
        <div
          className="w-full p-2 bg-gradient-to-br from-[#2d2d42] to-[#252538] shadow-lg cursor-pointer border-t border-white/10 flex items-center justify-center"
          onClick={() => setExpandedHistory(null)}
        >
          <div className="flex items-center gap-1">
            <IoIosArrowUp className="text-white" />
            <span className="text-sm text-white">Hide Details</span>
          </div>
        </div>
      </div>

      {/* Toggle Button for Collapsed State */}
      <div
        className={`w-full mt-2 p-2 bg-gradient-to-br from-[#2d2d42] to-[#252538] shadow-lg cursor-pointer rounded-lg border border-white/10 flex items-center justify-center ${expandedHistory === match?.key ? "hidden" : "block"}`}
        onClick={() => setExpandedHistory(match?.key)}
      >
        <div className="flex items-center gap-1">
          <IoIosArrowDown className="text-white" />
          <span className="text-sm text-white">Show Details</span>
        </div>
      </div>
    </motion.div>
  );
};

export default ModernMatchHistory;
