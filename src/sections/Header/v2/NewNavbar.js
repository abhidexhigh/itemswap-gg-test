"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from "@headlessui/react";
import {
  ArrowPathIcon,
  Bars3Icon,
  ChartPieIcon,
  CursorArrowRaysIcon,
  FingerPrintIcon,
  SquaresPlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  PhoneIcon,
  PlayCircleIcon,
} from "@heroicons/react/20/solid";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LanguageSwitcher from "./LanguageSwitcher";
import Badge3 from "../UI/Badge/Badge3";

const products = [
  {
    name: "Analytics",
    description: "Get a better understanding of your traffic",
    href: "#",
    icon: ChartPieIcon,
  },
  {
    name: "Engagement",
    description: "Speak directly to your customers",
    href: "#",
    icon: CursorArrowRaysIcon,
  },
  {
    name: "Security",
    description: "Your customers’ data will be safe and secure",
    href: "#",
    icon: FingerPrintIcon,
  },
  {
    name: "Integrations",
    description: "Connect with third-party tools",
    href: "#",
    icon: SquaresPlusIcon,
  },
  {
    name: "Automations",
    description: "Build strategic funnels that will convert",
    href: "#",
    icon: ArrowPathIcon,
  },
];
const callsToAction = [
  { name: "Watch demo", href: "#", icon: PlayCircleIcon },
  { name: "Contact sales", href: "#", icon: PhoneIcon },
];

export default function Navbar({ position = "relative" }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const { t } = useTranslation();
  const NT = t("nav");

  // Updated isActive function for dynamic routes
  const isActive = (path) => {
    // Handle exact matches for home page
    if (path === "/") return pathname === path;

    // Check for either exact match or dynamic route match
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  return (
    // <header
    //   className={`bg-gradient-to-b from-[#191F1F] via-[#191F1F] to-[#191F1F] md:from-[#00000040] md:via-[#00000040] md:to-[#00000000] ${
    //     position === "absolute" ? "z-[999] w-full md:absolute" : ""
    //   } sticky top-0 shadow-lg`}
    // >
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
              <Badge3 value="ARENA" />
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
              onClick={() => setMobileMenuOpen(true)}
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon
                aria-hidden="true"
                className="h-6 w-6 text-2xl text-white"
              />
            </button>
          </div>
        </div>
        <PopoverGroup className="ml-5 hidden w-full lg:flex lg:items-center lg:justify-between lg:gap-x-12 lg:pb-2.5">
          <div className="lg:flex lg:gap-x-12">
            <Link
              href={"https://itemswap-gg-test-five.vercel.app"}
              className="absolute left-5 top-7 cursor-pointer transition-all duration-300 ease-in-out hover:-translate-y-1 hover:scale-105"
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
                ARENA
              </motion.p>
            </Link>
            {/* <Link href="/" className="text-mud text-lg font-normal leading-6">
              {NT.game}
            </Link> */}
            <Link
              href="/champions"
              className={`text-mud text-xl font-normal leading-6 ${isActive("/") ? "!font-medium text-yellow-300" : "text-mud"}`}
            >
              {NT.champions}
            </Link>
            <Link
              href="/guildNew"
              className={`text-mud text-xl font-normal leading-6 ${isActive("/guildNew") ? "!font-medium text-yellow-300" : "text-mud"}`}
            >
              {NT.guild}
            </Link>
            <Link
              href="/items"
              className={`text-mud text-xl font-normal leading-6 ${isActive("/items") ? "!font-medium text-yellow-300" : "text-mud"}`}
            >
              {NT.items}
            </Link>
            <Link
              href="/traits"
              className={`text-mud text-xl font-normal leading-6 ${isActive("/traits") ? "!font-medium text-yellow-300" : "text-mud"}`}
            >
              {NT.traits}
            </Link>
          </div>
          <div className="flex">
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
          </div>
          <div className="lg:flex lg:gap-x-16">
            <Link
              href="/maze"
              className={`text-mud text-xl font-normal leading-6 ${isActive("/maze") ? "!font-medium text-yellow-300" : "text-mud"}`}
            >
              {NT.maze}
            </Link>
            <Link
              href="/dungeon"
              className={`text-mud text-xl font-normal leading-6 ${isActive("/dungeon") ? "!font-medium text-yellow-300" : "text-mud"}`}
            >
              {NT.dungeon}
            </Link>
            <Link
              href="/tower"
              className={`text-mud text-xl font-normal leading-6 ${isActive("/tower") ? "!font-medium text-yellow-300" : "text-mud"}`}
            >
              {NT.tower}
            </Link>
            <Link
              href="/huntingGround"
              className={`text-mud text-xl font-normal leading-6 ${isActive("/huntingGround") ? "!font-medium text-yellow-300" : "text-mud"}`}
            >
              {NT.hunting}
            </Link>
            <div className="absolute right-5 top-7">
              <LanguageSwitcher device="mobile" />
            </div>
          </div>
        </PopoverGroup>
        {/* <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <Link href="#" className="text-lg font-normal leading-6 text-mud">
            Log in <span aria-hidden="true">&rarr;</span>
          </Link>
        </div> */}
        {/* <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <LanguageSwitcher />
        </div> */}
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
      <Dialog
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className="lg:hidden"
      >
        <div className="fixed inset-0 z-10" />
        <DialogPanel className="fixed inset-y-0 right-0 z-[999999999] w-full overflow-y-auto bg-[#121212] px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-white/10">
          <div className="flex items-center justify-between">
            <Link href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              {/* <Image
                alt=""
                src="https://res.cloudinary.com/dg0cmj6su/image/upload/v1728457137/logo_lxblxt.svg"
                className="h-8 w-auto"
                width={8}
                height={8}
              /> */}
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="h-6 w-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {/* <Disclosure as="div" className="-mx-3">
                  <DisclosureButton className="group flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold leading-7 text-white hover:bg-gray-50">
                    Product
                    <ChevronDownIcon
                      aria-hidden="true"
                      className="h-5 w-5 flex-none group-data-[open]:rotate-180"
                    />
                  </DisclosureButton>
                  <DisclosurePanel className="mt-2 space-y-2">
                    {[...products, ...callsToAction].map((item) => (
                      <DisclosureButton
                        key={item.name}
                        as="a"
                        href={item.href}
                        className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-white hover:bg-gray-50"
                      >
                        {item.name}
                      </DisclosureButton>
                    ))}
                  </DisclosurePanel>
                </Disclosure> */}
                {/* <Link
                  href="/"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-gray-50"
                >
                  {NT.game}
                </Link> */}
                <Link
                  href="/champions"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-gray-200 hover:text-black"
                >
                  {NT.champions}
                </Link>
                <Link
                  href="/guildNew"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-gray-200 hover:text-black"
                >
                  {NT.guild}
                </Link>
                <Link
                  href="/maze"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-gray-200 hover:text-black"
                >
                  {NT.maze}
                </Link>
                <Link
                  href="/huntingGround"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-gray-200 hover:text-black"
                >
                  {NT.hunting}
                </Link>
                <Link
                  href="/dungeon"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-gray-200 hover:text-black"
                >
                  {NT.dungeon}
                </Link>
                <Link
                  href="/tower"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-gray-200 hover:text-black"
                >
                  {NT.tower}
                </Link>
              </div>
              {/* <div className="py-6">
                <Link
                  href="#"
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-white hover:bg-gray-200 hover:text-black"
                >
                  Log in
                </Link>
              </div> */}
              {/* <div className="py-6">
                <LanguageSwitcher />
              </div> */}
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}
