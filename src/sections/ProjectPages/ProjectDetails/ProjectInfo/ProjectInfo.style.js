import styled from "styled-components";
import bgShape from "@assets/images/bg/card-bg-shape-big.png";

const ProjectInfoStyleWrapper = styled.section`
  margin: -60px 0 30px;
  .game-price-item {
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    padding: 50px;
    position: relative;
    z-index: 9;
    background: radial-gradient(circle, #4a4176 -24%, #1e1f35 40%);

    &::before {
      position: absolute;
      height: 100%;
      width: 100%;
      left: 0%;
      top: 0;
      background: url(${bgShape.src});
      background-repeat: no-repeat;
      background-position: center;
      content: "";
      opacity: 0.8;
      z-index: -1;
    }
  }

  .game-price-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .total-price,
  .targeted-raise {
    width: 38%;
  }
  /* price inner  */
  .price-inner {
    margin-bottom: 45px;

    .image-icon {
      margin-right: 25px;
      img {
        max-width: 100%;
        width: auto;
        margin: 0 auto;
      }
    }

    .price-details {
      h3 {
        margin-bottom: 15px;
      }
      .dsc {
        text-transform: uppercase;
      }
    }
  }

  .all-raise {
    font-family: "CeraPro", sans-serif;
    margin-bottom: 10px;
    color: #ffffff;
  }

  .allocation-max {
    width: 24%;
    img {
      margin-top: 10px;
      margin: 0 auto;
    }

    .allocation {
      font-family: "CeraPro", sans-serif;
      color: #ffffff;
      margin-top: 73px;
    }
  }

  .targeted-raise {
    .seles-end-text {
      font-family: "Inter", sans-serif;
      color: rgba(255, 255, 255, 0.7);
      text-transform: uppercase;
      margin-bottom: 10px;
    }

    .targeted-raise-amount {
      color: #ffffff;
      font-family: "CeraPro", sans-serif;
      text-align: right;
      font-weight: 500;
    }
  }

  /* countdown timmer */

  .displayedTime {
    margin-bottom: 48px;
  }
  .countBox {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-family: "CeraPro", sans-serif;
    color: #ffffff;
    .count {
      font-size: 30px;
    }
  }

  .countBoxItem {
    display: flex;
    align-items: baseline;
    column-gap: 2px;
  }

  span.split {
    display: none;
  }

  .project_card_footer {
    display: flex;
    align-items: center;
    margin-top: 40px;
    justify-content: space-between;
    .participants {
      font-family: "CeraPro", sans-serif;
      padding-left: 100px;
      color: #ffffff;
    }
    .social_links {
      display: flex;
      align-items: center;
      column-gap: 20px;
    }
  }

  @media only screen and (max-width: 1199px) {
    .total-price {
      .price-inner {
        .price-details {
          h3 {
            font-size: 24px;
          }
        }
      }
    }
  }

  @media only screen and (max-width: 991px) {
    text-align: center;
    .game-price-inner {
      flex-direction: column;
      align-items: center;
    }
    .total-price {
      width: 100%;

      .price-inner {
        flex-direction: column;
        align-items: center;
        margin-bottom: 20px;

        .image-icon {
          margin: 0 0 10px;
        }

        .price-details h3 {
          margin-bottom: 5px;
        }
      }
    }

    .allocation-max {
      width: 100%;
      .allocation {
        margin-top: 35px;
      }
    }

    .targeted-raise {
      width: 100%;

      .displayedTime {
        max-width: 400px;
        margin: 0 auto 20px;
      }

      .targeted-raise-amount {
        text-align: center;
        margin-bottom: 10px;
      }
    }

    .project_card_footer {
      flex-direction: column;
      row-gap: 20px;
      .participants {
        padding-left: 0;
      }
    }
  }

  @media only screen and (max-width: 480px) {
    padding: 0;
    .game-price-item {
      padding-left: 15px;
      padding-right: 15px;
    }
    .total-price {
      .price-inner {
        .price-details {
          h3 {
            font-size: 20px;
          }
        }
      }
    }

    .countBox {
      .count {
        font-size: 26px !important;
      }

      .label {
        font-size: 16px !important;
      }
    }
  }
`;

export default ProjectInfoStyleWrapper;
