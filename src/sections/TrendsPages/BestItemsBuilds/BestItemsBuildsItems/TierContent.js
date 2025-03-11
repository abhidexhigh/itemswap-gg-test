import { Fragment, useState } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import "../../../../../i18n";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import Comps from "../../../../data/compsNew.json";
import ReactTltp from "src/components/tooltip/ReactTltp";
import CardImage from "src/components/cardImage";

const TierCard = ({ cost, itemsData }) => {
  const { t } = useTranslation();
  const others = t("others");
  const {
    props: {
      pageProps: {
        dehydratedState: {
          queries: { data },
        },
      },
    },
  } = Comps;

  const { champions } = data?.refs;
  const { items } = data?.refs;
  const { forces } = data?.refs;
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  return (
    <Fragment>
      <div className="w-full bg-zinc-900 hidden md:block rounded-t-lg">
        <p className="text-center py-2 text-[#fff] text-[18px] mb-0">
          {others?.tier} {cost}
        </p>
      </div>
      <div className="w-full bg-zinc-900 rounded-b-lg overflow-hidden">
        <table className="w-full">
          <tbody>
            {itemsData.map((champion, index) => (
              <tr className="bg-[#1e293b] shadow-xl">
                <td className="text-center py-0">
                  <div className="flex pt-[8px] pr-0 pb-[4px] pl-[5px] justify-center gap-x-2 items-center mb-2">
                    <div className="flex flex-shrink-1 gap-[2px]">
                      <div className="flex flex-col relative">
                        <div className="flex justify-between gap-2">
                          <div className="shrink-1 flex gap-1">
                            <CardImage
                              src={champions?.find(
                                (c) => c?.key === champion?.key
                              )}
                              imgStyle="w-[96px] md:w-[96px]"
                              identificationImageStyle="w-[36px] md:w-[30px]"
                              textStyle="text-[10px] md:text-[16px]"
                              forces={forces}
                            />
                          </div>
                        </div>
                      </div>
                      {champion?.championItemPairStats[0]?.keys.map((item) => (
                        <div className="flex gap-[1px] items-center">
                          <div
                            className="relative overflow-hidden w-[62px] md:w-[44px]"
                            data-tooltip-id={item}
                          >
                            <Image
                              src={
                                items?.find((i) => i?.key === item)?.imageUrl
                              }
                              alt={"item"}
                              width={30}
                              height={30}
                              className="w-full border-[1px] rounded-lg border-[#ffffff60]"
                            />
                          </div>
                          <ReactTltp
                            variant="item"
                            id={item}
                            content={items?.find((i) => i?.key === item)}
                          />
                        </div>
                      ))}
                      {/* <div className="flex gap-[4px] items-center">
                        <div className="relative overflow-hidden">
                          <img src={indianWeapon.src} width={28} height={28} />
                        </div>
                      </div>
                      <div className="flex gap-[4px] items-center">
                        <div className="relative overflow-hidden">
                          <img src={indianWeapon.src} width={28} height={28} />
                        </div>
                      </div> */}
                    </div>
                    <button
                      className="flex pr-[5px] pl-2 md:pl-0 py-[17px] cursor-pointer"
                      onClick={() =>
                        isAccordionOpen === cost + "" + index
                          ? setIsAccordionOpen(null)
                          : setIsAccordionOpen(cost + "" + index)
                      }
                    >
                      {isAccordionOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
                    </button>
                  </div>
                  <table
                    className={`w-full table-fixed border-collapse mb-4 ${
                      isAccordionOpen !== cost + "" + index ? "hidden" : ""
                    }`}
                  >
                    <thead className="table-row-group w-full text-[11px] font-[400]">
                      <tr className="text-center text-[14px] font-[400]">
                        <th className="pt-[5.25px] pr-0 pb-[5.25px] pl-[5px] text-center bg-[#27282e] text-[#d0d0d0] whitespace-nowrap mt-1">
                          Best Items
                        </th>
                        <th className="pt-[5.25px] pr-0 pb-[5.25px] text-center bg-[#27282e] text-[#d0d0d0] whitespace-nowrap w-[22%]">
                          Avg
                        </th>
                        <th className="pt-[5.25px] pr-0 pb-[5.25px] pl-[5px] text-center bg-[#27282e] text-[#d0d0d0] whitespace-nowrap w-[22%]">
                          Pick%
                        </th>
                      </tr>
                    </thead>
                    <tbody className="table-row-group w-full text-[11px] font-[400]">
                      {champion?.championItemPairStats.map((item, index) => (
                        <tr className="text-center text-[11px] shadow-lg shadow-red-950 rounded-md font-[400]">
                          <td className="pt-[4px] pr-0 pb-[4px] pl-[5px] text-left text-[#d0d0d0] whitespace-nowrap">
                            <div className="flex justify-start items-center gap-[4px]">
                              {item?.keys.map((item) => (
                                <div className="rounded-lg overflow-hidden border-[1px] border-[#ffffff60]">
                                  <div
                                    className="relative overflow-hidden"
                                    data-tooltip-id={item}
                                  >
                                    <Image
                                      src={
                                        items?.find((i) => i?.key === item)
                                          ?.imageUrl
                                      }
                                      alt={"item"}
                                      width={30}
                                      height={30}
                                      className="w-[56px] md:w-[44px]"
                                    />
                                  </div>
                                  <ReactTltp
                                    variant="item"
                                    id={item}
                                    content={items?.find(
                                      (i) => i?.key === item
                                    )}
                                  />
                                </div>
                              ))}
                            </div>
                          </td>
                          <td
                            className={`w-[52px] text-center py-[6px] text-[14px] ${item?.avgPlacement < 4 ? "text-yellow-200" : "text-[#fff]"}`}
                          >
                            #{item?.avgPlacement.toFixed(2)}
                          </td>
                          <td className="w-[52px] text-center py-[6px] text-[14px] text-[#fff]">
                            {(item?.pickRate * 100).toFixed(2)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Fragment>
  );
};

export default TierCard;
