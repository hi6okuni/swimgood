import { ChakraProvider, extendTheme } from "@chakra-ui/react"
import { AppWrapper } from '../lib/context/state'; // import based on where you put it
import '../styles/global.scss'


export default function App({ Component, pageProps }) {
  return (
    <ChakraProvider resetCSS theme={extendTheme({
      fonts: {
        body: "Poppins"
      }
    })}>
      <AppWrapper>
        <Component {...pageProps} />
      </AppWrapper>
    </ChakraProvider>
  )
}