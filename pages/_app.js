import router from "next/router";
import Error from "next/error";
import React, { useEffect } from "react";
import * as gtag from "../lib/gtag";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { AppWrapper } from "../lib/context/state"; // import based on where you put it
import "../styles/global.scss";

export default function App({ Component, pageProps }) {
  useEffect(() => {
    if (!gtag.existsGaId) {
      return;
    }
    const handleRouteChange = (path) => {
      gtag.pageview(path);
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  if (pageProps.error) {
    return (
      <Error
        statusCode={pageProps.error.statusCode}
        title={pageProps.error.message}
      />
    );
  }
  return (
    <ChakraProvider
      theme={extendTheme({
        fonts: {
          body: "Poppins",
        },
      })}
    >
      <AppWrapper>
        <Component {...pageProps} />
      </AppWrapper>
    </ChakraProvider>
  );
}
