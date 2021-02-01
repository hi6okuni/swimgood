import Head from 'next/head'
import Link from 'next/link'
import { Box, Heading, Flex } from "@chakra-ui/react"
import { useAppContext } from '../lib/context/state'
import SideBar from './sidebar'
import Overview from './overview'
import Footer from './footer'

export const siteTitle = 'Swimgood🏊‍| U.S. Stock Visualizer'

export default function Layout({ children, home }) {

  const {setValue, menu, setMenu, setStockInfo} = useAppContext();

  const resetSymbol = () => {
    setValue("");
    setMenu("");
    setStockInfo("");
  }

  return (
    <Box bg="#f7f8fd" color="#3f3356" minH="100vh" minW="100%">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.gstatic.com"/>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;800&family=Pacifico&display=swap" rel="stylesheet"/>
        <meta
          name="description"
          content="Learn how to build a personal website using Next.js"
        />
        <meta
          property="og:image"
          content={`https://og-image.now.sh/${encodeURI(
            siteTitle
          )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
        />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no"/>
        <script data-ad-client="ca-pub-5934737933948157" async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
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

