import React from "react";
import MetaTrendsItem from "../MetaTrendsItem/MetaTrendsItem";

const MetaTrendsCard = ({
  title,
  description,
  image,
  link,
  cost,
  itemCount,
}) => {
  return (
    <div className="flex flex-col overflow-hidden rounded-[4px] bg-[#2D2F37] lg:bg-[#2A2C33]">
      <header className="flex flex-col bg-[#27282E]">
        <h5 className="flex justify-center items-center h-[34px] gap-[4px] m-1">
          <span width="12" height="12" className="block h-[14px] w-[14px]">
            <svg
              viewBox="0 0 12 12"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              width="100%"
              height="100%"
            >
              <path
                d="M12 6A6 6 0 1 1 0 6a6 6 0 0 1 12 0Z"
                fill="#FFC528"
              ></path>
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M6 11A5 5 0 1 0 6 1a5 5 0 0 0 0 10Zm0 1A6 6 0 1 0 6 0a6 6 0 0 0 0 12Z"
                fill="#FF8929"
              ></path>
              <path
                d="M6.58 9.5c-.511 0-.985-.076-1.422-.228a3.287 3.287 0 0 1-1.14-.665 3.075 3.075 0 0 1-.746-1.085C3.091 7.091 3 6.592 3 6.027c0-.559.094-1.054.282-1.485.189-.438.444-.808.767-1.112a3.256 3.256 0 0 1 1.14-.693c.436-.158.9-.237 1.39-.237.539 0 .996.088 1.372.264.383.177.696.377.938.602l-.797.857a2.718 2.718 0 0 0-.615-.401c-.222-.11-.504-.164-.847-.164-.309 0-.595.054-.857.164a1.857 1.857 0 0 0-.665.455 2.26 2.26 0 0 0-.434.73c-.1.285-.151.61-.151.975 0 .735.185 1.312.554 1.732.37.413.921.62 1.654.62.182 0 .356-.022.524-.064.169-.043.306-.107.414-.192v-1.33H6.348V5.644H9v3.044c-.255.225-.592.416-1.008.574A3.96 3.96 0 0 1 6.58 9.5Z"
                fill="#FF8929"
              ></path>
            </svg>
          </span>
          <span className="text-[12px] font-semibold leading-none text-[#999]">
            {cost}
          </span>
        </h5>
      </header>
      <div className="flex flex-col p-[12px] lg:px-[14px]">
        <div className="flex flex-wrap" style={{ gap: "8px" }}>
          {Array(itemCount)
            .fill()
            .map((_, i) => (
              <MetaTrendsItem />
            ))}
        </div>
      </div>
    </div>
  );
};

export default MetaTrendsCard;
