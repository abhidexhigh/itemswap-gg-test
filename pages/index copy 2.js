import { Fragment } from "react";
import { useModal } from "src/utils/ModalContext";
import Layout from "@components/layout";
import SEO from "@components/SEO";
import WalletModal from "@components/modal/walletModal/WalletModal";
import MetamaskModal from "@components/modal/metamaskModal/MetamaskModal";
import Header from "@sections/Header/v2";
import PageHeader from "@sections/ProjectPages/ProjectsList/PageHeader";
import ProjectsList from "@sections/ProjectPages/ProjectsList";
import Footer from "@sections/Footer/v1";
import Banner from "@sections/Home";
import TrendsNav from "src/components/trendsNav";

export default function ProjectListPage() {
  const { walletModalvisibility, metamaskModal } = useModal();
  return (
    <Fragment>
      <SEO title="ItemSwap" />
      <Layout>
        {walletModalvisibility && <WalletModal />}
        {metamaskModal && <MetamaskModal />}
        <Header />
        <Banner />
        <Footer />
      </Layout>
    </Fragment>
  );
}
