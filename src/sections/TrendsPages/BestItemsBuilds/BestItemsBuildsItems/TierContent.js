import { Fragment, useState, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import "../../../../../i18n";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import Comps from "../../../../data/compsNew.json";
import ReactTltp from "src/components/tooltip/ReactTltp";
import CardImage from "src/components/cardImage";
import { OptimizedImage } from "src/utils/imageOptimizer";

// Memoized single item component to prevent unnecessary re-renders
const ItemComponent = ({ item, items, isLarge = false }) => {
  const itemData = useMemo(
    () => items?.find((i) => i?.key === item),
    [items, item]
  );

  if (!itemData) return null;

  return (
    <div
      className={
        isLarge
          ? "flex-shrink-0"
          : "rounded-lg overflow-hidden border-[1px] border-[#ffffff60] hover:border-[#ffffff90] transition-all duration-300 group"
      }
    >
      <div
        className={`relative overflow-hidden ${isLarge ? "w-[60px] md:w-[36px] group" : ""}`}
        data-tooltip-id={item}
      >
        <OptimizedImage
          src={itemData.imageUrl}
          alt={"item"}
          width={30}
          height={30}
          loading="lazy"
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEX///+/v7+jQ3Y5AAAADklEQVQI12P4AIX8EAgALgAD/aNpbtEAAAAASUVORK5CYII"
          className={
            isLarge
              ? "w-full border-[1px] rounded-lg border-[#ffffff60] hover:border-[#ffffff90] transition-all duration-300 shadow-md group-hover:scale-105"
              : "w-[56px] md:w-[44px] group-hover:scale-105 transition-transform duration-300 shadow-md"
          }
        />
      </div>
      <ReactTltp variant="item" id={item} content={itemData} />
    </div>
  );
};

// Memoized accordion content row
const AccordionContentRow = ({ item, itemIndex, items, others }) => {
  return (
    <tr
      key={itemIndex}
      className="text-center text-[11px] shadow-lg rounded-md font-[400] hover:bg-[#1e293b] transition-all duration-200 border-b border-[#ffffff08] last:border-b-0"
    >
      <td className="pt-[6px] pr-0 pb-[6px] pl-[8px] text-left text-[#d0d0d0] whitespace-nowrap">
        <div className="flex justify-start items-center gap-[6px]">
          {item?.keys.map((itemKey, keyIndex) => (
            <ItemComponent
              key={keyIndex}
              item={itemKey}
              items={items}
              isLarge={false}
            />
          ))}
        </div>
      </td>
      <td
        className={`w-[52px] text-center py-[8px] text-base md:text-sm font-medium ${
          item?.avgPlacement < 4 ? "text-yellow-300" : "text-[#fff]"
        }`}
      >
        #{item?.avgPlacement.toFixed(2)}
      </td>
      <td className="w-[52px] text-center py-[8px] text-base md:text-sm text-[#fff] font-medium">
        {(item?.pickRate).toFixed(2)}%
      </td>
    </tr>
  );
};

// Memoized main champion row
const ChampionRowContent = ({
  champion,
  index,
  cost,
  champions,
  items,
  forces,
  others,
  openAccordions,
  toggleAccordion,
}) => {
  const accordionId = cost + "" + index;
  const isOpen = openAccordions.has(accordionId);

  // Memoize champion lookup
  const championData = useMemo(
    () => champions?.find((c) => c?.key === champion?.key),
    [champions, champion?.key]
  );

  // Memoize top items
  const topItems = useMemo(
    () => champion?.championItemPairStats[0]?.keys?.slice(0, 3) || [],
    [champion?.championItemPairStats]
  );

  return (
    <tr className="bg-[#1e293b] shadow-xl hover:bg-[#283548] transition-all duration-300 border-b border-[#ffffff10]">
      <td className="text-center py-0">
        <div className="flex pt-[10px] pr-[5px] pb-[6px] pl-[8px] justify-between items-center mb-2">
          <div className="flex items-center gap-[8px]">
            <div className="flex-shrink-0">
              <CardImage
                src={championData}
                forces={forces}
                imgStyle="w-[68px] md:w-[84px]"
                identificationImageStyle="w=[16px] md:w-[32px]"
                textStyle="text-[10px] md:text-[16px] hidden"
                cardSize="!w-[96px] !h-[96px] md:!w-[86px] md:!h-[86px]"
              />
            </div>

            <div className="flex flex-wrap gap-[4px] items-center max-w-[220px] md:max-w-[220px]">
              {topItems.map((item, idx) => (
                <ItemComponent
                  key={idx}
                  item={item}
                  items={items}
                  isLarge={true}
                />
              ))}
            </div>
          </div>

          <button
            className="flex-shrink-0 text-white hover:text-blue-400 transition-colors duration-300 bg-[#1a1a2e] hover:bg-[#252547] rounded-full w-10 h-10 flex items-center justify-center"
            onClick={() => toggleAccordion(accordionId)}
          >
            {isOpen ? (
              <IoIosArrowUp className="text-xl" />
            ) : (
              <IoIosArrowDown className="text-xl" />
            )}
          </button>
        </div>
        {isOpen && (
          <div className="transition-all duration-500 ease-in-out transform origin-top">
            <table
              className={`w-full table-fixed border-collapse ${
                !isOpen ? "hidden" : ""
              }`}
            >
              <thead className="table-row-group w-full text-[11px] font-[400]">
                <tr className="text-center text-[16px] font-[500]">
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
                {champion?.championItemPairStats.map((item, itemIndex) => (
                  <AccordionContentRow
                    key={itemIndex}
                    item={item}
                    itemIndex={itemIndex}
                    items={items}
                    others={others}
                  />
                ))}
              </tbody>
            </table>
            <div
              className="w-full hover:text-blue-400 transition-colors duration-300 bg-[#1a1a2e] text-center hover:bg-[#252547] rounded-full flex items-center justify-center"
              onClick={() => toggleAccordion(accordionId)}
            >
              {isOpen ? (
                <IoIosArrowUp className="text-xl" />
              ) : (
                <IoIosArrowDown className="text-xl" />
              )}
            </div>
          </div>
        )}
      </td>
    </tr>
  );
};

const TierCard = ({ cost, itemsData }) => {
  const { t } = useTranslation();
  const others = t("others");

  // Memoize data extraction from Comps
  const { champions, items, forces } = useMemo(() => {
    const data = Comps?.props?.pageProps?.dehydratedState?.queries?.data?.refs;
    return {
      champions: data?.champions || [],
      items: data?.items || [],
      forces: data?.forces || [],
    };
  }, []);

  const [openAccordions, setOpenAccordions] = useState(new Set());

  const toggleAccordion = useCallback((accordionId) => {
    setOpenAccordions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(accordionId)) {
        newSet.delete(accordionId);
      } else {
        newSet.add(accordionId);
      }
      return newSet;
    });
  }, []);

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
              <ChampionRowContent
                key={index}
                champion={champion}
                index={index}
                cost={cost}
                champions={champions}
                items={items}
                forces={forces}
                others={others}
                openAccordions={openAccordions}
                toggleAccordion={toggleAccordion}
              />
            ))}
          </tbody>
        </table>
      </div>
    </Fragment>
  );
};

export default TierCard;
