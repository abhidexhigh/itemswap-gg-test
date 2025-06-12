import { useTranslation } from "react-i18next";
import "../../../../i18n";
import Link from "next/link";
import { SectionTitle } from "@components/sectionTitle";
import SocialStyleWrapper from "./SocialProfile.style";
import data from "@assets/data/social/dataV1";
import { FaXTwitter, FaDiscord, FaYoutube, FaTwitch } from "react-icons/fa6";

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
              {profile.icon === "twitter" && <FaXTwitter />}
              {profile.icon === "youtube" && <FaYoutube />}
              {profile.icon === "discord" && <FaDiscord />}
              {profile.icon === "twitch" && <FaTwitch />}
            </Link>
          ))}
        </div>
      </div>
    </SocialStyleWrapper>
  );
};

export default Social;
