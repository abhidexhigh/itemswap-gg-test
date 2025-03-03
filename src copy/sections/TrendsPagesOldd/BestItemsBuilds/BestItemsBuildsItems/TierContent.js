import { Fragment, useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import indianWeapon from "@assets/image/items/weapons/indian weapon.png";

const TierCard = ({ tier, tierName, tierColor, tierItems }) => {
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  return (
    <Fragment>
      <div className="w-full bg-zinc-900 hidden md:block">
        <p className="text-center py-2">Tier 1</p>
      </div>
      <div className="w-full bg-zinc-900">
        <table className="w-full">
          <tbody>
            <tr>
              <td className="text-center py-0">
                <div className="flex pt-[8px] pr-0 pb-[8px] pl-[16px] gap-[6px] justify-between">
                  <div className="flex flex-shrink-1 gap-[6px]">
                    <div className="flex flex-col relative">
                      <div className="flex justify-between gap-2">
                        <div className="shrink-1 flex gap-1">
                          <div className="flex-col inline-flex relative w-[50px] h-[50px]">
                            <img src={indianWeapon.src} alt="icon" />
                          </div>
                        </div>
                      </div>
                      <p className="absolute bottom-0 left-0 w-full text-center text-[11px] leading-[14px] m-0 p-[2px]">
                        Annie
                      </p>
                    </div>
                    <div className="flex gap-[4px] items-center">
                      <div className="relative overflow-hidden">
                        <img src={indianWeapon.src} width={28} height={28} />
                      </div>
                    </div>
                    <div className="flex gap-[4px] items-center">
                      <div className="relative overflow-hidden">
                        <img src={indianWeapon.src} width={28} height={28} />
                      </div>
                    </div>
                    <div className="flex gap-[4px] items-center">
                      <div className="relative overflow-hidden">
                        <img src={indianWeapon.src} width={28} height={28} />
                      </div>
                    </div>
                  </div>
                  <button
                    className="flex px-[19px] py-[17px] cursor-pointer"
                    onClick={() => setIsAccordionOpen(!isAccordionOpen)}
                  >
                    {isAccordionOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
                  </button>
                </div>
                <table
                  className={`w-full table-fixed border-collapse ${
                    !isAccordionOpen ? "hidden" : ""
                  }`}
                >
                  <thead className="table-row-group w-full text-[11px] font-[400]">
                    <tr className="text-center text-[11px] font-[400]">
                      <th className="pt-[5.25px] pr-0 pb-[5.25px] pl-[16px] text-left bg-[#27282e] text-[#d0d0d0] whitespace-nowrap">
                        Best Items
                      </th>
                      <th className="pt-[5.25px] pr-0 pb-[5.25px] pl-[16px] text-left bg-[#27282e] text-[#d0d0d0] whitespace-nowrap w-[70px]">
                        Avg.Rank
                      </th>
                      <th className="pt-[5.25px] pr-0 pb-[5.25px] pl-[16px] text-left bg-[#27282e] text-[#d0d0d0] whitespace-nowrap w-[70px]">
                        Pick%
                      </th>
                    </tr>
                  </thead>
                  <tbody className="table-row-group w-full text-[11px] font-[400]">
                    <tr className="text-center text-[11px] font-[400]">
                      <td className="pt-[4px] pr-0 pb-[4px] pl-[16px] text-left text-[#d0d0d0] whitespace-nowrap">
                        <div className="flex justify-start items-center gap-[4px]">
                          <div className="rounded-full overflow-hidden">
                            <div className="relative overflow-hidden">
                              <img
                                src={indianWeapon.src}
                                width={25}
                                height={25}
                              />
                            </div>
                          </div>
                          <div className="rounded-full overflow-hidden">
                            <div className="relative overflow-hidden">
                              <img
                                src={indianWeapon.src}
                                width={25}
                                height={25}
                              />
                            </div>
                          </div>
                          <div className="rounded-full overflow-hidden">
                            <div className="relative overflow-hidden">
                              <img
                                src={indianWeapon.src}
                                width={25}
                                height={25}
                              />
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="w-[52px] text-center py-[6px]">#4.22</td>
                      <td className="w-[52px] text-center py-[6px]">31.03%</td>
                    </tr>
                    <tr className="text-center text-[11px] font-[400]">
                      <td className="pt-[4px] pr-0 pb-[4px] pl-[16px] text-left text-[#d0d0d0] whitespace-nowrap">
                        <div className="flex justify-start items-center gap-[4px]">
                          <div className="rounded-full overflow-hidden">
                            <div className="relative overflow-hidden">
                              <img
                                src={indianWeapon.src}
                                width={25}
                                height={25}
                              />
                            </div>
                          </div>
                          <div className="rounded-full overflow-hidden">
                            <div className="relative overflow-hidden">
                              <img
                                src={indianWeapon.src}
                                width={25}
                                height={25}
                              />
                            </div>
                          </div>
                          <div className="rounded-full overflow-hidden">
                            <div className="relative overflow-hidden">
                              <img
                                src={indianWeapon.src}
                                width={25}
                                height={25}
                              />
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="w-[52px] text-center py-[6px]">#4.22</td>
                      <td className="w-[52px] text-center py-[6px]">31.03%</td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Fragment>
  );
};

export default TierCard;
