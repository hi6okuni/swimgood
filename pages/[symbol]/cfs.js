import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useAppContext } from '../../lib/context/state'
import colorPallet from '../../lib/color-pallet'
import Layout, { siteTitle } from '../../components/layout'
import AreaRechart from '../../components/area_rechart'
import BarRechart from '../../components/bar_rechart'
import LineRechart from '../../components/line_rechart'
import ComposedRechart from '../../components/composed_rechart'

import { 
  Box,
  Flex,
  Center,
  Text,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Button,
  Stack,
  Switch,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
} from "@chakra-ui/react"


export async function getServerSideProps({params}) {
  // Fetch data from external API    
    const symbol = params.symbol
    var yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    var yesterdayForApi = yesterday.getFullYear() + "-" +  (yesterday.getMonth()+ 1) + "-" + yesterday.getDate();

    var fiveYearsAgo = new Date();
    fiveYearsAgo.setDate(fiveYearsAgo.getDate() - 1824);
    var fiveYearsAgoForApi = fiveYearsAgo.getFullYear() + "-" +  (fiveYearsAgo.getMonth()+ 1) + "-" + fiveYearsAgo.getDate();
    const [res1, res2, res3, res4, res5, res6] = await Promise.all([
      fetch(`https://financialmodelingprep.com/api/v3/cash-flow-statement/${symbol}?limit=10&apikey=fea107802693a9f21cc94def10b870da`).then(response => response.json()),
      fetch(`https://financialmodelingprep.com/api/v3/income-statement/${symbol}?limit=10&apikey=fea107802693a9f21cc94def10b870da`).then(response => response.json()),
      fetch(`https://financialmodelingprep.com/api/v3/historical-price-full/${symbol}?from=${fiveYearsAgoForApi}&to=${yesterdayForApi}&apikey=fea107802693a9f21cc94def10b870da`).then(response => response.json()),
      fetch(`https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=fea107802693a9f21cc94def10b870da`).then(response => response.json()),
      fetch(`https://financialmodelingprep.com/api/v3/cash-flow-statement/${symbol}?period=quarter&limit=10&apikey=fea107802693a9f21cc94def10b870da`).then(response => response.json()),
      fetch(`https://financialmodelingprep.com/api/v3/income-statement/${symbol}?period=quarter&limit=10&apikey=fea107802693a9f21cc94def10b870da`).then(response => response.json()),
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

  const {setStockPrice, setStockInfo} = useAppContext();
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
        <Flex direction="row">
          <Stack align="center" direction="row" mx="2%">
            <Text>Annual</Text>
            <Switch size="md" colorScheme="teal"  onChange={() => setIsAnnual(!isAnnual)}/>
            <Text>Quarterly</Text>
          </Stack>
          <Text fontSize="xs" mx="2%">In Millions of USD except per share items</Text>
        </Flex>

        <Flex
          direction="column"
          w="100%"
          h="50vh"
          p="1.5%"
          mt="2%"
          pt="1%"
          justify="space-between"
          bg='gray.700'
          borderRadius="lg"
        >
          <Flex h="5%" fontWeight="bold" fontSize="sm">
            <Text>&nbsp;&nbsp;■ Capital Allocation</Text>
          </Flex>
          <Flex
            h="92.5%"
            w="100%"
            bg='transparent'
            wrap="nowrap"
            justify="space-around"
            fontSize="xs"
          >
            <Flex w="39%">
              <Flex
                direction="column"
                h="100%"
                w="100%"
                bg="gray.800"
                borderRadius="lg"
                boxShadow="md"
              >
                <Center><Text fontSize="xs" mt="2%">How to Use Cash</Text></Center>
                <ComposedRechart data={cfsData} color={colorPallet.cfs} keyword="cfs" />
              </Flex>
            </Flex>
            <Flex 
              w="59%" 
              wrap="wrap"
              justify="space-around"
            >
              <Flex
                direction="column"
                h="49%"
                w="49%"
                bg="gray.800"
                borderRadius="lg"
                boxShadow="md"
                m="0.4"
                align="center"
              >
                <Text fontSize="xs" mt="2%">Margins</Text>
                <LineRechart data={cfsData} title={["operatingCashFlowRatio", "netIncomeRatio"]} color={[colorPallet.cfs.pink, colorPallet.cfs.white]}/>
              </Flex>
              <Flex
                direction="column"
                h="49%"
                w="49%"
                bg="gray.800"
                borderRadius="lg"
                boxShadow="md"
                m="0.4"
                align="center"
              >
                <Text fontSize="xs" mt="2%">Capex + Free Cash Flow = Cash from Operations</Text>
                <BarRechart data={cfsData} title={["capitalExpenditure", "freeCashFlow"]} color={[colorPallet.cfs.pink, colorPallet.cfs.blue]}/>
              </Flex>
              <Flex
                direction="column"
                h="49%"
                w="49%"
                bg="gray.800"
                borderRadius="lg"
                boxShadow="md"
                m="0.4"
                align="center"
              >
                <Text fontSize="xs" mt="2%">Return to Shareholders</Text>
                <BarRechart data={cfsData} title={["dividendsPaid", "commonStockRepurchased"]} color={[colorPallet.cfs.white_blue, colorPallet.cfs.blue]}/>
              </Flex>
              <Flex
                direction="column"
                h="49%"
                w="49%"
                bg="gray.800"
                borderRadius="lg"
                boxShadow="md"
                m="0.4"
                align="center"
              >
                <Text fontSize="xs" mt="2%">Long-Term Debt Repaid</Text>
                <BarRechart data={cfsData} title={["debtRepayment"]} color={[colorPallet.cfs.white]}/>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Layout>
  )
}