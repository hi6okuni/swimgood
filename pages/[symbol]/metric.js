import Head from 'next/head'
import { useEffect } from 'react'
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
      fetch(`https://financialmodelingprep.com/api/v3/income-statement/${symbol}?limit=10&apikey=${apikey}`),
      fetch(`https://financialmodelingprep.com/api/v3/balance-sheet-statement/${symbol}?apikey=${apikey}&limit=10`),
      fetch(`https://financialmodelingprep.com/api/v3/historical-price-full/${symbol}?from=${fiveYearsAgoForApi}&to=${yesterdayForApi}&apikey=${apikey}`),
      fetch(`https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=${apikey}`),
    ]).then( responses => {
      return Promise.all(responses.map((response) => { 
        return response.json();
      }));
    }).catch(function (error) {
      // if there's an error, log it
      console.log(error);
    });
    
    const pl = res1.length ? res1.map((each) => ({
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
    })) : null;

    const bs = res2.length ? res2.map((bsInfo) => ({
      date: bsInfo.date,
      totalLiabilities: bsInfo.totalLiabilities/1000000,
      totalStockholdersEquity: bsInfo.totalStockholdersEquity/1000000,
      investedCapital: (bsInfo.shortTermDebt + bsInfo.longTermDebt + bsInfo.totalStockholdersEquity)/1000000
    })) : null;

    const historicalPrice = res3.symbol ? res3.historical.map((dailyPrice) => ({
      price: dailyPrice.close,
      date: dailyPrice.date.split('-'),
      volume: dailyPrice.volume,
    })) : null;
  
    const basicInfo = res1.length && res4.length ? res4.map((Info) => ({
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
    })) : null;
  
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

  const {value, setStockPrice, setStockInfo} = useAppContext();

  useEffect(() => {
    setStockPrice(historicalPrice);
    setStockInfo(basicInfo);
  }, [basicInfo])

  if (pl == null) {
    return (
      <Layout>
      <Head>
        <title>{siteTitle}</title>
      </Head>
        <Flex direction="column" mx ="2%" my="8%">
          <Text fontWeight="bold" fontSize="calc(6px + 4vmin)">🙇‍ Sorry, No Data...</Text>
          <Text fontSize="calc(6px + 2vmin)" m="1%">・ 入力したシンボルは間違えていないですか？(ex. ”APPL")</Text>
          <Text fontSize="calc(6px + 2vmin)" m="1%">・ 個別銘柄以外のETF等は現状対応していません。</Text>
          <Text fontSize="calc(6px + 2vmin)" m="1%">・ 上場直後で決算データが揃っていない銘柄は表示されない場合があります。</Text>
        </Flex>
      </Layout>
    )
  } else {

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
          h={["250px", "30vh", "30vh"]}
          p="1.5%"
          mt="2%"
          justify="space-around"
          bg='#e4e9fb'
          borderRadius="lg"
        >
          <Flex
            h="92.5%"
            w="100%"
            p="2%"
            bg="#6369f7"
            direction={["column", "row", "row"]}
            wrap="nowrap"
            justify={["center", "space-between", "space-between"]}
            fontSize={["calc(5px + 2vmin)", "sm", "sm"]}
            borderRadius="lg"
            boxShadow="2xl"
            color="white"
          >
            <Flex w={["100%", "30%", "30%"]} justify={["flex-start", "space-between", "space-between"]} p="2%" direction={["row", "column", "column"]}>
              <Flex justify="center" align="center" mr={["5%",0,0]} w={["40%", "100%", "100%"]}>
                <Text fontWeight="bold">Margin Metrics</Text>
              </Flex>
              <Flex direction="column" w={["60%", "100%", "100%"]}>
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
            </Flex>
            <Flex w={["100%", "30%", "30%"]} justify={["flex-start", "space-between", "space-between"]} p="2%" direction={["row", "column", "column"]}>
              <Flex justify="center" align="center" mr={["5%",0,0]} w={["40%", "100%", "100%"]}>
                <Text fontWeight="bold" >Return Metrics</Text>
              </Flex>
              <Flex direction="column" w={["60%", "100%", "100%"]}>
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
            </Flex>
            <Flex w={["100%", "30%", "30%"]} justify={["flex-start", "space-between", "space-between"]} p="2%" direction={["row", "column", "column"]}>
              <Flex justify="center" align="center" mr={["5%",0,0]} w={["40%", "100%", "100%"]}>
                <Text fontWeight="bold" >DuPont Analysis</Text>
              </Flex>
              <Flex direction="column" w={["60%", "100%", "100%"]}>
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
        </Flex>

        {/* Profitability */}
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
            <Text>&nbsp;&nbsp;■ Profitability</Text>
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
                <Center pt="2%"><Text fontSize="12px">${value}&nbsp;Comparison Equity with Net Income</Text></Center>
                <ComposedRechart data={profitData} color={colorPallet.profit} keyword="profit"/>
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
                <Center pt="2%"><Text fontSize="12px">${value}&nbsp;ROE & ROIC & ROA</Text></Center>
                <LineRechart data={profitData} title={["roe", "roic", "roa"]} color={[colorPallet.profit.pink, colorPallet.profit.orange, colorPallet.profit.green]}/>
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
                <Center pt="2%"><Text fontSize="12px">${value}&nbsp;Net Profit Margin</Text></Center>
                <LineRechart data={profitData} title={["netIncomeR"]} color={[colorPallet.profit.pink]}/>
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
                <Center pt="2%"><Text fontSize="12px">${value}&nbsp;Asset Turnover</Text></Center>
                <LineRechart data={profitData} title={["totalAssetTurnover"]} color={[colorPallet.profit.orange]}/>
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
                <Center pt="2%"><Text fontSize="12px">${value}&nbsp;Equity Multiplier</Text></Center>
                <BarRechart data={profitData} title={["equityMultiplier"]} color={[colorPallet.profit.green]}/>
                <Text fontSize="calc(2px + 1vmin)" align="right" pr="5%" pb="3%"color="gray.400">swimgood.io</Text>
              </Flex>
            </Flex>
          </Flex>
        </Flex>

      </Flex>
    </Layout>
  )
  }
}