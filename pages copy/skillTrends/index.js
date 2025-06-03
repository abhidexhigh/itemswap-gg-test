import { Fragment } from "react";
import { useModal } from "src/utils/ModalContext";
import Layout from "@components/layout";
import SEO from "@components/SEO";
import WalletModal from "@components/modal/walletModal/WalletModal";
import MetamaskModal from "@components/modal/metamaskModal/MetamaskModal";
import Header from "@sections/Header/v2";
import SkillTreeList from "@sections/TrendsPages/SkillTree";
import Footer from "@sections/Footer/v1";
import TrendsNav from "src/components/trendsNav";

export default function SkillTrends() {
  const { walletModalvisibility, metamaskModal } = useModal();
  return (
    <Fragment>
      <SEO title="Skill Trends" />
      <Layout>
        {walletModalvisibility && <WalletModal />}
        {metamaskModal && <MetamaskModal />}
        <Header />
        {/* <PageHeader currentPage="AUGMENTS TRENDS" pageTitle="AUGMENTS TRENDS" /> */}
        <div className="h-[360px] md:h-[360px] 2xl:h-[420px]" />
        <div
          className="backdrop-blur-md"
          style={{
            backgroundImage: `url(https://res.cloudinary.com/dg0cmj6su/image/upload/v1744785474/smoke_q32s0q.jpg)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "fixed",
          }}
        >
          <div className="container px-0 md:px-3">
            <div className="sticky top-14 z-50">
              <TrendsNav selected="skillTrends" />
            </div>
            {/* <div className="bg-transparent-20"></div> */}
            <SkillTreeList />
          </div>
        </div>
        <Footer />
      </Layout>
    </Fragment>
  );
}
