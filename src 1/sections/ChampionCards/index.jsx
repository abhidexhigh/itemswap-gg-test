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
import compsData from "../../ApiStructure/Comps/Comps.json";
import { IoMdCheckmarkCircle } from "react-icons/io";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import GlobalTooltip from "src/components/tooltip/GlobalTooltip.jsx";
import Comps from "./../../data/compsNew.json";

const ChampionCards = ({ selected }) => {
  const [hoverIndex, setHoverIndex] = useState(null);
  const [tableHover, setTableHover] = useState(false);
  const [space1, setSpace1] = useState(null);
  const [space2, setSpace2] = useState(null);

  const {
    props: {
      pageProps: {
        dehydratedState: { queries: data },
      },
    },
  } = compsData;
  const {
    state: {
      data: { champions },
    },
  } = data?.find((item) => item?.queryKey.includes("championRefs"));
  const {
    state: {
      data: { items },
    },
  } = data?.find((item) => item?.queryKey.includes("itemRefs"));
  const {
    state: {
      data: { traits },
    },
  } = data?.find((item) => item?.queryKey.includes("traitsRefs"));
  const {
    state: {
      data: { guideDecks: comps },
    },
  } = data?.find((item) => item?.queryKey.includes("getGuideDecks"));

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

  const inactiveChampions = [2, 6, 7, 12, 15, 16, 20, 21, 23, 26, 30];

  return (
    <ChampionsStyleWrapper>
      <div className="container">
        <Set10Tabs
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <div
          style={{
            background: "rgba(0, 0, 0, 0.2)",
            borderRadius: "16px",
            boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
            backdropFilter: "blur(2px)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            overflow: "auto",
          }}
        >
          <div className="mt-4 mb-2 mx-4 bg-[#22222250]">
            <input
              type="text"
              className="w-full bg-transparent border-[1px] border-[#ffffff50] text-[#ffffff] rounded-md p-3"
              placeholder="Search..."
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 p-3 mb-10">
            {imageUrls.map((_, index) => (
              <div key={index} className="relative w-full h-auto mb-9 md:mb-14">
                <img
                  src={_?.imageUrl}
                  alt={_.name}
                  className={`w-[93%] mt-1 md:mt-2 mx-auto h-auto object-cover md:rounded-2xl ${
                    inactiveChampions.indexOf(index) > -1 ? "grayscale" : ""
                  }`}
                />
                <img
                  src="https://res.cloudinary.com/dg0cmj6su/image/upload/v1719832194/goldFrame_fh0mo7.webp"
                  alt="Frame"
                  className={`absolute top-0 left-0 w-full h-auto ${
                    inactiveChampions.indexOf(index) > -1 ? "grayscale" : ""
                  }`}
                />
                <div className="absolute -bottom-[34px] md:-bottom-[43px] left-2 w-full p-2 text-[#ffffff]">
                  {_.name}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="">
          <div
            className="grid grid-cols-5 md:gap-4 gap-1"
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
        </div>
      </div>
    </ChampionsStyleWrapper>
  );
};

export default ChampionCards;
