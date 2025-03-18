import { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useTranslation } from "react-i18next";
import "../../../i18n";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const tabConfig = [
  { id: "metaTrends", href: "/metaTrends" },
  { id: "recentDecks", href: "/recentDecks" },
  { id: "championsTrends", href: "/championsTrends" },
  { id: "itemsTrends", href: "/itemsTrends" },
  { id: "traitsTrends", href: "/traitsTrends" },
  { id: "augmentsTrends", href: "/augmentsTrends" },
  { id: "bestItemsBuilds", href: "/bestItemsBuilds" },
];

const TrendsNav = ({ selected }) => {
  const { t } = useTranslation();
  const others = t("others");
  const router = useRouter();

  const [swiperInstance, setSwiperInstance] = useState(null);
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const handleChange = (e) => {
    router.push(`/${e.target.value}`);
  };

  // Scroll to active tab when selected or swiper instance changes
  useEffect(() => {
    if (swiperInstance) {
      const activeIndex = tabConfig.findIndex((tab) => tab.id === selected);
      if (activeIndex !== -1) {
        swiperInstance.slideTo(activeIndex);
      }
    }
  }, [selected, swiperInstance]);

  return (
    <>
      <div className="hidden mx-2">
        <select
          className="!bg-[#27282f] !text-white select w-full"
          onChange={handleChange}
        >
          <option
            value="metaTrends"
            selected={selected === "metaTrends" ? "selected" : null}
          >
            Meta Trends
          </option>
          <option
            value="recentDecks"
            selected={selected === "recentDecks" ? "selected" : null}
          >
            Recent #1 Decks
          </option>
          <option
            value="championsTrends"
            selected={selected === "championsTrends" ? "selected" : null}
          >
            Champions Trends
          </option>
          <option
            value="itemsTrends"
            selected={selected === "itemsTrends" ? "selected" : null}
          >
            Items Trends
          </option>
          <option
            value="traitsTrends"
            selected={selected === "traitsTrends" ? "selected" : null}
          >
            Traits Trends
          </option>
          <option
            value="augmentsTrends"
            selected={selected === "augmentsTrends" ? "selected" : null}
          >
            Augments Trends
          </option>
          <option
            value="bestItemsBuilds"
            selected={selected === "bestItemsBuilds" ? "selected" : null}
          >
            Best Items Buils
          </option>
          <option>France</option>
          <option>Germany</option>
        </select>
      </div>
      <div className="bg-[#222231] rounded-lg !border !border-[#ffffff70]">
        {/* Desktop View (keep your original desktop code here) */}
        <div className="hidden lg:block">
          <ul className="text-md font-medium text-center text-gray-500 shadow lg:flex">
            <li className="w-full text-nowrap">
              <Link
                href="/metaTrends"
                className={`${
                  selected === "metaTrends"
                    ? "active text-gray-900 !bg-gray-100 hover:text-black border-r rounded-l-lg"
                    : "hover:text-white"
                } inline-block w-full p-3 border-r text-xs lg:text-base border-r-[#ffffff14] hover:bg-gray-600 focus:outline-none`}
              >
                {others?.metaTrends}
              </Link>
            </li>
            <li className="w-full text-nowrap">
              <Link
                href="/recentDecks"
                className={`${
                  selected === "recentDecks"
                    ? "active text-gray-900 !bg-gray-100 hover:text-black border-r"
                    : "hover:text-white"
                } inline-block w-full p-3 border-r text-xs lg:text-base border-r-[#ffffff14] hover:bg-gray-600 focus:outline-none`}
              >
                {others?.recentDecks}
              </Link>
            </li>
            <li className="w-full text-nowrap">
              <Link
                href="/championsTrends"
                className={`${
                  selected === "championsTrends"
                    ? "active text-gray-900 !bg-gray-100 hover:text-black border-r"
                    : "hover:text-white"
                } inline-block w-full p-3 border-r text-xs lg:text-base border-r-[#ffffff14] hover:bg-gray-600 focus:outline-none`}
              >
                {others?.championsTrends}
              </Link>
            </li>
            <li className="w-full text-nowrap">
              <Link
                href="/itemsTrends"
                className={`${
                  selected === "itemsTrends"
                    ? "active text-gray-900 !bg-gray-100 hover:text-black border-r"
                    : "hover:text-white"
                } inline-block w-full p-3 border-r text-xs lg:text-base border-r-[#ffffff14] hover:bg-gray-600 focus:outline-none`}
              >
                {others?.itemsTrends}
              </Link>
            </li>
            <li className="w-full text-nowrap">
              <Link
                href="/traitsTrends"
                className={`${
                  selected === "traitsTrends"
                    ? "active text-gray-900 !bg-gray-100 hover:text-black border-r"
                    : "hover:text-white"
                } inline-block w-full p-3 border-r text-xs lg:text-base border-r-[#ffffff14] hover:bg-gray-600 focus:outline-none`}
              >
                {others?.traitsTrends}
              </Link>
            </li>
            <li className="w-full text-nowrap">
              <Link
                href="/augmentsTrends"
                className={`${
                  selected === "augmentsTrends"
                    ? "active text-gray-900 !bg-gray-100 hover:text-black border-r"
                    : "hover:text-white"
                } inline-block w-full p-3 border-r text-xs lg:text-base border-r-[#ffffff14] hover:bg-gray-600 focus:outline-none`}
              >
                {others.augmentsTrends}
              </Link>
            </li>
            <li className="w-full text-nowrap">
              <Link
                href="/bestItemsBuilds"
                className={`${
                  selected === "bestItemsBuilds"
                    ? "active text-gray-900 !bg-gray-100 hover:text-black border-r rounded-r-lg"
                    : "hover:text-white"
                } inline-block w-full p-3 border-r text-xs lg:text-base border-r-[#ffffff14] hover:bg-gray-600 focus:outline-none`}
              >
                {others?.bestItemsBuilds}
              </Link>
            </li>
          </ul>
        </div>

        {/* Mobile View */}
        <div className="lg:hidden relative">
          <div ref={prevRef} className="nav-button meta-prev left-0">
            <FiChevronLeft className="text-lg" />
          </div>
          <div ref={nextRef} className="nav-button meta-next right-0">
            <FiChevronRight className="text-lg" />
          </div>

          <Swiper
            modules={[Navigation]}
            spaceBetween={10}
            slidesPerView={"auto"}
            speed={800}
            cssMode={true}
            onSwiper={(swiper) => {
              setSwiperInstance(swiper);
              // Override Swiper's navigation with our custom elements
              swiper.navigation.init();
              swiper.navigation.update();

              // Wait until Swiper is initialized and has processed slides
              setTimeout(() => {
                // Set up custom navigation
                if (prevRef.current && nextRef.current) {
                  prevRef.current.addEventListener("click", () => {
                    swiper.slidePrev();
                  });
                  nextRef.current.addEventListener("click", () => {
                    swiper.slideNext();
                  });
                }

                // Set up visibility handlers
                const updateNavVisibility = () => {
                  if (prevRef.current) {
                    prevRef.current.style.display = swiper.isBeginning
                      ? "none"
                      : "flex";
                  }
                  if (nextRef.current) {
                    nextRef.current.style.display = swiper.isEnd
                      ? "none"
                      : "flex";
                  }
                };

                // Initialize visibility
                updateNavVisibility();

                // Add event listeners for navigation updates
                swiper.on("slideChange", updateNavVisibility);
                swiper.on("reachBeginning", updateNavVisibility);
                swiper.on("reachEnd", updateNavVisibility);
                swiper.on("fromEdge", updateNavVisibility);
                swiper.on("resize", updateNavVisibility);
                swiper.on("observerUpdate", updateNavVisibility);
              }, 100);
            }}
            className="tabs-swiper"
            slideToClickedSlide={false}
          >
            {tabConfig.map((tab) => (
              <SwiperSlide key={tab.id} className="!w-auto">
                <Link
                  href={tab.href}
                  className={`
              inline-block px-3 py-2.5 text-base border border-[#ffffff14] rounded-lg
              whitespace-nowrap
              ${
                selected === tab.id
                  ? "text-gray-900 bg-gray-100 hover:text-black font-semibold"
                  : "text-gray-300 hover:text-white hover:bg-gray-600"
              }
            `}
                >
                  {others?.[tab.id]}
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
      {/* <div className="bg-[#222231] rounded-lg !border !border-[#ffffff70] hidden lg:block">
        <ul className="text-md font-medium text-center text-gray-500 shadow lg:flex">
          <li className="w-full text-nowrap">
            <Link
              href="/metaTrends"
              className={`${
                selected === "metaTrends"
                  ? "active text-gray-900 !bg-gray-100 hover:text-black border-r rounded-l-lg"
                  : "hover:text-white"
              } inline-block w-full p-3 border-r text-xs lg:text-base border-r-[#ffffff14] hover:bg-gray-600 focus:outline-none`}
            >
              {others?.metaTrends}
            </Link>
          </li>
          <li className="w-full text-nowrap">
            <Link
              href="/recentDecks"
              className={`${
                selected === "recentDecks"
                  ? "active text-gray-900 !bg-gray-100 hover:text-black border-r"
                  : "hover:text-white"
              } inline-block w-full p-3 border-r text-xs lg:text-base border-r-[#ffffff14] hover:bg-gray-600 focus:outline-none`}
            >
              {others?.recentDecks}
            </Link>
          </li>
          <li className="w-full text-nowrap">
            <Link
              href="/championsTrends"
              className={`${
                selected === "championsTrends"
                  ? "active text-gray-900 !bg-gray-100 hover:text-black border-r"
                  : "hover:text-white"
              } inline-block w-full p-3 border-r text-xs lg:text-base border-r-[#ffffff14] hover:bg-gray-600 focus:outline-none`}
            >
              {others?.championsTrends}
            </Link>
          </li>
          <li className="w-full text-nowrap">
            <Link
              href="/itemsTrends"
              className={`${
                selected === "itemsTrends"
                  ? "active text-gray-900 !bg-gray-100 hover:text-black border-r"
                  : "hover:text-white"
              } inline-block w-full p-3 border-r text-xs lg:text-base border-r-[#ffffff14] hover:bg-gray-600 focus:outline-none`}
            >
              {others?.itemsTrends}
            </Link>
          </li>
          <li className="w-full text-nowrap">
            <Link
              href="/traitsTrends"
              className={`${
                selected === "traitsTrends"
                  ? "active text-gray-900 !bg-gray-100 hover:text-black border-r"
                  : "hover:text-white"
              } inline-block w-full p-3 border-r text-xs lg:text-base border-r-[#ffffff14] hover:bg-gray-600 focus:outline-none`}
            >
              {others?.traitsTrends}
            </Link>
          </li>
          <li className="w-full text-nowrap">
            <Link
              href="/augmentsTrends"
              className={`${
                selected === "augmentsTrends"
                  ? "active text-gray-900 !bg-gray-100 hover:text-black border-r"
                  : "hover:text-white"
              } inline-block w-full p-3 border-r text-xs lg:text-base border-r-[#ffffff14] hover:bg-gray-600 focus:outline-none`}
            >
              {others.augmentsTrends}
            </Link>
          </li>
          <li className="w-full text-nowrap">
            <Link
              href="/bestItemsBuilds"
              className={`${
                selected === "bestItemsBuilds"
                  ? "active text-gray-900 !bg-gray-100 hover:text-black border-r rounded-r-lg"
                  : "hover:text-white"
              } inline-block w-full p-3 border-r text-xs lg:text-base border-r-[#ffffff14] hover:bg-gray-600 focus:outline-none`}
            >
              {others?.bestItemsBuilds}
            </Link>
          </li>
        </ul>
      </div> */}
    </>
  );
};

export default TrendsNav;
