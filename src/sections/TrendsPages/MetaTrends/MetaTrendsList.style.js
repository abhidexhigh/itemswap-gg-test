import styled from "styled-components";

const ProjectsListStyleWrapper = styled.section`
  height: auto;
  // PERFORMANCE OPTIMIZATION: Replaced backdrop-filter with performance-friendly alternative
  // backdrop-filter: blur(2px); // REMOVED - causes severe scroll lag
  background: rgba(
    9,
    10,
    26,
    0.95
  ); // Semi-transparent background for similar effect
  position: relative;

  // PERFORMANCE OPTIMIZATION: Add will-change for better scroll performance
  will-change: transform;

  // PERFORMANCE OPTIMIZATION: Enable hardware acceleration without heavy effects
  transform: translateZ(0);

  // Optional: Add subtle texture overlay for visual depth without blur
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background:
      radial-gradient(
        circle at 20% 50%,
        rgba(255, 255, 255, 0.02) 0%,
        transparent 50%
      ),
      radial-gradient(
        circle at 80% 20%,
        rgba(255, 255, 255, 0.01) 0%,
        transparent 50%
      ),
      radial-gradient(
        circle at 40% 80%,
        rgba(255, 255, 255, 0.01) 0%,
        transparent 50%
      );
    pointer-events: none;
    z-index: 0;
  }

  // Ensure content is above the overlay
  > * {
    position: relative;
    z-index: 1;
  }

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
