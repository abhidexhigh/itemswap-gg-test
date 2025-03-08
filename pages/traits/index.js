import { Fragment, useState } from "react";
import { useModal } from "src/utils/ModalContext";
import SEO from "@components/SEO";
import Layout from "@components/layout";
import WalletModal from "@components/modal/walletModal/WalletModal";
import MetamaskModal from "@components/modal/metamaskModal/MetamaskModal";
import Header from "@sections/Header/v2";
import PageHeader from "@sections/ProjectPages/ProjectsList/PageHeader";
import Traits from "@sections/Traits";
import Footer from "@sections/Footer/v1";
import Set10Tabs from "src/sections/set10Tabs";

export default function IGORankingPage() {
  const { walletModalvisibility, metamaskModal } = useModal();
  const [activeTab, setActiveTab] = useState("Traits");
  const tabs = ["Comps", "Champions", "Traits", "Items"];
  return (
    <Fragment>
      <SEO title="igo ranking page" />
      <Layout>
        {walletModalvisibility && <WalletModal />}
        {metamaskModal && <MetamaskModal />}
        <Header />
        {/* <PageHeader currentPage="Traits" pageTitle="Traits" /> */}
        <div className="h-[360px] md:h-[360px] 2xl:h-[420px]" />
        {/* <Set10Tabs
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        /> */}
        {/* <div className="bg-transparent-20"></div> */}
        <Traits />
        <Footer />
      </Layout>
    </Fragment>
  );
}
