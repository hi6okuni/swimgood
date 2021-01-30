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
    const symbol = params.symbol;
    const apikey = process.env.FMP_API_KEY;

    var yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    var yesterdayForApi = yesterday.getFullYear() + "-" +  (yesterday.getMonth()+ 1) + "-" + yesterday.getDate();

    var fiveYearsAgo = new Date();
    fiveYearsAgo.setDate(fiveYearsAgo.getDate() - 1824);
    var fiveYearsAgoForApi = fiveYearsAgo.getFullYear() + "-" +  (fiveYearsAgo.getMonth()+ 1) + "-" + fiveYearsAgo.getDate();
    const [res1, res2, res3, res4] = await Promise.all([
      fetch(`https://financialmodelingprep.com/api/v3/income-statement/${symbol}?limit=10&apikey=${apikey}`).then(response => response.json()),
      fetch(`https://financialmodelingprep.com/api/v3/balance-sheet-statement/${symbol}?apikey=${apikey}&limit=10`).then(response => response.json()),
      fetch(`https://financialmodelingprep.com/api/v3/historical-price-full/${symbol}?from=${fiveYearsAgoForApi}&to=${yesterdayForApi}&apikey=${apikey}`).then(response => response.json()),
      fetch(`https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=${apikey}`).then(response => response.json()),
    ]);
    
    const pl = res1.map((each) => ({
      revenue: each.revenue/1000000,
      date: each.date.split('-'),
      costOfRevenue: each.costOfRevenue/1000000,
      costOfRevenueR: (each.costOfRevenue*100) / each.revenue,
      operatingExpense: (each.revenue - each.costOfRevenue - each.operatingIncome)/1000000,
      operatingExpenseR: (each.revenue - each.costOfRevenue - each.operatingIncome)*100 / each.revenue,
      nonOperatingExpense: (each.operatingIncome - each.netIncome)/1000000,
      nonOperatingExpenseR: (each.operatingIncome - each.netIncome)*100 / each.revenue,
      grossProfit: (each.revenue - each.costOfRevenue)/1000000,
      grossProfitR: (each.revenue - each.costOfRevenue)*100 /each.revenue,
      operatingIncome: (each.operatingIncome)/1000000,
      operatingIncomeR: each.operatingIncome*100 /each.revenue,
      netIncome: (each.netIncome)/1000000,
      netIncomeR: each.netIncome*100 /each.revenue,
      eps: each.eps,
      weightedAverageShsOutDil: each.weightedAverageShsOutDil,
      revenuePerShare: each.revenue / each.weightedAverageShsOutDil,
      sellingAndMarketingExpenses: (each.sellingAndMarketingExpenses)/1000000,
      sellingAndMarketingExpensesR: each.sellingAndMarketingExpenses*100 / each.operatingExpenses,
      rd: each.researchAndDevelopmentExpenses/1000000,
      rdR: each.researchAndDevelopmentExpenses*100 / each.operatingExpenses,
      sga: each.operatingExpenses - each.researchAndDevelopmentExpenses/1000000,
      sgaR: (each.operatingExpenses - each.researchAndDevelopmentExpenses )*100 / each.operatingExpenses,
      da: each.depreciationAndAmortization/1000000,
      daR: each.depreciationAndAmortization*100 / each.operatingExpenses,
      interestExpense: each.interestExpense/1000000,
      incomeTaxExpense: each.incomeTaxExpense/1000000,
      ebit: ( each.netIncome + each.incomeTaxExpense + each.interestExpense )/1000000,
      taxRate: each.incomeTaxExpense / each.netIncome,
      ebitdaR: (each.netIncome + each.incomeTaxExpense + each.interestExpense + each.depreciationAndAmortization)*100 / each.revenue,
    }));

    const bs = res2.map((bsInfo) => ({
      date: bsInfo.date,
      totalLiabilities: bsInfo.totalLiabilities/1000000,
      totalStockholdersEquity: bsInfo.totalStockholdersEquity/1000000,
      investedCapital: (bsInfo.shortTermDebt + bsInfo.longTermDebt + bsInfo.totalStockholdersEquity)/1000000
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
  
    return { 
      props: { 
        pl,
        bs,
        historicalPrice,
        basicInfo,
      } 
    }
  }


export default function Metrics ({ pl, bs, historicalPrice, basicInfo }) {

  const {setStockPrice, setStockInfo} = useAppContext();

  useEffect(() => {
    setStockPrice(historicalPrice);
    setStockInfo(basicInfo);
  }, [basicInfo])

  const profitData = 
  (pl.length && bs.length)
  ? pl.map((each, index) => {
      return(
        {
          date: each.date[0],
          revenue: each.revenue,
          costOfRevenue: each.costOfRevenue,
          operatingExpense: each.revenue - each.costOfRevenue - each.operatingIncome,
          nonOperatingExpense: each.operatingIncome - each.netIncome,
          grossProfit: each.revenue - each.costOfRevenue,
          grossProfitR: Math.round(each.grossProfitR * 100) /100,
          operatingIncome: each.operatingIncome,
          operatingIncomeR: each.operatingIncome*100 /each.revenue,
          ebitdaR: Math.round(each.ebitdaR * 100) /100,
          netIncome: each.netIncome,
          costs: each.revenue - each.netIncome,
          netIncomeR: Math.round(each.netIncomeR * 100) / 100,
          eps: each.eps,
          weightedAverageShsOutDil: each.weightedAverageShsOutDil,
          costOfRevenueR: (each.costOfRevenue*100) / each.revenue,
          operatingExpenseR: (each.revenue - each.costOfRevenue - each.operatingIncome)*100 / each.revenue,
          nonOperatingExpenseR: (each.operatingIncome - each.netIncome)*100 / each.revenue,
          totalLiabilities: bs[index].totalLiabilities,
          totalStockholdersEquity: bs[index].totalStockholdersEquity,
          totalAssets: bs[index].totalLiabilities + bs[index].totalStockholdersEquity,
          roe: Math.round((each.netIncome*100 / bs[index].totalStockholdersEquity)*100) / 100,
          roa: Math.round(each.netIncome*100 / (bs[index].totalStockholdersEquity + bs[index].totalLiabilities)*100) / 100,
          totalAssetTurnover: Math.round(each.revenue*100 / (bs[index].totalLiabilities + bs[index].totalStockholdersEquity)*100) /100,
          equityMultiplier:  Math.round(((bs[index].totalLiabilities + bs[index].totalStockholdersEquity) / bs[index].totalStockholdersEquity)*100) /100,
          roic: Math.round((each.ebit*(1 - each.taxRate)*100 / bs[index].investedCapital)*100) / 100,
        }
      )
    }).reverse(): [];

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

        <Flex
          direction="column"
          w="100%"
          h="30vh"
          p="1.5%"
          mt="2%"
          justify="space-around"
          bg='gray.700'
          borderRadius="lg"
        >
          <Flex
            h="92.5%"
            w="100%"
            p="2%"
            bg="gray.800"
            wrap="nowrap"
            justify="space-between"
            fontSize="sm"
            borderRadius="lg"
            boxShadow="md"
          >
            <Flex w="30%" justify="space-between" p="2%" direction="column">
              <Flex justify="center">
                <Text color="teal.300">Margin Metrics</Text>
              </Flex>
              <Flex justify="space-between">
                <Text>Gross Profit Margin</Text>
                <Text>{`${profitData[profitData.length - 1].grossProfitR}%`}</Text>
              </Flex>
              <Flex justify="space-between">
                <Text>EBITDA Margin</Text>
                <Text>{`${profitData[profitData.length - 1].ebitdaR}%`}</Text>
              </Flex>
              <Flex justify="space-between">
                <Text>Net Profit Margin</Text>
                <Text>{`${profitData[profitData.length - 1].netIncomeR}%`}</Text>
              </Flex>
            </Flex>
            <Flex w="30%" justify="space-between" p="2%" direction="column">
              <Flex justify="center">
                <Text color="teal.300">Return Metrics</Text>
              </Flex>
              <Flex justify="space-between">
                <Text>ROE</Text>
                <Text>{`${profitData[profitData.length - 1].roe}%`}</Text>
              </Flex>
              <Flex justify="space-between">
                <Text>ROIC</Text>
                <Text>{`${profitData[profitData.length - 1].roic}%`}</Text>
              </Flex>
              <Flex justify="space-between">
                <Text>ROA</Text>
                <Text>{`${profitData[profitData.length - 1].roa}%`}</Text>
              </Flex>
            </Flex>
            <Flex w="30%" justify="space-between" p="2%" direction="column">
              <Flex justify="center">
                <Text color="teal.300">DuPont Analysis</Text>
              </Flex>
              <Flex justify="space-between">
                <Text>Net Profit Margin</Text>
                <Text>{`${profitData[profitData.length - 1].netIncomeR}%`}</Text>
              </Flex>
              <Flex justify="space-between">
                <Text>Asset Turnover</Text>
                <Text>{`${profitData[profitData.length - 1].totalAssetTurnover}%`}</Text>
              </Flex>
              <Flex justify="space-between">
                <Text>Equity Multiplier</Text>
                <Text>{`x${profitData[profitData.length - 1].equityMultiplier}`}</Text>
              </Flex>
            </Flex>
          </Flex>
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
            <Text>&nbsp;&nbsp;■ Profitability</Text>
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
                <Center><Text fontSize="xs" mt="2%">Comparison Equity with Net Income</Text></Center>
                <ComposedRechart data={profitData} color={colorPallet.profit} keyword="profit"/>
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
                <Text fontSize="xs" mt="2%">ROE & ROIC & ROA</Text>
                <LineRechart data={profitData} title={["roe", "roic", "roa"]} color={[colorPallet.profit.pink, colorPallet.profit.orange, colorPallet.profit.green]}/>
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
                <Text fontSize="xs" mt="2%">Net Profit Margin</Text>
                <LineRechart data={profitData} title={["netIncomeR"]} color={[colorPallet.profit.pink]}/>
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
                <Text fontSize="xs" mt="2%">Asset Turnover</Text>
                <LineRechart data={profitData} title={["totalAssetTurnover"]} color={[colorPallet.profit.orange]}/>
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
                <Text fontSize="xs" mt="2%">Equity Multiplier</Text>
                <BarRechart data={profitData} title={["equityMultiplier"]} color={[colorPallet.profit.green]}/>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Layout>
  )
}