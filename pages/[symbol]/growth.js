import Head from 'next/head'
import Layout, { siteTitle } from '../../components/layout'
import colorPallet from '../../lib/color-pallet'
import { useEffect, useState } from 'react'
import { useAppContext } from '../../lib/context/state'
import AdsCard from '../../components/adscard'
import LineRechart from '../../components/line_rechart'
import Highlight from '../../components/highlight'


import { 
  Box,
  Flex,
  Center,
  Text,
  Switch,
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
    const [res1, res2, res3] = await Promise.all([
      fetch(`https://financialmodelingprep.com/api/v3/historical-price-full/${symbol}?from=${fiveYearsAgoForApi}&to=${yesterdayForApi}&apikey=${apikey}`).then(response => response.json()),
      fetch(`https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=${apikey}`).then(response => response.json()),
      fetch(`https://financialmodelingprep.com/api/v3/financial-growth/${symbol}?limit=5&apikey=${apikey}`).then(response => response.json()),      
    ]);

    const historicalPrice = res1.historical.map((dailyPrice) => ({
      price: dailyPrice.close,
      date: dailyPrice.date.split('-'),
      volume: dailyPrice.volume,
    }));
  
    const basicInfo = res2.map((Info) => ({
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

    const growth = res3.map((Info) => ({
      date: Info.date.split('-'),
      revenueGrowth: Info.revenueGrowth,
      grossProfitGrowth: Info.grossProfitGrowth,
      ebitgrowth: Info.ebitgrowth,
      operatingIncomeGrowth: Info.operatingIncomeGrowth,
      netIncomeGrowth: Info.netIncomeGrowth,
      epsdilutedGrowth: Info.epsdilutedGrowth,
      dividendsperShareGrowth: Info.epsdilutedGrowth,
      operatingCashFlowGrowth: Info.operatingCashFlowGrowth,
      freeCashFlowGrowth: Info.freeCashFlowGrowth,
      receivablesGrowth: Info.receivablesGrowth,
      inventoryGrowth: Info.inventoryGrowth,
      assetGrowth: Info.assetGrowth,
      bookValueperShareGrowth: Info.bookValueperShareGrowth,
      debtGrowth: Info.debtGrowth,
      rdexpenseGrowth: Info.rdexpenseGrowth,
      sgaexpensesGrowth: Info.sgaexpensesGrowth
    }))

    // const growthQ = res4.map((Info) => ({
    //   date: Info.date.split('-'),
    //   revenueGrowth: Info.revenueGrowth,
    //   grossProfitGrowth: Info.grossProfitGrowth,
    //   ebitgrowth: Info.ebitgrowth,
    //   operatingIncomeGrowth: Info.operatingIncomeGrowth,
    //   netIncomeGrowth: Info.netIncomeGrowth,
    //   epsdilutedGrowth: Info.epsdilutedGrowth,
    //   dividendsperShareGrowth: Info.epsdilutedGrowth,
    //   operatingCashFlowGrowth: Info.operatingCashFlowGrowth,
    //   freeCashFlowGrowth: Info.freeCashFlowGrowth,
    //   receivablesGrowth: Info.receivablesGrowt,
    //   inventoryGrowth: Info.inventoryGrowth,
    //   assetGrowth: Info.assetGrowth,
    //   bookValueperShareGrowth: Info.bookValueperShareGrowth,
    //   debtGrowth: Info.debtGrowth,
    //   rdexpenseGrowth: Info.rdexpenseGrowth,
    //   sgaexpensesGrowth: Info.sgaexpensesGrowth
    // }))
  
    return { 
      props: { 
        historicalPrice,
        basicInfo,
        growth,
      } 
    }
  }


export default function Growth ({ historicalPrice, basicInfo, growth }) {

  const {value,setStockPrice, setStockInfo} = useAppContext();

  useEffect(() => {
    setStockPrice(historicalPrice);
    setStockInfo(basicInfo);
  }, [basicInfo])

  const growthData = 
  (growth.length)
  ? growth.map((each) => {
      return(
        {
          date: each.date[0],
          revenueGrowth: Math.round(each.revenueGrowth*1000)/10,
          grossProfitGrowth: Math.round(each.grossProfitGrowth*1000)/10,
          ebitgrowth: Math.round(each.ebitgrowth*1000)/10,
          operatingIncomeGrowth: Math.round(each.operatingIncomeGrowth*1000)/10,
          netIncomeGrowth: Math.round(each.netIncomeGrowth*1000)/10,
          epsdilutedGrowth: Math.round(each.epsdilutedGrowth*1000)/10,
          dividendsperShareGrowth: Math.round(each.dividendsperShareGrowth*1000)/10,
          operatingCashFlowGrowth: Math.round(each.operatingCashFlowGrowth*1000)/10,
          freeCashFlowGrowth: Math.round(each.freeCashFlowGrowth*1000)/10,
          receivablesGrowth: Math.round(each.receivablesGrowth*1000)/10,
          inventoryGrowth: Math.round(each.inventoryGrowth*1000)/10,
          assetGrowth: Math.round(each.assetGrowth*1000)/10,
          bookValueperShareGrowth: Math.round(each.bookValueperShareGrowth*1000)/10,
          debtGrowth: Math.round(each.debtGrowth*1000)/10,
          rdexpenseGrowth: Math.round(each.rdexpenseGrowth*1000)/10,
          sgaexpensesGrowth: Math.round(each.sgaexpensesGrowth*1000)/10
        }
      )
    }).reverse(): [];

    const highlightData_growth = growthData ? {
      symbol: value,
      period: growthData[growthData.length - 1].date,
      data: [
        {
          title: "Revenue",
          value: growthData[growthData.length - 1].revenueGrowth.toLocaleString(),
          unit_forth: "",
          unit_back: "%"
        },
        {
          title: "Operating Income",
          value: growthData[growthData.length - 1].operatingIncomeGrowth.toLocaleString(),
          unit_forth: "",
          unit_back: "%"
        },
        {
          title: "Net Income",
          value: growthData[growthData.length - 1].netIncomeGrowth.toLocaleString(),
          unit_forth: "",
          unit_back: "%"
        },
        {
          title: "Operating Cash Flow",
          value: growthData[growthData.length - 1].operatingCashFlowGrowth.toLocaleString(),
          unit_forth: "",
          unit_back: "%"
        }
      ]
    } : null;
    

  return (
    <Layout>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <Flex
        direction="column"
        m="3%"
      >
        <section>
          <AdsCard/>
        </section>
        
        <Flex direction={["column", "row"]}>
          {/* <Center fontSize={["xs", "lg"]}  align="center" direction="row" m="2%">
            <Text>Annual&nbsp;</Text>
            <Switch size="md" colorScheme="teal"  onChange={() => setIsAnnual(!isAnnual)}/>
            <Text>&nbsp;Quarterly</Text>
          </Center> */}
          <Text fontSize="xs" m="2%" align="center">In Millions of USD except per share items</Text>
        </Flex>

         {/* Growth */}
         <Flex
          direction="column"
          w="100%"
          h={["1260px", "1260px", "75vh"]} 
          p={["4%","4%","2%"]} 
          my="2%"
          pt="1%"
          bg="#e4e9fb"
          color="#3f3356"
          justify="space-around"
          borderRadius="lg"
          z-index="5"
        >
          <Flex textAlign="center" fontSize="sm">
            <Text>&nbsp;&nbsp;■ Growth (YoY)</Text>
          </Flex>
          <Flex
            h={["96%","96%","95%"]} 
            w="100%"
            justify="space-between"
            fontSize="xs"
            direction={["column","column", "row"]}
          >
            <Flex h={["40%","40%", "100%"]} w={["100%","100%", "39%"]}  direction="column" justify="space-between">
              <Highlight highlightData={highlightData_growth}/>
              <Flex
                direction="column"
                h="69%"
                w="100%"
                borderRadius="2xl"
                boxShadow="xl"
                bg="#ffffff"
                color="#000000"
              >
                <Center pt="2%"><Text fontSize="12px">${value}&nbsp;Revenue & Gross Profit</Text></Center>
                <LineRechart data={growthData} title={["revenueGrowth", "grossProfitGrowth"]} color={[colorPallet.profit.green, colorPallet.profit.pink]}/>
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
                <Center pt="2%"><Text fontSize="12px">${value}&nbsp;Operating Income & Net Income</Text></Center>
                <LineRechart data={growthData} title={["operatingIncomeGrowth", "netIncomeGrowth"]} color={[colorPallet.profit.blue, colorPallet.profit.orange]}/>
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
                <Center pt="2%"><Text fontSize="12px">${value}&nbsp;Cash Flow</Text></Center>
                <LineRechart data={growthData} title={["operatingCashFlowGrowth", "freeCashFlowGrowth"]} color={[colorPallet.profit.blue, colorPallet.profit.pink]}/>
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
                 {/* <LineRechart data={growthData} title={["rdexpenseGrowth", "sgaexpensesGrowth"]} color={[colorPallet.profit.pink, colorPallet.profit.green]}/> */}
                 <Center h="90%" fontSize="100px">🏟</Center>
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
                <Center h="90%" fontSize="100px">🧱</Center>
                {/* <LineRechart data={growthData} title={["dividendsperShareGrowth", "freeCashFlowGrowth"]} color={[colorPallet.profit.pink, colorPallet.profit.green]}/> */}
                <Text fontSize="calc(2px + 1vmin)" align="right" pr="5%" pb="3%"color="gray.400">swimgood.io</Text>
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
}