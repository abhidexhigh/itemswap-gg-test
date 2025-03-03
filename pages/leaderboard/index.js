import { Fragment } from "react";
import { useModal } from "src/utils/ModalContext";
import SEO from "@components/SEO";
import Layout from "@components/layout";
import WalletModal from "@components/modal/walletModal/WalletModal";
import MetamaskModal from "@components/modal/metamaskModal/MetamaskModal";
import Header from "@sections/Header/v2";
import LeaderboardSection from "src/sections/Leaderboard";
import Footer from "@sections/Footer/v1";

export default function IGORankingPage() {
  const { walletModalvisibility, metamaskModal } = useModal();
  return (
    <Fragment>
      <SEO title="igo ranking page" />
      <Layout>
        {walletModalvisibility && <WalletModal />}
        {metamaskModal && <MetamaskModal />}
        <Header />
        <div className="h-[120px] md:h-[360px]" />
        <LeaderboardSection />
        <Footer />
      </Layout>
    </Fragment>
  );
}
