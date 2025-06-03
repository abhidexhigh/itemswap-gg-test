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

export default function ProjectListPage() {
  const { walletModalvisibility, metamaskModal } = useModal();
  return (
    <Fragment>
      <SEO title="" />
      <Layout>
        {walletModalvisibility && <WalletModal />}
        {metamaskModal && <MetamaskModal />}
        <Header />
        {/* <PageHeader currentPage="PROJECTS" pageTitle="EXPLORE IGOS" /> */}
        <div className="md:mt-[300px]" />
        <ProjectsList />
        <Footer />
      </Layout>
    </Fragment>
  );
}
