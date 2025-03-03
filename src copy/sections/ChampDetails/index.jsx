import React, { useState } from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";
import Link from "next/link";
import "react-tooltip/dist/react-tooltip.css";
import ReactTltp from "src/components/tooltip/ReactTltp.jsx";
import ChampionsStyleWrapper from "./Champions.style.js";
import Set10Tabs from "../set10Tabs/index.js";
import { FaPlus, FaEquals } from "react-icons/fa";
import cloak from "@assets/image/items/basicItems/cloak.png";
import riven from "@assets/image/backgrounds/riven.jpg";
import { HiMiniMagnifyingGlass } from "react-icons/hi2";
import coin from "@assets/image/icons/coin.png";
import attackDistance from "@assets/image/icons/ico_attack_distance.png";
import icoMp from "@assets/image/icons/ico-mp.png";
import icoGold from "@assets/image/icons/ico-gold.svg";
import doller from "@assets/image/icons/doller.svg";
// import compsData from "../../ApiStructure/Comps/Comps.json";
import { IoMdCheckmarkCircle } from "react-icons/io";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import GlobalTooltip from "src/components/tooltip/GlobalTooltip.jsx";
import Comps from "./../../data/compsNew.json";

const Traits = ({ selected }) => {
  const [hoverIndex, setHoverIndex] = useState(null);
  const [tableHover, setTableHover] = useState(false);
  const [space1, setSpace1] = useState(null);
  const [space2, setSpace2] = useState(null);

  const {
    props: {
      pageProps: {
        dehydratedState: {
          queries: { data },
        },
      },
    },
  } = Comps;
  const { metaDecks } = data?.metaDeckList;
  const { champions } = data?.refs;
  const { items } = data?.refs;
  const { traits } = data?.refs;
  console.log("chal", champions);

  const selectedChampion = champions?.find(
    (champion) => champion?.key === selected
  );

  const [championss, setChampionss] = useState(champions);

  const handleSearch = (e) => {
    const search = e.target.value;
    const filteredChampions = champions?.filter((champion) =>
      champion?.name.toLowerCase().includes(search.toLowerCase())
    );
    setChampionss(filteredChampions);
  };

  const [activeTab, setActiveTab] = useState("Champions");
  const [height, setHeight] = useState("auto");
  const tabs = ["Comps", "Champions", "Traits", "Items"];

  const imageUrls = [
    {
      name: "Nicothoe",
      imageUrl:
        "https://res.cloudinary.com/dg0cmj6su/image/upload/v1719662727/Harpy_Updated_V3_1_er7dzy.webp",
    },
    {
      name: "Celaeno",
      imageUrl:
        "https://res.cloudinary.com/dg0cmj6su/image/upload/v1719921880/final4up_ekgr1i.webp",
    },
    {
      name: "Pyralia",
      imageUrl:
        "https://res.cloudinary.com/dg0cmj6su/image/upload/v1719999771/00646-609178461_fcxp2m.webp",
    },
    {
      name: "Aello",
      imageUrl:
        "https://res.cloudinary.com/dg0cmj6su/image/upload/v1720080846/Harpy_Storm_wgaezk.webp",
    },
    {
      name: "Ocypete",
      imageUrl:
        "https://res.cloudinary.com/dg0cmj6su/image/upload/v1719999771/final6_vrpuhj.webp",
    },
    {
      name: "Artemis",
      imageUrl:
        "https://res.cloudinary.com/dg0cmj6su/image/upload/v1720498931/Magic_Archer_Light_zvfs4n.webp",
    },
    {
      name: "Hecate",
      imageUrl:
        "https://res.cloudinary.com/dg0cmj6su/image/upload/v1720498931/Magic_Archer_Dark_ojfius.webp",
    },
    {
      name: "Hestial",
      imageUrl:
        "https://res.cloudinary.com/dg0cmj6su/image/upload/v1720498931/Magic_Archer_Fire_2_xkhinq.webp",
    },
    {
      name: "Rhiannon",
      imageUrl:
        "https://res.cloudinary.com/dg0cmj6su/image/upload/v1720585221/Magic_Archer_Storm_uesxay.webp",
    },
    {
      name: "Selene",
      imageUrl:
        "https://res.cloudinary.com/dg0cmj6su/image/upload/v1720585221/Magic_Archer_Water_2_otkuaa.webp",
    },
    {
      name: "Aetheria",
      imageUrl:
        "https://res.cloudinary.com/dg0cmj6su/image/upload/v1720680047/DRYAD_Light_doyy7c.webp",
    },
    {
      name: "Orphne",
      imageUrl:
        "https://res.cloudinary.com/dg0cmj6su/image/upload/v1720680047/Dryad_Dark_et9pfr.webp",
    },
    {
      name: "Pyra",
      imageUrl:
        "https://res.cloudinary.com/dg0cmj6su/image/upload/v1720586017/Fire_Corrected_rpswrx.webp",
    },
    {
      name: "Meliae",
      imageUrl:
        "https://res.cloudinary.com/dg0cmj6su/image/upload/v1720680048/Dryad_Storm_jaarlp.webp",
    },
    {
      name: "Merope",
      imageUrl:
        "https://res.cloudinary.com/dg0cmj6su/image/upload/v1720586016/Dryad_Water_hzhxhu.webp",
    },
  ];

  const inactiveChampions = [
    2, 3, 5, 6, 8, 10, 13, 14, 15, 16, 18, 19, 22, 24, 25, 28, 29, 30,
  ];

  return (
    <ChampionsStyleWrapper>
      <div className="container md:!max-w-[95%]">
        <Set10Tabs
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        {/* <div className="">
          <div
            className="grid grid-cols-5 md:gap-4 h-[200px] gap-1 md:h-[290px] md:hover:h-[560px] md:transition md:ease-in-out md:duration-300 md:hover:transition-all md:delay-150"
            style={{
              background: "rgba(0, 0, 0, 0.2)",
              borderRadius: "16px",
              boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
              backdropFilter: "blur(2px)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              padding: "10px",
              overflow: "auto",
            }}
          >
            {imageUrls.map((_, index) => (
              <div class="relative mx-[2px] my-0 mb-3 md:m-0 h-[82px] sm:h-[137px] md:w-[220px] md:h-[260px] overflow-hidden z-[2]">
                <img
                  src={_?.imageUrl}
                  alt={_.name}
                  className="absolute overflow-hidden w-[91%] top-[2px] left-[3px] md:left-2 md:top-2"
                />
                <img
                  src="https://res.cloudinary.com/dg0cmj6su/image/upload/v1719832194/goldFrame_fh0mo7.webp"
                  className="absolute rounded-tl-md"
                />
                <div className="absolute bottom-2.5 md:bottom-[12px] w-full flex justify-between items-center">
                  <p className="text-[7px] md:text-lg font-bold p-0 my-1 ml-1.5 md:ml-4 !text-[#fff]">
                    {_.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div> */}
        <br />

        <article className="overflow-auto mt-5">
          <h5 className="text-xl font-semibold leading-5 mb-2.5">Champions</h5>
          <table className="table-fixed w-full min-w-[375px] border-t border-l border-r border-[#e6e6e650]">
            <thead>
              <tr className="font-bold text-[12px] cursor-pointer text-left bg-[#333232]">
                <th className="w-[16%] md:w-[180px] pl-2 text-[8px] md:text-[14px]">
                  Name
                </th>
                <th className="w-[5%] md:w-[50px] pl-2 text-[8px] md:text-[14px]">
                  Cost
                </th>
                <th className="pl-2 md:w-[10%] text-[8px] md:text-[14px]">
                  Origin
                </th>
                <th className="pl-2 text-[8px] md:text-[14px]">Class</th>
                <th className="pl-2 text-[8px] md:text-[14px]">Health</th>
                <th className="pl-2 text-[8px] md:text-[14px]">Armor</th>
                <th className="pl-2 text-[8px] md:text-[14px]">AD</th>
                <th className="pl-2 text-[8px] md:text-[14px]">Attack Range</th>
                <th className="pl-2 text-[8px] md:text-[14px]">AS</th>
                <th className="pl-2 text-[8px] md:text-[14px]">DPS</th>
                <th className="pl-2 text-[8px] md:text-[14px]">Skill</th>
                <th className="w-[14%] md:w-[80px] pl-2 text-[8px] md:text-[14px]">
                  Mana
                </th>
              </tr>
            </thead>
            <tbody>
              {champions?.map(
                (champion, index) =>
                  champion?.cost[0] !== 0 && (
                    <tr>
                      <td className="text-left align-middle text-white text-xs font-normal pl-2 py-1 border-b-[#ffffff14] border-b border-solid">
                        <div className="flex justify-center items-center md:justify-start">
                          <a className="flex justify-center items-center gap-x-2">
                            <div className="relative inline-flex flex-col">
                              <div className="flex flex-col w-10 h-10 rounded-md">
                                <div className="relative inline-flex overflow-hidden rounded-md border-0">
                                  <img
                                    src={champion?.imageUrl}
                                    className="h-full object-cover object-center w-[120%] max-w-[120%] -ml-[10%]"
                                  />
                                </div>
                              </div>
                            </div>
                            <span className="hidden md:inline-block md:text-left md:text-[14px]">
                              {champion?.name}
                            </span>
                          </a>
                        </div>
                      </td>
                      <td className="text-center align-middle text-xs font-normal py-1 border-b-[#ffffff14] border-b border-solid">
                        <div className="flex flex-wrap gap-x-[2px] justify-center ">
                          <img src={icoGold.src} />
                          <span className="md:text-[14px]">
                            {champion?.cost[0]}
                          </span>
                        </div>
                      </td>
                      <td className="text-center align-middle text-[rgb(33,37,41)] text-xs font-normal py-1 border-b-[#ffffff14] border-b border-solid">
                        <div className="flex justify-center items-center flex-wrap md:flex-col md:justify-start md:items-start md:gap-y-1 md:pl-2">
                          {champion?.traits?.map(
                            (trait) =>
                              traits?.find(
                                (item) =>
                                  item?.key === trait && item?.type === "ORIGIN"
                              ) && (
                                <div className="md:flex md:flex-row md:items-center md:gap-x-1">
                                  <div className="[background:url('//cdn.dak.gg/tft/images2/icon/ico-trait-darken.svg')_50%_center_/_cover_no-repeat] w-6 h-6 flex justify-center items-center shrink-0">
                                    <img
                                      src={
                                        traits?.find(
                                          (item) => item?.key === trait
                                        )?.imageUrl
                                      }
                                      className="h-3.5 w-3.5"
                                    />
                                  </div>
                                  <span className="hidden md:inline !text-white md:text-[14px]">
                                    <>
                                      {
                                        traits?.find(
                                          (item) => item?.key === trait
                                        )?.name
                                      }
                                    </>
                                  </span>
                                </div>
                              )
                          )}
                        </div>
                      </td>
                      <td className="text-center align-middle text-[rgb(33,37,41)] text-xs font-normal py-1 border-b-[#ffffff14] border-b border-solid">
                        <div className="flex justify-center items-center flex-wrap md:flex-col md:justify-start md:items-start md:gap-y-1 md:pl-2">
                          {champion?.traits?.map(
                            (trait) =>
                              traits?.find(
                                (item) =>
                                  item?.key === trait && item?.type === "CLASS"
                              ) && (
                                <div className="md:flex md:flex-row md:items-center md:gap-x-1">
                                  <div className="[background:url('//cdn.dak.gg/tft/images2/icon/ico-trait-darken.svg')_50%_center_/_cover_no-repeat] w-6 h-6 flex justify-center items-center shrink-0">
                                    <img
                                      src={
                                        traits?.find(
                                          (item) => item?.key === trait
                                        )?.imageUrl
                                      }
                                      className="h-3.5 w-3.5"
                                    />
                                  </div>
                                  <span className="hidden md:inline !text-white md:text-[14px]">
                                    <>
                                      {
                                        traits?.find(
                                          (item) => item?.key === trait
                                        )?.name
                                      }
                                    </>
                                  </span>
                                </div>
                              )
                          )}
                        </div>
                      </td>
                      <td className="text-center align-middle !text-white text-xs font-normal py-1 border-b-[#ffffff14] border-b border-solid md:text-[14px]">
                        {champion?.health[0]}
                      </td>
                      <td className="text-center align-middle !text-white text-xs font-normal py-1 border-b-[#ffffff14] border-b border-solid md:text-[14px]">
                        {champion?.armor}
                      </td>
                      <td className="text-center align-middle !text-white text-xs font-normal py-1 border-b-[#ffffff14] border-b border-solid md:text-[14px]">
                        {champion?.attackDamage[0]}
                      </td>
                      <td className="text-center align-middle !text-white text-xs font-normal py-1 border-b-[#ffffff14] border-b border-solid md:text-[14px]">
                        <div className="mt-[6px]">
                          <img src={attackDistance.src} className="" />
                        </div>
                      </td>
                      <td className="text-center align-middle !text-white text-xs font-normal py-1 border-b-[#ffffff14] border-b border-solid md:text-[14px]">
                        {champion?.attackSpeed}
                      </td>
                      <td className="text-center align-middle !text-white text-xs font-normal py-1 border-b-[#ffffff14] border-b border-solid md:text-[14px]">
                        {champion?.damagePerSecond?.[0]}
                      </td>
                      <td className="text-center align-middle !text-white text-xs font-normal py-1 border-b-[#ffffff14] border-b border-solid md:text-[14px]">
                        <div className="flex justify-center items-center">
                          <img
                            src={champion?.skill?.imageUrl}
                            className="w-[28px] h-[28px]"
                          />
                        </div>
                      </td>
                      <td className="text-center align-middle !text-white text-xs font-normal py-1 border-b-[#ffffff14] border-b border-solid">
                        <div className="flex justify-center items-center flex-wrap">
                          <img
                            src={icoMp.src}
                            className="w-[14px] h-[14px] md:w-[20px] md:h-[20px]"
                          />
                          <span>
                            {champion?.skill?.startingMana}/
                            {champion?.skill?.skillMana}
                          </span>
                        </div>
                      </td>
                    </tr>
                  )
              )}
            </tbody>
          </table>
        </article>
      </div>
    </ChampionsStyleWrapper>
  );
};

export default Traits;
