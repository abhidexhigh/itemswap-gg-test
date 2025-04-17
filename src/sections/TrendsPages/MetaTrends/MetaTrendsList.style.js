import styled from "styled-components";

const ProjectsListStyleWrapper = styled.section`
  height: auto;
  backdrop-filter: blur(2px);
  // background: #090a1a;
  // background-image: url("https://res.cloudinary.com/dg0cmj6su/image/upload/v1726558185/adrien-olichon-RCAhiGJsUUE-unsplash_k1xxtl.jpg");
  // box-shadow: inset 0 0 0 2000px #40404154;
  position: relative;

  .previous_projects {
    .section_title {
      margin-bottom: 50px;
    }
  }

  .section_heading {
    position: relative;
    display: flex;
    align-items: center;
    max-width: 333px;
    width: 100%;
    margin-bottom: 50px;
    z-index: 1;
    .title {
      margin: 0;
    }
  }
`;

export default ProjectsListStyleWrapper;
