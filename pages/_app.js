import React, { Fragment } from 'react'
import Router from 'next/router'
import * as gtag from '../lib/gtag'

import { ChakraProvider, extendTheme } from "@chakra-ui/react"
import { AppWrapper } from '../lib/context/state'; // import based on where you put it
import '../styles/global.scss'

// Notice how we track pageview when route is changed
Router.events.on('routeChangeComplete', (url) => gtag.pageview(url))


export default function App({ Component, pageProps }) {
  return (
    <Fragment>
      <ChakraProvider resetCSS theme={extendTheme({
        fonts: {
          body: "Poppins"
        }
      })}>
        <AppWrapper>
          <Component {...pageProps} />
        </AppWrapper>
      </ChakraProvider>
    </Fragment>
  )
}