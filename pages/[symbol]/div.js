import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useAppContext } from '../../lib/context/state'
import colorPallet from '../../lib/color-pallet'
import Layout, { siteTitle } from '../../components/layout'
import BarRechart from '../../components/bar_rechart'
import LineRechart from '../../components/line_rechart'
import Highlight from '../../components/highlight'
import AdsCard from '../../components/adscard'


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
    
    if (res1.historical) {

      const div = res1.historical.slice(0,39).map((divInfo) => ({
        date: divInfo.date.split('-'),
        adjDividend: divInfo.adjDividend,
      }));

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

    } else {

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
          keyMetrics,
          historicalPrice,
          basicInfo,
        } 
      }
    }
}


export default function Dividends ({ div, keyMetrics, historicalPrice, basicInfo }) {

  const {value, setStockPrice, setStockInfo} = useAppContext();

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
    div
    ? div.map((each, index) => {
        return(
          {
            date: each.date[1] + "-" + each.date[0],
            adjDividend: each.adjDividend,
          }
        )
      }).reverse(): null;
  
  const highlightData = div ? {
    symbol: value,
    period: divData[divData.length - 1].date,
    data: [
      {
        title: "Last Quarterly Amount",
        value: divHistory[divHistory.length - 1].adjDividend.toLocaleString(),
        unit_forth: "$",
        unit_back: ""
      },
      {
        title: "Div Yield",
        value: divData[divData.length - 1].dividendYield.toLocaleString(),
        unit_forth: "",
        unit_back: "%"
      },
      {
        title: "Payout Ratio",
        value: divData[divData.length - 1].payoutRatio.toLocaleString(),
        unit_forth: "",
        unit_back: "%"
      },
    ]
  } : null;
  
  if (divHistory) {
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
          <Flex
            direction="column"
            w="100%"
            h={["1260px", "1260px", "75vh"]} 
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
              h={["96%","96%","95%"]} 
              w="100%"
              justify="space-between"
              fontSize="xs"
              direction={["column","column", "row"]}
            >
              <Flex h={["40%","40%", "100%"]} w={["100%","100%", "39%"]}  direction="column" justify="space-between">
                <Highlight highlightData={highlightData}/>
                <Flex
                  direction="column"
                  h="69%"
                  w="100%"
                  borderRadius="2xl"
                  boxShadow="xl"
                  bg="#ffffff"
                  color="#000000"
                >
                  <Center pt="2%"><Text fontSize="12px">${value}&nbsp;Dividends History</Text></Center>
                  <BarRechart data={divHistory} title={["adjDividend"]} color={[colorPallet.profit.green]}/>
                  <Text fontSize="calc(2px + 1vmin)" align="right" pr="5%" pb="3%"color="gray.400">swimgood.io</Text>
                </Flex>
              </Flex>
              <Flex 
                h={["60%","60%", "100%"]} 
                w={["100%","100%", "60%"]}
                wrap="wrap"
                justify={["space-around","space-around", "space-between"]}
                direction={["column","colmn", "row"]}
                alignContent="space-between"
              >
                <Flex
                  direction="column"
                  h={["23%", "44%","49%"]} 
                  w={["100%", "47%","49%"]} 
                  borderRadius="2xl"
                  boxShadow="xl"
                  bg="#ffffff"
                  color="#000000"
                >
                  <Center pt="2%"><Text fontSize="12px">${value}&nbsp;Dividends Yield</Text></Center>
                  <LineRechart data={divData} title={["dividendYield"]} color={[colorPallet.profit.pink]}/>
                  <Text fontSize="calc(2px + 1vmin)" align="right" pr="5%" pb="3%"color="gray.400">swimgood.io</Text>
                </Flex>
                <Flex
                  direction="column"
                  h={["23%", "44%","49%"]} 
                  w={["100%", "47%","49%"]} 
                  bg="#ffffff"
                  color="#000000"                
                  borderRadius="2xl"
                  boxShadow="xl"
                >
                  <Center pt="2%"><Text fontSize="12px">${value}&nbsp;Payout Ratio</Text></Center>
                  <LineRechart data={divData} title={["payoutRatio"]} color={[colorPallet.profit.green]}/>
                  <Text fontSize="calc(2px + 1vmin)" align="right" pr="5%" pb="3%"color="gray.400">swimgood.io</Text>
                </Flex>
                <Flex
                  direction="column"
                  h={["23%", "44%","49%"]} 
                  w={["100%", "47%","49%"]}  
                  bg="#ffffff"
                  color="#000000"
                  borderRadius="2xl"
                  boxShadow="xl"
                  justify="center"
                  align="center"
                >
                🏕Under Development
                </Flex>
                <Flex
                  direction="column"
                  h={["23%", "44%","49%"]} 
                  w={["100%", "47%","49%"]} 
                  bg="#ffffff"
                  color="#000000"
                  borderRadius="2xl"
                  boxShadow="xl"
                  justify="center"
                  align="center"
                >
                🏕Under Development
                </Flex>
              </Flex>
            </Flex>
          </Flex>
          <section>
            <AdsCard/>
          </section>
        </Flex>
      </Layout>
    )
   } else {
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
          <Flex direction="column" mx ="2%" my="8%">
            <Text fontWeight="bold" fontSize="calc(6px + 3vmin)"> ${value} pay no dividends</Text>
          </Flex>
          <section>
            <AdsCard/>
          </section>
        </Flex>
      </Layout>
    )

    }
  
}