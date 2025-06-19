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
            <img
              src={
                "https://res.cloudinary.com/dg0cmj6su/image/upload/v1747135734/ArmyDragone_text_copy_kelovj_wb1nrz.webp"
              }
              className="w-[190px]"
              alt="footer logo"
            />
          </Link>

          <ul className="footer-menu">
            <li>
              <Link href="#">{others.aboutUs}</Link>
            </li>
            <li>
              <Link href="https://itemswap-guild-test.vercel.app/T&C">
                {others.termsOfService}
              </Link>
            </li>
            <li>
              <Link href="https://itemswap-guild-test.vercel.app/PrivacyPolicy">
                {others.privacyPolicy}
              </Link>
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
