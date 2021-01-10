import { ChakraProvider } from "@chakra-ui/react"
import { AppWrapper } from '../lib/context/state'; // import based on where you put it

export default function App({ Component, pageProps }) {
  return (
    <ChakraProvider resetCSS>
      <AppWrapper>
        <Component {...pageProps} />
      </AppWrapper>
    </ChakraProvider>
  )
}