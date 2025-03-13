import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const LeaderboardSubcategory = ({
  subcategories,
  activeSubcategory,
  setActiveSubcategory,
}) => {
  const [swiperInstance, setSwiperInstance] = useState(null);

  // Scroll to active tab when selected or swiper instance changes
  useEffect(() => {
    if (swiperInstance) {
      const activeIndex = subcategories.findIndex(
        (subcategory) => subcategory === activeSubcategory
      );
    }
  }, [activeSubcategory, swiperInstance]);

  const handleChange = (e) => {
    router.push(`/${e.target.value}`);
  };
  return (
    <>
      <div className="bg-[#222231] rounded-lg !border !border-[#ffffff70]">
        {/* Desktop View (keep your original desktop code here) */}
        <div className="hidden lg:block">
          <ul className="text-md font-medium text-center text-gray-500 shadow lg:flex">
            {subcategories?.map((subcategory, index) => (
              <li className="w-full text-nowrap">
                <div
                  className={`${
                    subcategory === activeSubcategory
                      ? "active text-gray-900 !bg-gray-100 hover:text-black border-r first:rounded-l-lg last:rounded-r-lg"
                      : "hover:text-white"
                  } inline-block w-full p-3 border-r text-xs lg:text-base border-r-[#ffffff14] hover:bg-gray-600 focus:outline-none`}
                  onClick={() => setActiveSubcategory(subcategory)}
                >
                  {subcategory}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Mobile View */}
        <div className="lg:hidden relative">
          <Swiper
            modules={[Navigation]}
            spaceBetween={10}
            slidesPerView={"auto"}
            speed={800}
            cssMode={true}
            navigation={{
              prevEl: ".meta-prev",
              nextEl: ".meta-next",
            }}
            className="tabs-swiper"
            onSwiper={(swiper) => setSwiperInstance(swiper)}
            slideToClickedSlide={false}
          >
            {subcategories.map((subcategory, index) => (
              <SwiperSlide key={index} className="!w-auto">
                <div
                  className={`
              inline-block px-3 py-2.5 text-base border border-[#ffffff14] rounded-lg
              whitespace-nowrap
              ${
                subcategory === activeSubcategory
                  ? "text-gray-900 bg-gray-100 hover:text-black font-semibold"
                  : "text-gray-300 hover:text-white hover:bg-gray-600"
              }
            `}
                  onClick={() => setActiveSubcategory(subcategory)}
                >
                  {subcategory}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="nav-button meta-prev left-0">
            <FiChevronLeft className="text-lg" />
          </div>
          <div className="nav-button meta-next right-0">
            <FiChevronRight className="text-lg" />
          </div>
        </div>
      </div>
    </>
  );
};

export default LeaderboardSubcategory;
