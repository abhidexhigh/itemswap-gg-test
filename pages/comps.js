import { Fragment, useState } from "react";
import { useModal } from "src/utils/ModalContext";
import Layout from "@components/layout";
import SEO from "@components/SEO";
import WalletModal from "@components/modal/walletModal/WalletModal";
import MetamaskModal from "@components/modal/metamaskModal/MetamaskModal";
import Header from "@sections/Header/v2";
import PageHeader from "@sections/ProjectPages/ProjectsList/PageHeader";
import MetaTrends from "@sections/TrendsPages/MetaTrends";
import Footer from "@sections/Footer/v1";
import TrendsNav from "src/components/trendsNav";
import Set10Tabs from "src/sections/set10Tabs";

export default function ItemsTrends() {
  const { walletModalvisibility, metamaskModal } = useModal();
  const [activeTab, setActiveTab] = useState("Comps");
  const tabs = ["Comps", "Champions", "Traits", "Items"];
  return (
    <Fragment>
      <SEO title="Comps" />
      <Layout>
        {walletModalvisibility && <WalletModal />}
        {metamaskModal && <MetamaskModal />}
        <Header />
        {/* <PageHeader currentPage="META TRENDS" pageTitle="META TRENDS" /> */}
        <div className="h-[120px] md:h-[360px] 2xl:h-[420px]" />
        {/* <Set10Tabs
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        /> */}
        {/* <div className="bg-transparent-20"></div> */}
        <MetaTrends />
        <Footer />
      </Layout>
    </Fragment>
  );
}
