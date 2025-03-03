import Link from "next/link";
import { useTranslation } from "react-i18next";
import "../../../../i18n";
import { useEffect, useState } from "react";
import { useModal } from "src/utils/ModalContext";
import { motion } from "framer-motion";
import {
  MdNotes,
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";
import NavWrapper from "./Header.style";
import Button from "@components/button";
import MobileMenu from "../MobileMenu/MobileMenu";

import data from "@assets/data/menu/menuData";
import logo from "@assets/image/logo.png";
import connectIcon from "@assets/images/icons/connect.png";
import walletIcon1 from "@assets/images/icons/pancake.png";
import walletIcon2 from "@assets/images/icons/uniswap.png";
import walletIcon3 from "@assets/images/icons/market.png";
import walletIcon4 from "@assets/images/icons/gate.png";
import LanguageSwitcher from "src/lib/LanguageSwitcher";

const Header = () => {
  const { t } = useTranslation();
  const others = t("others");
  const { walletModalHandle } = useModal();
  const [isMobileMenu, setMobileMenu] = useState(false);

  const handleMobileMenu = () => {
    setMobileMenu(!isMobileMenu);
  };

  const handleWalletBtn = (e) => {
    e.preventDefault();
    walletModalHandle();
  };

  return (
    <NavWrapper className="gamfi_header sticky" id="navbar">
      <div className="container 2xl:!max-w-[90%] mx-auto">
        {/* Main Menu Start */}
        <Link
          href={"https://itemswap-guild-test.vercel.app/champions"}
          className="absolute left-5 hidden md:block top-4 cursor-pointer transition-all duration-300 ease-in-out hover:-translate-y-1 hover:scale-105"
        >
          <motion.video
            autoPlay
            muted
            loop
            className="w-24 2xl:w-28 rounded-lg shadow-lg"
            animate={{
              scale: [1, 1.1, 1], // Zoom in & out effect
              rotate: [0, 1, -1, 0], // Slight rotation
            }}
            transition={{
              duration: 3, // Smooth animation duration
              repeat: Infinity, // Loop animation
              ease: "easeInOut",
            }}
          >
            <source
              src="https://res.cloudinary.com/dg0cmj6su/video/upload/v1740742060/TFT_SIZE_u2kvc9.webm"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </motion.video>

          {/* Text with pulsing glow effect */}
          <motion.p
            className="absolute left-1/2 top-1/2 mb-0 -translate-x-1/2 -translate-y-1/2 font-medium text-white 2xl:text-xl"
            animate={{
              textShadow: [
                "0px 0px 5px rgba(255, 255, 255, 0.5)",
                "0px 0px 15px rgba(255, 255, 255, 0.8)",
                "0px 0px 5px rgba(255, 255, 255, 0.5)",
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            RPG
          </motion.p>
        </Link>
        <div className="gamfi_menu_sect">
          <div className="gamfi_menu_left_sect mx-auto">
            <div className="logo">
              <a href="http://itemswap-guild-test.vercel.app/">
                <img
                  src={
                    "https://res.cloudinary.com/dg0cmj6su/image/upload/v1740650877/ArmyDragone_text_copy_kelovj.png"
                  }
                  alt="ItemSwap logo"
                  className="w-36 mt-2"
                />
              </a>
            </div>
          </div>
          <div className="gamfi_menu_right_sect gamfi_v1_menu_right_sect">
            <div className="gamfi_menu_list">
              <ul>
                {/* <li>
                  <Link href="/">Home</Link>
                </li> */}
                {/* menu  */}
                {data?.map((menu, i) => (
                  <li key={i}>
                    <Link href={menu.url}>
                      {others?.[menu.title?.toLowerCase()]}{" "}
                      {menu.subMenus?.length > 0 && (
                        <MdOutlineKeyboardArrowDown />
                      )}
                    </Link>

                    {/* if has subMenu and length is greater than 0 */}
                    {menu.subMenus?.length > 0 && (
                      <ul className="sub_menu_list">
                        {menu.subMenus?.map((subMenu, i) => (
                          <li key={i}>
                            <Link href={subMenu.url}>
                              {subMenu?.title !== "Champions"
                                ? others?.[subMenu.url.replace("/", "")]
                                : others?.champions}{" "}
                              {subMenu?.subMenuChilds?.length > 0 && (
                                <MdOutlineKeyboardArrowRight />
                              )}
                            </Link>

                            {/* if subMenu child has menu child */}
                            {subMenu?.subMenuChilds?.length > 0 && (
                              <ul className="sub_menu_child_list">
                                {subMenu?.subMenuChilds?.map((subChild, i) => (
                                  <li key={i}>
                                    <Link href={subChild.url}>
                                      {subChild.title}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            <div className="gamfi_menu_btns">
              <button className="menu_btn" onClick={() => handleMobileMenu()}>
                <MdNotes />
              </button>
              <LanguageSwitcher />
              <Link
                href={"https://itemswap-guild-test.vercel.app/champions"}
                className="relative md:hidden cursor-pointer transition-all duration-300 ease-in-out hover:-translate-y-1 hover:scale-105"
              >
                <motion.video
                  autoPlay
                  muted
                  loop
                  className="w-16 rounded-lg shadow-lg"
                  animate={{
                    scale: [1, 1.1, 1], // Zoom in & out effect
                    rotate: [0, 1, -1, 0], // Slight rotation
                  }}
                  transition={{
                    duration: 3, // Smooth animation duration
                    repeat: Infinity, // Loop animation
                    ease: "easeInOut",
                  }}
                >
                  <source
                    src="https://res.cloudinary.com/dg0cmj6su/video/upload/v1740742060/TFT_SIZE_u2kvc9.webm"
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </motion.video>

                {/* Text with pulsing glow effect */}
                <motion.p
                  className="absolute left-1/2 top-1/2 mb-0 -translate-x-1/2 -translate-y-1/2 font-medium text-white"
                  animate={{
                    textShadow: [
                      "0px 0px 5px rgba(255, 255, 255, 0.5)",
                      "0px 0px 15px rgba(255, 255, 255, 0.8)",
                      "0px 0px 5px rgba(255, 255, 255, 0.5)",
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  RPG
                </motion.p>
              </Link>

              {/* <div className="wallet_btn">
                Buy token <MdOutlineKeyboardArrowDown />
                <div className="wallet_token_list">
                  <Link href="#">
                    <img src={walletIcon1.src} alt="icon" /> PancakeSwap
                  </Link>
                  <Link href="#">
                    <img src={walletIcon2.src} alt="icon" /> UniSwap
                  </Link>
                  <Link href="#">
                    <img src={walletIcon3.src} alt="icon" /> CoinMarketCap
                  </Link>
                  <Link href="#">
                    <img src={walletIcon4.src} alt="icon" /> Gate.io
                  </Link>
                </div>
              </div>
              <Button
                sm
                variant="white"
                className="connect_btn"
                onClick={(e) => handleWalletBtn(e)}
              >
                <img src={connectIcon.src} alt="icon" />
                Connect
              </Button> */}
            </div>
          </div>
        </div>
        {/* <!-- Main Menu END --> */}
        {isMobileMenu && <MobileMenu mobileMenuhandle={handleMobileMenu} />}
      </div>
    </NavWrapper>
  );
};

export default Header;
