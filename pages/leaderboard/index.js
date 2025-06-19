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
        <div className="h-[360px] md:h-[360px] 2xl:h-[420px]" />
        <div>
          <div className="container px-0 md:px-3">
            <LeaderboardSection />
          </div>
        </div>
        <Footer />
      </Layout>
    </Fragment>
  );
}
