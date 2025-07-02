import { createGlobalStyle } from "styled-components";

const banners = [
  "https://res.cloudinary.com/dg0cmj6su/image/upload/v1747136638/Champions_Webpage_Magic_Archer_Resize_nghsgn_j9ageu.webp",
  "https://res.cloudinary.com/dg0cmj6su/image/upload/v1747136638/Champions_Webpage_Valkyrie_wnreue_yeim3g.webp",
  "https://res.cloudinary.com/dg0cmj6su/image/upload/v1747136639/Champions_Webpage_Fairy_Dragon_mmmexo_bwuoun.webp",
  "https://res.cloudinary.com/dg0cmj6su/image/upload/v1747136638/Champions_Webpage_Succubus_pqguqq_pyxkj4.webp",
  "https://res.cloudinary.com/dg0cmj6su/image/upload/v1747136639/Champions_Webpage_Vampire_nxxcbf_kfqrty.webp",
  "https://res.cloudinary.com/dg0cmj6su/image/upload/v1747136639/Champions_Webpage_Phoenix_fdj6z9_qkbavk.webp",
  "https://res.cloudinary.com/dg0cmj6su/image/upload/v1747136639/Champions_Webpage_Witch_pmiraz_fbfahv.webp",
  "https://res.cloudinary.com/dg0cmj6su/image/upload/v1747136639/Champions_Webpage_Western_Dragon_x5xoiv_q3dhqk.webp",
  "https://res.cloudinary.com/dg0cmj6su/image/upload/v1747136639/Champions_Webpage_NineTail_emsygp_covvfw.webp",
  "https://res.cloudinary.com/dg0cmj6su/image/upload/v1747136628/Champions_Webpage_Eastern_dragon_t57yn6_bhmwxb.webp",
  "https://res.cloudinary.com/dg0cmj6su/image/upload/v1747136628/Champions_Webpage_Elemental_Dragon_nbierd_j2twtc.webp",
  "https://res.cloudinary.com/dg0cmj6su/image/upload/v1747136628/Champions_Webpage_BONE_DRAGON_mezyio_liypp4.webp",
  //   "https://res.cloudinary.com/dg0cmj6su/image/upload/v1726810714/1_2_r8m96x.webp",
  //   "https://res.cloudinary.com/dg0cmj6su/image/upload/v1726810714/3_f9btc3.webp",
  //   "https://res.cloudinary.com/dg0cmj6su/image/upload/v1726810713/5_2_gkjoxb.webp",
  //   "https://res.cloudinary.com/dg0cmj6su/image/upload/v1726810713/2_2_ho7jjx.webp",
  //   "https://res.cloudinary.com/dg0cmj6su/image/upload/v1726658109/27_wkcz2w.webp",
  //   "https://res.cloudinary.com/dg0cmj6su/image/upload/v1726652143/22_riyfto.webp",
  //   "https://res.cloudinary.com/dg0cmj6su/image/upload/v1726573776/15_rfg99m.webp",
  //   "https://res.cloudinary.com/dg0cmj6su/image/upload/v1726834331/19_hcvlxg.webp",
  //   "https://res.cloudinary.com/dg0cmj6su/image/upload/v1726834336/17_pdnfxw.webp",
  //   "https://res.cloudinary.com/dg0cmj6su/image/upload/v1726834338/15_1_kbuzpu.webp",
];

const mobileBanners = [
  "https://res.cloudinary.com/dg0cmj6su/image/upload/v1742468268/Elemental_mf2ael.webp",
  "https://res.cloudinary.com/dg0cmj6su/image/upload/v1742468268/Eastern_b9glxe.webp",
  "https://res.cloudinary.com/dg0cmj6su/image/upload/v1742468268/witch_vfyn35.webp",
  "https://res.cloudinary.com/dg0cmj6su/image/upload/v1742468269/Western_Dragon_emjhxc.webp",
  "https://res.cloudinary.com/dg0cmj6su/image/upload/v1742468269/Succubus_j0svmf.webp",
  "https://res.cloudinary.com/dg0cmj6su/image/upload/v1742468269/ninetails_ljgwab.webp",
  "https://res.cloudinary.com/dg0cmj6su/image/upload/v1742468270/phoenix_suqtrv.webp",
];

function getRandomChampionKey() {
  console.log("getRandomChampionKey");
  const randomIndex = Math.floor(Math.random() * banners.length);
  return banners[randomIndex];
}

function getRandomMobileBanner() {
  const randomIndex = Math.floor(Math.random() * mobileBanners.length);
  return mobileBanners[randomIndex];
}

function getMobileBackgroundPosition(pathname) {
  // Default position
  let position = "center center";

  // Map of page paths to background positions
  const positionMap = {
    "/": "50%",
    "/metaTrends": "0%",
    "/recentDecks": "17%",
    "/championsTrends": "34%",
    "/itemsTrends": "51%",
    "/traitsTrends": "68%",
    "/augmentsTrends": "85%",
    "/bestItemsBuilds": "100%",
  };

  return positionMap[pathname] || "center center";
}

const GlobalStyles = createGlobalStyle` 

::-moz-selection {
    background: #2D65F8;
    text-shadow: none;
    color: #ffffff;
}

::selection {
    background: #2D65F8;
    text-shadow: none;
    color: #ffffff;
}

/* -----------------------------------/
    01. Gamfi General CSS
-------------------------------------*/
html,
body {
    font-size: 16px;
    color: rgba(255, 255, 255, 0.7);
    font-family: 'CeraPro', sans-serif;
    line-height: 1.6;
    font-weight: 500; 
    // background-color: #151625;
    // background-color: #1e1e1e; /* Dark background color */
    // background-image: url('https://media.discordapp.net/attachments/1210207279333253193/1256477832381595688/istockphoto-1168786352-170667a.webp?ex=6680e9ab&is=667f982b&hm=4c01d16420b4af521b41b964c88252ca757d04bd314963a72b8de5ef078f75a9&=&format=webp&width=1084&height=610');
//     background: #1D4350;  /* fallback for old browsers */
// background: -webkit-linear-gradient(to right, #A43931, #1D4350);  /* Chrome 10-25, Safari 5.1-6 */
// background: linear-gradient(to right, #A43931, #1D4350); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
// background: linear-gradient(90deg, rgba(19,18,38,1) 0%, rgba(19,18,38,1) 100%);
//   background-image: url("https://res.cloudinary.com/dg0cmj6su/image/upload/v1726573776/15_rfg99m.webp");
  background-image: 
    linear-gradient(to top, rgba(0, 0, 0) 0%, rgba(0,0,0) 53%, transparent 100%),
    url(${getRandomChampionKey()});
//   background-image: url("https://res.cloudinary.com/dg0cmj6su/image/upload/v1726658106/24_baandr.webp");
//   background-image: url("https://res.cloudinary.com/dg0cmj6su/image/upload/v1726658109/27_wkcz2w.webp");




// background-image: linear-gradient(to right, #434343 0%, black 100%);
// background-image: linear-gradient(60deg, #29323c 0%, #485563 100%);
// background: linear-gradient(to bottom, #323232 0%, #3F3F3F 40%, #1C1C1C 150%), linear-gradient(to top, rgba(255,255,255,0.40) 0%, rgba(0,0,0,0.25) 200%);
//  background-blend-mode: multiply;

    backgroint-attachment: fixed;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
}

img {
    max-width: 100%;
    height: auto;
}

p {
    margin: 0 0 26px;
    line-height: 1.8;
}

h1,
h2,
h3,
h4,
h5,
h6 {
    font-family: "CeraPro", sans-serif;
    color: #ffffff;
    line-height: 1.35;
    font-weight: 400;
    margin: 0 0 26px;
}

h1 {
    font-size: 50px; 
}

h2 {
    font-size: 36px; 
}

h3 {
    font-size: 30px; 
}

h4 {
    font-size: 22px;
}

h5 {
    font-size: 16px;
}

h6 {
    font-size: 14px;
}

a {
    color: #fff;
    transition: all 0.3s ease;
    text-decoration: none;
    outline: none;
}

a:active,
a:hover {
    text-decoration: none;
    outline: 0 none;
    color: #a3ff12;
}

ul {
    list-style: outside none none;
    margin: 0;
    padding: 0;
}

input:focus,
select:focus,
textarea:focus,
button:focus {
    outline: none;
    text-decoration: none;
    box-shadow: none;
}

button {
    border: none;
}

/* css grid */

.grid{
    display: grid;
}
.grid-cols-7{
    grid-template-columns: repeat(7, minmax(0, 1fr));
}

.col-start-2{
    grid-column-start: 2;
}
.col-start-3{
    grid-column-start: 3;
}
.col-start-4{
    grid-column-start: 4;
}
.col-start-5{
    grid-column-start: 5;
}
.col-start-6{
    grid-column-start: 6;
}
.col-start-7{
    grid-column-start: 7;
}

@media only screen and (min-width: 1200px) {
  .container {
    max-width: 1460px;
  }
}

@media only screen and (max-width: 480px) {
    html {
        margin: 0;
        padding: 0;
        overflow-x: hidden;
        /* Enable smooth scrolling */
        scroll-behavior: smooth;
    }

    body {
        font-size: 15px;
        position: relative;
        min-height: 100vh;
        margin: 0;
        padding: 0;
        background: none;
        /* Fix mobile scroll issues */
        overflow-x: hidden;
        -webkit-overflow-scrolling: touch;
        touch-action: manipulation;
    }

    body::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        min-height: 100vh;
        background-image: url(${getRandomMobileBanner()});
        background-position: center 25px;
        background-repeat: no-repeat;
        background-size: 100% auto;
        z-index: -1;
        /* Improve rendering performance */
        -webkit-transform: translate3d(0,0,0);
        transform: translate3d(0,0,0);
        -webkit-backface-visibility: hidden;
        backface-visibility: hidden;
        will-change: transform;
    }

    #__next {
        position: relative;
        z-index: 1;
        background: transparent;
        min-height: 100vh;
    }
}

tabs-carousel {
    position: relative;
    padding: 0 52px !important;
  }
  .nav-button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 20;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  .nav-button:hover {
    background: rgba(255, 255, 255, 0.2);
  }
  .nav-button.disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
  .swiper-slide {
    width: auto !important;
  }

  .swiper {
  width: 80% !important;
  margin-left: auto !important;;
  margin-right: auto !important;;
  }
`;

export default GlobalStyles;
