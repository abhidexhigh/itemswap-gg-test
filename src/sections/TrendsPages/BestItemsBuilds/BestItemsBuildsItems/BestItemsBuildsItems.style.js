import styled from "styled-components";

const ProjectCardStyleWrapper = styled.div`
  // background: #090b1a;
  padding: 0;
  position: relative;

  .section_title {
    margin-bottom: 50px;
  }

  .menu-list {
    font-family: "CeraPro", sans-serif;
    padding-left: 40px;
    margin-bottom: 15px;

    li {
      display: inline-block;
      color: rgba(255, 255, 255, 0.7);
      text-transform: uppercase;
      transition: 0.4s;

      &:nth-child(1) {
        width: 20%;
      }
      &:nth-child(2) {
        width: 25%;
      }
      &:nth-child(3) {
        width: 32%;
      }
      &:nth-child(4) {
        width: 10%;
      }
    }
  }

  /* tabs  */
  .react-tabs {
    position: relative;

    .react-tabs__tab {
      position: relative;

      &::before {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 0;
        height: 2px;
        background: #6d4afe;
        content: "";
        transition: 0.4s ease-in-out;
      }

      &.react-tabs__tab--selected {
        &::before {
          width: 100%;
        }
      }
    }
  }

  .projects-row {
    row-gap: 30px;
    transition: all 0.4s;
  }

  .react-tabs__tab-list {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: absolute;
    top: -145px;
    left: 0;
    width: 100%;
    height: auto;
    background: #222231;
    margin-bottom: 42px;
  }

  .tab_btn_wrapper {
    display: flex;
    align-items: center;
  }

  /* Mobile Tabs */
  .text-sm.font-medium.text-center {
    ul {
      li {
        div {
          font-weight: 600;
          transition: all 0.3s ease;

          &:hover {
            color: #ffffff;
          }

          &.active {
            background: linear-gradient(to bottom, #f0f9ff, #ffffff);
            color: #121212;
            font-weight: 700;
          }
        }
      }
    }
  }

  /* Tier Cards */
  .bg-slate-800 {
    overflow: hidden;
    transition: all 0.3s ease;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);

    &:hover {
      transform: translateY(-2px);
    }
  }

  /* Champion Rows */
  tr.bg-[#1e293b] {
    transition: background-color 0.2s ease;

    &:hover {
      background-color: #283548;
    }

    td {
      .flex.pt-\\[8px\\] {
        align-items: center;

        button {
          transition: color 0.2s ease;

          &:hover {
            color: #3b82f6;
          }
        }
      }
    }
  }

  /* Item Images */
  .relative.overflow-hidden {
    img {
      transition: transform 0.2s ease;

      &:hover {
        transform: scale(1.05);
      }
    }
  }

  /* Table Styling */
  table {
    width: 100%;

    thead tr th {
      font-weight: 600;
      color: #d0d0d0;
    }

    tbody tr {
      &:hover {
        background-color: rgba(255, 255, 255, 0.05);
      }
    }
  }

  @media only screen and (max-width: 991px) {
    padding-bottom: 30px;

    .menu-list {
      li {
        font-size: 14px;
        &:nth-child(1) {
          width: 33%;
        }
      }
    }
  }

  @media only screen and (max-width: 767px) {
    padding-top: 20px;

    .section_title {
      margin-bottom: 35px;
    }

    .menu-list {
      padding-left: 10px;
      margin-bottom: 20px;
      li {
        width: 100% !important;
      }
      li + li {
        margin-top: 15px;
      }
    }

    .text-sm.font-medium.text-center {
      ul {
        li {
          div {
            font-size: 14px;
            padding: 8px 4px;
          }
        }
      }
    }
  }

  @media only screen and (max-width: 575px) {
    .text-sm.font-medium.text-center {
      ul {
        li {
          div {
            font-size: 12px;
            padding: 6px 2px;
          }
        }
      }
    }
  }
`;

export default ProjectCardStyleWrapper;
