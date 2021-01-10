import Head from 'next/head'
import Link from 'next/link'
import { Box, Heading, Flex } from "@chakra-ui/react"
import { useAppContext } from '../lib/context/state'
import SideBar from './sidebar'
import Overview from './overview'

const name = 'Your Name'
export const siteTitle = 'Make Money Big.'

export default function Layout({ children, home }) {

  const {setValue, setMenu, setStockInfo} = useAppContext();

  const resetSymbol = () => {
    setValue("");
    setMenu("");
    setStockInfo("");
  }

  return (
    <Box bg='gray.800' color="white" minH="100vh">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.gstatic.com"/>
        <link href="https://fonts.googleapis.com/css2?family=Mukta&family=Pacifico&display=swap" rel="stylesheet"/>
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
      </Head>
      <Flex direction="row" justify="space-around">
        <Box flexBasis="20%" bg='gray.700'>
          <SideBar/>
        </Box>
        <Box flexBasis="80%">
          {!home && (
            <Box m="3%">
              <Box onClick={() => resetSymbol()}>
                <Link href="/">
                  <a>← Back to home</a>
                </Link>
              </Box>
              <Overview/>
            </Box>
          )}
          <main>{children}</main>
        </Box>
      </Flex>
    </Box>
  )
}