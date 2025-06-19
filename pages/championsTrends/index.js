import { Fragment } from "react";
import { useModal } from "src/utils/ModalContext";
import Layout from "@components/layout";
import SEO from "@components/SEO";
import WalletModal from "@components/modal/walletModal/WalletModal";
import MetamaskModal from "@components/modal/metamaskModal/MetamaskModal";
import Header from "@sections/Header/v2";
import PageHeader from "@sections/ProjectPages/ProjectsList/PageHeader";
import ProjectsList from "@sections/TrendsPages/ChampionsTrends";
import Footer from "@sections/Footer/v1";
import TrendsNav from "src/components/trendsNav";

export default function ChampionsTrends() {
  const { walletModalvisibility, metamaskModal } = useModal();
  return (
    <Fragment>
      <SEO title="Champions Trends" />
      <Layout>
        {walletModalvisibility && <WalletModal />}
        {metamaskModal && <MetamaskModal />}
        <Header />
        {/* <PageHeader
          currentPage="CHAMPIONS TRENDS"
          pageTitle="CHAMPIONS TRENDS"
        /> */}
        <div className="h-[360px] md:h-[360px] 2xl:h-[420px]" />
        <div
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0) 0%, rgba(0, 0, 0) 10%, transparent 100%), url(https://res.cloudinary.com/dg0cmj6su/image/upload/v1750163680/smoke_q32s0q_1_nbvwur.webp)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "fixed",
          }}
        >
          <div className="container px-0 md:px-3">
            <div className="sticky top-14 z-50">
              <TrendsNav selected={"championsTrends"} />
            </div>
            {/* <div className="bg-transparent-20"></div> */}
            <ProjectsList />
          </div>
        </div>
        <Footer />
      </Layout>
    </Fragment>
  );
}
