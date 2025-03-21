import { Fragment, useState } from "react";
import { useModal } from "src/utils/ModalContext";
import Layout from "@components/layout";
import SEO from "@components/SEO";
import WalletModal from "@components/modal/walletModal/WalletModal";
import MetamaskModal from "@components/modal/metamaskModal/MetamaskModal";
import Header from "@sections/Header/v2";
import PageHeader from "@sections/ProjectPages/ProjectsList/PageHeader";
import RecentDecks from "@sections/TrendsPages/RecentDecks";
import Footer from "@sections/Footer/v1";
import TrendsNav from "src/components/trendsNav";

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
        <div className="container px-0 md:px-3">
          <div className="h-[360px] md:h-[360px] 2xl:h-[420px] relative">
            <div class="absolute bottom-0 h-10 w-full bg-transparent bg-gradient-to-b from-[#00000005] from-5% to-[#191F1F] to-95% md:static md:block"></div>
          </div>
          {/* <PageHeader currentPage="META TRENDS" pageTitle="META TRENDS" /> */}
          <div className="sticky top-14 z-50">
            <TrendsNav selected="recentDecks" />
          </div>
          {/* <div className="bg-transparent-20"></div> */}
          <RecentDecks />
          <Footer />
        </div>
      </Layout>
    </Fragment>
  );
}
