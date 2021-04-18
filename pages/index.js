import { useRouter } from 'next/router'
import Head from 'next/head'
import Image from 'next/image'
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

  const goToAmazon = () => {
    setValue("AMZN");
    setMenu("pl");
    router.push(`/AMZN/pl`);
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
          <Flex
            bgColor="white"
            borderRadius="3xl"
            p={["6%","3%","3%"]}
            h={["540px","320px","320px"]}
            wrap="nowrap"
            direction={["column", "row", "row"]}
            justify="space-around"
            align="center"
          >
            <Box
              basis="35%"
            >
              <Image
                src="/images/swimgood_top3.png"
                alt="toppage"
                width={375}
                height={300}
              />
            </Box>
            <Flex 
              basis="55%"
              wrap="wrap"
              direction="column"
              justify="space-around"
              w="100%"
            >
              <Box 
                className="gradient"
                fontFamily="Noto Sans JP"
                w="100%"
              >
                <span className="gradient-text">米国企業をひと目で攻略。</span><br></br>
                <Text
                  my="2%"
                  color="gray.400"
                  fontSize="xs"
                  w="100%"
                >
                  英語の決算書は読む気がしない？swimgood.ioはさまざまな決算情報を一瞬でチャートに変換。気になる企業を目で見てカンタンに理解しよう！
                </Text>
              </Box>

              <Box align="center" mt="3%" w={["100%", "100%", "100%"]} >
                <Search getSymbol={getSymbol}/>
                <Text
                  my="2%"
                  color="gray.400"
                  fontSize="xs"
                  w="90%"
                  align="center"
                  fontFamily="Noto Sans JP"
                >
                or
                </Text>
                <Box
                  position="inline"
                  align="center"
                  color="gray.400"
                  fontSize="xs"
                  fontFamily="Noto Sans JP"
                >
                  とりあえず試してみる 👉 
                  <Box
                    p="2%"
                    display="inline"
                    bgColor="#fd867a"
                    borderRadius="3xl"
                    color="white"
                    cursor="pointer"
                    onClick={() => goToAmazon()}
                  >
                    AMZN
                  </Box>
                </Box>
              </Box>
            </Flex>
          </Flex>
        </section>

        <section>
          <AdsCard/>
        </section>

        <section>
          <Category/>
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