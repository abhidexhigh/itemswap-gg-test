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
        <div className="h-[294px] md:h-[360px] 2xl:h-[420px]" />
        <div
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0) 0%, rgba(0, 0, 0) 10%, transparent 100%), url(https://res.cloudinary.com/dg0cmj6su/image/upload/v1750163680/smoke_q32s0q_1_nbvwur.webp)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "fixed",
          }}
        >
          <div className="container">
            {/* <PageHeader currentPage="META TRENDS" pageTitle="META TRENDS" /> */}
            <div className="sticky top-[3.3rem] md:top-[3.3rem] z-50">
              <TrendsNav selected="metaTrends" />
            </div>
            {/* <div className="bg-transparent-20"></div> */}
            <MetaTrends />
          </div>
        </div>
        <Footer />
      </Layout>
    </Fragment>
  );
}
