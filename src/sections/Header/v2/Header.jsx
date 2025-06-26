"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import { motion } from "framer-motion";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LanguageSwitcher from "../../../lib/LanguageSwitcher";

export default function NavbarWithoutHeadless({ position = "relative" }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [trendsDropdownOpen, setTrendsDropdownOpen] = useState(false);
  const [mobileTrendsOpen, setMobileTrendsOpen] = useState(false);
  const pathname = usePathname();
  const dialogRef = useRef(null);
  const backdropRef = useRef(null);
  const trendsDropdownRef = useRef(null);

  const { t } = useTranslation();
  const NT = t("nav");
  const OT = t("others");

  // Handle mobile menu close on backdrop click
  useEffect(() => {
    const handleBackdropClick = (e) => {
      if (backdropRef.current && e.target === backdropRef.current) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener("click", handleBackdropClick);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("click", handleBackdropClick);
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  // Handle escape key to close mobile menu and trends dropdown
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === "Escape") {
        if (mobileMenuOpen) {
          setMobileMenuOpen(false);
        }
        if (trendsDropdownOpen) {
          setTrendsDropdownOpen(false);
        }
      }
    };

    document.addEventListener("keydown", handleEscapeKey);
    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, [mobileMenuOpen, trendsDropdownOpen]);

  // Handle click outside to close trends dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        trendsDropdownRef.current &&
        !trendsDropdownRef.current.contains(event.target)
      ) {
        setTrendsDropdownOpen(false);
      }
    };

    if (trendsDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [trendsDropdownOpen]);

  // Updated isActive function for dynamic routes
  const isActive = (path) => {
    // Handle exact matches for home page
    if (path === "/") return pathname === path;

    // Check for either exact match or dynamic route match
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  return (
    <>
      <header
        className={`bg-gradient-to-b from-[#191F1F] via-[#191F1F] to-[#191F1F] ${
          position === "absolute" ? "z-[999] w-full md:absolute" : ""
        } sticky top-0 z-[9999999999999] shadow-lg`}
      >
        <nav
          aria-label="Global"
          className="mx-auto bg-gradient-to-b from-[#00000040] via-[#00000040] to-[#00000000] p-2 md:p-5 lg:pl-32 lg:pr-24"
        >
          <div className="flex w-full items-center justify-between lg:hidden">
            {/*arena switcher for mobile */}
            <Link
              href="https://itemswap-gg-test-five.vercel.app"
              className="flex lg:hidden"
            >
              <div className="flex items-center gap-x-1">
                <div>ARENA</div>
              </div>
            </Link>
            <Link href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <Image
                src="https://res.cloudinary.com/dg0cmj6su/image/upload/v1740651458/ArmyDragone_text_copy_qiojcu.png"
                alt="ItemSwap"
                width={100}
                height={100}
                className="-mb-6 -mt-2 h-[48px] w-auto"
              />
            </Link>
            <div className="flex items-center gap-x-1">
              <LanguageSwitcher device={"mobile"} />
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white"
              >
                <span className="sr-only">
                  {mobileMenuOpen ? "Close main menu" : "Open main menu"}
                </span>
                <Bars3Icon
                  aria-hidden="true"
                  className="h-6 w-6 text-2xl text-white"
                />
              </button>
            </div>
          </div>

          {/* Desktop Navigation - replaces PopoverGroup */}
          <div className="hidden w-full lg:flex lg:items-center lg:justify-between lg:gap-x-12 lg:pb-2.5">
            <div className="lg:flex md:gap-x-6 2xl:gap-x-12">
              <Link
                href="https://itemswap-guild-test.vercel.app/champions"
                className={`text-[#fff4e2] text-xl !font-normal leading-[4rem] ${isActive("/champions") ? "!font-medium text-yellow-300" : "text-[#fff4e2]"}`}
              >
                {OT.champions}
              </Link>
              <Link
                href="https://itemswap-guild-test.vercel.app/guildNew"
                className={`text-[#fff4e2] text-xl !font-normal leading-[4rem] ${isActive("/guildNew") ? "!font-medium text-yellow-300" : "text-[#fff4e2]"}`}
              >
                {OT.guild}
              </Link>
              <Link
                href="https://itemswap-guild-test.vercel.app/items"
                className={`text-[#fff4e2] text-xl !font-normal leading-[4rem] ${isActive("/items") ? "!font-medium text-yellow-300" : "text-[#fff4e2]"}`}
              >
                {OT.items}
              </Link>
              <Link
                href="/leaderboard"
                className={`text-[#fff4e2] text-xl !font-normal leading-[4rem] ${isActive("/leaderboard") ? "!font-medium text-yellow-300" : "text-[#fff4e2]"}`}
              >
                {OT.leaderboard}
              </Link>
              {/* Trends Dropdown */}
              <div className="relative" ref={trendsDropdownRef}>
                <button
                  onClick={() => setTrendsDropdownOpen(!trendsDropdownOpen)}
                  className={`flex items-center gap-x-1 text-[#fff4e2] text-xl !font-normal leading-[4rem] ${
                    isActive("/metaTrends") ||
                    isActive("/recentDecks") ||
                    isActive("/championsTrends") ||
                    isActive("/itemsTrends") ||
                    isActive("/skillTrends") ||
                    isActive("/traitsTrends") ||
                    isActive("/augmentsTrends") ||
                    isActive("/bestItemsBuilds")
                      ? "!font-medium text-yellow-300"
                      : "text-[#fff4e2]"
                  }`}
                >
                  Trends
                  <ChevronDownIcon
                    className={`h-5 w-5 transition-transform duration-200 text-white ${
                      trendsDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {trendsDropdownOpen && (
                  <div className="absolute left-0 top-full z-50 mt-2 w-56 rounded-md bg-[#1a1a1a] shadow-lg ring-1 ring-white/10">
                    <div className="py-2">
                      <Link
                        href="/metaTrends"
                        className="block px-4 py-2 text-sm text-white hover:bg-gray-700 hover:text-yellow-300"
                        onClick={() => setTrendsDropdownOpen(false)}
                      >
                        Meta Trends
                      </Link>
                      <Link
                        href="/recentDecks"
                        className="block px-4 py-2 text-sm text-white hover:bg-gray-700 hover:text-yellow-300"
                        onClick={() => setTrendsDropdownOpen(false)}
                      >
                        Recent Decks
                      </Link>
                      <Link
                        href="/championsTrends"
                        className="block px-4 py-2 text-sm text-white hover:bg-gray-700 hover:text-yellow-300"
                        onClick={() => setTrendsDropdownOpen(false)}
                      >
                        Champions Trends
                      </Link>
                      <Link
                        href="/itemsTrends"
                        className="block px-4 py-2 text-sm text-white hover:bg-gray-700 hover:text-yellow-300"
                        onClick={() => setTrendsDropdownOpen(false)}
                      >
                        Items Trends
                      </Link>
                      <Link
                        href="/skillTrends"
                        className="block px-4 py-2 text-sm text-white hover:bg-gray-700 hover:text-yellow-300"
                        onClick={() => setTrendsDropdownOpen(false)}
                      >
                        Skill Trends
                      </Link>
                      <Link
                        href="/traitsTrends"
                        className="block px-4 py-2 text-sm text-white hover:bg-gray-700 hover:text-yellow-300"
                        onClick={() => setTrendsDropdownOpen(false)}
                      >
                        Traits Trends
                      </Link>
                      <Link
                        href="/augmentsTrends"
                        className="block px-4 py-2 text-sm text-white hover:bg-gray-700 hover:text-yellow-300"
                        onClick={() => setTrendsDropdownOpen(false)}
                      >
                        Augments Trends
                      </Link>
                      <Link
                        href="/bestItemsBuilds"
                        className="block px-4 py-2 text-sm text-white hover:bg-gray-700 hover:text-yellow-300"
                        onClick={() => setTrendsDropdownOpen(false)}
                      >
                        Best Items Build
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex md:gap-x-4 2xl:gap-x-12">
              <Link
                href={"https://itemswap-gg-test-five.vercel.app/champions"}
                className="relative h-fit cursor-pointer transition-all duration-300 ease-in-out hover:-translate-y-1 hover:scale-105"
              >
                <motion.video
                  autoPlay
                  muted
                  loop
                  className="w-24 rounded-lg shadow-lg"
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
                  className="absolute text-sm left-1/2 top-1/2 mb-0 -translate-x-1/2 -translate-y-1/2 font-medium text-white"
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
              <Link href="/" className="-m-1.5 p-1.5">
                <span className="sr-only">Your Company</span>
                <Image
                  src="https://res.cloudinary.com/dg0cmj6su/image/upload/v1740651458/ArmyDragone_text_copy_qiojcu.png"
                  alt="ItemSwap"
                  width={100}
                  height={100}
                  className="-mb-6 -mt-2 h-[72px] w-auto"
                />
              </Link>
              <Link
                href={"/"}
                className="relative h-fit cursor-pointer transition-all duration-300 ease-in-out hover:-translate-y-1 hover:scale-105"
              >
                <motion.video
                  autoPlay
                  muted
                  loop
                  className="w-24 rounded-lg shadow-lg"
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
                  className="absolute text-sm left-1/2 top-1/2 mb-0 -translate-x-1/2 -translate-y-1/2 font-medium text-white"
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
                  ARENA
                </motion.p>
              </Link>
            </div>
            <div className="lg:flex md:gap-x-6 2xl:gap-x-12">
              <Link
                href="https://itemswap-guild-test.vercel.app/traits"
                className={`text-[#fff4e2] text-xl !font-normal leading-[4rem] ${isActive("/traits") ? "!font-medium text-yellow-300" : "text-[#fff4e2]"}`}
              >
                {OT.traits}
              </Link>
              <Link
                href="https://itemswap-guild-test.vercel.app/maze"
                className={`text-[#fff4e2] text-xl !font-normal leading-[4rem] ${isActive("/maze") ? "!font-medium text-yellow-300" : "text-[#fff4e2]"}`}
              >
                {OT.maze}
              </Link>
              <Link
                href="https://itemswap-guild-test.vercel.app/dungeon"
                className={`text-[#fff4e2] text-xl !font-normal leading-[4rem] ${isActive("/dungeon") ? "!font-medium text-yellow-300" : "text-[#fff4e2]"}`}
              >
                {OT.dungeon}
              </Link>
              <Link
                href="https://itemswap-guild-test.vercel.app/tower"
                className={`text-[#fff4e2] text-xl !font-normal leading-[4rem] ${isActive("/tower") ? "!font-medium text-yellow-300" : "text-[#fff4e2]"}`}
              >
                {OT.tower}
              </Link>
              <Link
                href="https://itemswap-guild-test.vercel.app/huntingGround"
                className={`text-[#fff4e2] text-xl !font-normal leading-[4rem] ${isActive("/huntingGround") ? "!font-medium text-yellow-300" : "text-[#fff4e2]"}`}
              >
                {OT.hunting}
              </Link>
              <div className="leading-[4rem] m-auto">
                <LanguageSwitcher device="mobile" />
              </div>
            </div>
          </div>
        </nav>

        <img
          src="https://res.cloudinary.com/dg0cmj6su/image/upload/v1738605248/image_5_sgv3su.png"
          alt="ItemSwap"
          width={8}
          height={8}
          className="w-full md:hidden"
        />
        <div className="hidden lg:-mt-8 lg:flex lg:items-center lg:justify-between">
          <img
            src="https://res.cloudinary.com/dg0cmj6su/image/upload/v1738605248/image_4_zjejce.png"
            alt="ItemSwap"
            width={8}
            height={8}
            className="h-3 w-1/3"
          />
          <img
            src="https://res.cloudinary.com/dg0cmj6su/image/upload/v1738605248/image_5_sgv3su.png"
            alt="ItemSwap"
            width={8}
            height={8}
            className="h-3 w-1/3"
          />
        </div>
      </header>

      {/* Mobile Menu Modal - replaces Dialog and DialogPanel */}
      {mobileMenuOpen && (
        <div className="lg:hidden">
          {/* Backdrop */}
          <div
            ref={backdropRef}
            className="fixed inset-0 z-10 bg-black bg-opacity-25"
            aria-hidden="true"
          />

          {/* Mobile Menu Panel */}
          <div
            ref={dialogRef}
            className="fixed inset-y-0 right-0 z-[999999999] w-full overflow-y-auto bg-[#121212] px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-white/10"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-menu"
          >
            <div className="flex items-center justify-between">
              <Link href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">Your Company</span>
              </Link>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="-m-2.5 rounded-md p-2.5 text-white"
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon aria-hidden="true" className="h-6 w-6 text-white" />
              </button>
            </div>

            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  <Link
                    href="https://itemswap-guild-test.vercel.app/champions"
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-gray-200 hover:text-black"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {OT.champions}
                  </Link>
                  <Link
                    href="https://itemswap-guild-test.vercel.app/guildNew"
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-gray-200 hover:text-black"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {OT.guild}
                  </Link>
                  <Link
                    href="https://itemswap-guild-test.vercel.app/items"
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-gray-200 hover:text-black"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {OT.items}
                  </Link>
                  <Link
                    href="https://itemswap-guild-test.vercel.app/traits"
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-gray-200 hover:text-black"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {OT.traits}
                  </Link>
                  <Link
                    href="https://itemswap-guild-test.vercel.app/maze"
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-gray-200 hover:text-black"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {OT.maze}
                  </Link>
                  <Link
                    href="https://itemswap-guild-test.vercel.app/huntingGround"
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-gray-200 hover:text-black"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {OT.hunting}
                  </Link>
                  <Link
                    href="https://itemswap-guild-test.vercel.app/dungeon"
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-gray-200 hover:text-black"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {OT.dungeon}
                  </Link>
                  <Link
                    href="https://itemswap-guild-test.vercel.app/tower"
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-gray-200 hover:text-black"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {OT.tower}
                  </Link>
                  <Link
                    href="/leaderboard"
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-gray-200 hover:text-black"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {OT.leaderboard}
                  </Link>
                  {/* Trends Section */}
                  <div className="-mx-3 rounded-lg px-3 py-2">
                    <button
                      onClick={() => setMobileTrendsOpen(!mobileTrendsOpen)}
                      className="flex w-full items-center justify-between text-base font-semibold leading-7 text-white mb-2"
                    >
                      {OT.trends}
                      <ChevronDownIcon
                        className={`h-5 w-5 transition-transform duration-200 ${
                          mobileTrendsOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {mobileTrendsOpen && (
                      <div className="ml-4 space-y-1">
                        <Link
                          href="/metaTrends"
                          className="block rounded-lg px-3 py-1 text-sm text-white hover:bg-gray-200 hover:text-black"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {OT.metaTrends}
                        </Link>
                        <Link
                          href="/recentDecks"
                          className="block rounded-lg px-3 py-1 text-sm text-white hover:bg-gray-200 hover:text-black"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {OT.recentDecks}
                        </Link>
                        <Link
                          href="/championsTrends"
                          className="block rounded-lg px-3 py-1 text-sm text-white hover:bg-gray-200 hover:text-black"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {OT.championsTrends}
                        </Link>
                        <Link
                          href="/itemsTrends"
                          className="block rounded-lg px-3 py-1 text-sm text-white hover:bg-gray-200 hover:text-black"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {OT.itemsTrends}
                        </Link>
                        <Link
                          href="/skillTrends"
                          className="block rounded-lg px-3 py-1 text-sm text-white hover:bg-gray-200 hover:text-black"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {OT.skillTrends}
                        </Link>
                        <Link
                          href="/traitsTrends"
                          className="block rounded-lg px-3 py-1 text-sm text-white hover:bg-gray-200 hover:text-black"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {OT.traitsTrends}
                        </Link>
                        <Link
                          href="/augmentsTrends"
                          className="block rounded-lg px-3 py-1 text-sm text-white hover:bg-gray-200 hover:text-black"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {OT.augmentsTrends}
                        </Link>
                        <Link
                          href="/bestItemsBuilds"
                          className="block rounded-lg px-3 py-1 text-sm text-white hover:bg-gray-200 hover:text-black"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {OT.bestItemsBuild}
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
