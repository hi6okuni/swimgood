import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useAppContext } from '../../lib/context/state'
import colorPallet from '../../lib/color-pallet'
import Layout, { siteTitle } from '../../components/layout'
import BarRechart from '../../components/bar_rechart'
import LineRechart from '../../components/line_rechart'

import { 
  Box,
  Flex,
  Center,
  Text,
} from "@chakra-ui/react"


export async function getServerSideProps({params}) {
  // Fetch data from external API    
    const symbol = params.symbol;
    const apikey = process.env.FMP_API_KEY;

    var yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    var yesterdayForApi = yesterday.getFullYear() + "-" +  (yesterday.getMonth()+ 1) + "-" + yesterday.getDate();

    var fiveYearsAgo = new Date();
    fiveYearsAgo.setDate(fiveYearsAgo.getDate() - 1824);
    var fiveYearsAgoForApi = fiveYearsAgo.getFullYear() + "-" +  (fiveYearsAgo.getMonth()+ 1) + "-" + fiveYearsAgo.getDate();
    const [res1, res2, res3, res4] = await Promise.all([
      fetch(`https://financialmodelingprep.com/api/v3/historical-price-full/stock_dividend/${symbol}?apikey=${apikey}`).then(response => response.json()),
      fetch(`https://financialmodelingprep.com/api/v3/key-metrics/${symbol}?limit=10&apikey=${apikey}`).then(response => response.json()),
      fetch(`https://financialmodelingprep.com/api/v3/historical-price-full/${symbol}?from=${fiveYearsAgoForApi}&to=${yesterdayForApi}&apikey=${apikey}`).then(response => response.json()),
      fetch(`https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=${apikey}`).then(response => response.json()),
    ]);
    
    const div = res1.length ? 
      res1.historical.slice(0,39).map((divInfo) => ({
      date: divInfo.date.split('-'),
      adjDividend: divInfo.adjDividend,
    })) : [];

    const keyMetrics = res2.map((keyMetric) => ({
      date: keyMetric.date.split('-'),
      dividendYield: keyMetric.dividendYield,
      payoutRatio: keyMetric.payoutRatio,
    }))

    const historicalPrice = res3.historical.map((dailyPrice) => ({
      price: dailyPrice.close,
      date: dailyPrice.date.split('-'),
      volume: dailyPrice.volume,
    }));
  
    const basicInfo = res4.map((Info) => ({
      symbol: Info.symbol,
      name: Info.name,
      price: Info.price,
      marketCap: Info.marketCap,
      changesPercentage: Info.changesPercentage,
      change: Info.change,
      yearHigh: Info.yearHigh,
      yearLow: Info.yearLow,
      exchange: Info.exchange,
      eps: Math.round(Info.eps * 100) / 100,
      pe: Math.round(Info.pe * 100) / 100,
    }))
  
    return { 
      props: { 
        div,
        keyMetrics,
        historicalPrice,
        basicInfo,
      } 
    }
}


export default function Dividends ({ div, keyMetrics, historicalPrice, basicInfo }) {

  const {setStockPrice, setStockInfo} = useAppContext();

  useEffect(() => {
    setStockPrice(historicalPrice);
    setStockInfo(basicInfo);
  }, [basicInfo])

  const divData = 
  (keyMetrics.length)
  ? keyMetrics.map((each, index) => {
      return(
        {
          date: each.date[1] + "-" + each.date[0],
          dividendYield: Math.round((each.dividendYield*100)*100) / 100,
          payoutRatio: Math.round((each.payoutRatio*100)*100) / 100,
        }
      )
    }).reverse(): [];
  
  const divHistory = 
  (div.length)
  ? div.map((each, index) => {
      return(
        {
          date: each.date[1] + "-" + each.date[0],
          adjDividend: each.adjDividend,
        }
      )
    }).reverse(): null;
  
  return (
    <Layout>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <Flex
        direction="column"
        m="3%"
      >
        <Flex direction="row">
          <Text fontSize="xs" mx="2%">In Millions of USD except per share items</Text>
        </Flex>

         {/* Dividends */}
         { div.length ? 
            (<Flex
              direction="column"
              w="100%"
              h={["960px", "960px", "60vh"]} 
              p={["4%","4%","2%"]} 
              my="4%"
              pt="1%"
              bg="#e4e9fb"
              color="#3f3356"
              justify="space-around"
              borderRadius="lg"
              z-index="5"
              >
                <Flex textAlign="center" fontSize="sm">
                  <Text>&nbsp;&nbsp;■ Dividends</Text>
                </Flex>
                <Flex
                  h={["96%","96%","92.5%"]} 
                  w="100%"
                  justify="space-around"
                  fontSize="xs"
                  direction={["column","column", "row"]}
                >
                  <Flex h={["25%","25%", "100%"]} w={["100%","100%", "39%"]}>
                    <Flex
                      direction="column"
                      h="100%"
                      w="100%"
                      borderRadius="2xl"
                      boxShadow="xl"
                      bg="#ffffff"
                      color="#000000"
                    >
                      <Center><Text fontSize="xs" mt="2%">Dividends History</Text></Center>
                      <BarRechart data={divHistory} title={["adjDividend"]} color={[colorPallet.profit.green]}/>
                    </Flex>
                  </Flex>
                  <Flex 
                    h={["75%","75%", "100%"]} 
                    w={["100%","100%", "59%"]}
                    wrap="wrap"
                    direction="column"
                    justify={["flex-start","flex-start", "space-around"]} 
                    my={["4%","4%", "0%"]}
                  >
                    <Flex
                      direction="column"
                      h={["22%", "44%","47%"]} 
                      w={["100%", "47%","47%"]} 
                      borderRadius="2xl"
                      boxShadow="xl"
                      my="1"
                      align="center"
                      bg="#ffffff"
                      color="#000000"
                    >
                      <Text fontSize="xs" mt="2%">Dividends Yield</Text>
                      <LineRechart data={divData} title={["dividendYield"]} color={[colorPallet.profit.pink]}/>
                    </Flex>
                    <Flex
                      direction="column"
                      h={["22%", "44%","47%"]} 
                      w={["100%", "47%","47%"]} 
                      bg="#ffffff"
                      color="#000000"                
                      borderRadius="2xl"
                      boxShadow="xl"
                      my="1"
                      align="center"
                    >
                      <Text fontSize="xs" mt="2%">Payout Ratio</Text>
                      <LineRechart data={divData} title={["payoutRatio"]} color={[colorPallet.profit.green]}/>
                    </Flex>
                  </Flex>
                </Flex>
              </Flex>) : 
              ( <Box m="4%">
                  <Text>
                    The company pays no dividends.
                  </Text>
                </Box>
              )
            }
      </Flex>
    </Layout>
  )
}