import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import Head from "next/head";
import "../styles/globals.css";
import { ReactQueryDevtools } from "react-query/devtools";
import { QueryClient, QueryClientProvider } from "react-query";
import { useState } from "react";

function MyApp({ Component, pageProps }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>ItemSwap - Your Game, Your Items, Your Way</title>
      </Head>
      <Component {...pageProps} />
      <Tooltip
        id="global-tooltip"
        className="global-tooltip-theme"
        clickable
        deleteOnUnmount={true}
      />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default MyApp;

// Make sure the tooltip stylesheet is imported somewhere in your app
// You might already have it in your _app.js or a global styles file
// import "react-tooltip/dist/react-tooltip.css";
