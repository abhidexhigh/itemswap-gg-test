import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ContextProvider from "src/utils/ContextProvider";
import GlobalStyles from "@assets/styles/GlobalStyles";
import "@assets/styles/globalStyles.css";

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
      <Component {...pageProps} />
    </ContextProvider>
  );
};

export default App;
