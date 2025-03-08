import { Fragment, useState } from "react";
import { useModal } from "src/utils/ModalContext";
import SEO from "@components/SEO";
import Layout from "@components/layout";
import WalletModal from "@components/modal/walletModal/WalletModal";
import MetamaskModal from "@components/modal/metamaskModal/MetamaskModal";
import Header from "@sections/Header/v2";
import PageHeader from "@sections/ProjectPages/ProjectsList/PageHeader";
import Champions from "@sections/User";
import Footer from "@sections/Footer/v1";

export default function User() {
  const { walletModalvisibility, metamaskModal } = useModal();
  return (
    <Fragment>
      <SEO title="igo ranking page" />
      <Layout>
        {walletModalvisibility && <WalletModal />}
        {metamaskModal && <MetamaskModal />}
        <Header />
        {/* <PageHeader currentPage="Traits" pageTitle="Traits" /> */}
        <div className="h-[120px] md:h-[360px] 2xl:h-[420px]" />
        <div className="backdrop-blur-md">
          <div className="container">
            <Champions />
          </div>
        </div>
        <Footer />
      </Layout>
    </Fragment>
  );
}
