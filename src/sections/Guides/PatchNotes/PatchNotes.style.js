import styled from "styled-components";

const ProjectsListStyleWrapper = styled.section`
  height: auto;
  // background: #090a1a;
  backdrop-filter: blur(20px);
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
