import { Fragment } from "react";
import { useModal } from "src/utils/ModalContext";
import Layout from "@components/layout";
import SEO from "@components/SEO";
import WalletModal from "@components/modal/walletModal/WalletModal";
import MetamaskModal from "@components/modal/metamaskModal/MetamaskModal";
import Header from "@sections/Header/v2";
import PageHeader from "@sections/ProjectPages/ProjectsList/PageHeader";
import TraitsTrends from "@sections/TrendsPages/TraitsTrends";
import Footer from "@sections/Footer/v1";
import TrendsNav from "src/components/trendsNav";

export default function ChampionsTrends() {
  const { walletModalvisibility, metamaskModal } = useModal();
  return (
    <Fragment>
      <SEO title="Traits Trends" />
      <Layout>
        {walletModalvisibility && <WalletModal />}
        {metamaskModal && <MetamaskModal />}
        <Header />
        {/* <PageHeader currentPage="TRAITS TRENDS" pageTitle="TRAITS TRENDS" /> */}
        <div className="h-[120px] md:h-[360px]" />
        <TrendsNav selected={"traitsTrends"} />
        {/* <div className="bg-transparent-20"></div> */}
        <TraitsTrends />
        <Footer />
      </Layout>
    </Fragment>
  );
}
