import { Tooltip } from "react-tooltip";
import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { createPortal } from "react-dom";
import { OptimizedImage } from "../../utils/imageOptimizer";
import Comps from "../../data/compsNew.json";

// Constants
const TOOLTIP_CONTAINER_ID = "global-tooltip-container";

// Utility functions (moved outside component to prevent recreation)
const isTouchDevice = () => {
  if (typeof window === "undefined") return false;
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  );
};

const generateId = () =>
  `tooltip-${Math.random().toString(36).substring(2, 9)}`;

// Memoized tooltip content components
const ChampionTooltip = ({ content, traits, items }) => (
  <div className="w-[200px] text-[#fff] bg-black">
    <div className="flex justify-start items-center gap-x-2">
      {content?.name}
      <span className="flex justify-center items-center">
        <OptimizedImage
          src="https://res.cloudinary.com/dg0cmj6su/image/upload/v1720771035/dollar_i5ay9s.png"
          className="w-3"
          alt="dollar"
          width={24}
          height={24}
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAwAB/SkhXQAAAABJRU5ErkJggg=="
        />
        {content?.cost}
      </span>
    </div>

    <div className="mb-2">
      {content?.traits?.map((trait, index) => (
        <div className="flex justify-left items-center" key={trait || index}>
          <OptimizedImage
            src={traits?.find((t) => t?.key === trait)?.imageUrl}
            className="w-5"
            alt={trait}
            width={24}
            height={24}
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAwAB/SkhXQAAAABJRU5ErkJggg=="
          />
          <span className="text-xs font-light">{trait}</span>
        </div>
      ))}
    </div>

    <div className="flex justify-start items-center gap-x-2">
      <div>Abilities</div>
      <div className="flex justify-start items-center gap-x-2">
        {content?.abilities?.map((ability, index) => (
          <OptimizedImage
            key={ability?.imageUrl || index}
            src={ability?.imageUrl}
            alt="skill"
            width={24}
            height={24}
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAwAB/SkhXQAAAABJRU5ErkJggg=="
            className="w-8 rounded-sm !border !border-white/60"
          />
        ))}
      </div>
    </div>

    <div className="text-[10px] text-left font-light mb-1">
      {content?.skill?.desc}
    </div>
    <div className="text-xs text-left font-light">
      Attack Range: {content?.attackRange}
    </div>
    <div className="text-xs text-left font-light">
      Attack Speed: {content?.attackSpeed}
    </div>
    <div className="text-xs text-left font-light mb-1">
      Damage: {content?.attackDamage}
    </div>
    <div className="text-xs text-left font-light mb-1">
      Mana: {content?.mana}
    </div>

    <div>
      <div className="text-xs text-left font-light">Recommended Items</div>
      <div className="flex justify-start items-center gap-x-1">
        {content?.recommendItems?.map((item, index) => (
          <OptimizedImage
            key={item || index}
            src={items?.find((i) => i?.key === item)?.imageUrl}
            alt={item}
            width={24}
            height={24}
            className="w-8 rounded-sm !border !border-white/60"
          />
        ))}
      </div>
    </div>
  </div>
);

const ItemTooltip = ({ content, items }) => (
  <div className="w-[150px] text-[#fff] bg-[black]">
    <div className="flex justify-start items-center gap-x-2">
      {content?.name}
    </div>
    <div className="text-xs font-light mb-2">{content?.shortDesc}</div>
    <div className="flex justify-start items-center gap-x-2">
      {content?.compositions?.map((comp, index) => (
        <div className="flex justify-center items-center" key={comp || index}>
          <OptimizedImage
            src={items?.find((item) => item?.key === comp)?.imageUrl}
            width={24}
            height={24}
            className="w-10 mr-1"
            alt={comp}
          />
          {index < content.compositions.length - 1 && " +"}
        </div>
      ))}
    </div>
  </div>
);

const TraitTooltip = ({ content }) => (
  <div className="w-[200px] text-[#fff] bg-black">
    <div className="flex justify-start items-center gap-x-2">
      {content?.name}
    </div>
    <div className="text-[12px] font-light mb-2">{content?.desc}</div>
    <div className="text-center">
      {content.stats ? (
        Object.entries(content.stats).map(([key, value]) => {
          const isActive =
            parseInt(key) === parseInt(content?.numUnits) ||
            parseInt(key) - 1 === parseInt(content?.numUnits);

          return (
            <div
              className={`mb-1 text-xs flex justify-start items-center ${
                isActive ? "text-[#23aa23] font-bold" : "text-[#fff] font-light"
              }`}
              key={key}
            >
              <span
                className={`px-2 py-1 rounded-full ${
                  isActive ? "bg-[#ffffff]" : "bg-[#a97322]"
                }`}
              >
                {key}
              </span>
              : {value}
            </div>
          );
        })
      ) : (
        <p>No stats available.</p>
      )}
    </div>
  </div>
);

const OtherTraitsTooltip = ({ content, traits }) => (
  <div className="max-w-[300px] text-[#fff] bg-black">
    <div className="flex text-lg justify-start items-center gap-x-2">
      Traits
    </div>
    <div className="text-[12px] font-light mb-2">{content?.desc}</div>
    <div className="grid grid-cols-4 justify-center items-center gap-x-4">
      {content?.map((trait, index) => (
        <div key={trait?.name || index}>
          <OptimizedImage
            src={traits?.find((t) => t?.key === trait?.name)?.imageUrl}
            className="w-14"
            alt={trait?.name}
            width={24}
            height={24}
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAwAB/SkhXQAAAABJRU5ErkJggg=="
          />
          <div className="text-sm text-center font-light">{trait?.name}</div>
        </div>
      ))}
    </div>
  </div>
);

const SimpleTooltip = ({ content }) => (
  <div className="w-[200px] text-[#fff] bg-black">
    <div className="flex justify-start items-center gap-x-2">
      {content?.name}
    </div>
    {content?.desc && (
      <div className="text-[12px] font-light mb-2">{content.desc}</div>
    )}
  </div>
);

// Portal component (memoized)
const TooltipPortal = ({ children }) => {
  const [container, setContainer] = useState(null);

  useEffect(() => {
    let tooltipContainer = document.getElementById(TOOLTIP_CONTAINER_ID);

    if (!tooltipContainer) {
      tooltipContainer = document.createElement("div");
      tooltipContainer.id = TOOLTIP_CONTAINER_ID;
      Object.assign(tooltipContainer.style, {
        position: "fixed",
        zIndex: "10000",
        pointerEvents: "none",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%",
      });
      document.body.appendChild(tooltipContainer);
    }

    setContainer(tooltipContainer);
  }, []);

  return container ? createPortal(children, container) : null;
};

const ReactTltp = ({ variant = "", content, id }) => {
  // Memoize data extraction
  const gameData = useMemo(() => {
    const {
      props: {
        pageProps: {
          dehydratedState: {
            queries: { data },
          },
        },
      },
    } = Comps;

    return {
      metaDecks: data?.metaDeckList?.metaDecks,
      champions: data?.refs?.champions,
      items: data?.refs?.items,
      traits: data?.refs?.traits,
    };
  }, []);

  // Stable ID generation
  const tooltipId = useMemo(() => id || generateId(), [id]);

  // Device detection (memoized)
  const isTouch = useMemo(() => isTouchDevice(), []);

  // Memoize tooltip content
  const tooltipContent = useMemo(() => {
    const { champions, items, traits } = gameData;

    const contentProps = {
      overflowX: "hidden",
      overflowY: "auto",
      maxHeight: isTouch ? "70vh" : "auto",
    };

    switch (variant) {
      case "champion":
        return (
          <ChampionTooltip content={content} traits={traits} items={items} />
        );
      case "item":
        return <ItemTooltip content={content} items={items} />;
      case "trait":
        return <TraitTooltip content={content} />;
      case "otherTraits":
        return <OtherTraitsTooltip content={content} traits={traits} />;
      case "augment":
      case "force":
      case "skillTree":
        return <SimpleTooltip content={content} />;
      default:
        return content;
    }
  }, [variant, content, gameData, isTouch]);

  // Memoize tooltip props
  const tooltipProps = useMemo(
    () => ({
      id: tooltipId,
      delayShow: 0,
      className: `tooltip-container tooltip-${variant}`,
      style: {
        zIndex: 10000,
        position: "fixed",
        backgroundColor: variant ? "black" : undefined,
        border: variant === "otherTraits" ? "1px solid #000000" : undefined,
        borderRadius: variant === "otherTraits" ? "4px" : undefined,
        maxWidth: "90vw",
        opacity: 0,
        transition: "opacity 0.2s ease-in-out",
      },
      place: "bottom",
      offset: 40,
      clickable: false,
      positionStrategy: "fixed",
      float: true,
      noArrow: false,
      events: isTouch ? ["touch"] : ["hover"],
    }),
    [tooltipId, variant, isTouch]
  );

  return (
    <TooltipPortal>
      <Tooltip {...tooltipProps}>
        <div
          className="tooltip-content"
          style={{
            overflowX: "hidden",
            overflowY: "auto",
            maxHeight: isTouch ? "70vh" : "auto",
          }}
        >
          {tooltipContent}
        </div>
      </Tooltip>
    </TooltipPortal>
  );
};

export default ReactTltp;
