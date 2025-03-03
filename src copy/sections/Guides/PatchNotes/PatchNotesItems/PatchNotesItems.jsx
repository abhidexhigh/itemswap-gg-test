import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import React, { useState } from "react";
import { Tooltip } from "react-tooltip";
import projectsData from "@assets/data/projects/dataV6";
import indianWeapon from "@assets/image/items/weapons/indian weapon.png";
import TraitTooltip from "src/components/tooltip/TraitTooltip";
import "react-tooltip/dist/react-tooltip.css";
import GirlCrush from "@assets/image/traits/GirlCrush.svg";
import TrendFilters from "src/components/trendFilters";
import set10 from "@assets/image/backgrounds/set-10.jpg";

const PatchNotesItems = () => {
  const { data } = projectsData;
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <div className="container">
        <br />
        <div className="md:flex">
          <section
            className="mb-6 md:flex-[0_0_25%]"
            style={{
              background: "rgba(0, 0, 0, 0.2)",
              boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
              backdropFilter: "blur(2px)",
              border: "1px solid rgba(35, 31, 31, 0.3)",
            }}
          >
            <article>
              <ul className="[list-style:none] m-0 p-0">
                <li className="pt-0 text-white py-2 px-0 font-bold">
                  <a className="flex justify-between items-center h-[50px] py-0 px-4 [background:url('//cdn.dak.gg/tft/images2/patch-notes/img-patchnote-set-10.jpg')_50%_center_/_cover_no-repeat]">
                    <span className="md:text-[18px]">Set 10</span>
                    <img
                      src="//cdn.dak.gg/tft/images2/tft/icons/ico-caret-up-white.svg"
                      alt="Up"
                    />
                  </a>
                  <ul className="[list-style:none] m-0 p-0">
                    <li className=" h-[42px] py-0 px-4 flex justify-start items-center text-left text-[14px] text-white font-normal bg-[#101827] rounded-[4px] md:rounded-none cursor-pointer">
                      <a href="#" className="w-full h-full flex items-center">
                        Mar 05, 2024 - 14.5
                      </a>
                    </li>
                    {Array(4)
                      .fill(0)
                      .map((_, i) => (
                        <li className=" h-[42px] py-0 px-4 flex justify-start items-center text-left text-[14px] text-[#4F4F67] font-normal rounded-[4px] md:rounded-none !border !border-[#e6e6e620] cursor-pointer">
                          <a
                            href="#"
                            className="w-full h-full flex items-center"
                          >
                            Mar 05, 2024 - 14.5
                          </a>
                        </li>
                      ))}
                  </ul>
                </li>
              </ul>
              <ul className="[list-style:none] m-0 p-0">
                <li className="pt-0 text-white py-2 px-0 font-bold">
                  <a className="flex justify-between items-center h-[50px] py-0 px-4 [background:url('//cdn.dak.gg/tft/images2/patch-notes/img-patchnote-set-10.jpg')_50%_center_/_cover_no-repeat]">
                    <span className="md:text-[18px]">Set 10</span>
                    <img
                      src="//cdn.dak.gg/tft/images2/tft/icons/ico-caret-up-white.svg"
                      alt="Up"
                    />
                  </a>
                </li>
              </ul>
              <ul className="[list-style:none] m-0 p-0">
                <li className="pt-0 text-white py-2 px-0 font-bold">
                  <a className="flex justify-between items-center h-[50px] py-0 px-4 [background:url('//cdn.dak.gg/tft/images2/patch-notes/img-patchnote-set-10.jpg')_50%_center_/_cover_no-repeat]">
                    <span className="md:text-[18px]">Set 10</span>
                    <img
                      src="//cdn.dak.gg/tft/images2/tft/icons/ico-caret-up-white.svg"
                      alt="Up"
                    />
                  </a>
                </li>
              </ul>
              <ul className="[list-style:none] m-0 p-0">
                <li className="pt-0 text-white py-2 px-0 font-bold">
                  <a className="flex justify-between items-center h-[50px] py-0 px-4 [background:url('//cdn.dak.gg/tft/images2/patch-notes/img-patchnote-set-10.jpg')_50%_center_/_cover_no-repeat]">
                    <span className="md:text-[18px]">Set 10</span>
                    <img
                      src="//cdn.dak.gg/tft/images2/tft/icons/ico-caret-up-white.svg"
                      alt="Up"
                    />
                  </a>
                </li>
              </ul>
            </article>
          </section>
          <section className="md:flex-[0_0_75%] md:pl-5">
            <article>
              {Array(4)
                .fill(0)
                .map((_, i) => (
                  <div className="border border-[#e6e6e620] mb-4">
                    <div className="flex justify-between items-center text-white text-md font-bold text-left px-[18px] py-[9px] border-b-[#e6e6e620] border-b border-solid">
                      <div className="md:text-[20px] ">INKBORN FABLES</div>
                    </div>
                    <ul className="text-white text-sm font-normal pl-10 pr-4 py-4">
                      <li className="text-left list-disc mb-[3px] last-of-type:mb-0 md:text-[16px] text-[#fff]">
                        Our next set comes next patch, so if you need to catchh
                        up on Inkborn Fables content you can find those links in
                        the intro for our Inkborn Fables dev drop, and our
                        gameplay overview article for the set.
                      </li>
                    </ul>
                  </div>
                ))}
            </article>
          </section>
        </div>
      </div>
    </>
  );
};

export default PatchNotesItems;
