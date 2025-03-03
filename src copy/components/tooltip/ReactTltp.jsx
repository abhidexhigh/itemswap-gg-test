import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import Comps from "../../data/compsNew.json";

const ReactTltp = ({ variant = "", content, id }) => {
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
  let renderData = "";
  if (variant === "champion") {
    return (
      <Tooltip
        id={id}
        // delayHide={1000}
        delayShow={500}
        style={{ zIndex: 9999, backgroundColor: "black" }}
      >
        <div className="w-[200px] text-[#fff] bg-black z-[9999]">
          <div className="flex justify-start items-center gap-x-2">
            {content?.name}
            <span className="flex justify-center items-center">
              <img
                src="https://res.cloudinary.com/dg0cmj6su/image/upload/v1720771035/dollar_i5ay9s.png"
                className="w-3"
              />
              {content?.cost}
            </span>
          </div>
          <div className="mb-2 z-[9999]">
            {content?.traits.map((trait) => (
              <div className="flex justity-left items-center">
                <img
                  src={traits?.find((t) => t?.key === trait)?.imageUrl}
                  className="w-5"
                />
                <span className="text-xs font-light">{trait}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-start items-center text-xs font-light mb-2">
            <div>Attack Range: </div>
            <div>{content?.attackRange}</div>
          </div>
          <div className="flex justify-start items-center gap-x-2">
            <img src={content?.skill?.imageUrl} className="w-6" />
            <div className="text-xs font-light">
              <div>{content?.skill?.name}</div>
              <div>Mana: {content?.skill?.skillMana}</div>
            </div>
          </div>
          <div className="text-[10px] text-left font-light mb-1">
            {content?.skill?.desc}
          </div>
          <div className="text-xs text-left font-light">
            Attack Speed: {content?.attackSpeed}
          </div>
          <div className="text-xs text-left font-light mb-1">
            Damage: {content?.damagePerSecond}
          </div>
          <div>
            <div className="text-xs text-left font-light">
              Recommended Items
            </div>
            <div className="flex justify-start items-center gap-x-1">
              {content?.recommendItems?.map((item) => (
                <img
                  src={items?.find((i) => i?.key === item)?.imageUrl}
                  className="w-8"
                />
              ))}
            </div>
          </div>
        </div>
      </Tooltip>
    );
  } else if (variant === "item") {
    return (
      <Tooltip
        id={id}
        // delayHide={1000}
        delayShow={500}
        style={{ zIndex: 9999, backgroundColor: "black" }}
      >
        <div className="w-[150px] text-[#fff] bg-[black]">
          <div className="flex justify-start items-center gap-x-2">
            {content?.name}
          </div>
          <div className="text-xs font-light mb-2">{content?.shortDesc}</div>
          <div className="flex justify-start items-center gap-x-2">
            {content?.compositions &&
              content?.compositions.length > 0 &&
              content?.compositions?.map((comp, index) => (
                <div className="flex justify-center items-center">
                  <div className="rounded-full">
                    <img
                      src={items?.find((item) => item?.key === comp)?.imageUrl}
                      className="w-10 mr-1"
                    />
                  </div>
                  {index < content?.compositions?.length - 1 ? " +" : ""}
                </div>
              ))}
          </div>
        </div>
      </Tooltip>
    );
  } else if (variant === "trait") {
    return (
      <Tooltip
        id={id}
        delayShow={500}
        style={{ zIndex: 9999, backgroundColor: "black" }}
      >
        <div className="w-[200px] text-[#fff] bg-black">
          <div className="flex justify-start items-center gap-x-2">
            {content?.name}
          </div>
          <div className="text-[12px] font-light mb-2">{content?.desc}</div>
          <div className="text-center">
            {content.stats ? (
              Object.entries(content.stats).map(([key, value]) => (
                <div
                  className={`mb-1 text-xs flex justify-start items-center ${parseInt(key) === parseInt(content?.numUnits) || parseInt(key) - 1 === parseInt(content?.numUnits) ? "text-[#23aa23] font-bold" : "text-[#fff]  font-light"}`}
                  key={key}
                >
                  <span
                    className={`px-2 py-1 rounded-full ${parseInt(key) === parseInt(content?.numUnits) || parseInt(key) - 1 === parseInt(content?.numUnits) ? "bg-[#ffffff]" : "bg-[#a97322]"}`}
                  >
                    {key}
                  </span>
                  : {value}
                </div>
              ))
            ) : (
              <p>No stats available.</p>
            )}
          </div>
        </div>
      </Tooltip>
    );
  } else if (variant === "augment") {
    return (
      <Tooltip
        id={id}
        delayShow={500}
        style={{ zIndex: 9999, backgroundColor: "black" }}
      >
        <div className="w-[200px] text-[#fff] bg-black">
          <div className="flex justify-start items-center gap-x-2">
            {content?.name}
          </div>
          <div className="text-[12px] font-light mb-2">{content?.desc}</div>
        </div>
      </Tooltip>
    );
    // } else if (variant === "comp") {
  } else {
    return (
      <Tooltip
        id={id}
        // delayHide={1000}
        delayShow={500}
        style={{ zIndex: 9999 }}
        content={content}
      />
    );
  }
};

export default ReactTltp;
