import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ContextProvider from "src/utils/ContextProvider";
import GlobalStyles from "@assets/styles/GlobalStyles";
import "@assets/styles/globalStyles.css";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { AnimatePresence } from "framer-motion";
import TooltipDebugger from "src/components/tooltip/TooltipDebugger";

// Configure NProgress
NProgress.configure({
  showSpinner: false,
  minimum: 0.3,
  easing: "ease",
  speed: 500,
  trickleSpeed: 200,
});

const App = ({ Component, pageProps }) => {
  const [showChild, setShowChild] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setShowChild(true);

    // Start progress bar on route change start
    router.events.on("routeChangeStart", () => {
      NProgress.start();
    });

    // Complete progress bar on route change complete
    router.events.on("routeChangeComplete", () => {
      NProgress.done();
    });

    // Handle route change errors
    router.events.on("routeChangeError", () => {
      NProgress.done();
    });

    return () => {
      router.events.off("routeChangeStart", () => {
        NProgress.start();
      });
      router.events.off("routeChangeComplete", () => {
        NProgress.done();
      });
      router.events.off("routeChangeError", () => {
        NProgress.done();
      });
    };
  }, [router]);

  if (!showChild) {
    return null;
  }

  return (
    <ContextProvider>
      <GlobalStyles pathname={router.pathname} />
      <AnimatePresence mode="wait">
        <Component {...pageProps} key={router.route} />
      </AnimatePresence>
      <TooltipDebugger />
    </ContextProvider>
  );
};

export default App;
