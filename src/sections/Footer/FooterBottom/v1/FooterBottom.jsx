import { useTranslation } from "react-i18next";
import "../../../../../i18n";
import Link from "next/link";
import Social from "../../SocialProfile/SocialProfile";
import logo from "@assets/image/logo.png";
import { VscChevronUp } from "react-icons/vsc";
import FooterBottomStyleWrapper from "./FooterBottom.style";

const FooterBottom = () => {
  const { t } = useTranslation();
  const others = t("others");
  return (
    <FooterBottomStyleWrapper className="footer_bottom_wrapper">
      <Social />
      <div className="container">
        <div className="footer-bottom-content">
          <Link href="/" className="footer-logo">
            <img src={logo.src} className="w-[190px]" alt="footer logo" />
          </Link>

          <ul className="footer-menu">
            <li>
              <Link href="#">{others.aboutUs}</Link>
            </li>
            <li>
              <Link href="#">{others.termsOfService}</Link>
            </li>
            <li>
              <Link href="#">{others.privacyPolicy}</Link>
            </li>
          </ul>

          <div className="copyright-text">
            {t("others.copyright", { year: new Date().getFullYear() })}
            {/* Copyright © {new Date().getFullYear()}. All Rights Reserved by */}
            &nbsp;
            {/* <Link href="#">ItemSwap</Link> */}
          </div>
          <div className="scrollup text-center">
            <Link href="#">
              <VscChevronUp className="mx-auto" />
            </Link>
          </div>
        </div>
      </div>
    </FooterBottomStyleWrapper>
  );
};

export default FooterBottom;
