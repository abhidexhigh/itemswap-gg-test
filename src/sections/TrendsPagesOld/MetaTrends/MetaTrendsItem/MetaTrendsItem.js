import React from "react";
import { Tooltip as Ttip } from "flowbite-react";
import annie from "@assets/image/items/annie.jpeg";
import { IoMdCheckmarkCircle } from "react-icons/io";

const MetaTrendsItem = ({ title, description, image, link }) => {
  return (
    <Ttip content="Tooltip content" animation="duration-500" arrow={false}>
      <div className="relative inline-flex cursor-pointer overflow-hidden">
        <div className="relative inline-flex flex-col">
          <div className="relative flex flex-col w-[32px] h-[32px]">
            <div className="relative inline-flex overflow-hidden rounded-[6px] w-full h-full border-[#848999] border-2">
              <img src={annie.src} alt="icon" />
            </div>
          </div>
        </div>
        {/* <div className="flex justify-center items-center absolute top-1/2 left-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 bg-[#2322228f] rounded-[6px]">
          <span
            width="14"
            height="15"
            color="#FFFFFF"
            className="IconContainer block h-[14px] w-[14px]"
          >
            <IoMdCheckmarkCircle />
          </span>
        </div> */}
      </div>
    </Ttip>
  );
};

export default MetaTrendsItem;
