import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useAppContext } from '../../lib/context/state'
import colorPallet from '../../lib/color-pallet'
import Layout, { siteTitle } from '../../components/layout'
import BarRechart from '../../components/bar_rechart'
import LineRechart from '../../components/line_rechart'
import ComposedRechart from '../../components/composed_rechart'

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
    const [res1, res2, res3, res4, res5, res6] = await Promise.all([
      fetch(`https://financialmodelingprep.com/api/v3/cash-flow-statement/${symbol}?limit=10&apikey=${apikey}`).then(response => response.json()),
      fetch(`https://financialmodelingprep.com/api/v3/income-statement/${symbol}?limit=10&apikey=${apikey}`).then(response => response.json()),
      fetch(`https://financialmodelingprep.com/api/v3/historical-price-full/${symbol}?from=${fiveYearsAgoForApi}&to=${yesterdayForApi}&apikey=${apikey}`).then(response => response.json()),
      fetch(`https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=${apikey}`).then(response => response.json()),
      fetch(`https://financialmodelingprep.com/api/v3/cash-flow-statement/${symbol}?period=quarter&limit=10&apikey=${apikey}`).then(response => response.json()),
      fetch(`https://financialmodelingprep.com/api/v3/income-statement/${symbol}?period=quarter&limit=10&apikey=${apikey}`).then(response => response.json()),
    ]);
  
    const cfs = res1.map((cfsInfo) => ({
      date: cfsInfo.date.split('-'),
      operatingCashFlow: cfsInfo.operatingCashFlow/1000000,
      capitalExpenditure: Math.abs(cfsInfo.capitalExpenditure/1000000),
      freeCashFlow: cfsInfo.freeCashFlow/1000000,
      acquisitionsNet: - cfsInfo.acquisitionsNet/1000000,
      debtRepayment: - cfsInfo.debtRepayment/1000000,
      commonStockRepurchased: - cfsInfo.commonStockRepurchased/1000000,
      dividendsPaid: - cfsInfo.dividendsPaid/1000000,
    }))
  
    const pl = res2.map((plInfo) => ({
      revenue: plInfo.revenue/1000000,
      netIncome: plInfo.netIncome/1000000,
      eps: plInfo.eps,
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
      psr: Math.round((Info.marketCap / (pl[0].revenue * 1000000) * 100)) / 100
    }))

    const cfsQ = res5.map((cfsInfo) => ({
      date: cfsInfo.date.split('-'),
      operatingCashFlow: cfsInfo.operatingCashFlow/1000000,
      capitalExpenditure: Math.abs(cfsInfo.capitalExpenditure/1000000),
      freeCashFlow: cfsInfo.freeCashFlow/1000000,
      acquisitionsNet: - cfsInfo.acquisitionsNet/1000000,
      debtRepayment: - cfsInfo.debtRepayment/1000000,
      commonStockRepurchased: - cfsInfo.commonStockRepurchased/1000000,
      dividendsPaid: - cfsInfo.dividendsPaid/1000000,
    }))

    const plQ = res6.map((plInfo) => ({
      revenue: plInfo.revenue/1000000,
      netIncome: plInfo.netIncome/1000000,
      eps: plInfo.eps,
    }))
  
    return { 
      props: { 
        cfs,
        pl,
        historicalPrice,
        basicInfo,
        cfsQ,
        plQ
      } 
    }
  }


export default function CashFlowStatement ({ cfs, pl, historicalPrice, basicInfo, cfsQ, plQ }) {

  const {value, setStockPrice, setStockInfo} = useAppContext();
  const [isAnnual, setIsAnnual] = useState(true);

  useEffect(() => {
    setStockPrice(historicalPrice);
    setStockInfo(basicInfo);
  }, [basicInfo])

  const cfsData = 
  (cfs.length && cfsQ.length && isAnnual === true)
  ? cfs.map((each, index) => {
      return(
        {
          date: each.date[0],
          operatingCashFlow: each.operatingCashFlow,
          operatingCashFlowRatio: Math.round(each.operatingCashFlow *1000 / pl[index].revenue) /10,
          netIncomeRatio: Math.round(pl[index].netIncome *1000 / pl[index].revenue) /10,
          capitalExpenditure: each.capitalExpenditure,
          freeCashFlow: each.freeCashFlow,
          acquisitionsNet: each.acquisitionsNet,
          debtRepayment: each.debtRepayment,
          commonStockRepurchased: each.commonStockRepurchased,
          dividendsPaid: each.dividendsPaid,
          returnToShareholders: each.commonStockRepurchased + each.dividendsPaid,
          reInvestment: each.capitalExpenditure + each.acquisitionsNet,
        }
      )
    }).reverse(): 
    cfsQ.map((each, index) => {
      return(
        {
          date: each.date[1] + "-" + each.date[0],
          operatingCashFlow: each.operatingCashFlow,
          operatingCashFlowRatio: Math.round(each.operatingCashFlow *1000 / plQ[index].revenue) /10,
          netIncomeRatio: Math.round(plQ[index].netIncome *1000 / plQ[index].revenue) /10,
          capitalExpenditure: each.capitalExpenditure,
          freeCashFlow: each.freeCashFlow,
          acquisitionsNet: each.acquisitionsNet,
          debtRepayment: each.debtRepayment,
          commonStockRepurchased: each.commonStockRepurchased,
          dividendsPaid: each.dividendsPaid,
          returnToShareholders: each.commonStockRepurchased + each.dividendsPaid,
          reInvestment: each.capitalExpenditure + each.acquisitionsNet,
        }
      )
    }).reverse();
  

  return (
    <Layout>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <Flex
        direction="column"
        m="3%"
      >
        <Flex direction={["column", "row"]}>
          <Center fontSize={["xs", "lg"]}  align="center" direction="row" m="2%">
            <Text>Annual&nbsp;</Text>
            <Switch size="md" colorScheme="teal"  onChange={() => setIsAnnual(!isAnnual)}/>
            <Text>&nbsp;Quarterly</Text>
          </Center>
          <Text fontSize="xs" m="2%" align="center">In Millions of USD except per share items</Text>
        </Flex>

         {/* Capital Allocation */}
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
            <Text>&nbsp;&nbsp;■ Capital Allocation</Text>
          </Flex>
          <Flex
            h={["96%","96%","95%"]} 
            w="100%"
            justify="space-between"
            fontSize="xs"
            direction={["column","column", "row"]}
          >
            <Flex h={["40%","40%", "100%"]} w={["100%","100%", "39%"]}  direction="column" justify="space-between">
              <Flex
                h="29%"
                w="100%"
                borderRadius="2xl"
                boxShadow="xl"
                bg="#ffffff"
                color="#000000"
                justify="center"
                align="center"
              >
              🏕Under Development
              </Flex>
              <Flex
                direction="column"
                h="69%"
                w="100%"
                borderRadius="2xl"
                boxShadow="xl"
                bg="#ffffff"
                color="#000000"
              >
                <Center pt="2%"><Text fontSize="12px">${value}&nbsp;How to Use Cash</Text></Center>
                <ComposedRechart data={cfsData} color={colorPallet.cfs} keyword="cfs" />
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
                <Center pt="2%"><Text fontSize="12px">${value}&nbsp;Margins</Text></Center>
                <LineRechart data={cfsData} title={["operatingCashFlowRatio", "netIncomeRatio"]} color={[colorPallet.cfs.yellow, colorPallet.cfs.blue]}/>
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
                <Center pt="2%"><Text fontSize="12px">${value}&nbsp;Cash from Operations</Text></Center>
                <BarRechart data={cfsData} title={["capitalExpenditure", "freeCashFlow"]} color={[colorPallet.cfs.pink3, colorPallet.cfs.blue]}/>
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
                <Center pt="2%"><Text fontSize="12px">${value}&nbsp;Return to Shareholders</Text></Center>
                <BarRechart data={cfsData} title={["dividendsPaid", "commonStockRepurchased"]} color={[colorPallet.cfs.white_blue, colorPallet.cfs.blue]}/>
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
                <Center pt="2%"><Text fontSize="12px">${value}&nbsp;Long-Term Debt Repaid</Text></Center>
                <BarRechart data={cfsData} title={["debtRepayment"]} color={[colorPallet.cfs.pink1]}/>
                <Text fontSize="calc(2px + 1vmin)" align="right" pr="5%" pb="3%"color="gray.400">swimgood.io</Text>
              </Flex>
            </Flex>
          </Flex>
        </Flex>

      </Flex>
    </Layout>
  )
}