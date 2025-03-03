import React, { Fragment, useState } from "react";
import Link from "next/link";
import ProgressBar from "@components/progressBar";
import CardHover from "@components/cardHover";
import { Tooltip } from "react-tooltip";
import TraitTooltip from "src/components/tooltip/TraitTooltip";
import "react-tooltip/dist/react-tooltip.css";
import ProjectCardStyleWrapper from "./AugmentsTrendsCard.style";
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

const ProjectCard = ({
  thumb,
  title,
  price,
  launchedDate,
  totalRised,
  progress,
  coinIcon,
}) => {
  const inlineStyle = {
    backgroundImage: `url(${TrainGoldBg.src})`,
    backgroundPosition: "50%",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    display: "inline-flex",
    height: "28px",
    justifyContent: "center",
    verticalAlign: "middle",
    width: "28px",
  };

  const [isOpen, setIsOpen] = useState(false);

  const handleMouseEnter = () => {
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
  };

  return (
    <ProjectCardStyleWrapper>
      <tr>
        <th>
          <div>#</div>
        </th>
        <th>
          <div>Champions</div>
        </th>
        <th>
          <div>Avg. Rank</div>
        </th>
        <th>
          <div>TOP4</div>
        </th>
        <th>
          <div>Win%</div>
        </th>
        <th>
          <div>Pick%</div>
        </th>
        <th>
          <div>Played</div>
        </th>
        <th>
          <div>3-Stars%</div>
        </th>
        <th>
          <div>3-Stars Rank</div>
        </th>
        <th>
          <div>Recommend Items</div>
        </th>
      </tr>
      {/* <div className="previous-item hover-shape-border hover-shape-inner">
        <div className="previous-gaming">
          <div className="previous-price">
            <h4 className="m-0">
              <Link href="/projects-details-1">{title}</Link>
            </h4>
          </div>
        </div>
        <div className="previous-traits">
          <div className="previous-image">
            <div style={inlineStyle} data-tooltip-id="my-tooltip">
              <img
                src={GirlCrush.src}
                className="power-icon"
                alt="Power icon"
              />
            </div>
            <div style={inlineStyle}>
              <img
                src={Blockbuster.src}
                className="power-icon"
                alt="Power icon"
              />
            </div>
            <div style={inlineStyle}>
              <img src={Chaos.src} className="power-icon" alt="Power icon" />
            </div>
            <div style={inlineStyle}>
              <img src={Druid.src} className="power-icon" alt="Power icon" />
            </div>
            <div style={inlineStyle}>
              <img src={Fury.src} className="power-icon" alt="Power icon" />
            </div>
            <div style={inlineStyle}>
              <img src={Guardian.src} className="power-icon" alt="Power icon" />
            </div>
          </div>
        </div>
        <div className="previous-chaining">
          <div style={{ position: "relative" }}>
            <img src={chineseWeapon.src} className="item" alt="Chain icon" />
            <div className="item-amount">$5</div>
          </div>
          <div style={{ position: "relative" }}>
            <img src={englandWeapon.src} className="item" alt="Chain icon" />
          </div>
          <div style={{ position: "relative" }}>
            <img src={greekWeapon.src} className="item" alt="Chain icon" />
          </div>
          <div style={{ position: "relative" }}>
            <img src={indianWeapon.src} className="item" alt="Chain icon" />
          </div>
        </div>
        <div className="previous-raise">
          <span>
            <img src={coin.src} className="coin-img" /> {price}
          </span>
          <ProgressBar progress={progress} />
        </div>
      </div> */}
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
