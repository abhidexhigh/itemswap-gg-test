import { useTranslation } from "react-i18next";
import "../../../../i18n";
import Link from "next/link";
import { SectionTitle } from "@components/sectionTitle";
import SocialStyleWrapper from "./SocialProfile.style";
import data from "@assets/data/social/dataV1";

const Social = () => {
  const { t } = useTranslation();
  const others = t("others");
  return (
    <SocialStyleWrapper>
      <div className="container">
        <SectionTitle isCenter={true} subtitle={others.findUsOnSocial} />
        <div className="social-link-list">
          {data?.map((profile, i) => (
            <Link key={i} href={profile.url}>
              <img src={profile.icon.src} alt="social icon" />
            </Link>
          ))}
        </div>
      </div>
    </SocialStyleWrapper>
  );
};

export default Social;
