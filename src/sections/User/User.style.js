import styled from "styled-components";

const ChampionsStyleWrapper = styled.div`
  padding: 0 0 60px;
  backdrop-filter: blur(30px);

  @media (min-width: 768px) {
    padding: 0 0 100px;
  }

  // Add animation for pulse effect
  @keyframes pulse-slow {
    0% {
      opacity: 0.6;
    }
    50% {
      opacity: 0.8;
    }
    100% {
      opacity: 0.6;
    }
  }

  .animate-pulse-slow {
    animation: pulse-slow 3s infinite ease-in-out;
  }

  // Modern scrollbar styling
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }

  // Container styling
  .container {
    max-width: 1280px;
    margin: 0 auto;
    width: 100%;
    padding-left: 12px;
    padding-right: 12px;

    @media (min-width: 640px) {
      padding-left: 16px;
      padding-right: 16px;
    }
  }

  // Glass effect backgrounds
  .bg-glass {
    background: rgba(34, 34, 49, 0.7);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  // Card hover effects
  .card-hover {
    transition: all 0.3s ease;
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    }
  }

  // Mobile optimizations
  @media only screen and (max-width: 640px) {
    h1,
    h2,
    h3 {
      word-break: break-word;
    }

    .text-truncate {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 100%;
    }
  }

  // Responsive text
  .text-responsive {
    font-size: 14px;

    @media (min-width: 640px) {
      font-size: 16px;
    }
  }

  // Responsive grid
  .grid-responsive {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 12px;

    @media (min-width: 768px) {
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 16px;
    }
  }

  // Responsive padding
  .p-responsive {
    padding: 12px;

    @media (min-width: 640px) {
      padding: 16px;
    }

    @media (min-width: 768px) {
      padding: 24px;
    }
  }

  // Responsive margin
  .m-responsive {
    margin: 12px;

    @media (min-width: 640px) {
      margin: 16px;
    }

    @media (min-width: 768px) {
      margin: 24px;
    }
  }

  // Responsive gap
  .gap-responsive {
    gap: 8px;

    @media (min-width: 640px) {
      gap: 12px;
    }

    @media (min-width: 768px) {
      gap: 16px;
    }
  }

  .leaderboard_list {
    display: block;
  }

  .leaderboard_list_item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
    background: rgba(30, 31, 53, 0.8);
    backdrop-filter: blur(5px);

    @media (min-width: 768px) {
      padding: 25px 20px;
    }

    li {
      position: relative;
      width: 20.2%;
      color: #ffffff;
      &:nth-child(1) {
        width: 15%;
      }

      &::before {
        display: none;
        position: absolute;
        left: 0;
        top: -75px;
        content: attr(data-title);
        font-family: "CeraPro", sans-serif;
        color: rgba(255, 255, 255, 0.7);
        font-weight: 400;
        text-transform: uppercase;
      }
    }

    &:nth-child(1) {
      li {
        &::before {
          display: block;
        }
      }
    }
  }

  .leaderboard_list_item + .leaderboard_list_item {
    margin-top: 10px;
  }

  @media only screen and (max-width: 991px) {
    padding-top: 0;
    .leaderboard_list {
      display: flex;
      flex-wrap: wrap;
      column-gap: 10px;
      row-gap: 10px;
    }

    .leaderboard_list_item {
      width: calc(50% - 10px);
      flex-direction: column;
      align-items: flex-end;
      row-gap: 10px;
      margin: 0 !important;

      li {
        width: 100% !important;
        text-align: right;
        &::before {
          top: 0;
          font-size: 14px;
          display: block;
        }
      }
    }
  }

  @media only screen and (max-width: 767px) {
    .leaderboard_list_item {
      width: 100%;
    }
  }

  @media only screen and (max-width: 320px) {
    .leaderboard_list_item {
      li {
        font-size: 11px;
      }
    }
  }
`;

export default ChampionsStyleWrapper;
