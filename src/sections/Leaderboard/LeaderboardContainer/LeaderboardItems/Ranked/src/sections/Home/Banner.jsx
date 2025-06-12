import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "../../../i18n";
import Link from "next/link";
import OutsideClickHandler from "./OutsideClickHandler";
import rocketParticle from "@assets/images/homeV2/rocketStar.svg";

import tokenImg1 from "@assets/images/homeV2/buyTokenlogo1.png";
import tokenImg2 from "@assets/images/homeV2/buyTokenlogo2.png";
import tokenImg3 from "@assets/images/homeV2/buyTokenlogo3.png";
import tokenImg4 from "@assets/images/homeV2/buyTokenlogo4.png";

import BannerStyleWrapper from "./Banner.style";
const Banner = () => {
  const { t } = useTranslation();
  const home = t("home");
  const players = [
    {
      name: "jaishankar",
      imageUrl:
        "https://cdn.mobalytics.gg/assets/lol/images/dd/summoner-icons/29.png?1",
    },
    {
      name: "jaishankar10",
      imageUrl:
        "https://cdn.mobalytics.gg/assets/lol/images/dd/summoner-icons/29.png?1",
    },
    {
      name: "jaishan",
      imageUrl:
        "https://cdn.mobalytics.gg/assets/lol/images/dd/summoner-icons/29.png?1",
    },
    {
      name: "jai",
      imageUrl:
        "https://cdn.mobalytics.gg/assets/lol/images/dd/summoner-icons/29.png?1",
    },
    {
      name: "jaish",
      imageUrl:
        "https://cdn.mobalytics.gg/assets/lol/images/dd/summoner-icons/29.png?1",
    },
  ];
  const [suggestions, setSuggestions] = useState(players);
  const [suggetionsVisible, setSuggestionsVisible] = useState(false);
  const [query, setQuery] = useState("");
  useEffect(() => {
    if (query) {
      const filteredSuggestions = players.filter((player) =>
        player.name.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    }
  }, [query]);
  const particles = [
    rocketParticle,
    rocketParticle,
    rocketParticle,
    rocketParticle,
    rocketParticle,
  ];
  const tokenImages = [tokenImg1, tokenImg2, tokenImg3, tokenImg4];

  const handleOutsideClick = () => {
    setSuggestionsVisible(false);
  };
  return (
    <>
      <BannerStyleWrapper>
        <div className="container bg-glass !bg-[#00000050]">
          <div className="row">
            <div className="col-md-6">
              <div className="gamfi_v2_hero_left">
                <h2>
                  {/* ItemSwap <span>Game</span> Ecosystem */}
                  {home.title}
                </h2>
                <p className="!text-[22px]">{home.description}</p>
                <OutsideClickHandler onOutsideClick={handleOutsideClick}>
                  <div className="search_box relative mb-2">
                    <input
                      type="search"
                      name="serch"
                      placeholder={home.search.placeholder}
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onFocus={() => setSuggestionsVisible(true)}
                      class="!bg-white !text-black h-10 px-4 pr-10 py-10 rounded-2xl text-sm focus:outline-none w-full !text-[20px]"
                    />
                    {/* <button
                      type="submit"
                      class="absolute right-0 top-5 mt-3 mr-4"
                    >
                      <FaMagnifyingGlass className="!text-black text-[26px]" />
                    </button> */}
                  </div>
                  {suggetionsVisible && (
                    <ul className="!bg-[#090a1a] rounded-2xl px-4 py-2 border-[1px] border-[#ffffff50]">
                      {suggestions.map((suggestion, i) => (
                        <Link href={`/user/${suggestion?.name}`} key={i}>
                          <li className="!text-white cursor-pointer hover:bg-[#1d1f2f] rounded-2xl px-4 py-2">
                            <div className="flex justify-start items-center mb-2">
                              <img
                                src={suggestion?.imageUrl}
                                className="rounded-full w-10 border-[1px] border-[#ffffff50] mr-2"
                              />
                              <h6 className="mb-0 text-[18px]">
                                {suggestion?.name}
                              </h6>
                            </div>
                          </li>
                        </Link>
                      ))}
                    </ul>
                  )}
                </OutsideClickHandler>

                {/* <div className="buy_token">
                  <h6>BUY TOKEN ON</h6>
                  <div className="token-list">
                    {tokenImages?.map((token, i) => (
                      <Link key={i} href="# ">
                        <img
                          src={token.src}
                          alt="token logo"
                          className="img-fluid"
                        />
                      </Link>
                    ))}
                  </div>
                </div> */}
              </div>
            </div>
            {/* <div className="col-md-6">
              <div className="gamfi_v2_hero_right">
                <div className="gamfi_v2_hero_thumb">
                  <span className="rocket_thumb">
                    <img src={rocketThumb.src} alt="Rocket thumb" />
                  </span>

                  {particles?.map((particle, i) => (
                    <span
                      key={i}
                      className={`rocket_particle particle_${i + 1}`}
                    >
                      <img src={particle.src} alt="rocket particle" />
                    </span>
                  ))}
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </BannerStyleWrapper>
    </>
  );
};

export default Banner;
