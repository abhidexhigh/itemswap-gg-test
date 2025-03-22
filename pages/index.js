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
  const [activeTab, setActiveTab] = useState("Items");
  const tabs = ["Comps", "Champions", "Traits", "Items"];
  return (
    <Fragment>
      <SEO title="Meta Trends" />
      <Layout>
        {walletModalvisibility && <WalletModal />}
        {metamaskModal && <MetamaskModal />}
        <Header />
        <div className="h-[360px] md:h-[360px] 2xl:h-[420px]" />
        {/* <PageHeader currentPage="META TRENDS" pageTitle="META TRENDS" /> */}
        <div className="backdrop-blur-md">
          <div className="container">
            <div className="sticky top-14 z-50">
              <TrendsNav selected="metaTrends" />
            </div>
            {/* <div className="bg-transparent-20"></div> */}
            <MetaTrends />
            <Footer />
          </div>
        </div>
      </Layout>
    </Fragment>
  );
}
