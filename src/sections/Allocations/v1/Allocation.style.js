import styled from "styled-components";

const AllocationStyleWrapper = styled.div`
  background: #090a1a;
  padding-top: 0px;
  padding-bottom: 105px;
  .menu-list {
    display: block;
    font-family: "CeraPro", sans-serif;
    padding-left: 40px;
    margin-bottom: 15px;

    li {
      font-family: "CeraPro";
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      line-height: 45px;
      display: inline-block;
      color: rgba(255, 255, 255, 0.7);
      text-transform: uppercase;
      transition: 0.4s;

      &:nth-child(1) {
        width: 140px;
        margin-right: 81px;
      }
      &:nth-child(2) {
        width: 158px;
        margin-right: 46px;
      }
      &:nth-child(3) {
        width: 175px;
        margin-right: 84px;
      }
      &:nth-child(4) {
        width: 158px;
        margin-right: 79px;
      }
      &:nth-child(5) {
        width: 41px;
        margin-right: 73px;
      }
      &:nth-child(6) {
        width: 99px;
      }
    }
  }

  .projects-row {
    row-gap: 20px;
  }

  @media only screen and (max-width: 991px) {
    padding-bottom: 85px;
    .menu-list {
      display: none;
      visibility: hidden;
    }
  }
  @media only screen and (max-width: 767px) {
  }
`;

export default AllocationStyleWrapper;
