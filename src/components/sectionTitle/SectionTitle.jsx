import {
  SectionTitleStyle,
  SectionTitleWrapperStyle,
} from "./SectionTitle.style";
import sectionTitleShapeRgiht from "@assets/images/icons/steps.png";
import sectionTitleShapeleft from "@assets/images/icons/steps2.png";

export const SectionTitle = ({ title, subtitle, isCenter, ...props }) => {
  return (
    <SectionTitleStyle {...props} className="section_title">
      {subtitle && (
        <span className="subtitle !flex !justify-center !mx-auto">
          {isCenter ? (
            <img src={sectionTitleShapeleft.src} alt="section title shape" />
          ) : (
            ""
          )}
          {subtitle}{" "}
          <img
            src={sectionTitleShapeRgiht.src}
            alt="bithu nft section title shape"
          />{" "}
        </span>
      )}
      {title && <h2>{title}</h2>}
    </SectionTitleStyle>
  );
};

export const SectionTitleWrapper = ({ children }) => {
  return (
    <SectionTitleWrapperStyle className="section_title_wrapper">
      {children}
    </SectionTitleWrapperStyle>
  );
};
