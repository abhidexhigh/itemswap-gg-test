import { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";
import "../../../../../i18n";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import Comps from "../../../../data/compsNew.json";
import ReactTltp from "src/components/tooltip/ReactTltp";
import CardImage from "src/components/cardImage";
import { OptimizedImage } from "src/utils/imageOptimizer";

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
  const [openAccordions, setOpenAccordions] = useState(new Set());

  const toggleAccordion = (accordionId) => {
    setOpenAccordions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(accordionId)) {
        newSet.delete(accordionId);
      } else {
        newSet.add(accordionId);
      }
      return newSet;
    });
  };

  return (
    <Fragment>
      <div className="w-full bg-gradient-to-r from-[#1e293b] to-[#1a1a2e] hidden md:block rounded-t-lg border-b border-[#ffffff20]">
        <p className="text-center py-3 text-[#fff] text-[18px] font-semibold mb-0 tracking-wide">
          {others?.tier} {cost}
        </p>
      </div>
      <div className="w-full bg-[#0f172a] rounded-b-lg overflow-hidden">
        <table className="w-full">
          <tbody>
            {itemsData.map((champion, index) => (
              <tr
                key={index}
                className="bg-[#1e293b] shadow-xl hover:bg-[#283548] transition-all duration-300 border-b border-[#ffffff10]"
              >
                <td className="text-center py-0">
                  <div className="flex pt-[10px] pr-[5px] pb-[6px] pl-[8px] justify-between items-center mb-2">
                    <div className="flex items-center gap-[8px]">
                      <div className="flex-shrink-0">
                        <CardImage
                          src={champions?.find((c) => c?.key === champion?.key)}
                          imgStyle="w-[96px] md:w-[64px] rounded-lg border-2 border-[#ffffff30] shadow-lg hover:border-[#ffffff50] transition-all duration-300"
                          cardSize="w-[96px] md:w-[86px]"
                          identificationImageStyle="!w-[36px] md:!w-[30px]"
                          textStyle="text-[10px] md:text-[16px] font-medium"
                          forces={forces}
                        />
                      </div>

                      <div className="flex flex-wrap gap-[4px] items-center max-w-[180px] md:max-w-[220px]">
                        {champion?.championItemPairStats[0]?.keys
                          .slice(0, 3)
                          .map((item, idx) => (
                            <div key={idx} className="flex-shrink-0">
                              <div
                                className="relative overflow-hidden w-[56px] md:w-[36px] group"
                                data-tooltip-id={item}
                              >
                                <OptimizedImage
                                  src={
                                    items?.find((i) => i?.key === item)
                                      ?.imageUrl
                                  }
                                  alt={"item"}
                                  width={30}
                                  height={30}
                                  loading="lazy"
                                  placeholder="blur"
                                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEX///+/v7+jQ3Y5AAAADklEQVQI12P4AIX8EAgALgAD/aNpbtEAAAAASUVORK5CYII"
                                  className="w-full border-[1px] rounded-lg border-[#ffffff60] hover:border-[#ffffff90] transition-all duration-300 shadow-md group-hover:scale-105"
                                />
                              </div>
                              <ReactTltp
                                variant="item"
                                id={item}
                                content={items?.find((i) => i?.key === item)}
                              />
                            </div>
                          ))}
                      </div>
                    </div>

                    <button
                      className="flex-shrink-0 text-white hover:text-blue-400 transition-colors duration-300 bg-[#1a1a2e] hover:bg-[#252547] rounded-full w-10 h-10 flex items-center justify-center"
                      onClick={() => toggleAccordion(cost + "" + index)}
                    >
                      {openAccordions.has(cost + "" + index) ? (
                        <IoIosArrowUp className="text-xl" />
                      ) : (
                        <IoIosArrowDown className="text-xl" />
                      )}
                    </button>
                  </div>
                  {openAccordions.has(cost + "" + index) && (
                    <div className="transition-all duration-500 ease-in-out transform origin-top">
                      <table
                        className={`w-full table-fixed border-collapse ${
                          !openAccordions.has(cost + "" + index) ? "hidden" : ""
                        }`}
                      >
                        <thead className="table-row-group w-full text-[11px] font-[400]">
                          <tr className="text-center text-[14px] font-[500]">
                            <th className="pt-[6px] pr-0 pb-[6px] pl-[8px] text-center bg-[#1e1e24] text-[#d0d0d0] whitespace-nowrap mt-1 rounded-tl-md">
                              {others?.bestItems}
                            </th>
                            <th className="pt-[6px] pr-0 pb-[6px] text-center bg-[#1e1e24] text-[#d0d0d0] whitespace-nowrap w-[22%]">
                              {others?.avg}
                            </th>
                            <th className="pt-[6px] pr-0 pb-[6px] pl-[5px] text-center bg-[#1e1e24] text-[#d0d0d0] whitespace-nowrap w-[22%] rounded-tr-md">
                              {others?.pickPercentage}
                            </th>
                          </tr>
                        </thead>
                        <tbody className="table-row-group w-full text-[11px] font-[400]">
                          {champion?.championItemPairStats.map(
                            (item, itemIndex) => (
                              <tr
                                key={itemIndex}
                                className="text-center text-[11px] shadow-lg rounded-md font-[400] hover:bg-[#1e293b] transition-all duration-200 border-b border-[#ffffff08] last:border-b-0"
                              >
                                <td className="pt-[6px] pr-0 pb-[6px] pl-[8px] text-left text-[#d0d0d0] whitespace-nowrap">
                                  <div className="flex justify-start items-center gap-[6px]">
                                    {item?.keys.map((itemKey, keyIndex) => (
                                      <div
                                        key={keyIndex}
                                        className="rounded-lg overflow-hidden border-[1px] border-[#ffffff60] hover:border-[#ffffff90] transition-all duration-300 group"
                                      >
                                        <div
                                          className="relative overflow-hidden"
                                          data-tooltip-id={itemKey}
                                        >
                                          <OptimizedImage
                                            src={
                                              items?.find(
                                                (i) => i?.key === itemKey
                                              )?.imageUrl
                                            }
                                            alt={"item"}
                                            width={30}
                                            height={30}
                                            loading="lazy"
                                            placeholder="blur"
                                            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEX///+/v7+jQ3Y5AAAADklEQVQI12P4AIX8EAgALgAD/aNpbtEAAAAASUVORK5CYII"
                                            className="w-[56px] md:w-[44px] group-hover:scale-105 transition-transform duration-300 shadow-md"
                                          />
                                        </div>
                                        <ReactTltp
                                          variant="item"
                                          id={itemKey}
                                          content={items?.find(
                                            (i) => i?.key === itemKey
                                          )}
                                        />
                                      </div>
                                    ))}
                                  </div>
                                </td>
                                <td
                                  className={`w-[52px] text-center py-[8px] text-[14px] font-medium ${
                                    item?.avgPlacement < 4
                                      ? "text-yellow-300"
                                      : "text-[#fff]"
                                  }`}
                                >
                                  #{item?.avgPlacement.toFixed(2)}
                                </td>
                                <td className="w-[52px] text-center py-[8px] text-[14px] text-[#fff] font-medium">
                                  {(item?.pickRate * 100).toFixed(2)}%
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                      <div
                        className="w-full hover:text-blue-400 transition-colors duration-300 bg-[#1a1a2e] text-center hover:bg-[#252547] rounded-full flex items-center justify-center"
                        onClick={() => toggleAccordion(cost + "" + index)}
                      >
                        {openAccordions.has(cost + "" + index) ? (
                          <IoIosArrowUp className="text-xl" />
                        ) : (
                          <IoIosArrowDown className="text-xl" />
                        )}
                      </div>
                    </div>
                  )}
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
