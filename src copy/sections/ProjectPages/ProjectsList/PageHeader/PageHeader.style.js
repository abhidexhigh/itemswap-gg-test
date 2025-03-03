import styled from "styled-components";
import breadcumdBg from "@assets/images/bg/breadcrumbs-bg.jpg";
import breadcumbBgNew from "@assets/image/backgrounds/image.webp";

// const banners = [
//   "https://res.cloudinary.com/dg0cmj6su/image/upload/v1719398260/5_ulis2d.webp",
//   "https://res.cloudinary.com/dg0cmj6su/image/upload/v1719398260/1_odmh9l.webp",
//   "https://res.cloudinary.com/dg0cmj6su/image/upload/v1719398260/2_c9qmsx.webp",
//   "https://res.cloudinary.com/dg0cmj6su/image/upload/v1719398260/6_dhlec4.webp",
//   "https://res.cloudinary.com/dg0cmj6su/image/upload/v1719398260/8_vcedjx.webp",
//   "https://res.cloudinary.com/dg0cmj6su/image/upload/v1719398259/3_m8zfta.webp",
//   "https://res.cloudinary.com/dg0cmj6su/image/upload/v1719398259/10_ikphqk.webp",
//   "https://res.cloudinary.com/dg0cmj6su/image/upload/v1719398259/4_oilfpn.webp",
//   "https://res.cloudinary.com/dg0cmj6su/image/upload/v1719398259/7_hymlli.webp",
//   "https://res.cloudinary.com/dg0cmj6su/image/upload/v1719398259/9_iczv0b.webp",
// ];

const banners = [
  "https://res.cloudinary.com/dg0cmj6su/image/upload/v1725944884/03_jowtqx.webp",
  "https://res.cloudinary.com/dg0cmj6su/image/upload/v1725944884/04_ecmfo7.webp",
  "https://res.cloudinary.com/dg0cmj6su/image/upload/v1725951189/07_np8blb.webp",
  "https://res.cloudinary.com/dg0cmj6su/image/upload/v1725963879/09_lt2t8g.webp",
  "https://res.cloudinary.com/dg0cmj6su/image/upload/v1725963879/08_2_ixol6x.webp",
  "https://res.cloudinary.com/dg0cmj6su/image/upload/v1725969672/07_1_x230z9.webp",
  "https://res.cloudinary.com/dg0cmj6su/image/upload/v1725969673/02_2_u984vf.webp",
  "https://res.cloudinary.com/dg0cmj6su/image/upload/v1725969673/01_1_py2o6m.webp",
  "https://res.cloudinary.com/dg0cmj6su/image/upload/v1725969674/11_bxselz.webp",
  "https://res.cloudinary.com/dg0cmj6su/image/upload/v1725969674/10_vkh1hf.webp",
  "https://res.cloudinary.com/dg0cmj6su/image/upload/v1726057657/1_o8wxqu.webp",
  "https://res.cloudinary.com/dg0cmj6su/image/upload/v1726057657/5_ccgowt.webp",
  "https://res.cloudinary.com/dg0cmj6su/image/upload/v1726057658/2_zbtev7.webp",
  "https://res.cloudinary.com/dg0cmj6su/image/upload/v1726057658/4_guv1ho.webp",
  "https://res.cloudinary.com/dg0cmj6su/image/upload/v1726057669/06_1_wzg3ak.webp",
];

function getRandomChampionKey() {
  const randomIndex = Math.floor(Math.random() * banners.length);
  return banners[randomIndex];
}

const PageHeaderStyleWrapper = styled.div`
  background: url(${getRandomChampionKey()});
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  padding: 10px 0 10px;
  box-shadow: inset 0 0 0 2000px #40404154;

  .breadcrumb_area {
    font-family: "Russo One", sans-serif;

    .breadcrumb_menu {
      text-transform: uppercase;
      display: flex;
      align-items: center;
      font-size: 16px;
      color: #a3ff12;
      a {
        color: rgba(255, 255, 255, 0.7);
        text-decoration: none;
        &:hover {
          color: #ffffff;
        }
      }
      span {
        color: rgba(255, 255, 255, 0.7);
        margin: 0 10px;
      }
      img {
        margin-left: 15px;
      }
    }

    .breadcrumb_title {
      color: white;
      margin: 15px 0 0;
    }
  }

  .breadcrumb_form {
    display: flex;
    align-items: center;
    justify-content: end;
    column-gap: 30px;

    form {
      position: relative;

      input,
      button {
        background: transparent;
      }

      input {
        width: 380px;
        padding: 11px 50px 11px 20px;
        color: rgba(255, 255, 255, 0.7);
        border: 1px solid rgba(255, 255, 255, 0.3);

        &:focus {
          outline: none;
        }
      }

      button {
        height: 100%;
        width: 50px;
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        top: 50%;
        right: 0;
        font-size: 20px;
        color: rgba(255, 255, 255, 0.7);
        transform: translate(0, -50%);
        border: none;
      }
    }
  }

  @media only screen and (max-width: 991px) {
    .breadcrumb_title {
      font-size: 30px;
    }
  }

  @media only screen and (max-width: 768px) {
    .breadcrumb_title {
      font-size: 26px;
    }
    .breadcrumb_form {
      justify-content: start;
      margin-top: 40px;
      form {
        width: 70%;
        input {
          width: 100%;
        }
      }
    }
  }
  @media only screen and (max-width: 540px) {
    .breadcrumb_menu {
      a {
        font-size: 14px;
      }
    }
    .breadcrumb_title {
      font-size: 22px;
    }
    .breadcrumb_form {
      justify-content: start;
      flex-direction: column;
      align-items: flex-start;
      row-gap: 20px;
      margin-top: 30px;
      form {
        width: 80%;
        input {
          width: 100%;
        }
      }
    }
  }
`;

export default PageHeaderStyleWrapper;
