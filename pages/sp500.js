import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import { useAppContext } from '../lib/context/state'
import { Box, Flex, Center, Text} from "@chakra-ui/react"
import Link from 'next/link'

export async function getStaticProps() {
  // Fetch data from external API
  const apikey = process.env.FMP_API_KEY;

  const [res1] = await Promise.all([
    fetch(`https://financialmodelingprep.com/api/v3/sp500_constituent?apikey=${apikey}`).then(response => response.json()),
  ]);

  const Lists = res1.map((list) => ({
    symbol: list.symbol,
    name: list.name,
    sector: list.sector,
    subSector: list.subSector
  }));

  function compare(a, b) {
    const stockA = a.symbol;
    const stockB = b.symbol;
  
    let comparison = 0;
      if (stockA > stockB) {
        comparison = 1;
      } else if (stockA < stockB) {
        comparison = -1;
      }
      return comparison;
    }

    const editedLists = Lists.sort(compare);
    const targetSector = [
      "Communication Services", 
      "Consumer Staples", 
      "Consumer Discretionary", 
      "Energy", 
      "Financials", 
      "Health Care", 
      "Industrials", 
      "Information Technology", 
      "Materials", 
      "Real Estate", 
      "Utilities"
    ]

    const cs1Stocks = editedLists.filter(function(stock) {
        return stock.sector == targetSector[0];
    })
    const cs2Stocks = editedLists.filter(function(stock) {
      return stock.sector == targetSector[1];
    })
    const cdStocks = editedLists.filter(function(stock) {
      return stock.sector == targetSector[2];
    })
    const eStocks = editedLists.filter(function(stock) {
      return stock.sector == targetSector[3];
    })
    const fStocks = editedLists.filter(function(stock) {
      return stock.sector == targetSector[4];
    })
    const hcStocks = editedLists.filter(function(stock) {
      return stock.sector == targetSector[5];
    })
    const iStocks = editedLists.filter(function(stock) {
      return stock.sector == targetSector[6];
    })
    const itStocks = editedLists.filter(function(stock) {
      return stock.sector == targetSector[7];
    })
    const mStocks = editedLists.filter(function(stock) {
      return stock.sector == targetSector[8];
    })
    const reStocks = editedLists.filter(function(stock) {
      return stock.sector == targetSector[9];
    })
    const uStocks = editedLists.filter(function(stock) {
      return stock.sector == targetSector[10];
    })

    const sp500Stocks = [
      cs1Stocks, 
      cs2Stocks, 
      cdStocks, 
      eStocks, 
      fStocks, 
      hcStocks, 
      iStocks, 
      itStocks,
      mStocks,
      reStocks,
      uStocks
    ]


  // Pass data to the page via props
  return { 
    props: { 
      sp500Stocks
    } 
  }
}

export default function Sp500 ({ sp500Stocks }) {

  const { setMenu , setValue} = useAppContext();

  const jumpToPage = (e) => {
    setMenu("pl");
    setValue(e);
  }

  return (
    <Layout>
      <React.Fragment>
        <Head>
          <title>{siteTitle}</title>
        </Head>
        <Flex
          direction="column"
          m="3%"
        >
          <Flex fontSize="xl">
            <Text>S&P 500 List</Text>
          </Flex>
          <Flex direction="column" >
            {sp500Stocks.map((stocks) => {
              return (
                <Box p="3%" mx="2%" my={["5%","4%","2%"]} borderRadius="2xl" bg="#e4eafb">
                  <Text fontSize={["xs","md","lg"]} fontWeight="bold">■&nbsp;{stocks[0].sector}</Text>
                  <Flex justify="space-between" wrap="wrap">
                    {stocks.map((e) => {
                      return (
                        <Link
                          href={`/${e.symbol}/pl`}
                        >
                          <Flex 
                            bg="#6369f7" 
                            color="white"
                            m={["2%","2%","1%"]}
                            px={["5%","3%","1.5%"]}
                            py={["1%","2%","0.5%"]}
                            w={["92%","46%","46%"]}
                            align="baseline" 
                            borderRadius="md"
                            _hover={{ bg:"#fd8db9"}}
                            transition="all 0.3s ease-in-out"
                            boxShadow="xl"
                            direction="column"
                            onClick={() => jumpToPage(e.symbol)}
                            cursor="pointer"
                          >
                            <Box>
                              <Text fontWeight="bold" fontSize={["xs","xs","sm"]} >{e.symbol}&nbsp;</Text>
                              <Text fontSize={["calc(4px + 2vmin)","xs","xs"]} >{e.name}</Text>
                            </Box>
                            <Box>
                              <Text fontSize={["calc(4px + 2vmin)","xs","xs"]}>‐&nbsp;{e.subSector}</Text>
                            </Box>
                          </Flex>
                        </Link>
                      )
                    })}
                  </Flex>
                </Box>
              )
            })}
          </Flex>
        </Flex>
      </React.Fragment>
    </Layout>
  )
}