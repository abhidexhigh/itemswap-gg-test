import React, { Fragment, useState } from "react";
import Link from "next/link";
import ProgressBar from "@components/progressBar";
import CardHover from "@components/cardHover";
import { Tooltip } from "react-tooltip";
import TraitTooltip from "src/components/tooltip/TraitTooltip";
import "react-tooltip/dist/react-tooltip.css";
import ProjectCardStyleWrapper from "./ProjectCard.style";
import GirlCrush from "@assets/image/traits/GirlCrush.svg";
import Blockbuster from "@assets/image/traits/Blockbuster.svg";
import Chaos from "@assets/image/traits/Chaos.svg";
import Druid from "@assets/image/traits/Druid.svg";
import Fury from "@assets/image/traits/Fury.svg";
import Guardian from "@assets/image/traits/Guardian.svg";
import Mirage from "@assets/image/traits/Mirage.svg";
import TrainIronBg from "@assets/image/traitBackgrounds/iron.svg";
import TrainBronzeBg from "@assets/image/traitBackgrounds/bronze.svg";
import TrainSilverBg from "@assets/image/traitBackgrounds/silver.svg";
import TrainGoldBg from "@assets/image/traitBackgrounds/gold.svg";
import TrainDiamondBg from "@assets/image/traitBackgrounds/diamond.svg";
import chineseWeapon from "@assets/image/items/weapons/chinese weapon.png";
import englandWeapon from "@assets/image/items/weapons/england weapon.png";
import greekWeapon from "@assets/image/items/weapons/greek weapon.png";
import indianWeapon from "@assets/image/items/weapons/indian weapon.png";
import coin from "@assets/image/icons/coin.png";
import styled from "styled-components";

const ProjectCard = ({ comps, items, traits, champions }) => {
  const inlineStyle = {
    backgroundImage: `url(${TrainGoldBg.src})`,
    backgroundPosition: "50%",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    display: "inline-flex",
    height: "56px",
    justifyContent: "center",
    verticalAlign: "middle",
    width: "56px",
  };

  const [isOpen, setIsOpen] = useState(false);
  // return <></>;
  return (
    <ProjectCardStyleWrapper>
      <div className="previous-item !gap-y-2 hover-shape-border hover-shape-inner">
        <div className="previous-price">
          <h5 className="m-0 md:text-[20px]">{comps?.name}</h5>
        </div>
        <div className="previous-gaming flex justify-between">
          {/* <div className="previous-price">
            <h5 className="m-0">{comps?.name}</h5>
          </div> */}
          <div className="previous-raise md:!hidden w-auto">
            <span>
              <img src={coin?.src} className="coin-img !w-4 mx-auto inline" />{" "}
              {comps?.cost}
            </span>
          </div>
        </div>
        <div className="previous-raise !hidden sm:!block">
          <span>
            <img src={coin?.src} className="coin-img !w-4 mx-auto inline" />{" "}
            {comps?.cost}
          </span>
        </div>
        <div className="previous-chaining !gap-x-1.5 md:!gap-x-2">
          {comps?.data?.slots
            ?.sort((a, b) => a.champion.localeCompare(b.champion))
            ?.map((champion, i) =>
              champions?.find((champ) => champ?.key === champion?.champion)
                ?.cost[0] ? (
                <div className="relative flex flex-col items-center w-[60px] h-[92px] md:h-[135px] md:w-[90px]">
                  <div className="absolute top-0 right-0 text-[10px] leading-[11px] text-[#ffffff] pointer-events-none w-[18px] h-[12px] flex items-center justify-center rounded-tr-[4px] [text-shadow:-1px_0_2px_#000,_0_1px_2px_#000,_1px_0_2px_#000,_0_-1px_2px_#000] pb-px z-50 bg-[#848999] rounded-sm">
                    $
                    {
                      champions?.find(
                        (champ) => champ?.key === champion?.champion
                      )?.cost[0]
                    }
                  </div>
                  <div className="rounded-md" style={{ position: "relative" }}>
                    <img
                      src={
                        champions?.find(
                          (champ) => champ?.key === champion?.champion
                        )?.imageUrl
                      }
                      className="item rounded-md !w-[60px] md:!w-[90px]"
                      alt="Chain icon"
                    />

                    <div className="absolute h-[18px] w-[85%] text-[10px] text-center pointer-events-none [text-shadow:-1px_0_2px_#000,_0_1px_2px_#000,_1px_0_2px_#000,_0_-1px_2px_#000] bottom-[0] whitespace-nowrap overflow-hidden overflow-ellipsis">
                      {champion?.champion}
                    </div>
                  </div>
                  {champion?.items?.length && (
                    <div className="w-[42px] absolute flex justify-center bottom-[0]">
                      {champion?.items?.map((item, i) => (
                        <div className="w-[24px] h-[24px]">
                          <img
                            src={
                              items?.find((itm) => itm?.key === item)?.imageUrl
                            }
                            className="w-full h-full"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : null
            )}
        </div>
        <div className="previous-traits">
          <div className="previous-image">
            <div style={inlineStyle} data-tooltip-id="my-tooltip">
              <img
                src={GirlCrush?.src}
                className="power-icon"
                alt="Power icon"
              />
            </div>
            <div style={inlineStyle}>
              <img
                src={Blockbuster?.src}
                className="power-icon"
                alt="Power icon"
              />
            </div>
          </div>
        </div>
      </div>
      <Tooltip
        id="my-tooltip"
        effect="solid"
        style={{
          zIndex: 999,
          backgroundColor: "#1e1e2f",
          opacity: "1 !important",
        }}
      >
        <TraitTooltip
          title="Lillia"
          icon={GirlCrush.src}
          description={{
            title: "Confetti Bloom",
            text: "Deal magic damage to adjacent enemies. Heal Lillia and her nearest ally.",
          }}
          magicDamage="180 / 270 / 400"
          healAmount="180 / 220 / 260"
          allyHealAmount="90 / 110 / 130"
          rangeFilled={70}
        />
      </Tooltip>
    </ProjectCardStyleWrapper>
  );
};

export default ProjectCard;
