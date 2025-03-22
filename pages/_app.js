import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ContextProvider from "src/utils/ContextProvider";
import GlobalStyles from "@assets/styles/GlobalStyles";
import "@assets/styles/globalStyles.css";
import PageTransition from "@components/PageTransition";
import dynamic from "next/dynamic";

// Dynamically import heavy components
const WalletModal = dynamic(
  () => import("@components/modal/walletModal/WalletModal"),
  {
    ssr: false,
    loading: () => null,
  }
);

const MetamaskModal = dynamic(
  () => import("@components/modal/metamaskModal/MetamaskModal"),
  {
    ssr: false,
    loading: () => null,
  }
);

const App = ({ Component, pageProps }) => {
  const [showChild, setShowChild] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setShowChild(true);
  }, []);

  if (!showChild) {
    return null;
  }

  return (
    <ContextProvider>
      <GlobalStyles pathname={router.pathname} />
      <PageTransition>
        <Component {...pageProps} />
      </PageTransition>
    </ContextProvider>
  );
};

export default App;
