import { ChakraProvider, extendTheme } from "@chakra-ui/react"
import { AppWrapper } from '../lib/context/state'; // import based on where you put it
import '../styles/global.css'


export default function App({ Component, pageProps }) {
  return (
    <ChakraProvider resetCSS theme={extendTheme({
      fonts: {
        body: "Mukta"
      }
    })}>
      <AppWrapper>
        <Component {...pageProps} />
      </AppWrapper>
    </ChakraProvider>
  )
}