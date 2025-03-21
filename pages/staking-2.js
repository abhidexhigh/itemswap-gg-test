import { Fragment } from "react";
import { useModal } from "src/utils/ModalContext";
import Layout from "@components/layout";
import SEO from "@components/SEO";
import WalletModal from "@components/modal/walletModal/WalletModal";
import MetamaskModal from "@components/modal/metamaskModal/MetamaskModal";
import Header from "@sections/Header/v2";
import PageHeader from "@sections/StakingPages/v1/PageHeader";
import Staking from "@sections/StakingPages/v2";
import Footer from "@sections/Footer/v1";

export default function StakingTwo() {
  const { walletModalvisibility, metamaskModal } = useModal();
  return (
    <Fragment>
      <SEO title="staking two page" />
      <Layout>
        {walletModalvisibility && <WalletModal />}
        {metamaskModal && <MetamaskModal />}
        <Header />
        <PageHeader currentPage="stake" pageTitle="STAKING v2" />
        <Staking />
        <Footer />
      </Layout>
    </Fragment>
  );
}
