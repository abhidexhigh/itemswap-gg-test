import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useTranslation } from "react-i18next";
import "../../../i18n";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

// Memoize the tab configuration
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

  // Memoize the handleChange function
  const handleChange = useCallback(
    (e) => {
      router.push(`/${e.target.value}`);
    },
    [router]
  );

  // Memoize the updateNavVisibility function
  const updateNavVisibility = useCallback(() => {
    if (prevRef.current) {
      prevRef.current.style.display = swiperInstance?.isBeginning
        ? "none"
        : "flex";
    }
    if (nextRef.current) {
      nextRef.current.style.display = swiperInstance?.isEnd ? "none" : "flex";
    }
  }, [swiperInstance]);

  // Memoize the swiper configuration
  const swiperConfig = useMemo(
    () => ({
      modules: [Navigation],
      spaceBetween: 10,
      slidesPerView: "auto",
      speed: 800,
      cssMode: true,
      onSwiper: (swiper) => {
        setSwiperInstance(swiper);
        swiper.navigation.init();
        swiper.navigation.update();

        setTimeout(() => {
          if (prevRef.current && nextRef.current) {
            prevRef.current.addEventListener("click", () => swiper.slidePrev());
            nextRef.current.addEventListener("click", () => swiper.slideNext());
          }

          updateNavVisibility();

          const events = [
            "slideChange",
            "reachBeginning",
            "reachEnd",
            "fromEdge",
            "resize",
            "observerUpdate",
          ];

          events.forEach((event) => {
            swiper.on(event, updateNavVisibility);
          });
        }, 100);
      },
      className: "tabs-swiper",
      slideToClickedSlide: false,
    }),
    [updateNavVisibility]
  );

  // Scroll to active tab when selected or swiper instance changes
  useEffect(() => {
    if (swiperInstance) {
      const activeIndex = tabConfig.findIndex((tab) => tab.id === selected);
      if (activeIndex !== -1) {
        swiperInstance.slideTo(activeIndex);
      }
    }
  }, [selected, swiperInstance]);

  // Memoize the link class names
  const getLinkClassName = useCallback(
    (tabId, isFirst = false, isLast = false) => {
      const baseClasses =
        "inline-block w-full p-3 border-r text-xs lg:text-base border-r-[#ffffff14] hover:bg-gray-600 focus:outline-none";
      const activeClasses =
        "active text-gray-900 !bg-gray-100 hover:text-black";
      const inactiveClasses = "hover:text-white";
      const roundedClasses = isFirst
        ? "rounded-l-lg"
        : isLast
          ? "rounded-r-lg"
          : "";

      return `${baseClasses} ${selected === tabId ? activeClasses : inactiveClasses} ${roundedClasses}`;
    },
    [selected]
  );

  return (
    <div className="bg-[#222231] rounded-lg !border !border-[#ffffff70]">
      {/* Desktop View */}
      <div className="hidden lg:block">
        <ul className="text-md font-medium text-center text-gray-500 shadow lg:flex">
          {tabConfig.map((tab, index) => (
            <li key={tab.id} className="w-full text-nowrap">
              <Link
                href={tab.href}
                prefetch={true}
                className={getLinkClassName(
                  tab.id,
                  index === 0,
                  index === tabConfig.length - 1
                )}
              >
                {others?.[tab.id]}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile View */}
      <div className="lg:hidden relative">
        <button
          ref={prevRef}
          className="nav-button meta-prev left-0"
          aria-label="Previous tab"
        >
          <FiChevronLeft className="text-lg" />
        </button>
        <button
          ref={nextRef}
          className="nav-button meta-next right-0"
          aria-label="Next tab"
        >
          <FiChevronRight className="text-lg" />
        </button>

        <Swiper {...swiperConfig}>
          {tabConfig.map((tab) => (
            <SwiperSlide key={tab.id} className="!w-auto">
              <Link
                href={tab.href}
                prefetch={true}
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
  );
};

export default TrendsNav;
