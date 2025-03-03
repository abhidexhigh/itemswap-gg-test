import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import "../../../i18n";
import ItemsStyleWrapper from "./Items.style.js";
import Set10Tabs from "../set10Tabs/index.js";
import { FaPlus, FaEquals } from "react-icons/fa";
import itemsData from "./items.json";
import ItemTable from "./ItemTable.jsx";
import itemsData1 from "../../data/newData/items.json";
import ReactTltp from "src/components/tooltip/ReactTltp.jsx";

const Items = () => {
  const { t } = useTranslation();
  const others = t("others");
  const [hoverIndex, setHoverIndex] = useState(null);
  const [tableHover, setTableHover] = useState(false);
  const [space1, setSpace1] = useState(null);
  const [space2, setSpace2] = useState(null);
  console.log(itemsData);
  const [activeTab, setActiveTab] = useState("Items");
  const tabs = ["Comps", "Champions", "Traits", "Items"];

  const tooltipData = {
    title: "Lillia",
    mana: {
      current: 70,
      max: 130,
    },
    abilities: [
      {
        name: "Magic Damage",
        values: [180, 270, 400],
      },
      {
        name: "Heal Amount",
        values: [180, 220, 260],
      },
      {
        name: "Ally Heal Amount",
        values: [90, 110, 130],
      },
    ],
  };

  return (
    <ItemsStyleWrapper>
      <div className="container">
        {/* <Set10Tabs
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        /> */}
        <div className="flex flex-col gap-y-[48px] overflow-hidden">
          <article className="flex flex-col gap-y-[8px]">
            <div className="flex items-center gap-[8px] bg-gradient-to-r from-[#2d2f3710] via-[#2d2f37] to-[#2d2f3710] rounded-md py-2 pl-2">
              <div className="h-[32px] w-full text-center mb-0 leading-[32px] text-[#fff] font-bold text-[28px]">
                {others?.itemRecipes}
              </div>
            </div>
            <div
              style={{
                background: "rgba(0, 0, 0, 0.3)",
                boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(35, 31, 31, 0.3)",
              }}
              className="flex p-[16px] justify-center flex-col gap-y-[16px] rounded-md"
            >
              <div className="flex gap-[8px] items-center justify-center">
                <div className="w-[48px] h-[48px] md:w-[72px] md:h-[72px] rounded-[50%] overflow-hidden #363944 bg-[#0d0d0d] border-[1px] border-[#ffffff50]">
                  {space1 && (
                    <button
                      className="w-[48px] h-[48px] md:w-[72px] md:h-[72px] rounded-[50%] overflow-hidden"
                      onClick={() => setSpace1(null)}
                    >
                      <div
                        className="relative overflow-hidden"
                        data-tooltip-id={space1?.key}
                      >
                        <Image
                          alt="ItemImage"
                          width={100}
                          height={100}
                          src={space1?.imageUrl}
                          className="w-full h-full"
                        />
                      </div>
                      <ReactTltp
                        key={space1?.key}
                        id={space1?.key}
                        content={space1?.name}
                      />
                    </button>
                  )}
                </div>
                <FaPlus className="text-[#ca9372]" />
                <div className="w-[48px] h-[48px] md:w-[72px] md:h-[72px] rounded-[50%] overflow-hidden #363944 bg-[#0d0d0d] border-[1px] border-[#ffffff50]">
                  {space2 && (
                    <button
                      className="w-[48px] h-[48px] md:w-[72px] md:h-[72px] rounded-[50%] overflow-hidden"
                      onClick={() => setSpace2(null)}
                    >
                      <div
                        className="relative overflow-hidden"
                        data-tooltip-id={space2?.key}
                      >
                        <Image
                          alt="ItemImage"
                          width={100}
                          height={100}
                          src={space2?.imageUrl}
                          className="w-full h-full"
                        />
                      </div>
                      <ReactTltp
                        key={space2?.key}
                        id={space2?.key}
                        content={space2?.name}
                      />
                    </button>
                  )}
                </div>
                <FaEquals className="text-[#ca9372]" />
                <div className="w-[48px] h-[48px] md:w-[72px] md:h-[72px] rounded-[10px] overflow-hidden #363944 bg-[#0d0d0d] border-[1px] border-[#ffffff50]">
                  {space1 && space2 && (
                    <button
                      className="w-[48px] h-[48px] md:w-[72px] md:h-[72px] rounded-[50%] overflow-hidden"
                      onClick={() => {
                        setSpace1(null);
                        setSpace2(null);
                      }}
                    >
                      <div
                        className="relative overflow-hidden"
                        data-tooltip-id={
                          space1?.key === space2?.key
                            ? itemsData1.filter(
                                (item) =>
                                  item?.compositions?.length === 2 &&
                                  item?.compositions?.every(
                                    (comp) => comp === space1?.key
                                  )
                              )[0]?.imageUrl
                            : itemsData1.find(
                                (item) =>
                                  item.compositions?.includes(space1?.key) &&
                                  item.compositions?.includes(space2?.key)
                              )?.key
                        }
                      >
                        <Image
                          alt="ItemImage"
                          width={100}
                          height={100}
                          src={
                            space1?.key === space2?.key
                              ? itemsData1.filter(
                                  (item) =>
                                    item?.compositions?.length === 2 &&
                                    item?.compositions?.every(
                                      (comp) => comp === space1?.key
                                    )
                                )[0]?.imageUrl
                              : itemsData1.find(
                                  (item) =>
                                    item.compositions?.includes(space1?.key) &&
                                    item.compositions?.includes(space2?.key)
                                )?.imageUrl
                          }
                          className="w-[48px] h-[48px] md:w-[72px] md:h-[72px]"
                        />
                      </div>
                      <ReactTltp
                        key={
                          space1?.key === space2?.key
                            ? itemsData1.filter(
                                (item) =>
                                  item?.compositions?.length === 2 &&
                                  item?.compositions?.every(
                                    (comp) => comp === space1?.key
                                  )
                              )[0]?.imageUrl
                            : itemsData1.find(
                                (item) =>
                                  item.compositions?.includes(space1?.key) &&
                                  item.compositions?.includes(space2?.key)
                              )?.key
                        }
                        id={
                          space1?.key === space2?.key
                            ? itemsData1.filter(
                                (item) =>
                                  item?.compositions?.length === 2 &&
                                  item?.compositions?.every(
                                    (comp) => comp === space1?.key
                                  )
                              )[0]?.imageUrl
                            : itemsData1.find(
                                (item) =>
                                  item.compositions?.includes(space1?.key) &&
                                  item.compositions?.includes(space2?.key)
                              )?.key
                        }
                        content={
                          space1?.key === space2?.key
                            ? itemsData1.filter(
                                (item) =>
                                  item?.compositions?.length === 2 &&
                                  item?.compositions?.every(
                                    (comp) => comp === space1?.key
                                  )
                              )[0]?.imageUrl
                            : itemsData1.find(
                                (item) =>
                                  item.compositions?.includes(space1?.key) &&
                                  item.compositions?.includes(space2?.key)
                              )?.name
                        }
                      />
                    </button>
                  )}
                </div>
              </div>
              <div className="flex gap-x-[8px] gap-y-[10px] justify-center items-center flex-wrap">
                {itemsData1
                  .filter((item) => item?.isFromItem)
                  .map((item, index) => (
                    <button
                      className="w-[48px] h-[48px] md:w-[84px] md:h-[84px] rounded-[50%] overflow-hidden  hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-in-out"
                      onClick={() => {
                        if (space1 === null) {
                          setSpace1({
                            key: item?.key,
                            imageUrl: item?.imageUrl,
                          });
                        } else if (space2 === null) {
                          setSpace2({
                            key: item?.key,
                            imageUrl: item?.imageUrl,
                          });
                        }
                      }}
                    >
                      <div
                        className="relative overflow-hidden"
                        data-tooltip-id={item?.key}
                      >
                        <Image
                          alt="ItemImage"
                          width={100}
                          height={100}
                          src={item?.imageUrl}
                          className={`w-full h-full ${
                            space1 && space2 ? "opacity-[0.5]" : ""
                          }`}
                        />
                      </div>
                      <ReactTltp
                        key={item?.key}
                        id={item?.key}
                        content={item?.name}
                      />
                    </button>
                  ))}
              </div>
            </div>
            {!space1 ? (
              <div
                className="grid grid-cols-1 min-h-[114px] bg-[#27282e] border border-[#323232] p-[16px]"
                style={{
                  background: "rgba(0, 0, 0, 0.3)",
                  boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
                  backdropFilter: "blur(2px)",
                  border: "1px solid rgba(35, 31, 31, 0.3)",
                }}
              >
                <div className="flex justify-center items-center text-[18px] text-[#ffffff95]">
                  {others?.chooseItems}
                </div>
              </div>
            ) : (
              <div
                className="grid grid-cols-1 min-h[114px] bg-[#27282e] border border-[#323232] p-[16px]"
                style={{
                  background: "rgba(0, 0, 0, 0.3)",
                  boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
                  backdropFilter: "blur(2px)",
                  border: "1px solid rgba(35, 31, 31, 0.3)",
                }}
              >
                <div className="md:grid-cols-4 grid gap-y-[16px]">
                  {itemsData1
                    .filter((item) => item.compositions?.includes(space1?.key))
                    .map((item) => (
                      <div className="flex gap-x-[4px] items-center justify-center">
                        <div className="rounded-[50%] overflow-hidden">
                          <div
                            className="relative overflow-hidden"
                            data-tooltip-id={space1?.key}
                          >
                            <Image
                              alt="ItemImage"
                              width={100}
                              height={100}
                              src={space1?.imageUrl}
                              className="w-[48px] h-[48px] md:w-[64px] md:h-[64px]"
                            />
                          </div>
                          <ReactTltp
                            key={space1?.key}
                            id={space1?.key}
                            content={space1?.name}
                          />
                        </div>
                        <FaPlus className="text-[#ca9372]" />
                        <div className="rounded-[50%] overflow-hidden">
                          <div
                            className="relative overflow-hidden"
                            data-tooltip-id={
                              item?.compositions?.find((i) => i !== space1?.key)
                                ? itemsData1?.find(
                                    (i) =>
                                      i?.key ===
                                      item?.compositions?.find(
                                        (i) => i !== space1?.key
                                      )
                                  )?.key
                                : space1?.key
                            }
                          >
                            <Image
                              alt="ItemImage"
                              width={100}
                              height={100}
                              src={
                                item?.compositions?.find(
                                  (i) => i !== space1?.key
                                )
                                  ? itemsData1?.find(
                                      (i) =>
                                        i?.key ===
                                        item?.compositions?.find(
                                          (i) => i !== space1?.key
                                        )
                                    )?.imageUrl
                                  : space1?.imageUrl
                              }
                              className="w-[48px] h-[48px] md:w-[64px] md:h-[64px]"
                            />
                          </div>
                          <ReactTltp
                            key={
                              item?.compositions?.find((i) => i !== space1?.key)
                                ? itemsData1?.find(
                                    (i) =>
                                      i?.key ===
                                      item?.compositions?.find(
                                        (i) => i !== space1?.key
                                      )
                                  )?.key
                                : space1?.key
                            }
                            id={
                              item?.compositions?.find((i) => i !== space1?.key)
                                ? itemsData1?.find(
                                    (i) =>
                                      i?.key ===
                                      item?.compositions?.find(
                                        (i) => i !== space1?.key
                                      )
                                  )?.key
                                : space1?.key
                            }
                            content={
                              item?.compositions?.find((i) => i !== space1?.key)
                                ? itemsData1?.find(
                                    (i) =>
                                      i?.key ===
                                      item?.compositions?.find(
                                        (i) => i !== space1?.key
                                      )
                                  )?.name
                                : space1?.name
                            }
                          />
                        </div>
                        <FaEquals className="text-[#ca9372]" />
                        <div className="rounded-[10px] overflow-hidden">
                          <div
                            className="relative overflow-hidden"
                            data-tooltip-id={item?.key}
                          >
                            <Image
                              alt="ItemImage"
                              width={100}
                              height={100}
                              src={item?.imageUrl}
                              className="w-[48px] h-[48px] md:w-[64px] md:h-[64px]"
                            />
                          </div>
                          <ReactTltp
                            key={item?.key}
                            id={item?.key}
                            content={item?.name}
                          />
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </article>
          {/* <article className="flex flex-col gap-y-[16px]">
            <h5 className="h-[32px] mb-0 leading-[32px] text-[#fff] font-light text-[24px]">
              Items Table
            </h5>
            <div className="py-[20px] px-0 bg-[#27282e] border border-[#323232] flex flex-col gap-[10px]">
              <div className="flex overflow-auto flex-col">
                <div className="flex py-0 px-[0.25rem] justify-end invisible"></div>
                <div className="min-w-[392px] relative self-stretch pb-[20px]">
                  <div className="flex">
                    <div className="relative my-0 mx-auto">
                      <table
                        className="table-fixed group"
                        onMouseEnter={() => setTableHover(true)}
                        onMouseLeave={() => setTableHover(false)}
                      >
                        <tbody>
                          {items.map((item, rowIndex) => (
                            <tr key={rowIndex}>
                              <td className="pb-[8px] pr-[8px]"></td>
                              {items.map((item, colIndex) => (
                                <td
                                  className="pb-[8px] pr-[8px]"
                                  key={colIndex}
                                  onMouseEnter={() =>
                                    setHoverIndex({ rowIndex, colIndex })
                                  }
                                  onMouseLeave={() => setHoverIndex(null)}
                                >
                                  <div className="relative">
                                    <div className="relative">
                                      {rowIndex !== 0 && colIndex !== 0 ? (
                                        <>
                                          {hoverIndex?.rowIndex === rowIndex &&
                                          hoverIndex?.colIndex === colIndex ? (
                                            <GlobalTooltip
                                              title="Deathblade"
                                              desc="Deal 8% bonus damage"
                                              subDesc="+55% attack damage"
                                            >
                                              <Image alt="ItemImage" width={100} height={100}
                                                src={item}
                                                className={`w-[40px] h-[40px] rounded-[8px] transition-all duration-300 ${
                                                  hoverIndex === null
                                                    ? "opacity-100"
                                                    : ""
                                                } ${
                                                  hoverIndex !== null &&
                                                  hoverIndex?.rowIndex !==
                                                    rowIndex &&
                                                  hoverIndex?.colIndex !==
                                                    colIndex
                                                    ? "grayscale opacity-40"
                                                    : ""
                                                } ${
                                                  hoverIndex !== null &&
                                                  hoverIndex?.rowIndex ===
                                                    rowIndex &&
                                                  hoverIndex?.colIndex ===
                                                    colIndex
                                                    ? "opacity-100"
                                                    : "opacity-40"
                                                }`}
                                              />
                                            </GlobalTooltip>
                                          ) : (
                                            <Image alt="ItemImage" width={100} height={100}
                                              src={item}
                                              className={`w-[40px] h-[40px] rounded-[8px] transition-all duration-300 ${
                                                hoverIndex === null
                                                  ? "opacity-100"
                                                  : ""
                                              } ${
                                                hoverIndex !== null &&
                                                hoverIndex?.rowIndex !==
                                                  rowIndex &&
                                                hoverIndex?.colIndex !==
                                                  colIndex
                                                  ? "grayscale opacity-40"
                                                  : ""
                                              } ${
                                                hoverIndex !== null &&
                                                hoverIndex?.rowIndex ===
                                                  rowIndex &&
                                                hoverIndex?.colIndex ===
                                                  colIndex
                                                  ? "opacity-100"
                                                  : "opacity-40"
                                              }`}
                                            />
                                          )}
                                        </>
                                      ) : (
                                        <></>
                                      )}
                                    </div>
                                  </div>
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article> */}

          <article className="flex flex-col gap-y-[8px]">
            <div className="bg-gradient-to-r from-[#2d2f3710] via-[#2d2f37] to-[#2d2f3710] py-2 pl-2">
              <div className="h-[32px] mb-0 leading-[32px] w-full text-center text-[#fff] font-bold text-[28px]">
                {others?.itemTable}
              </div>
            </div>
            <div
              style={{
                background: "rgba(0, 0, 0, 0.3)",
                boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
                backdropFilter: "blur(2px)",
                border: "1px solid rgba(35, 31, 31, 0.3)",
              }}
              className="py-[20px] px-0 flex flex-col gap-[10px] rounded-md"
            >
              <div className="flex overflow-auto flex-col">
                <div className="flex py-0 px-[0.25rem] justify-end invisible"></div>
                <div className="relative self-stretch pb-[20px]">
                  <div className="flex">
                    <div className="relative my-0 md:mx-auto">
                      {console.log(itemsData)}
                      <ItemTable itemsData={itemsData} />
                      {/* <table className="table-fixed group">
                        <tbody>
                          <tr>
                            <td className="pb-[8px] pr-[8px]" id="v_0_h_0"></td>
                            <td className="pb-[8px] pr-[8px]" id="v_0_h_1">
                              <div className="relative">
                                <div className="relative">
                                  <Image alt="ItemImage" width={100} height={100}
                                    src={itemsData[0].imageUrl}
                                    className={`w-[40px] h-[40px] rounded-[8px] transition-all duration-300`}
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="pb-[8px] pr-[8px]" id="v_0_h_2">
                              <div className="relative">
                                <div className="relative">
                                  <Image alt="ItemImage" width={100} height={100}
                                    src={itemsData[1].imageUrl}
                                    className={`w-[40px] h-[40px] rounded-[8px] transition-all duration-300`}
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="pb-[8px] pr-[8px]" id="v_0_h_3">
                              <div className="relative">
                                <div className="relative">
                                  <Image alt="ItemImage" width={100} height={100}
                                    src={itemsData[2].imageUrl}
                                    className={`w-[40px] h-[40px] rounded-[8px] transition-all duration-300`}
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="pb-[8px] pr-[8px]" id="v_0_h_4">
                              <div className="relative">
                                <div className="relative">
                                  <Image alt="ItemImage" width={100} height={100}
                                    src={itemsData[3].imageUrl}
                                    className={`w-[40px] h-[40px] rounded-[8px] transition-all duration-300`}
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="pb-[8px] pr-[8px]" id="v_0_h_5">
                              <div className="relative">
                                <div className="relative">
                                  <Image alt="ItemImage" width={100} height={100}
                                    src={itemsData[4].imageUrl}
                                    className={`w-[40px] h-[40px] rounded-[8px] transition-all duration-300`}
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="pb-[8px] pr-[8px]" id="v_0_h_6">
                              <div className="relative">
                                <div className="relative">
                                  <Image alt="ItemImage" width={100} height={100}
                                    src={itemsData[5].imageUrl}
                                    className={`w-[40px] h-[40px] rounded-[8px] transition-all duration-300`}
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="pb-[8px] pr-[8px]" id="v_0_h_7">
                              <div className="relative">
                                <div className="relative">
                                  <Image alt="ItemImage" width={100} height={100}
                                    src={itemsData[6].imageUrl}
                                    className={`w-[40px] h-[40px] rounded-[8px] transition-all duration-300`}
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="pb-[8px] pr-[8px]" id="v_0_h_8">
                              <div className="relative">
                                <div className="relative">
                                  <Image alt="ItemImage" width={100} height={100}
                                    src={itemsData[7].imageUrl}
                                    className={`w-[40px] h-[40px] rounded-[8px] transition-all duration-300`}
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="pb-[8px] pr-[8px]" id="v_0_h_9">
                              <div className="relative">
                                <div className="relative">
                                  <Image alt="ItemImage" width={100} height={100}
                                    src={itemsData[8].imageUrl}
                                    className={`w-[40px] h-[40px] rounded-[8px] transition-all duration-300`}
                                  />
                                </div>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td className="pb-[8px] pr-[8px]" id="v_1_h_0">
                              <div className="relative">
                                <div className="relative">
                                  <Image alt="ItemImage" width={100} height={100}
                                    src={itemsData[9].imageUrl}
                                    className={`w-[40px] h-[40px] rounded-[8px] transition-all duration-300`}
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="pb-[8px] pr-[8px]" id="v_1_h_1">
                              <div className="relative">
                                <div className="relative">
                                  <Image alt="ItemImage" width={100} height={100}
                                    src={itemsData[10].imageUrl}
                                    className={`w-[40px] h-[40px] rounded-[8px] transition-all duration-300`}
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="pb-[8px] pr-[8px]" id="v_1_h_2">
                              <div className="relative">
                                <div className="relative">
                                  <Image alt="ItemImage" width={100} height={100}
                                    src={itemsData[11].imageUrl}
                                    className="w-[40px] h-[40px] rounded-[8px] transition-all duration-300"
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="pb-[8px] pr-[8px]" id="v_1_h_3">
                              <div className="relative">
                                <div className="relative">
                                  <Image alt="ItemImage" width={100} height={100}
                                    src={itemsData[12].imageUrl}
                                    className="w-[40px] h-[40px] rounded-[8px] transition-all duration-300"
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="pb-[8px] pr-[8px]" id="v_1_h_4">
                              <div className="relative">
                                <div className="relative">
                                  <Image alt="ItemImage" width={100} height={100}
                                    src={itemsData[13].imageUrl}
                                    className="w-[40px] h-[40px] rounded-[8px] transition-all duration-300"
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="pb-[8px] pr-[8px]" id="v_1_h_5">
                              <div className="relative">
                                <div className="relative">
                                  <Image alt="ItemImage" width={100} height={100}
                                    src={itemsData[14].imageUrl}
                                    className="w-[40px] h-[40px] rounded-[8px] transition-all duration-300"
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="pb-[8px] pr-[8px]" id="v_1_h_6">
                              <div className="relative">
                                <div className="relative">
                                  <Image alt="ItemImage" width={100} height={100}
                                    src={itemsData[15].imageUrl}
                                    className="w-[40px] h-[40px] rounded-[8px] transition-all duration-300"
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="pb-[8px] pr-[8px]" id="v_1_h_7">
                              <div className="relative">
                                <div className="relative">
                                  <Image alt="ItemImage" width={100} height={100}
                                    src={itemsData[16].imageUrl}
                                    className="w-[40px] h-[40px] rounded-[8px] transition-all duration-300"
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="pb-[8px] pr-[8px]" id="v_1_h_8">
                              <div className="relative">
                                <div className="relative">
                                  <Image alt="ItemImage" width={100} height={100}
                                    src={itemsData[17].imageUrl}
                                    className="w-[40px] h-[40px] rounded-[8px] transition-all duration-300"
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="pb-[8px] pr-[8px]" id="v_1_h_9">
                              <div className="relative">
                                <div className="relative">
                                  <Image alt="ItemImage" width={100} height={100}
                                    src={itemsData[18].imageUrl}
                                    className="w-[40px] h-[40px] rounded-[8px] transition-all duration-300"
                                  />
                                </div>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td className="pb-[8px] pr-[8px]" id="v_2_h_0">
                              <div className="relative">
                                <div className="relative">
                                  <Image alt="ItemImage" width={100} height={100}
                                    src={itemsData[19].imageUrl}
                                    className="w-[40px] h-[40px] rounded-[8px] transition-all duration-300"
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="pb-[8px] pr-[8px]" id="v_2_h_1">
                              <div className="relative">
                                <div className="relative">
                                  <Image alt="ItemImage" width={100} height={100}
                                    src={itemsData[20].imageUrl}
                                    className="w-[40px] h-[40px] rounded-[8px] transition-all duration-300"
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="pb-[8px] pr-[8px]" id="v_2_h_2">
                              <div className="relative">
                                <div className="relative">
                                  <Image alt="ItemImage" width={100} height={100}
                                    src={itemsData[21].imageUrl}
                                    className="w-[40px] h-[40px] rounded-[8px] transition-all duration-300"
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="pb-[8px] pr-[8px]" id="v_2_h_3">
                              <div className="relative">
                                <div className="relative">
                                  <Image alt="ItemImage" width={100} height={100}
                                    src={itemsData[22].imageUrl}
                                    className="w-[40px] h-[40px] rounded-[8px] transition-all duration-300"
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="pb-[8px] pr-[8px]" id="v_2_h_4">
                              <div className="relative">
                                <div className="relative">
                                  <Image alt="ItemImage" width={100} height={100}
                                    src={itemsData[23].imageUrl}
                                    className="w-[40px] h-[40px] rounded-[8px] transition-all duration-300"
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="pb-[8px] pr-[8px]" id="v_2_h_5">
                              <div className="relative">
                                <div className="relative">
                                  <Image alt="ItemImage" width={100} height={100}
                                    src={itemsData[24].imageUrl}
                                    className="w-[40px] h-[40px] rounded-[8px] transition-all duration-300"
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="pb-[8px] pr-[8px]" id="v_2_h_6">
                              <div className="relative">
                                <div className="relative">
                                  <Image alt="ItemImage" width={100} height={100}
                                    src={itemsData[25].imageUrl}
                                    className="w-[40px] h-[40px] rounded-[8px] transition-all duration-300"
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="pb-[8px] pr-[8px]" id="v_2_h_7">
                              <div className="relative">
                                <div className="relative">
                                  <Image alt="ItemImage" width={100} height={100}
                                    src={itemsData[26].imageUrl}
                                    className="w-[40px] h-[40px] rounded-[8px] transition-all duration-300"
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="pb-[8px] pr-[8px]" id="v_2_h_8">
                              <div className="relative">
                                <div className="relative">
                                  <Image alt="ItemImage" width={100} height={100}
                                    src={itemsData[27].imageUrl}
                                    className="w-[40px] h-[40px] rounded-[8px] transition-all duration-300"
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="pb-[8px] pr-[8px]" id="v_2_h_9">
                              <div className="relative">
                                <div className="relative">
                                  <Image alt="ItemImage" width={100} height={100}
                                    src={itemsData[28].imageUrl}
                                    className="w-[40px] h-[40px] rounded-[8px] transition-all duration-300"
                                  />
                                </div>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td className="pb-[8px] pr-[8px]" id="v_3_h_0">
                              <div className="relative">
                                <div className="relative">
                                  <Image alt="ItemImage" width={100} height={100}
                                    src={itemsData[29].imageUrl}
                                    className="w-[40px] h-[40px] rounded-[8px] transition-all duration-300"
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="pb-[8px] pr-[8px]" id="v_3_h_1">
                              <div className="relative">
                                <div className="relative">
                                  <Image alt="ItemImage" width={100} height={100}
                                    src={itemsData[30].imageUrl}
                                    className="w-[40px] h-[40px] rounded-[8px] transition-all duration-300"
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="pb-[8px] pr-[8px]" id="v_3_h_2">
                              <div className="relative">
                                <div className="relative">
                                  <Image alt="ItemImage" width={100} height={100}
                                    src={itemsData[31].imageUrl}
                                    className="w-[40px] h-[40px] rounded-[8px] transition-all duration-300"
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="pb-[8px] pr-[8px]" id="v_3_h_3">
                              <div className="relative">
                                <div className="relative">
                                  <Image alt="ItemImage" width={100} height={100}
                                    src={itemsData[32].imageUrl}
                                    className="w-[40px] h-[40px] rounded-[8px] transition-all duration-300"
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="pb-[8px] pr-[8px]" id="v_3_h_4">
                              <div className="relative">
                                <div className="relative">
                                  <Image alt="ItemImage" width={100} height={100}
                                    src={itemsData[33].imageUrl}
                                    className="w-[40px] h-[40px] rounded-[8px] transition-all duration-300"
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="pb-[8px] pr-[8px]" id="v_3_h_5">
                              <div className="relative">
                                <div className="relative">
                                  <Image alt="ItemImage" width={100} height={100}
                                    src={itemsData[34].imageUrl}
                                    className="w-[40px] h-[40px] rounded-[8px] transition-all duration-300"
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="pb-[8px] pr-[8px]" id="v_3_h_6">
                              <div className="relative">
                                <div className="relative">
                                  <Image alt="ItemImage" width={100} height={100}
                                    src={itemsData[35].imageUrl}
                                    className="w-[40px] h-[40px] rounded-[8px] transition-all duration-300"
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="pb-[8px] pr-[8px]" id="v_3_h_7">
                              <div className="relative">
                                <div className="relative">
                                  <Image alt="ItemImage" width={100} height={100}
                                    src={itemsData[36].imageUrl}
                                    className="w-[40px] h-[40px] rounded-[8px] transition-all duration-300"
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="pb-[8px] pr-[8px]" id="v_3_h_8">
                              <div className="relative">
                                <div className="relative">
                                  <Image alt="ItemImage" width={100} height={100}
                                    src={itemsData[37].imageUrl}
                                    className="w-[40px] h-[40px] rounded-[8px] transition-all duration-300"
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="pb-[8px] pr-[8px]" id="v_3_h_9">
                              <div className="relative">
                                <div className="relative">
                                  <Image alt="ItemImage" width={100} height={100}
                                    src={itemsData[38].imageUrl}
                                    className="w-[40px] h-[40px] rounded-[8px] transition-all duration-300"
                                  />
                                </div>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td className="pb-[8px] pr-[8px]" id="v_4_h_0">
                              <div className="relative">
                                <div className="relative">
                                  <Image alt="ItemImage" width={100} height={100}
                                    src={itemsData[39].imageUrl}
                                    className="w-[40px] h-[40px] rounded-[8px] transition-all duration-300"
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="pb-[8px] pr-[8px]" id="v_4_h_1">
                              <div className="relative">
                                <div className="relative">
                                  <Image alt="ItemImage" width={100} height={100}
                                    src={itemsData[40].imageUrl}
                                    className="w-[40px] h-[40px] rounded-[8px] transition-all duration-300"
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="pb-[8px] pr-[8px]" id="v_4_h_2">
                              <div className="relative">
                                <div className="relative">
                                  <Image alt="ItemImage" width={100} height={100}
                                    src={itemsData[41].imageUrl}
                                    className="w-[40px] h-[40px] rounded-[8px] transition-all duration-300"
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="pb-[8px] pr-[8px]" id="v_4_h_3">
                              <div className="relative">
                                <div className="relative">
                                  <Image alt="ItemImage" width={100} height={100}
                                    src={itemsData[42].imageUrl}
                                    className="w-[40px] h-[40px] rounded-[8px] transition-all duration-300"
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="pb-[8px] pr-[8px]" id="v_4_h_4">
                              <div className="relative">
                                <div className="relative">
                                  <Image alt="ItemImage" width={100} height={100}
                                    src={itemsData[43].imageUrl}
                                    className="w-[40px] h-[40px] rounded-[8px] transition-all duration-300"
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="pb-[8px] pr-[8px]" id="v_4_h_5">
                              <div className="relative">
                                <div className="relative">
                                  <Image alt="ItemImage" width={100} height={100}
                                    src={itemsData[44].imageUrl}
                                    className="w-[40px] h-[40px] rounded-[8px] transition-all duration-300"
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="pb-[8px] pr-[8px]" id="v_4_h_6">
                              <div className="relative">
                                <div className="relative">
                                  <Image alt="ItemImage" width={100} height={100}
                                    src={itemsData[45].imageUrl}
                                    className="w-[40px] h-[40px] rounded-[8px] transition-all duration-300"
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="pb-[8px] pr-[8px]" id="v_4_h_7">
                              <div className="relative">
                                <div className="relative">
                                  <Image alt="ItemImage" width={100} height={100}
                                    src={itemsData[46].imageUrl}
                                    className="w-[40px] h-[40px] rounded-[8px] transition-all duration-300"
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="pb-[8px] pr-[8px]" id="v_4_h_8">
                              <div className="relative">
                                <div className="relative">
                                  <Image alt="ItemImage" width={100} height={100}
                                    src={itemsData[47].imageUrl}
                                    className="w-[40px] h-[40px] rounded-[8px] transition-all duration-300"
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="pb-[8px] pr-[8px]" id="v_4_h_9">
                              <div className="relative">
                                <div className="relative">
                                  <Image alt="ItemImage" width={100} height={100}
                                    src={itemsData[48].imageUrl}
                                    className="w-[40px] h-[40px] rounded-[8px] transition-all duration-300"
                                  />
                                </div>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td className="pb-[8px] pr-[8px]" id="v_5_h_0">
                              <div className="relative">
                                <div className="relative">
                                  <Image alt="ItemImage" width={100} height={100}
                                    src={itemsData[49].imageUrl}
                                    className="w-[40px] h-[40px] rounded-[8px] transition-all duration-300"
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="pb-[8px] pr-[8px]" id="v_5_h_1">
                              <div className="relative">
                                <div className="relative">
                                  <Image alt="ItemImage" width={100} height={100}
                                    src={itemsData[50].imageUrl}
                                    className="w-[40px] h-[40px] rounded-[8px] transition-all duration-300"
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="pb-[8px] pr-[8px]" id="v_5_h_2">
                              <div className="relative">
                                <div className="relative">
                                  <Image alt="ItemImage" width={100} height={100}
                                    src={itemsData[51].imageUrl}
                                    className="w-[40px] h-[40px] rounded-[8px] transition-all duration-300"
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="pb-[8px] pr-[8px]" id="v_5_h_3">
                              <div className="relative">
                                <div className="relative">
                                  <Image alt="ItemImage" width={100} height={100}
                                    src={itemsData[52].imageUrl}
                                    className="w-[40px] h-[40px] rounded-[8px] transition-all duration-300"
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="pb-[8px] pr-[8px]" id="v_5_h_4">
                              <div className="relative">
                                <div className="relative">
                                  <Image alt="ItemImage" width={100} height={100}
                                    src={itemsData[53].imageUrl}
                                    className="w-[40px] h-[40px] rounded-[8px] transition-all duration-300"
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="pb-[8px] pr-[8px]" id="v_5_h_5">
                              <div className="relative">
                                <div className="relative">
                                  <Image alt="ItemImage" width={100} height={100}
                                    src={itemsData[54].imageUrl}
                                    className="w-[40px] h-[40px] rounded-[8px] transition-all duration-300"
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="pb-[8px] pr-[8px]" id="v_5_h_6">
                              <div className="relative">
                                <div className="relative">
                                  <Image alt="ItemImage" width={100} height={100}
                                    src={itemsData[55].imageUrl}
                                    className="w-[40px] h-[40px] rounded-[8px] transition-all duration-300"
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="pb-[8px] pr-[8px]" id="v_5_h_7">
                              <div className="relative">
                                <div className="relative">
                                  <Image alt="ItemImage" width={100} height={100}
                                    src={itemsData[56].imageUrl}
                                    className="w-[40px] h-[40px] rounded-[8px] transition-all duration-300"
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="pb-[8px] pr-[8px]" id="v_5_h_8">
                              <div className="relative">
                                <div className="relative">
                                  <Image alt="ItemImage" width={100} height={100}
                                    src={itemsData[57].imageUrl}
                                    className="w-[40px] h-[40px] rounded-[8px] transition-all duration-300"
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="pb-[8px] pr-[8px]" id="v_5_h_9">
                              <div className="relative">
                                <div className="relative">
                                  <Image alt="ItemImage" width={100} height={100}
                                    src={itemsData[58].imageUrl}
                                    className="w-[40px] h-[40px] rounded-[8px] transition-all duration-300"
                                  />
                                </div>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td className="pb-[8px] pr-[8px]" id="v_6_h_0">
                              <div className="relative">
                                <div className="relative">
                                  <Image alt="ItemImage" width={100} height={100}
                                    src={itemsData[59].imageUrl}
                                    className="w-[40px] h-[40px] rounded-[8px] transition-all duration-300"
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="pb-[8px] pr-[8px]" id="v_6_h_1">
                              <div className="relative">
                                <div className="relative">
                                  <Image alt="ItemImage" width={100} height={100}
                                    src={itemsData[60].imageUrl}
                                    className="w-[40px] h-[40px] rounded-[8px] transition-all duration-300"
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="pb-[8px] pr-[8px]" id="v_6_h_2">
                              <div className="relative">
                                <div className="relative">
                                  <Image alt="ItemImage" width={100} height={100}
                                    src={itemsData[61].imageUrl}
                                    className="w-[40px] h-[40px] rounded-[8px] transition-all duration-300"
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="pb-[8px] pr-[8px]" id="v_6_h_3">
                              <div className="relative">
                                <div className="relative">
                                  <Image alt="ItemImage" width={100} height={100}
                                    src={itemsData[62].imageUrl}
                                    className="w-[40px] h-[40px] rounded-[8px] transition-all duration-300"
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="pb-[8px] pr-[8px]" id="v_6_h_4">
                              <div className="relative">
                                <div className="relative">
                                  <Image alt="ItemImage" width={100} height={100}
                                    src={itemsData[63].imageUrl}
                                    className="w-[40px] h-[40px] rounded-[8px] transition-all duration-300"
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="pb-[8px] pr-[8px]" id="v_6_h_5">
                              <div className="relative">
                                <div className="relative">
                                  <Image alt="ItemImage" width={100} height={100}
                                    src={itemsData[64].imageUrl}
                                    className="w-[40px] h-[40px] rounded-[8px] transition-all duration-300"
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="pb-[8px] pr-[8px]" id="v_6_h_6">
                              <div className="relative">
                                <div className="relative">
                                  <Image alt="ItemImage" width={100} height={100}
                                    src={itemsData[65].imageUrl}
                                    className="w-[40px] h-[40px] rounded-[8px] transition-all duration-300"
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="pb-[8px] pr-[8px]" id="v_6_h_7">
                              <div className="relative">
                                <div className="relative">
                                  <Image alt="ItemImage" width={100} height={100}
                                    src={itemsData[66].imageUrl}
                                    className="w-[40px] h-[40px] rounded-[8px] transition-all duration-300"
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="pb-[8px] pr-[8px]" id="v_6_h_8">
                              <div className="relative">
                                <div className="relative">
                                  <Image alt="ItemImage" width={100} height={100}
                                    src={itemsData[67].imageUrl}
                                    className="w-[40px] h-[40px] rounded-[8px] transition-all duration-300"
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="pb-[8px] pr-[8px]" id="v_6_h_9">
                              <div className="relative">
                                <div className="relative">
                                  <Image alt="ItemImage" width={100} height={100}
                                    src={itemsData[68].imageUrl}
                                    className="w-[40px] h-[40px] rounded-[8px] transition-all duration-300"
                                  />
                                </div>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td className="pb-[8px] pr-[8px]" id="v_7_h_0">
                              <div className="relative">
                                <div className="relative">
                                  <Image alt="ItemImage" width={100} height={100}
                                    src={itemsData[69].imageUrl}
                                    className="w-[40px] h-[40px] rounded-[8px] transition-all duration-300"
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="pb-[8px] pr-[8px]" id="v_7_h_1">
                              <div className="relative">
                                <div className="relative">
                                  <Image alt="ItemImage" width={100} height={100}
                                    src={itemsData[70].imageUrl}
                                    className="w-[40px] h-[40px] rounded-[8px] transition-all duration-300"
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="pb-[8px] pr-[8px]" id="v_7_h_2">
                              <div className="relative">
                                <div className="relative">
                                  <Image alt="ItemImage" width={100} height={100}
                                    src={itemsData[71].imageUrl}
                                    className="w-[40px] h-[40px] rounded-[8px] transition-all duration-300"
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="pb-[8px] pr-[8px]" id="v_7_h_3">
                              <div className="relative">
                                <div className="relative">
                                  <Image alt="ItemImage" width={100} height={100}
                                    src={itemsData[72].imageUrl}
                                    className="w-[40px] h-[40px] rounded-[8px] transition-all duration-300"
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="pb-[8px] pr-[8px]" id="v_7_h_4">
                              <div className="relative">
                                <div className="relative">
                                  <Image alt="ItemImage" width={100} height={100}
                                    src={itemsData[73].imageUrl}
                                    className="w-[40px] h-[40px] rounded-[8px] transition-all duration-300"
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="pb-[8px] pr-[8px]" id="v_7_h_5">
                              <div className="relative">
                                <div className="relative">
                                  <Image alt="ItemImage" width={100} height={100}
                                    src={itemsData[74].imageUrl}
                                    className="w-[40px] h-[40px] rounded-[8px] transition-all duration-300"
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="pb-[8px] pr-[8px]" id="v_7_h_6">
                              <div className="relative">
                                <div className="relative">
                                  <Image alt="ItemImage" width={100} height={100}
                                    src={itemsData[75].imageUrl}
                                    className="w-[40px] h-[40px] rounded-[8px] transition-all duration-300"
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="pb-[8px] pr-[8px]" id="v_7_h_7">
                              <div className="relative">
                                <div className="relative">
                                  <Image alt="ItemImage" width={100} height={100}
                                    src={itemsData[76].imageUrl}
                                    className="w-[40px] h-[40px] rounded-[8px] transition-all duration-300"
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="pb-[8px] pr-[8px]" id="v_7_h_8">
                              <div className="relative">
                                <div className="relative">
                                  <Image alt="ItemImage" width={100} height={100}
                                    src={itemsData[77].imageUrl}
                                    className="w-[40px] h-[40px] rounded-[8px] transition-all duration-300"
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="pb-[8px] pr-[8px]" id="v_7_h_9">
                              <div className="relative">
                                <div className="relative">
                                  <Image alt="ItemImage" width={100} height={100}
                                    src={itemsData[78].imageUrl}
                                    className="w-[40px] h-[40px] rounded-[8px] transition-all duration-300"
                                  />
                                </div>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td className="pb-[8px] pr-[8px]" id="v_8_h_0">
                              <div className="relative">
                                <div className="relative">
                                  <Image alt="ItemImage" width={100} height={100}
                                    src={itemsData[79].imageUrl}
                                    className="w-[40px] h-[40px] rounded-[8px] transition-all duration-300"
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="pb-[8px] pr-[8px]" id="v_8_h_1">
                              <div className="relative">
                                <div className="relative">
                                  <Image alt="ItemImage" width={100} height={100}
                                    src={itemsData[80].imageUrl}
                                    className="w-[40px] h-[40px] rounded-[8px] transition-all duration-300"
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="pb-[8px] pr-[8px]" id="v_8_h_2">
                              <div className="relative">
                                <div className="relative">
                                  <Image alt="ItemImage" width={100} height={100}
                                    src={itemsData[81].imageUrl}
                                    className="w-[40px] h-[40px] rounded-[8px] transition-all duration-300"
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="pb-[8px] pr-[8px]" id="v_8_h_3">
                              <div className="relative">
                                <div className="relative">
                                  <Image alt="ItemImage" width={100} height={100}
                                    src={itemsData[82].imageUrl}
                                    className="w-[40px] h-[40px] rounded-[8px] transition-all duration-300"
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="pb-[8px] pr-[8px]" id="v_8_h_4">
                              <div className="relative">
                                <div className="relative">
                                  <Image alt="ItemImage" width={100} height={100}
                                    src={itemsData[83].imageUrl}
                                    className="w-[40px] h-[40px] rounded-[8px] transition-all duration-300"
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="pb-[8px] pr-[8px]" id="v_8_h_5">
                              <div className="relative">
                                <div className="relative">
                                  <Image alt="ItemImage" width={100} height={100}
                                    src={itemsData[84].imageUrl}
                                    className="w-[40px] h-[40px] rounded-[8px] transition-all duration-300"
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="pb-[8px] pr-[8px]" id="v_8_h_6">
                              <div className="relative">
                                <div className="relative">
                                  <Image alt="ItemImage" width={100} height={100}
                                    src={itemsData[85].imageUrl}
                                    className="w-[40px] h-[40px] rounded-[8px] transition-all duration-300"
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="pb-[8px] pr-[8px]" id="v_8_h_7">
                              <div className="relative">
                                <div className="relative">
                                  <Image alt="ItemImage" width={100} height={100}
                                    src={itemsData[86].imageUrl}
                                    className="w-[40px] h-[40px] rounded-[8px] transition-all duration-300"
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="pb-[8px] pr-[8px]" id="v_8_h_8">
                              <div className="relative">
                                <div className="relative">
                                  <Image alt="ItemImage" width={100} height={100}
                                    src={itemsData[87].imageUrl}
                                    className="w-[40px] h-[40px] rounded-[8px] transition-all duration-300"
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="pb-[8px] pr-[8px]" id="v_8_h_9">
                              <div className="relative">
                                <div className="relative">
                                  <Image alt="ItemImage" width={100} height={100}
                                    src={itemsData[88].imageUrl}
                                    className="w-[40px] h-[40px] rounded-[8px] transition-all duration-300"
                                  />
                                </div>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td className="pb-[8px] pr-[8px]" id="v_9_h_0">
                              <div className="relative">
                                <div className="relative">
                                  <Image alt="ItemImage" width={100} height={100}
                                    src={itemsData[89].imageUrl}
                                    className="w-[40px] h-[40px] rounded-[8px] transition-all duration-300"
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="pb-[8px] pr-[8px]" id="v_9_h_1">
                              <div className="relative">
                                <div className="relative">
                                  <Image alt="ItemImage" width={100} height={100}
                                    src={itemsData[90].imageUrl}
                                    className="w-[40px] h-[40px] rounded-[8px] transition-all duration-300"
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="pb-[8px] pr-[8px]" id="v_9_h_2">
                              <div className="relative">
                                <div className="relative">
                                  <Image alt="ItemImage" width={100} height={100}
                                    src={itemsData[91].imageUrl}
                                    className="w-[40px] h-[40px] rounded-[8px] transition-all duration-300"
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="pb-[8px] pr-[8px]" id="v_9_h_3">
                              <div className="relative">
                                <div className="relative">
                                  <Image alt="ItemImage" width={100} height={100}
                                    src={itemsData[92].imageUrl}
                                    className="w-[40px] h-[40px] rounded-[8px] transition-all duration-300"
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="pb-[8px] pr-[8px]" id="v_9_h_4">
                              <div className="relative">
                                <div className="relative">
                                  <Image alt="ItemImage" width={100} height={100}
                                    src={itemsData[93].imageUrl}
                                    className="w-[40px] h-[40px] rounded-[8px] transition-all duration-300"
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="pb-[8px] pr-[8px]" id="v_9_h_5">
                              <div className="relative">
                                <div className="relative">
                                  <Image alt="ItemImage" width={100} height={100}
                                    src={itemsData[94].imageUrl}
                                    className="w-[40px] h-[40px] rounded-[8px] transition-all duration-300"
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="pb-[8px] pr-[8px]" id="v_9_h_6">
                              <div className="relative">
                                <div className="relative">
                                  <Image alt="ItemImage" width={100} height={100}
                                    src={itemsData[95].imageUrl}
                                    className="w-[40px] h-[40px] rounded-[8px] transition-all duration-300"
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="pb-[8px] pr-[8px]" id="v_9_h_7">
                              <div className="relative">
                                <div className="relative">
                                  <Image alt="ItemImage" width={100} height={100}
                                    src={itemsData[96].imageUrl}
                                    className="w-[40px] h-[40px] rounded-[8px] transition-all duration-300"
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="pb-[8px] pr-[8px]" id="v_9_h_8">
                              <div className="relative">
                                <div className="relative">
                                  <Image alt="ItemImage" width={100} height={100}
                                    src={itemsData[97].imageUrl}
                                    className="w-[40px] h-[40px] rounded-[8px] transition-all duration-300"
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="pb-[8px] pr-[8px]" id="v_9_h_9">
                              <div className="relative">
                                <div className="relative">
                                  <Image alt="ItemImage" width={100} height={100}
                                    src={itemsData[98].imageUrl}
                                    className="w-[40px] h-[40px] rounded-[8px] transition-all duration-300"
                                  />
                                </div>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>

          <article className="flex flex-col gap-1 py-0 px-[0.5rem]">
            <div className="bg-gradient-to-r from-[#2d2f3710] via-[#2d2f37] to-[#2d2f3710] py-2 pl-2 rounded-md">
              <div className="h-[32px] mb-0 leading-[32px] text-[#fff] font-bold text-[28px] text-center w-full">
                {others?.itemTable}{" "}
                <span className="text-[20px] font-light text-[#eee]">
                  ({others?.byItem})
                </span>
              </div>
            </div>
            <ul className="hidden flex flex-wrap list-none m-0 p-0">
              {itemsData1
                .filter((item) => item?.isFromItem)
                .map((item) => (
                  <li className=" md:w-[74px] md:h-[58px] rounded-[0.25rem]">
                    <button className="w-full h-full flex justify-center items-center">
                      <Image
                        alt="ItemImage"
                        width={100}
                        height={100}
                        src={item?.imageUrl}
                        className="w-[36px] h-[36px] md:w-[56px] md:h-[56px] rounded-full"
                      />
                    </button>
                  </li>
                ))}
            </ul>
            <div className="grid gap-x-1 gap-y-4 md:grid-cols-2 rounded-md">
              {itemsData1
                .filter((item) => item?.isFromItem)
                .map((item) => (
                  <dl
                    className="flex flex-col bg-[#222222] border border-[#323232] text-[#fff] text-[12px]"
                    style={{
                      background: "rgba(0, 0, 0, 0.3)",
                      boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
                      backdropFilter: "blur(2px)",
                      border: "1px solid rgba(35, 31, 31, 0.3)",
                    }}
                  >
                    <dt>
                      <div className="flex bg-[#222222] border border-[#323232] items-center p-[0.5rem] gap-x-[0.25rem]">
                        <div className="overflow-hidden relative">
                          <Image
                            alt="ItemImage"
                            width={100}
                            height={100}
                            src={item?.imageUrl}
                            className="rounded-[6px] w-[56px] h-[56px]"
                          />
                        </div>
                        <div className="flex flex-col">
                          <strong className="text-lg">{item?.name}</strong>
                          <span className="text-[#fff] text-sm">
                            {item?.shortDesc}
                          </span>
                        </div>
                      </div>
                    </dt>
                    <div className="pt-0 pr-[0.5rem] pb-[0.5rem] pl-[0.5rem]">
                      <dd className="m-0">
                        {itemsData1
                          .filter((item2) =>
                            item2.compositions?.includes(item?.key)
                          )
                          ?.map((item2) => (
                            <div className="flex justify-start items-center gap-x-[16px] mt-[0.5rem] border-b-[1px] border-[#ffffff20] py-2">
                              <div className="flex items-center gap-x-[2px] flex-shrink-0 min-h-[32px]">
                                <FaPlus />
                                <div className="relative">
                                  <Image
                                    alt="ItemImage"
                                    width={100}
                                    height={100}
                                    src={
                                      item2?.compositions?.find(
                                        (i) => i !== item?.key
                                      )
                                        ? itemsData1?.find(
                                            (id) =>
                                              id?.key ===
                                              item2?.compositions?.find(
                                                (i) => i !== item?.key
                                              )
                                          )?.imageUrl
                                        : item?.imageUrl
                                    }
                                    className="rounded-[6px] w-[32px] h-[32px] md:w-[48px] md:h-[48px]"
                                    data-tooltip-id={
                                      item2?.compositions?.find(
                                        (i) => i !== item?.key
                                      )
                                        ? itemsData1?.find(
                                            (id) =>
                                              id?.key ===
                                              item2?.compositions?.find(
                                                (i) => i !== item?.key
                                              )
                                          )?.key
                                        : item?.key
                                    }
                                  />
                                  <ReactTltp
                                    content={
                                      item2?.compositions?.find(
                                        (i) => i !== item?.key
                                      )
                                        ? itemsData1?.find(
                                            (id) =>
                                              id?.key ===
                                              item2?.compositions?.find(
                                                (i) => i !== item?.key
                                              )
                                          )?.name
                                        : item?.name
                                    }
                                    id={
                                      item2?.compositions?.find(
                                        (i) => i !== item?.key
                                      )
                                        ? itemsData1?.find(
                                            (id) =>
                                              id?.key ===
                                              item2?.compositions?.find(
                                                (i) => i !== item?.key
                                              )
                                          )?.key
                                        : item?.key
                                    }
                                  />
                                </div>
                                <FaEquals />
                                <div className="relative">
                                  <Image
                                    alt="ItemImage"
                                    width={100}
                                    height={100}
                                    src={item2?.imageUrl}
                                    className="rounded-[6px] w-[32px] h-[32px] md:w-[48px] md:h-[48px]"
                                    data-tooltip-id={item2?.key}
                                  />
                                  <ReactTltp
                                    content={item2?.name}
                                    id={item2?.key}
                                  />
                                </div>
                              </div>
                              <div
                                className="inline-flex text-[#fff] md:text-[15px] font-normal leading-[1]"
                                dangerouslySetInnerHTML={{
                                  __html: item2?.desc,
                                }}
                              />
                              {/* <div className="inline-flex text-[#808080] leading-[1]">
                                {item2?.shortDesc}
                              </div> */}
                            </div>
                          ))}
                      </dd>
                    </div>
                  </dl>
                ))}
            </div>
          </article>
        </div>
      </div>
    </ItemsStyleWrapper>
  );
};

export default Items;
