import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useAppContext } from '../../lib/context/state'
import Layout, { siteTitle } from '../../components/layout'
import AreaRechart from '../../components/area_rechart'
import BarRechart from '../../components/bar_rechart'
import LineRechart from '../../components/line_rechart'
import { 
  Box,
  Flex,
  Center,
  Text,
  Switch,
} from "@chakra-ui/react"


export async function getServerSideProps({params}) {
  // Fetch data from external API
  const apikey = process.env.FMP_API_KEY;

  var yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  var yesterdayForApi = yesterday.getFullYear() + "-" +  (yesterday.getMonth()+ 1) + "-" + yesterday.getDate();

  var fiveYearsAgo = new Date();
  fiveYearsAgo.setDate(fiveYearsAgo.getDate() - 1824);
  var fiveYearsAgoForApi = fiveYearsAgo.getFullYear() + "-" +  (fiveYearsAgo.getMonth()+ 1) + "-" + fiveYearsAgo.getDate();
    
  const symbol = params.symbol
  const [res1, res2, res3, res4, res5] = await Promise.all([
    fetch(`https://financialmodelingprep.com/api/v3/income-statement/${symbol}?limit=10&apikey=${apikey}`).then(response => response.json()),
    fetch(`https://financialmodelingprep.com/api/v3/key-metrics/${symbol}?limit=10&apikey=${apikey}`).then(response => response.json()),
    fetch(`https://financialmodelingprep.com/api/v3/historical-price-full/${symbol}?from=${fiveYearsAgoForApi}&to=${yesterdayForApi}&apikey=${apikey}`).then(response => response.json()),
    fetch(`https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=${apikey}`).then(response => response.json()),
    fetch(`https://financialmodelingprep.com/api/v3/income-statement/${symbol}?period=quarter&limit=10&apikey=${apikey}`).then(response => response.json()),
  ]);

  const plData = res1.map((each) => ({
    revenue: each.revenue,
    date: each.date.split('-'),
    costOfRevenue: each.costOfRevenue,
    costOfRevenueR: (each.costOfRevenue*100) / each.revenue,
    operatingExpense: each.revenue - each.costOfRevenue - each.operatingIncome,
    operatingExpenseR: (each.revenue - each.costOfRevenue - each.operatingIncome)*100 / each.revenue,
    nonOperatingExpense: each.operatingIncome - each.netIncome,
    nonOperatingExpenseR: (each.operatingIncome - each.netIncome)*100 / each.revenue,
    grossProfit: each.revenue - each.costOfRevenue,
    grossProfitR: (each.revenue - each.costOfRevenue)*100 /each.revenue,
    operatingIncome: each.operatingIncome,
    operatingIncomeR: each.operatingIncome*100 /each.revenue,
    netIncome: each.netIncome,
    netIncomeR: each.netIncome*100 /each.revenue,
    eps: each.eps,
    weightedAverageShsOutDil: each.weightedAverageShsOutDil,
    revenuePerShare: each.revenue / each.weightedAverageShsOutDil,
    sellingAndMarketingExpenses: each.sellingAndMarketingExpenses,
    sellingAndMarketingExpensesR: each.sellingAndMarketingExpenses*100 / each.operatingExpenses,
    rd: each.researchAndDevelopmentExpenses,
    rdR: each.researchAndDevelopmentExpenses*100 / each.operatingExpenses,
    sga: each.operatingExpenses - each.researchAndDevelopmentExpenses,
    sgaR: (each.operatingExpenses - each.researchAndDevelopmentExpenses )*100 / each.operatingExpenses,
    da: each.depreciationAndAmortization,
    daR: each.depreciationAndAmortization*100 / each.operatingExpenses,
    interestExpense: each.interestExpense,
    incomeTaxExpense: each.incomeTaxExpense,
    ebitdaR: (each.netIncome + each.incomeTaxExpense + each.interestExpense + each.depreciationAndAmortization)*100 / each.revenue,
  }));

  const keyMetrics = res2.map((keyMetric) => ({
    date: keyMetric.date.split('-'),
    dividendYield: Math.round(keyMetric.dividendYield*100 * 100) / 100,
    payoutRatio: Math.round(keyMetric.payoutRatio*100 * 100) / 100,
    operatingCashFlowPerShare: Math.round(keyMetric.operatingCashFlowPerShare * 100) / 100,
    freeCashFlowPerShare: Math.round(keyMetric.freeCashFlowPerShare * 100) / 100,
  }));

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
    psr: Math.round((Info.marketCap / plData[0].revenue) * 100) / 100
  }))

  const plDataQ = res5.map((each) => ({
    revenue: each.revenue,
    date: each.date.split('-'),
    costOfRevenue: each.costOfRevenue,
    operatingExpense: each.revenue - each.costOfRevenue - each.operatingIncome,
    nonOperatingExpense: each.operatingIncome - each.netIncome,
    grossProfit: each.revenue - each.costOfRevenue,
    grossProfitR: (each.revenue - each.costOfRevenue)*100 /each.revenue,
    operatingIncome: each.operatingIncome,
    operatingIncomeR: each.operatingIncome*100 /each.revenue,
    netIncome: each.netIncome,
    netIncomeR: each.netIncome*100 /each.revenue,
    eps: each.eps,
    weightedAverageShsOutDil: each.weightedAverageShsOutDil,
    revenuePerShare: each.revenue / each.weightedAverageShsOutDil,
    costOfRevenueR: (each.costOfRevenue*100) / each.revenue,
    operatingExpenseR: (each.revenue - each.costOfRevenue - each.operatingIncome)*100 / each.revenue,
    nonOperatingExpenseR: (each.operatingIncome - each.netIncome)*100 / each.revenue,
    sellingAndMarketingExpenses: each.sellingAndMarketingExpenses,
    sellingAndMarketingExpensesR: each.sellingAndMarketingExpenses*100 / each.operatingExpenses,
    rd: each.researchAndDevelopmentExpenses,
    rdR: each.researchAndDevelopmentExpenses*100 / each.operatingExpenses,
    sga: each.operatingExpenses - each.researchAndDevelopmentExpenses,
    sgaR: (each.operatingExpenses - each.researchAndDevelopmentExpenses )*100 / each.operatingExpenses,
    da: each.depreciationAndAmortization,
    daR: each.depreciationAndAmortization*100 / each.operatingExpenses,
    interestExpense: each.interestExpense,
    incomeTaxExpense: each.incomeTaxExpense,
    ebitdaR: (each.netIncome + each.incomeTaxExpense + each.interestExpense + each.depreciationAndAmortization)*100 / each.revenue,
  }));

  // Pass data to the page via props
  return { 
    props: { 
      plData,
      keyMetrics,
      historicalPrice,
      basicInfo,
      plDataQ
    } 
  }
}


export default function IncomeStatement ({ plData, keyMetrics, basicInfo, historicalPrice, plDataQ }) {

  const {setStockPrice, setStockInfo} = useAppContext();
  const [isPercent, setIsPercent] = useState(false);
  const [isAnnual, setIsAnnual] = useState(true);

  useEffect(() => {
    setStockPrice(historicalPrice);
    setStockInfo(basicInfo);
  }, [basicInfo]);

  const profitData = 
  (plData.length && plDataQ.length && keyMetrics.length == plData.length  && isAnnual === true)
  ? plData.map((each, index) => {
      return(
        {
          date: each.date[0],
          revenue: each.revenue/1000000,
          grossProfit: each.grossProfit/1000000,
          grossProfitR: Math.round(each.grossProfitR * 10) / 10,
          operatingIncome: each.operatingIncome/1000000,
          operatingIncomeR: Math.round(each.operatingIncomeR * 10) / 10,
          costOfRevenue: each.costOfRevenue/1000000,
          costOfRevenueR: Math.round(each.costOfRevenueR * 10) / 10,
          operatingExpense: each.operatingExpense/1000000,
          operatingExpenseR: Math.round(each.operatingExpenseR * 10) / 10,
          nonOperatingExpense: each.nonOperatingExpense/1000000,
          nonOperatingExpenseR: Math.round(each.nonOperatingExpenseR * 10) / 10,
          netIncome: each.netIncome/1000000,
          netIncomeR: Math.round(each.netIncomeR * 10) / 10,
          rd: each.rd/1000000,
          sga: each.sga/1000000,
          incomeTaxExpense: each.incomeTaxExpense/1000000,
          interestExpense: each.interestExpense/1000000,
          da: each.da/1000000,
          ebitdaR: each.ebitdaR,
          weightedAverageShsOutDil: each.weightedAverageShsOutDil/1000000,
          eps: each.eps,
          revenuePerShare: each.revenuePerShare,
          operatingCashFlowPerShare: keyMetrics[index].operatingCashFlowPerShare,
          freeCashFlowPerShare: keyMetrics[index].freeCashFlowPerShare,
        }
      )
    }).reverse(): 
    plDataQ.map((each, index) => {
      return(
        {
          date: each.date[1] + "-" + each.date[0],
          revenue: each.revenue/1000000,
          grossProfit: each.grossProfit/1000000,
          grossProfitR: Math.round(each.grossProfitR * 10) / 10,
          operatingIncome: each.operatingIncome/1000000,
          operatingIncomeR: Math.round(each.operatingIncomeR * 10) / 10,
          costOfRevenue: each.costOfRevenue/1000000,
          costOfRevenueR: Math.round(each.costOfRevenueR * 10) / 10,
          operatingExpense: each.operatingExpense/1000000,
          operatingExpenseR: Math.round(each.operatingExpenseR * 10) / 10,
          nonOperatingExpense: each.nonOperatingExpense/1000000,
          nonOperatingExpenseR: Math.round(each.nonOperatingExpenseR * 10) / 10,
          netIncome: each.netIncome/1000000,
          netIncomeR: Math.round(each.netIncomeR * 10) / 10,
          rd: each.rd/1000000,
          sga: each.sga/1000000,
          incomeTaxExpense: each.incomeTaxExpense/1000000,
          interestExpense: each.interestExpense/1000000,
          da: each.da/1000000,
          ebitdaR: each.ebitdaR,
          weightedAverageShsOutDil: each.weightedAverageShsOutDil/1000000,
          eps: each.eps,
          revenuePerShare: each.revenuePerShare,
        }
      )
    }).reverse();

  const chartColor = {
      rev: ["#7827e6","#8d39ec","#aa4ff6","#ea80fc"],
      expense: ["#E53E3E", "#FC8181"],
      ebitda: ["#2e9684","#5ab6a8","#87cbc1","#b5dfd9"],
      perShare: ["#D69E2E","#ECC94B", "#FAF089", "#FEFCBF"]
  }

  const profitStructureKeyword = 
  (isPercent === true) 
  ? "profitR" : "profit";

  return (
    <Layout>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <Flex
        direction="column"
        my="3%"
      >
        <Flex direction={["column", "row"]}>
          <Center fontSize={["xs", "lg"]}  align="center" direction="row" m="2%">
            <Text>Annual&nbsp;</Text>
            <Switch size="md" colorScheme="teal"  onChange={() => setIsAnnual(!isAnnual)}/>
            <Text>&nbsp;Quarterly</Text>
          </Center>
          <Center fontSize={["xs", "lg"]}  align="center" direction="row" m="2%">
            <Text>$&nbsp;</Text>
            <Switch size="md" onChange={() => setIsPercent(!isPercent)}/>
            <Text>&nbsp;%</Text>
          </Center>
          <Text fontSize="xs" m="2%" align="center">In Millions of USD except per share items</Text>
        </Flex>


        {/* Revenue and Income */}
        <Flex
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
            <Text>&nbsp;&nbsp;■ Revenue and Income</Text>
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
                <Text fontSize="calc(2px + 1vmin)" mt="2%" ml="4%" color="gray.400">swimgood.io</Text>
                <Center><Text fontSize="xs">Profit Structure</Text></Center>
                <AreaRechart data={profitData} keyword={profitStructureKeyword} color={chartColor.rev}/>
              </Flex>
            </Flex>
            <Flex 
              h={["75%","75%", "100%"]} 
              w={["100%","100%", "59%"]}
              wrap="wrap"
              justify="space-around"
              direction={["column","colmn", "row"]}
            >
              <Flex
                direction="column"
                h={["22%", "44%","47%"]} 
                w={["100%", "47%","47%"]} 
                borderRadius="2xl"
                boxShadow="xl"
                my="1"
                bg="#ffffff"
                color="#000000"
              >
                <Text fontSize="calc(2px + 1vmin)" mt="2%" ml="4%" color="gray.400">swimgood.io</Text>
                <Center><Text fontSize="xs">Revenue</Text></Center>
                <BarRechart data={profitData} title={["revenue"]} color={[chartColor.rev[0]]}/>
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
              >
                <Text fontSize="calc(2px + 1vmin)" mt="2%" ml="4%" color="gray.400">swimgood.io</Text>
                <Center><Text fontSize="xs">Gross Profit</Text></Center>
                { isPercent === true ? 
                  <LineRechart data={profitData} title={["grossProfitR"]} color={[chartColor.rev[1]]}/> 
                  : 
                  <BarRechart data={profitData} title={["grossProfit"]} color={[chartColor.rev[1]]}/>
                }
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
              >
                <Text fontSize="calc(2px + 1vmin)" mt="2%" ml="4%" color="gray.400">swimgood.io</Text>
                <Center><Text fontSize="xs">Operating Income</Text></Center>
                { isPercent === true ? 
                  <LineRechart data={profitData} title={["operatingIncomeR"]} color={[chartColor.rev[2]]}/> 
                  : 
                  <BarRechart data={profitData} title={["operatingIncome"]} color={[chartColor.rev[2]]}/>
                }
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
              >
                <Text fontSize="calc(2px + 1vmin)" mt="2%" ml="4%" color="gray.400">swimgood.io</Text>
                <Center><Text fontSize="xs">Net Income</Text></Center>
                { isPercent === true ? 
                  <LineRechart data={profitData} title={["netIncomeR"]} color={[chartColor.rev[3]]}/> 
                  : 
                  <BarRechart data={profitData} title={["netIncome"]} color={[chartColor.rev[3]]}/>
                }
              </Flex>
            </Flex>
          </Flex>
        </Flex>

        {/* Operating Expenses */}
        <Flex
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
            <Text>&nbsp;&nbsp;■ Operating Expenses</Text>
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
                <Text fontSize="calc(2px + 1vmin)" mt="2%" ml="4%" color="gray.400">swimgood.io</Text>
                <Center><Text fontSize="xs">Operating Expenses Structure</Text></Center>
                <AreaRechart data={profitData} keyword="expense" color={chartColor.expense}/>
              </Flex>
            </Flex>
            <Flex 
              h={["75%","75%", "100%"]} 
              w={["100%","100%", "59%"]}
              wrap="wrap"
              justify="space-around"
              direction={["column","colmn", "row"]}
            >
              <Flex
                direction="column"
                h={["22%", "44%","47%"]} 
                w={["100%", "47%","47%"]} 
                borderRadius="2xl"
                boxShadow="xl"
                my="1"
                bg="#ffffff"
                color="#000000"
              >
                <Text fontSize="calc(2px + 1vmin)" mt="2%" ml="4%" color="gray.400">swimgood.io</Text>
                <Center><Text fontSize="xs">Operating Expenses / Revenue</Text></Center>
                <LineRechart data={profitData} title={["operatingExpenseR"]} color={[chartColor.expense[0]]}/>
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
              >
                <Text fontSize="calc(2px + 1vmin)" mt="2%" ml="4%" color="gray.400">swimgood.io</Text>
                <Center><Text fontSize="xs">R&D</Text></Center>
                <BarRechart data={profitData} title={["rd"]} color={[chartColor.expense[0]]}/>
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
              >
                <Text fontSize="calc(2px + 1vmin)" mt="2%" ml="4%" color="gray.400">swimgood.io</Text>
                <Center><Text fontSize="xs">SG&A</Text></Center>
                <BarRechart data={profitData} title={["sga"]} color={[chartColor.expense[1]]}/>
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
              >
                <Text fontSize="calc(2px + 1vmin)" mt="2%" ml="4%" color="gray.400">swimgood.io</Text>
                <Center><Text fontSize="xs">Depreciation and Amortization</Text></Center>
                <BarRechart data={profitData} title={["da"]} color={[chartColor.ebitda[0]]}/>
              </Flex>
            </Flex>
          </Flex>
        </Flex>


        {/* Ebitda */}
        <Flex
          direction="column"
          w="100%"
          h={["960px", "960px", "60vh"]} 
          p={["4%","4%","2%"]} 
          my="4%"
          bg="#e4e9fb"
          color="#3f3356"
          justify="space-around"
          borderRadius="lg"
          z-index="5"
        >
          <Flex textAlign="center" fontSize="sm">
            <Text>&nbsp;&nbsp;■ Ebitda</Text>
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
                <Text fontSize="calc(2px + 1vmin)" mt="2%" ml="4%" color="gray.400">swimgood.io</Text>
                <Center><Text fontSize="xs">From Net Income to EBITDA</Text></Center>
                <AreaRechart data={profitData} keyword="ebitda" color={chartColor.ebitda}/>
              </Flex>
            </Flex>
            <Flex 
              h={["75%","75%", "100%"]} 
              w={["100%","100%", "59%"]}
              wrap="wrap"
              justify="space-around"
              direction={["column","colmn", "row"]}
            >
              <Flex
                direction="column"
                h={["22%", "44%","47%"]} 
                w={["100%", "47%","47%"]} 
                borderRadius="2xl"
                boxShadow="xl"
                my="1"
                bg="#ffffff"
                color="#000000"
              >
                <Text fontSize="calc(2px + 1vmin)" mt="2%" ml="4%" color="gray.400">swimgood.io</Text>
                <Center><Text fontSize="xs">EBITDA Margin</Text></Center>
                <LineRechart data={profitData} title={["ebitdaR"]} color={[chartColor.ebitda[0]]}/>
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
              >
                <Text fontSize="calc(2px + 1vmin)" mt="2%" ml="4%" color="gray.400">swimgood.io</Text>
                <Center><Text fontSize="xs">Depreciation and Amortization</Text></Center>
                <BarRechart data={profitData} title={["da"]} color={[chartColor.ebitda[0]]}/>
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
              >
                <Text fontSize="calc(2px + 1vmin)" mt="2%" ml="4%" color="gray.400">swimgood.io</Text>
                <Center><Text fontSize="xs">Interest Expense</Text></Center>
                <BarRechart data={profitData} title={["interestExpense"]} color={[chartColor.ebitda[1]]}/>
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
              >
                <Text fontSize="calc(2px + 1vmin)" mt="2%" ml="4%" color="gray.400">swimgood.io</Text>
                <Center><Text fontSize="xs">Income Tax Expense</Text></Center>
                <BarRechart data={profitData} title={["incomeTaxExpense"]} color={[chartColor.ebitda[2]]}/>
              </Flex>
            </Flex>
          </Flex>
        </Flex>

        {/* EPS & other Per Share items */}
        <Flex
          direction="column"
          w="100%"
          h={["960px", "960px", "60vh"]} 
          p={["4%","4%","2%"]} 
          my="4%"
          bg="#e4e9fb"
          color="#3f3356"
          justify="space-around"
          borderRadius="lg"
          z-index="5"
        >
          <Flex textAlign="center" fontSize="sm">
            <Text>&nbsp;&nbsp;■ EPS & other Per Share items</Text>
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
                <Text fontSize="calc(2px + 1vmin)" mt="2%" ml="4%" color="gray.400">swimgood.io</Text>
                <Center><Text fontSize="xs">Diluted Weighted Average Shares Outst.</Text></Center>
                <BarRechart data={profitData} title={["weightedAverageShsOutDil"]} color={[chartColor.perShare[0]]}/>
              </Flex>
            </Flex>
            <Flex 
              h={["75%","75%", "100%"]} 
              w={["100%","100%", "59%"]}
              wrap="wrap"
              justify="space-around"
              direction={["column","colmn", "row"]}
            >
              <Flex
                direction="column"
                h={["22%", "44%","47%"]} 
                w={["100%", "47%","47%"]} 
                borderRadius="2xl"
                boxShadow="xl"
                my="1"
                bg="#ffffff"
                color="#000000"
              >
                <Text fontSize="calc(2px + 1vmin)" mt="2%" ml="4%" color="gray.400">swimgood.io</Text>
                <Center><Text fontSize="xs">Diluted EPS</Text></Center>
                <BarRechart data={profitData} title={["eps"]} color={[chartColor.perShare[0]]}/>
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
              >
                <Text fontSize="calc(2px + 1vmin)" mt="2%" ml="4%" color="gray.400">swimgood.io</Text>
                <Center><Text fontSize="xs">Revenue Per Share</Text></Center>
                <BarRechart data={profitData} title={["revenuePerShare"]} color={[chartColor.perShare[1]]}/>
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
              >
                <Text fontSize="calc(2px + 1vmin)" mt="2%" ml="4%" color="gray.400">swimgood.io</Text>
                <Center><Text fontSize="xs">Operating Cash From Per Share</Text></Center>
                <BarRechart data={profitData} title={["operatingCashFlowPerShare"]} color={[chartColor.perShare[2]]}/>
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
              >
                <Text fontSize="calc(2px + 1vmin)" mt="2%" ml="4%" color="gray.400">swimgood.io</Text>
                <Center><Text fontSize="xs">Free Cash From Per Share</Text></Center>
                <BarRechart data={profitData} title={["freeCashFlowPerShare"]} color={[chartColor.perShare[3]]}/>
              </Flex>
            </Flex>
          </Flex>
        </Flex>

      </Flex>
    </Layout>
  )
}