"use client";
import React, { useEffect, useState } from "react";
import moment from "moment";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import CardImage from "../../components/cardImage";
import ReactTltp from "../../components/tooltip/ReactTltp";
import { OptimizedImage } from "src/utils/imageOptimizer";

const MatchHistory = ({
  match,
  traits,
  champions,
  items,
  augments,
  forces,
  matchHistoryInfo,
  matchId,
}) => {
  const [expandedHistory, setExpandedHistory] = useState(null);

  useEffect(() => {
    if (matchId) {
      setExpandedHistory(matchId);
    }
  }, [matchId]);
  return (
    <div className=" mb-4">
      <div className="flex flex-col gap-[1px] border border-[#323232] bg-[#323232] bg-glass rounded-bl-xl rounded-br-xl">
        <header className="relative flex flex-col justify-between bg-[#222231] py-[5px] px-4 lg:min-h-[50px] lg:flex-row lg:items-center lg:py-[5px] lg:pr-[16px]">
          <div className="inline-flex flex-col flex-wrap gap-[8px] md:flex-row md:mt-0 items-center md:gap-[4px]">
            <img src={match?.info?.imageUrl} className="w-12" />
            <strong className="text-[16px] font-semibold text-center leading-none text-[#ffffff] md:mr-2">
              {match?.gameType}
            </strong>
            <span className="text-[14px] leading-none text-center text-[#999]">
              {moment(match?.dateTime).fromNow()} • {match?.duration}
            </span>
            <div className="flex justify-center items-center gap-x-1 ml-2">
              <img
                src="https://res.cloudinary.com/dg0cmj6su/image/upload/v1722934556/coin_6369589_wbb7uk.png"
                className="w-4"
              />
              <span className="text-[12px]"> {match?.info?.coins}</span>
            </div>
          </div>
          <div className="flex justify-center items-center">
            {match?.info?.traits
              ?.filter((trait) => trait?.numUnits > 1)
              ?.map((trait, i) => (
                <div className="">
                  <img
                    src={
                      traits
                        ?.find(
                          (t) =>
                            t?.key.toLowerCase() === trait?.name.toLowerCase()
                        )
                        ?.tiers.find((tier) => tier?.min >= trait?.numUnits)
                        ?.imageUrl
                    }
                    className="w-14"
                  />
                </div>
              ))}
          </div>
        </header>
        <div>
          <div
            className="flex flex-col bg-center bg-no-repeat mt-[-1px] rounded-bl-xl rounded-br-xl border-[1px] border-[#ffffff30] bg-[#222231]"
            // style={{
            //   backgroundImage: `url(${cardBg.src})`,
            //   backgroundSize: "cover",
            // }}
          >
            <div className="flex flex-col justify-between items-center bg-[#27282E] py-[16px] lg:flex-row lg:gap-[15px] lg:bg-transparent lg:py-[0px] xl:pr-[24px]">
              <div className="mb-[16px] lg:mb-0 lg:w-full lg:flex-shrink-0">
                <div className="md:flex flex-wrap justify-between items-center gap-2 py-2">
                  <div className="md:w-[5%] flex items-center justify-center relative flex-col ml-5">
                    <div className="relative flex flex-col justify-center items-center rounded-[20px] mx-auto">
                      <p className="mb-0 font-bold text-[36px] leading-none">
                        {match?.info?.placement}
                      </p>
                      <p className="mb-0 font-bold text-lg">Place</p>
                    </div>
                  </div>
                  <div className="md:w-[20%]">
                    <div className="flex flex-wrap items-center justify-center gap-1 mb-3 md:mb-0 bg-[#00000060] py-3 rounded-md">
                      {match?.info?.augments?.map((augment, i) => (
                        <div className="flex flex-col">
                          <img
                            src={
                              augments?.find((a) => a?.key === augment)
                                ?.imageUrl
                            }
                            className="md:w-16 w-12"
                            data-tooltip-id={augment}
                          />
                          <ReactTltp
                            variant="augment"
                            content={augments?.find((a) => a?.key === augment)}
                            id={augment}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="md:w-[70%]">
                    <div className="flex flex-wrap items-center justify-center gap-1">
                      {match?.info?.units?.slice(0, 7)?.map((unit, i) => (
                        <div className="flex flex-col">
                          <CardImage
                            src={champions?.find(
                              (champion) => champion?.key === unit?.key
                            )}
                            imgStyle="w-[68px] md:w-24"
                            identificationImageStyle="w=[16px] md:w-[32px]"
                            textStyle="text-[10px] md:text-[16px]"
                            forces={forces}
                          />
                          <div className="flex justify-center gap-x-1 items-center md:min-h-[32px] min-h-[24px]">
                            {unit?.items?.map((item, i) => (
                              <div>
                                <img
                                  src={
                                    items?.find((i) => i?.key === item)
                                      ?.imageUrl
                                  }
                                  className="w-[24px] md:w-[32px] rounded-lg !border !border-[#ffffff40] rounded-t-none border-t-0"
                                  data-tooltip-id={
                                    items?.find((i) => i?.key === item)
                                      ?.imageUrl
                                  }
                                />
                                <ReactTltp
                                  variant="item"
                                  content={items?.find((i) => i?.key === item)}
                                  id={
                                    items?.find((i) => i?.key === item)
                                      ?.imageUrl
                                  }
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                      {match?.info?.units?.length > 8 && (
                        <div>
                          <div
                            className="w-[72px] md:w-24 h-[72px] md:h-24 rounded-lg relative bg-[#00000040] !border !border-[#ffffff40] shadow-md hover:shadow-lg hover:-translate-y-[1px] cursor-pointer transition-all ease-in-out duration-300 flex items-center justify-center"
                            onClick={() =>
                              expandedHistory !== match?.key
                                ? setExpandedHistory(match?.key)
                                : setExpandedHistory(null)
                            }
                          >
                            <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 text-center text-2xl">
                              +{match?.info?.units?.length - 8}
                            </div>
                          </div>
                          <div className="flex justify-center items-center md:min-h-[32px] min-h-[24px]"></div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={`bg-glass md:mx-3 rounded-bl-xl rounded-br-xl`}>
        <div
          className={`overflow-scroll md:!overflow-auto  transition-all duration-500 ease-out ${expandedHistory === match?.key ? "max-h-expanded opacity-100" : "max-h-0 opacity-0"}`}
        >
          <div className="px-3 pt-4 w-[950px] md:w-full">
            {/* <div className="flex justify-between items-center">
                        <div className="w-[3%]">#</div>
                        <div className="w-[15%]">Summoner</div>
                        <div className="w-[7%]">Round</div>
                        <div className="w-[20%]">Augments</div>
                        <div className="w-[45%]">Champions</div>
                        <div className="w-[10%]">Stat</div>
                      </div> */}
            {matchHistoryInfo?.participants?.map((participant, i) => (
              <div className=" shadow-lg rounded-md mb-2">
                <div className="px-2 rounded-lg !border border-[#ffffff40] shadow-md">
                  <table className="w-full table-fixed border-collapse">
                    <tbody>
                      <tr>
                        {/* Placement Column (10%) */}
                        <td
                          style={{ width: "6%" }}
                          className="align-middle p-2"
                        >
                          <div
                            className={`rounded-lg !border border-[#ffffff40] p-2 py-0 shadow-lg w-fit ${
                              participant?.placement == 1
                                ? "text-[#3aedbd] border-[#3aedbd]"
                                : participant?.placement == 2
                                  ? "text-[#FBDB51] border-[#FBDB51]"
                                  : participant?.placement == 3
                                    ? "text-[#6eccff] border-[#6eccff]"
                                    : "text-white"
                            }`}
                          >
                            <div className="text-3xl p-2 text-center">
                              {participant?.placement}
                            </div>
                          </div>
                        </td>

                        {/* Participant Info Column (25%) */}
                        <td
                          style={{ width: "13%" }}
                          className="align-middle p-2"
                        >
                          <div className="flex items-center gap-x-2">
                            <div className="relative">
                              <img
                                src={participant?.imageUrl}
                                className="w-12 md:w-16"
                              />
                              <div className="absolute bottom-0 right-0 px-2 rounded-full bg-[#444] text-xs md:text-base">
                                {participant?.level}
                              </div>
                            </div>
                            <div className="flex flex-col">
                              <div className="text-sm md:text-lg truncate">
                                {participant?.name}
                              </div>
                              <div className="text-xs md:text-sm text-gray-300">
                                {matchHistoryInfo?.duration}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Augments & Traits Column (15%) */}
                        <td
                          style={{ width: "13%" }}
                          className="align-middle p-2"
                        >
                          <div className="flex flex-col gap-y-1 -z-10">
                            <div className="flex items-center gap-1 bg-[#00000020] rounded-md flex-wrap w-fit px-2">
                              {participant?.augments?.map((augment, i) => (
                                <>
                                  <img
                                    src={
                                      augments?.find((a) => a.key === augment)
                                        ?.imageUrl
                                    }
                                    className="w-10"
                                    data-tooltip-id={augment}
                                  />
                                  <ReactTltp
                                    variant="augment"
                                    content={augments?.find(
                                      (a) => a.key === augment
                                    )}
                                    id={augment}
                                  />
                                </>
                              ))}
                            </div>
                            <div className="flex items-center gap-1 bg-[#00000040] rounded-md flex-wrap w-fit px-2">
                              {participant?.traits
                                ?.slice(0, 2)
                                ?.map((trait, i) => (
                                  <>
                                    <OptimizedImage
                                      src={
                                        traits
                                          ?.find((t) => t.key === trait.name)
                                          ?.tiers.find(
                                            (tier) => tier.min >= trait.numUnits
                                          )?.imageUrl
                                      }
                                      alt={trait.name}
                                      width={40}
                                      height={40}
                                      className="w-10"
                                      data-tooltip-id={trait.name}
                                    />
                                    <ReactTltp
                                      variant="trait"
                                      content={traits?.find(
                                        (t) => t.key === trait.name
                                      )}
                                      id={trait.name}
                                    />
                                  </>
                                ))}
                              <div
                                className="w-8 h-8 bg-[#00000040] rounded-full !border !border-[#ffffff20] shadow-md hover:shadow-lg hover:-translate-y-[1px] cursor-pointer transition-all ease-in-out duration-300 flex items-center justify-center"
                                data-tooltip-id={participant?.name}
                              >
                                <span className="text-xs text-white py-2">
                                  +{participant?.traits?.length - 2}
                                </span>
                              </div>
                              <ReactTltp
                                content={participant?.traits}
                                id={participant?.name}
                                variant="otherTraits"
                              />
                            </div>
                          </div>
                        </td>

                        {/* Units & Items Column (50%) */}
                        <td
                          // style={{ width: "60%" }}
                          className="align-middle p-2"
                        >
                          <div className="flex flex-wrap items-center gap-x-1">
                            {participant?.units?.slice(0, 9)?.map((unit, i) => (
                              <div className="flex flex-col gap-y-0">
                                <CardImage
                                  src={champions?.find(
                                    (champion) => champion.key === unit.key
                                  )}
                                  imgStyle="w-[52px] md:w-[74px] 2xl:w-[92px]"
                                  identificationImageStyle="w-[12px] md:w-[16px]"
                                  textStyle="text-[8px] md:text-[12px]"
                                  forces={forces}
                                />
                                <div className="flex justify-center items-center">
                                  {unit?.items?.map((item, i) => (
                                    <div className="">
                                      <img
                                        src={
                                          items?.find((i) => i.key === item)
                                            ?.imageUrl
                                        }
                                        className="w-[16px] md:w-[24px] 2xl:w-[28px] rounded-lg !border !border-[#ffffff40] rounded-t-none border-t-0"
                                        data-tooltip-id={
                                          items?.find((i) => i.key === item)
                                            ?.imageUrl
                                        }
                                      />
                                      <ReactTltp
                                        variant="item"
                                        content={items?.find(
                                          (i) => i.key === item
                                        )}
                                        id={
                                          items?.find((i) => i.key === item)
                                            ?.imageUrl
                                        }
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
        {expandedHistory === match?.key ? (
          <div
            className="w-full p-0.5 bg-[#13131370] shadow-lg cursor-pointer rounded-bl-xl rounded-br-xl"
            onClick={() =>
              expandedHistory === match?.key ? setExpandedHistory(null) : null
            }
          >
            <IoIosArrowUp className="mx-auto text-center" size={16} />
          </div>
        ) : (
          <div
            className="w-full p-0.5 bg-[#13131370] shadow-lg cursor-pointer !border !border-[#ffffff40] hover:bg-[#00000080] transition-all duration-300 ease-in-out !border-t-0 rounded-bl-xl rounded-br-xl"
            onClick={() =>
              expandedHistory !== match?.key
                ? setExpandedHistory(match?.key)
                : null
            }
          >
            <IoIosArrowDown className="mx-auto text-center" size={16} />
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchHistory;
