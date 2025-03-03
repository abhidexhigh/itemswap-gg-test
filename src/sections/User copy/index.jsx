import React, { useState } from "react";
import dynamic from "next/dynamic";
import ChampionsStyleWrapper from "./User.style.js";
import Set10Tabs from "../set10Tabs/index.js";
import { FaPlus, FaEquals } from "react-icons/fa";
import cloak from "@assets/image/items/basicItems/cloak.png";
import attackDistance from "@assets/image/icons/ico_attack_distance.png";
import icoMp from "@assets/image/icons/ico-mp.png";
import icoGold from "@assets/image/icons/ico-gold.svg";
import ahri from "@assets/image/icons/ahri.png";
import skull from "@assets/image/icons/29.png";
import emerald from "@assets/image/icons/emerald.png";
import provisional from "@assets/image/icons/provisional.png";
const TierGraph = dynamic(() => import("./TierGraph"), {
  ssr: false, // This line is key to making it only render on the client-side
});

const User = () => {
  const items = [
    "https://cdn.lolchess.gg/upload/images/items/BFSword_1658364277-1038.png",
    "https://cdn.lolchess.gg/upload/images/items/RecurveBow_1640058784.png",
    "https://cdn.lolchess.gg/upload/images/items/ChainVest_1640058945.png",
    "https://cdn.lolchess.gg/upload/images/items/NegatronCloak_1640059073.png",
    "https://cdn.lolchess.gg/upload/images/items/NeedlesslyLargeRod_1640059008.png",
    "https://cdn.lolchess.gg/upload/images/items/Tearofthegoddess_1640059037.png",
    "https://cdn.lolchess.gg/upload/images/items/GiantsBelt_1658368751-1011.png",
    "https://cdn.lolchess.gg/upload/images/items/SparringGloves_1640059055.png",
    "https://cdn.lolchess.gg/upload/images/items/Spatula_1658364227-4403.png",
  ];
  const [activeTab, setActiveTab] = useState("Set 10");
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

  const backgroundStyle = {
    backgroundImage: "url(//cdn.dak.gg/tft/images2/profile/level-bg.png)",
    backgroundRepeat: "no-repeat",
    // You can add more CSS properties here as needed, like backgroundSize or backgroundPosition
  };

  return (
    <ChampionsStyleWrapper>
      <div className="container">
        <div className="bg-slate-700 py-1 rounded-md mb-4">
          <div className="pl-4 max-w-[1080px] w-full my-5 md:my-[53px] mx-auto">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
              <div>
                <figure className="relative w-[80px] h-[80px]">
                  <img
                    src={skull.src}
                    className="w-full h-full rounded-[50%]"
                  />
                  <span
                    className="absolute flex justify-center items-center -bottom-[5px] left-1/2 -translate-x-1/2 text-[12px] leading-[130%] text-white w-10 h-[18px]"
                    style={backgroundStyle}
                  >
                    1
                  </span>
                </figure>
                <div className="flex items-center gap-[6px] md:hidden">
                  <h2 className="font-semibold text-base leading-[100%] text-white">
                    Jaishankar#EUW
                  </h2>
                  <span className="text-xs font-semibold leading-[100%] text-white [background:rgba(0,0,0,0.4)] px-1.5 py-[3px] rounded-sm">
                    EUW
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-1.5">
                  <h2 className="font-semibold text-2xl leading-[100%] text-white mb-0">
                    Jaishankar#EUW
                  </h2>
                  <span className="text-xs font-semibold leading-[100%] text-white [background:rgba(0,0,0,0.4)] px-1.5 py-[3px] rounded-sm">
                    EUW
                  </span>
                </div>
                <div className="flex gap-1.5 break-keep flex-wrap">
                  <button className="font-semibold text-sm leading-[100%] text-white transition-opacity duration-[0.2s] ease-[ease-in-out] delay-0 h-10 rounded-md flex [-webkit-box-pack:center] justify-center [-webkit-box-align:center] items-center gap-0.5 whitespace-nowrap [background:rgb(17,178,136)] px-4 py-[13px] hover:[background:rgb(18,187,143)][background:rgb(18,187,143)]">
                    <span>Need Update</span>
                  </button>
                  <a className="w-[90px] md:w-auto md:py-[13px] md:px-4 py-0 px-4 break-keep flex items-center justify-center bg-[#0d568a] rounded-md font-semibold text-[12px] leading-[100%] text-[#ffffff] [transition:opacity_0.2s_ease-in-out] text-center h-[40px] cursor-pointer">
                    Set 9.5 Report
                  </a>
                </div>
                <p className="text-xs leading-[100%] text-white">
                  <span>Latest upddate: 2h ago</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <main className="rounded-none p-0 mt-0 md:p-5 md:rounded w-full max-w-[1120px] md:mt-[26px] mx-[auto] mb-[80px]">
          <nav className="mb-5">
            <ul className="flex flex-wrap pl-0 mb-4 list-none bg-[#222231]">
              <li
                className={`flex-auto flex-grow-1 p-2 text-center !border-r !border-[#ffffff14] rounded-none font-black -mb-[1px] text-[12px] cursor-pointer px-[12px] md:p-0 ${
                  activeTab === "Set 10" ? "!bg-[#ca9372]" : ""
                }`}
                onClick={() => setActiveTab("Set 10")}
              >
                <a>Set 10</a>
              </li>
              <li
                className={`flex-auto flex-grow-1 p-2 text-center !border-r !border-[#ffffff14] rounded-none font-black -mb-[1px] text-[12px] cursor-pointer px-[12px] md:p-0 ${
                  activeTab === "Match History" ? "!bg-[#ca9372]" : ""
                }`}
                onClick={() => setActiveTab("Match History")}
              >
                <a>Match History</a>
              </li>
              <li
                className={`flex-auto flex-grow-1 p-2 text-center !border-r !border-[#ffffff14] rounded-none font-black -mb-[1px] text-[12px] cursor-pointer px-[12px] md:p-0 ${
                  activeTab === "LP History" ? "!bg-[#ca9372]" : ""
                }`}
                onClick={() => setActiveTab("LP History")}
              >
                <a>LP History</a>
              </li>
            </ul>
          </nav>
          <div className="flex flex-col md:flex-row gap-2 md:gap-[10px] md:h-[329px]">
            <div className="flex flex-col md:w-80">
              <section className="flex flex-1 flex-col bg-gray-700 border-b border-[#e9eaed]">
                <h3 className="text-[12px] leading-[100%] px-[16px] py-[12px] border-b-[1px_solid_#e9eaed] h-[36px] mb-0">
                  Ranked Game
                </h3>
                <div className="flex flex-1 flex-col justify-center !py-0 px-4">
                  <div className="flex justify-center items-center gap-2">
                    <img src={emerald.src} className="w-20" />
                    <div className="flex flex-col gap-2">
                      <div className="leading-4">
                        <strong className="inline-block font-semibold text-[16px] leading-4">
                          Emerald IV
                        </strong>
                        <span className="ml-1 text-[12px] leading-3"></span>
                      </div>
                      <div className="flex items-center gap-1 text-[12px] ">
                        <span>Top 6.949%</span>
                        <div className="w-px h-2 [background:rgb(207,209,215)]"></div>
                        <span>#73,858</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              <section className="p-4 border border-t-0 bg-[#374151] border-[#e9eaed]">
                <ul className="grid grid-cols-2 gap-5 list-none">
                  {Array(4)
                    .fill(0)
                    .map((_, i) => (
                      <li className="flex flex-col gap-[6px] h-[39px]">
                        <div className="text-[12px] flex justify-between">
                          <span>Wins</span>
                          <strong className="text-[#11b288]">34</strong>
                        </div>

                        <progress
                          className="progress progress-primary w-auto"
                          value="40"
                          max="100"
                        />
                      </li>
                    ))}
                </ul>
              </section>
            </div>
            <div className="flex flex-1 flex-col">
              <div className="flex flex-col bg-gray-700">
                <h3 className="text-[12px] leading-[100%] px-[16px] py-[12px] border-b-[1px_solid_#e9eaed] h-[36px]">
                  Ranked Game
                </h3>
                <TierGraph />
              </div>
            </div>
            <div className="flex flex-col basis-44">
              <div className="flex flex-col bg-gray-700">
                <div className="flex flex-col gap-2.5 basis-[180px] bg-[#151625]">
                  {Array(2)
                    .fill(0)
                    .map((_, i) => (
                      <div className="flex flex-col flex-1 border bg-[#374151] border-[#d3d3d3] min-h-[123.5px]">
                        <h3 className="text-[12px] leading-[100%] px-[16px] py-[12px] border-b border-[#d3d3d3] h-[36px] mb-0">
                          Hyper Roll
                        </h3>
                        <div className="flex flex-col flex-1 items-center pt-2">
                          <img
                            src={provisional.src}
                            className="w-[72px] h-[72px] object-contain"
                          />
                          <strong className="text-center">Unrated</strong>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-2.5 h-[329px]"></div>
        </main>
      </div>
    </ChampionsStyleWrapper>
  );
};

export default User;
