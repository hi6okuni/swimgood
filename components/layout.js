import Head from 'next/head'
import Link from 'next/link'
import { Box, Flex } from "@chakra-ui/react"
import { useAppContext } from '../lib/context/state'
import SideBar from './sidebar'
import Overview from './overview'
import Footer from './footer'

export const siteTitle = 'Swimgood🏊‍| U.S. Stock Visualizer'

export default function Layout({ children, home }) {

  const {setValue, setMenu, setStockInfo} = useAppContext();

  const resetSymbol = () => {
    setValue("");
    setMenu("");
    setStockInfo("");
  }

  return (
    <Box bg="#f5f7ff" color="#3f3356" minH="100vh" minW="100%">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.gstatic.com"/>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;800&family=Pacifico&family=Noto+Sans+JP:wght@700&display=swap" rel="stylesheet"/>
        <meta
          name="description"
          content="Visualize U.S Stock. INSTANTLY. "
        />
        <meta
          property="og:image"
          content="https://swimgood.io/images/twitter_card.png"
        />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no"/>
      </Head>
      <Flex direction={{ base: "column", md: "row" }} justify="space-around">
        <Box flexBasis={{ base: "10%", md: "20%" }}>
          <SideBar/>
        </Box>
        <Box flexBasis="80%" p="3%">
          {!home && (
            <Box>
              <Box onClick={() => resetSymbol()}>
                <Link href="/">
                  <a>← Back to home</a>
                </Link>
              </Box>
              <Overview/>
            </Box>
          )}
          <main>
            {children}
          </main>
          <Footer/>
        </Box>
      </Flex>
    </Box>
  )
}

