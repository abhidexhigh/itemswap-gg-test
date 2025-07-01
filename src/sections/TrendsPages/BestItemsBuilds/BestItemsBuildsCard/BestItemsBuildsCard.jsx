import React, { Fragment, useState } from "react";
import { WithTooltip } from "src/components/tooltip/GlobalTooltip";
import ProjectCardStyleWrapper from "./BestItemsBuildsCard.style";
import GirlCrush from "@assets/image/traits/GirlCrush.svg";
import TrainGoldBg from "@assets/image/traitBackgrounds/gold.svg";

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
            <WithTooltip 
              variant="trait" 
              content={{
                name: "Lillia",
                desc: "Confetti Bloom: Deal magic damage to adjacent enemies. Heal Lillia and her nearest ally.",
                imageUrl: GirlCrush.src
              }}
            >
              <div style={inlineStyle}>
                <img
                  src={GirlCrush.src}
                  className="power-icon"
                  alt="Power icon"
                />
              </div>
            </WithTooltip>
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
    </ProjectCardStyleWrapper>
  );
};

export default ProjectCard;
