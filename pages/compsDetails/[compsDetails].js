import { Fragment, useState } from "react";
import { useModal } from "src/utils/ModalContext";
import SEO from "@components/SEO";
import Layout from "@components/layout";
import WalletModal from "@components/modal/walletModal/WalletModal";
import MetamaskModal from "@components/modal/metamaskModal/MetamaskModal";
import Header from "@sections/Header/v2";
import PageHeader from "@sections/ProjectPages/ProjectsList/PageHeader";
import CompsDetails from "@sections/CompsDetails";
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
        <div className="md:mt-[300px]" />
        <CompsDetails />
        <Footer />
      </Layout>
    </Fragment>
  );
}
