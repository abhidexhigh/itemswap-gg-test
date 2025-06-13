import { Fragment } from "react";
import { useModal } from "src/utils/ModalContext";
import Layout from "@components/layout";
import SEO from "@components/SEO";
import WalletModal from "@components/modal/walletModal/WalletModal";
import MetamaskModal from "@components/modal/metamaskModal/MetamaskModal";
import Header from "@sections/Header/v2";
import Footer from "@sections/Footer/v1";

export default function Custom404() {
  const { walletModalvisibility, metamaskModal } = useModal();

  return (
    <Fragment>
      <SEO title="Page Not Found - 404" />
      <Layout>
        {walletModalvisibility && <WalletModal />}
        {metamaskModal && <MetamaskModal />}
        <Header />

        <div className="container mx-auto px-4 py-20 text-center">
          <div className="max-w-md mx-auto">
            <h1 className="text-6xl font-bold text-white mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-white mb-4">
              Page Not Found
            </h2>
            <p className="text-gray-400 mb-8">
              The page you are looking for doesn't exist or has been moved.
            </p>
            <a
              href="/"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Go Back Home
            </a>
          </div>
        </div>

        <Footer />
      </Layout>
    </Fragment>
  );
}
