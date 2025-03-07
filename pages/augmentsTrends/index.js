import { Fragment } from "react";
import { useModal } from "src/utils/ModalContext";
import Layout from "@components/layout";
import SEO from "@components/SEO";
import WalletModal from "@components/modal/walletModal/WalletModal";
import MetamaskModal from "@components/modal/metamaskModal/MetamaskModal";
import Header from "@sections/Header/v2";
import PageHeader from "@sections/ProjectPages/ProjectsList/PageHeader";
import AugmentsTrendsList from "@sections/TrendsPages/AugmentsTrends";
import Footer from "@sections/Footer/v1";
import TrendsNav from "src/components/trendsNav";

export default function ItemsTrends() {
  const { walletModalvisibility, metamaskModal } = useModal();
  return (
    <Fragment>
      <SEO title="Augments Trends" />
      <Layout>
        {walletModalvisibility && <WalletModal />}
        {metamaskModal && <MetamaskModal />}
        <Header />
        {/* <PageHeader currentPage="AUGMENTS TRENDS" pageTitle="AUGMENTS TRENDS" /> */}
        <div className="h-[120px] md:h-[360px] 2xl:h-[420px]" />
        <div className="backdrop-blur-md">
          <div className="container">
            <TrendsNav selected="augmentsTrends" />
            {/* <div className="bg-transparent-20"></div> */}
            <AugmentsTrendsList />
          </div>
        </div>
        <Footer />
      </Layout>
    </Fragment>
  );
}
