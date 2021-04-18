import { useRouter } from 'next/router'
import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import { getSortedPostsData } from '../lib/posts'
import { useAppContext } from '../lib/context/state'
import Search from '../components/search'
import Category from '../components/category'
import AdsCard from '../components/adscard'
import Link from 'next/link'
import Toppicture from '../public/images/swimgood_top.png'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { 
  Box,
  Flex,
  Text,
  Center,
  Image,
  Link as ChakraLink
} from "@chakra-ui/react"


export async function getStaticProps() {
  const apikey = process.env.FMP_API_KEY;

  const allPostsData = getSortedPostsData()
  const [res1] = await Promise.all([
    fetch(`https://financialmodelingprep.com/api/v3/actives?apikey=${apikey}`).then(response => response.json()),
  ]);
  const hotStocks = res1.map((stock) => ({
    symbol: stock.ticker,
    changesPercentage: stock.changesPercentage,
  }));

  return {
    props: {
      allPostsData,
      hotStocks
    }
  }
}


export default function Home ({ allPostsData, hotStocks }) {

  const { setValue, menu, setMenu } = useAppContext();

  const router = useRouter()

  const hotStocks_15 = hotStocks.slice(0,15);

  const getSymbol = (e) => {
    setValue(e);
    if (menu == "") {
      setValue(e);
      setMenu("pl");
      router.push(`/${e}/pl`);
    } else {
      setValue(e);
      router.push(`/${e}/${menu}`);
    }
  }

  const goToHotStockPage = (e) => {
    setValue(e.symbol);
    setMenu("pl");
  }

  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <Flex
        direction="column"
        my="2%"
        mx="3%"
      >
        <section>
          <Box>
            <Flex 
              wrap="wrap"
              zIndex="2" 
              bgImage="url(images/swimgood_top.png)"
              bgRepeat="no-repeat"
              bgSize="70%"
              bgPosition="top right"
              direction="column"
              py="8%"
            >
              <Box 
                mt="10%"
                w="35%" 
                className="gradient"
              >
                <span className="gradient-text">米国株の</span><br></br>
                <span className="gradient-text">決算データを</span><br></br>
                <span className="gradient-text">ビジュアル✨で分析</span>
              </Box>
              <Box mt="3%" w={["80%", "70%", "60%"]} >
                <Search getSymbol={getSymbol}/>
              </Box>
            </Flex>
          </Box>
        </section>

        <section>
          <Category/>
        </section>

        <section>
          <AdsCard/>
        </section>

        {/* <section>
          <Box mt="10%">
          <Flex
              direction="column"
              justify="space-around"
            >
              <Box mb="2%">
                <Text fontWeight="bold" fontSize="calc(6px + 4vmin)">🌋 HOT PICK UP</Text>
              </Box>
              <Flex wrap="wrap">
                {hotStocks_15.map((e) => {
                  return(
                    <Box
                      bg="#ffe1e7"
                      color="#3f3356"
                      border="1px solid #3f3356"
                      _hover={{ bg: "linear-gradient(to right top , #ffafbd,  #ffc3a0 )" }}
                      my="1.5%"
                      mx="1%"
                      px="4%"
                      py="0.8%"
                      borderRadius="3xl"
                      fontSize="calc(6px + 2vmin)"
                      cursor="pointer"
                      key={e.symbol}
                      onClick={() => goToHotStockPage(e)}
                    >
                      <Link href={`/${e.symbol}/pl`}>
                        <span>{e.symbol}&nbsp;{e.changesPercentage}</span>
                      </Link>
                    </Box>
                  )
                })}
              </Flex>
            </Flex>
          </Box>
        </section> */}

        <section>
          <Box my="8%" mx="4%">
            <Box mb="2%">
              <Text fontWeight="bold" fontSize="calc(5px + 2vmin)">🎉 Special Thanks!</Text>
            </Box>
            <Flex
              direction="column"
              justify="space-around"
            >
              <Box fontSize={["calc(6px + 2vmin)", "xs", "xs"]}>
                <span>あなたのポートフォリオを1か所で管理</span><br></br>▶︎ 
                <ChakraLink href='https://43juni.pocco.net/' target='_blank'  isExternal>
                  &nbsp;&nbsp;ju-ni  <ExternalLinkIcon mx="2px" />
                </ChakraLink>
              </Box>
            </Flex>
          </Box>
        </section>
      </Flex>
    </Layout>
  )
}