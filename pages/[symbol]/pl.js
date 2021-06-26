import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useAppContext } from '../../lib/context/state'
import Layout, { siteTitle } from '../../components/layout'
import AdsCard from '../../components/adscard'
import AreaRechart from '../../components/area_rechart'
import BarRechart from '../../components/bar_rechart'
import LineRechart from '../../components/line_rechart'
import Highlight from '../../components/highlight'
import { 
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
  // const [res1, res2, res3, res4, res5] = await Promise.all([
  //   fetch(`https://financialmodelingprep.com/api/v3/income-statement/${symbol}?limit=10&apikey=${apikey}`),
  //   fetch(`https://financialmodelingprep.com/api/v3/key-metrics/${symbol}?limit=10&apikey=${apikey}`),
  //   fetch(`https://financialmodelingprep.com/api/v3/historical-price-full/${symbol}?from=${fiveYearsAgoForApi}&to=${yesterdayForApi}&apikey=${apikey}`),
  //   fetch(`https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=${apikey}`),
  //   fetch(`https://financialmodelingprep.com/api/v3/income-statement/${symbol}?period=quarter&limit=10&apikey=${apikey}`),
  // ]).then( responses => {
  //   return Promise.all(responses.map((response) => { 
  //     return response.json();
  //   }));
  // }).catch(function (error) {
  //   // if there's an error, log it
  //   console.log(error);
  // });

  const [res1, res2, res3, res4, res5, res6] = await Promise.all([
    fetch(`https://financialmodelingprep.com/api/v3/income-statement/${symbol}?limit=10&apikey=${apikey}`).then(response => response.json()),
    fetch(`https://financialmodelingprep.com/api/v3/key-metrics/${symbol}?limit=10&apikey=${apikey}`).then(response => response.json()),
    fetch(`https://financialmodelingprep.com/api/v3/historical-price-full/${symbol}?from=${fiveYearsAgoForApi}&to=${yesterdayForApi}&apikey=${apikey}`).then(response => response.json()),
    fetch(`https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=${apikey}`).then(response => response.json()),
    fetch(`https://financialmodelingprep.com/api/v3/income-statement/${symbol}?period=quarter&limit=10&apikey=${apikey}`).then(response => response.json()),
    fetch(`https://financialmodelingprep.com/api/v3/key-metrics/${symbol}?period=quarter&limit=10&apikey=${apikey}`).then(response => response.json()),
  ]);
  
    const plData = res1.length ? res1.map((each) => ({
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
      ebitda: each.ebitda,
      ebitdaR: (each.netIncome + each.incomeTaxExpense + each.interestExpense + each.depreciationAndAmortization)*100 / each.revenue,
      annualReport: each.finalLink,
    })) : null ;
  
    const keyMetrics = res2.length ? res2.map((keyMetric) => ({
      date: keyMetric.date.split('-'),
      operatingCashFlowPerShare: Math.round(keyMetric.operatingCashFlowPerShare * 100) / 100,
      freeCashFlowPerShare: Math.round(keyMetric.freeCashFlowPerShare * 100) / 100,
    })): [] ;
  
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
      psr: Math.round((Info.marketCap / plData[0].revenue) * 100) / 100
    })) : null;
  
    const plDataQ = res5.length ? res5.map((each) => ({
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
      ebitda: each.ebitda,
      ebitdaR: (each.netIncome + each.incomeTaxExpense + each.interestExpense + each.depreciationAndAmortization)*100 / each.revenue,
      quarterlyReport: each.finalLink
    })) : null ;

    const keyMetricsQ = res6.length ? res6.map((keyMetric) => ({
      date: keyMetric.date.split('-'),
      operatingCashFlowPerShare: Math.round(keyMetric.operatingCashFlowPerShare * 100) / 100,
      freeCashFlowPerShare: Math.round(keyMetric.freeCashFlowPerShare * 100) / 100,
    })): [] ;

  
    // Pass data to the page via props
    return { 
      props: { 
        plData,
        keyMetrics,
        historicalPrice,
        basicInfo,
        plDataQ,
        keyMetricsQ
      } 
    }
}


export default function IncomeStatement ({ plData, keyMetrics, basicInfo, historicalPrice, plDataQ, keyMetricsQ }) {

  const {value, setStockPrice, setStockInfo} = useAppContext();
  const [isPercent, setIsPercent] = useState(false);
  const [isAnnual, setIsAnnual] = useState(true);

  useEffect(() => {
    setStockPrice(historicalPrice);
    setStockInfo(basicInfo);
  }, [basicInfo]);


  if (plDataQ == null || keyMetrics == null ) {
    return (
      <Layout>
      <Head>
        <title>{siteTitle}</title>
      </Head>
        <Flex direction="column" mx ="2%" my="8%">
          <Text fontWeight="bold" fontSize="calc(6px + 4vmin)">🙇‍ Sorry, No Data...</Text>
          <Text fontSize="calc(6px + 2vmin)" m="1%">・ 入力したティッカーに間違いは無いですか？(ex. ”APPL")</Text>
          <Text fontSize="calc(6px + 2vmin)" m="1%">・ 個別銘柄以外のETF等は現状対応していません。</Text>
          <Text fontSize="calc(6px + 2vmin)" m="1%">・ 上場直後で決算データが揃っていない銘柄は表示されない場合があります。</Text>
        </Flex>
      </Layout>
    )
  } else {

  const secData =
  plData.length && plData[plData.length - 1].annualReport !== "" ?
  plData.slice(0,5).map((each) => {
    return (
      {
        data: each.date[0],
        annualReport: each.annualReport,
      }
    )
  }) : [] ;

  const secDataQ =
  plDataQ.length && plDataQ[plDataQ.length - 1].quarterlyReport !== "" ?
  plDataQ.slice(0,5).map((each) => {
    return (
      {
        data: each.date[1] + "-" + each.date[0],
        quarterlyReport: each.quarterlyReport,
      }
    )
  }) : [] ;

  const profitData = 
  (plData.length && plDataQ.length && keyMetrics.length == plData.length && isAnnual === true)
  ? plData.map((each, index) => {
      return(
        {
          date: each.date[0],
          売上高: Math.round((each.revenue/1000000) * 10) / 10,
          粗利益: Math.round((each.grossProfit/1000000) * 10) / 10,
          粗利益率: Math.round(each.grossProfitR * 10) / 10,
          営業利益: Math.round((each.operatingIncome/1000000) * 10) / 10,
          営業利益率: Math.round(each.operatingIncomeR * 10) / 10,
          原価: Math.round((each.costOfRevenue/1000000) * 10) / 10,
          原価率: Math.round(each.costOfRevenueR * 10) / 10,
          営業費用: each.operatingExpense/1000000,
          営業費用率: Math.round(each.operatingExpenseR * 10) / 10,
          非営業費用: each.nonOperatingExpense/1000000,
          非営業費用率: Math.round(each.nonOperatingExpenseR * 10) / 10,
          純利益: Math.round((each.netIncome/1000000) * 10) / 10,
          純利益率: Math.round(each.netIncomeR * 10) / 10,
          研究開発費: each.rd/1000000,
          販管費: each.sga/1000000,
          税金費用: each.incomeTaxExpense/1000000,
          支払利息: each.interestExpense/1000000,
          減価償却: each.da/1000000,
          EBITDA: each.ebitda/1000000,
          EBITDA利益率: each.ebitdaR,
          発行済み株式数: each.weightedAverageShsOutDil/1000000,
          EPS: Math.round((each.eps) * 100) / 100,
          "1株当たり売上高": Math.round((each.revenuePerShare) * 100) / 100,
          "1株当たり営業キャッシュフロー": Math.round((keyMetrics[index].operatingCashFlowPerShare) * 100) / 100,
          "1株当たりフリーキャッシュフロー": Math.round((keyMetrics[index].freeCashFlowPerShare) * 100) / 100,
        }
      )
    }).reverse(): 
    plDataQ.map((each, index) => {
      if (keyMetricsQ.length == plDataQ.length) {
      return(
        {
          date: each.date[1] + "-" + each.date[0],
          売上高: Math.round((each.revenue/1000000) * 10) / 10,
          粗利益: Math.round((each.grossProfit/1000000) * 10) / 10,
          粗利益率: Math.round(each.grossProfitR * 10) / 10,
          営業利益: Math.round((each.operatingIncome/1000000) * 10) / 10,
          営業利益率: Math.round(each.operatingIncomeR * 10) / 10,
          原価: Math.round((each.costOfRevenue/1000000) * 10) / 10,
          原価率: Math.round(each.costOfRevenueR * 10) / 10,
          営業費用: each.operatingExpense/1000000,
          営業費用率: Math.round(each.operatingExpenseR * 10) / 10,
          非営業費用: each.nonOperatingExpense/1000000,
          非営業費用率: Math.round(each.nonOperatingExpenseR * 10) / 10,
          純利益: Math.round((each.netIncome/1000000) * 10) / 10,
          純利益率: Math.round(each.netIncomeR * 10) / 10,
          研究開発費: each.rd/1000000,
          販管費: each.sga/1000000,
          税金費用: each.incomeTaxExpense/1000000,
          支払利息: each.interestExpense/1000000,
          減価償却: each.da/1000000,
          EBITDA: each.ebitda/1000000,
          EBITDA利益率: each.ebitdaR,
          発行済み株式数: each.weightedAverageShsOutDil/1000000,
          EPS: Math.round((each.eps) * 100) / 100,
          "1株当たり売上高": Math.round((each.revenuePerShare) * 100) / 100,
          "1株当たり営業キャッシュフロー": Math.round((keyMetricsQ[index].operatingCashFlowPerShare) * 100) / 100,
          "1株当たりフリーキャッシュフロー": Math.round((keyMetricsQ[index].freeCashFlowPerShare) * 100) / 100,
        }
      ) } else {
        return(
          {
            date: each.date[1] + "-" + each.date[0],
            売上高: Math.round((each.revenue/1000000) * 10) / 10,
            粗利益: Math.round((each.grossProfit/1000000) * 10) / 10,
            粗利益率: Math.round(each.grossProfitR * 10) / 10,
            営業利益: Math.round((each.operatingIncome/1000000) * 10) / 10,
            営業利益率: Math.round(each.operatingIncomeR * 10) / 10,
            原価: Math.round((each.costOfRevenue/1000000) * 10) / 10,
            原価率: Math.round(each.costOfRevenueR * 10) / 10,
            営業費用: each.operatingExpense/1000000,
            営業費用率: Math.round(each.operatingExpenseR * 10) / 10,
            非営業費用: each.nonOperatingExpense/1000000,
            非営業費用率: Math.round(each.nonOperatingExpenseR * 10) / 10,
            純利益: Math.round((each.netIncome/1000000) * 10) / 10,
            純利益率: Math.round(each.netIncomeR * 10) / 10,
            研究開発費: each.rd/1000000,
            販管費: each.sga/1000000,
            税金費用: each.incomeTaxExpense/1000000,
            支払利息: each.interestExpense/1000000,
            減価償却: each.da/1000000,
            EBITDA: each.ebitda/1000000,
            EBITDA利益率: each.ebitdaR,
            発行済み株式数: each.weightedAverageShsOutDil/1000000,
            EPS: Math.round((each.eps) * 100) / 100,
            "1株当たり売上高": Math.round((each.revenuePerShare) * 100) / 100,
          }
        )
      }
    }).reverse();

  const chartColor = {
      rev: [
              "hsla(222, 80%, 30%, 100%)",
              "hsla(222, 80%, 40%, 100%)",
              "hsla(222, 80%, 55%, 100%)",
              "hsla(222, 80%, 70%, 100%)"
            ],
      expense: ["#E53E3E", "#FC8181"],
      ebitda: [
                "hsla(160, 70%, 30%, 100%)",
                "hsla(160, 70%, 40%, 100%)",
                "hsla(160, 70%, 55%, 100%)",
                "hsla(160, 70%, 70%, 100%)",
              ],

      perShare: [
                  "hsl(270, 70%, 30%, 100%)", 
                  "hsl(270, 70%, 40%, 100%)", 
                  "hsl(270, 70%, 55%, 100%)", 
                  "hsl(270, 70%, 70%, 100%)", 
                ]
  }

  const profitStructureKeyword = 
  (isPercent === true) 
  ? "profitR" : "profit";

  const highlightData_sales = profitData ? {
    symbol: value,
    period: profitData[profitData.length - 1].date,
    data: [
      {
        title: "売上高",
        value: profitData[profitData.length - 1].revenue.toLocaleString(),
        unit_forth: "$",
        unit_back: ""
      },
      {
        title: "粗利益",
        value: profitData[profitData.length - 1].grossProfit.toLocaleString(),
        unit_forth: "$",
        unit_back: ""
      },
      {
        title: "営業利益",
        value: profitData[profitData.length - 1].operatingIncome.toLocaleString(),
        unit_forth: "$",
        unit_back: ""
      },
      {
        title: "純利益",
        value: profitData[profitData.length - 1].netIncome.toLocaleString(),
        unit_forth: "$",
        unit_back: ""
      },
    ]
  } : null;

  const highlightData_ebitda = profitData ? {
    symbol: value,
    period: profitData[profitData.length - 1].date,
    data: [
      {
        title: "EBITDA",
        value: profitData[profitData.length - 1].ebitda.toLocaleString(),
        unit_forth: "$",
        unit_back: ""
      },
      {
        title: "EBITDA利益率",
        value: profitData[profitData.length - 1].ebitdaR.toLocaleString(),
        unit_forth: "",
        unit_back: "%"
      },
      {
        title: "減価償却",
        value: profitData[profitData.length - 1].da.toLocaleString(),
        unit_forth: "$",
        unit_back: ""
      },
    ]
  } : null;


  const operatingCashFlowPerShare_highlight = 
  profitData[profitData.length - 1].operatingCashFlowPerShare  ?
  profitData[profitData.length - 1].operatingCashFlowPerShare.toLocaleString() 
  : "";

  const freeCashFlowPerShare_highlight = 
  profitData[profitData.length - 1].freeCashFlowPerShare  ?
  profitData[profitData.length - 1].freeCashFlowPerShare.toLocaleString() 
  : "";

  const highlightData_pershare = profitData[profitData.length - 1].revenuePerShare ? {
    symbol: value,
    period: profitData[profitData.length - 1].date,
    data: [
      {
        title: "1株当たり純利益",
        value: profitData[profitData.length - 1].eps.toLocaleString(),
        unit_forth: "$",
        unit_back: ""
      },
      {
        title: "1株当たり売上高",
        value: profitData[profitData.length - 1].revenuePerShare.toLocaleString(),
        unit_forth: "$",
        unit_back: ""
      },
      {
        title: "1株当たり営業キャッシュフロー",
        value: operatingCashFlowPerShare_highlight,
        unit_forth: "$",
        unit_back: ""
      },
      {
        title: "1株当たりフリーキャッシュフロー",
        value: freeCashFlowPerShare_highlight,
        unit_forth: "$",
        unit_back: ""
      },
    ]
  } : 
  {
    symbol: value,
    period: profitData[profitData.length - 1].date,
  };

  return (
    <Layout>
      <Head>
        <title>{siteTitle}</title>
      </Head>

      <Flex
        direction="column"
        my="3%"
      >

        <Flex
          direction="column"
          w="100%"
          h={["150px", "180px", "20vh"]} 
          p={["4%","4%","2%"]} 
          my="2%"
          pt="1%"
          bg="#e4e9fb"
          color="#3f3356"
          justify="space-around"
          borderRadius="lg"
          z-index="5"
        >
          <Flex>
            <Text align="center" w="15%">10-K</Text>
            <Flex w="85%" wrap="wrap" >
              {secData.map((e) => {
                return (
                  <Flex 
                    mx="1.5%" 
                    my="0.5%"px="2%" 
                    align="center" 
                    fontSize="14px" 
                    color="white" 
                    bg="#6369f7" 
                    borderRadius="2xl"
                    _hover={{ bg: "linear-gradient(to right top , #ffafbd,  #ffc3a0 )" }}
                  >
                    <a href={e.annualReport} target='_blank' >{e.data}</a>
                  </Flex>
                )
              })}
            </Flex>
          </Flex>
          <Flex>
            <Text align="center" w="15%">10-Q</Text>
            <Flex w="85%" wrap="wrap" >
              {secDataQ.map((e) => {
                return (
                  <Flex 
                    mx="1.5%" 
                    my="0.5%" 
                    px="2%" 
                    align="center" 
                    fontSize="14px" 
                    color="white" 
                    bg="#6369f7" 
                    borderRadius="2xl"
                    _hover={{ bg: "linear-gradient(to right top , #ffafbd,  #ffc3a0 )" }}
                  >
                    <a href={e.quarterlyReport} target='_blank' >{e.data}</a>
                  </Flex>
                )
              })}
            </Flex>
          </Flex>
        </Flex>

        <section>
          <AdsCard/>
        </section>

        <Flex direction="column" w="100%" mt="3%">
          <Flex fontSize={["xs", "sm"]} mx="4%" my="0.5%" w="80%" >
            <Switch size="md" colorScheme="pink"  onChange={() => setIsAnnual(!isAnnual)}/>
            <Text px="2%">年間 ⇄ 四半期</Text>
          </Flex>
          <Flex fontSize={["xs", "sm"]} mx="4%" my="0.5%" w="80%" >
            <Switch size="md" colorScheme="green" onChange={() => setIsPercent(!isPercent)}/>
            <Text px="2%">$ ⇄ %</Text>
          </Flex>
          <Text fontSize="10px" align="right">In Millions of USD except per share items</Text>
        </Flex>

        {profitData.length < 3 ? 
        <Text m="2%" color="#fb8fb9" fontSize="sm">⚠️十分なデータが揃っていない可能性があります⚠️</Text>
          : null }
      

        {/* Revenue and Income */}
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
            <Text>&nbsp;&nbsp;■ 売上高&利益</Text>
          </Flex>
          <Flex
            h={["96%","96%","95%"]} 
            w="100%"
            justify="space-between"
            fontSize="xs"
            direction={["column","column", "row"]}
          >
            <Flex h={["40%","40%", "100%"]} w={["100%","100%", "39%"]}  direction="column" justify="space-between">
              <Highlight highlightData={highlightData_sales}/>
              <Flex
                direction="column"
                h="69%"
                w="100%"
                borderRadius="2xl"
                boxShadow="xl"
                bg="#ffffff"
                color="#000000"
              >
                <Center pt="2%"><Text fontSize="12px">${value}&nbsp;収益構造</Text></Center>
                <AreaRechart data={profitData} keyword={profitStructureKeyword} color={chartColor.rev}/>
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
                <Center pt="2%"><Text fontSize="12px">${value}&nbsp;売上高</Text></Center>
                <BarRechart data={profitData} title={["売上高"]} color={[chartColor.rev[0]]}/>
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
                <Center pt="2%"><Text fontSize="12px">${value}&nbsp;粗利益</Text></Center>
                { isPercent === true ? 
                  <LineRechart data={profitData} title={["粗利益率"]} color={[chartColor.rev[1]]}/> 
                  : 
                  <BarRechart data={profitData} title={["粗利益"]} color={[chartColor.rev[1]]}/>
                }
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
                 <Center pt="2%"><Text fontSize="12px">${value}&nbsp;営業利益</Text></Center>
                { isPercent === true ? 
                  <LineRechart data={profitData} title={["営業利益率"]} color={[chartColor.rev[2]]}/> 
                  : 
                  <BarRechart data={profitData} title={["営業利益"]} color={[chartColor.rev[2]]}/>
                }
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
                <Center pt="2%"><Text fontSize="12px">${value}&nbsp;純利益</Text></Center>
                { isPercent === true ? 
                  <LineRechart data={profitData} title={["純利益率"]} color={[chartColor.rev[3]]}/> 
                  : 
                  <BarRechart data={profitData} title={["純利益"]} color={[chartColor.rev[3]]}/>
                }
                <Text fontSize="calc(2px + 1vmin)" align="right" pr="5%" pb="3%"color="gray.400">swimgood.io</Text>
              </Flex>
            </Flex>
          </Flex>
        </Flex>

        <section>
          <AdsCard/>
        </section>

        {/* Operating Expenses */}
        {/* <Flex
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
            <Text>&nbsp;&nbsp;■ Operating Expenses</Text>
          </Flex>
          <Flex
            h={["96%","96%","95%"]} 
            w="100%"
            justify="space-between"
            fontSize="xs"
            direction={["column","column", "row"]}
          >
            <Flex h={["40%","40%", "100%"]} w={["100%","100%", "39%"]}  direction="column" justify="space-between">
              <Highlight highlightData={highlightData_expense}/>
              <Flex
                direction="column"
                h="69%"
                w="100%"
                borderRadius="2xl"
                boxShadow="xl"
                bg="#ffffff"
                color="#000000"
              >
                <Center pt="2%"><Text fontSize="12px">${value}&nbsp;Operating Expenses Structure</Text></Center>
                <AreaRechart data={profitData} keyword="expense" color={chartColor.expense}/>
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
                <Center pt="2%"><Text fontSize="12px" ml="4%">${value}&nbsp;Operating Expenses / Revenue</Text></Center>
                <LineRechart data={profitData} title={["operatingExpenseR"]} color={[chartColor.expense[0]]}/>
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
                <Center pt="2%"><Text fontSize="12px">${value}&nbsp;R&D</Text></Center>
                <BarRechart data={profitData} title={["rd"]} color={[chartColor.expense[0]]}/>
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
                <Center pt="2%"><Text fontSize="12px">${value}&nbsp;SG&A</Text></Center>
                <BarRechart data={profitData} title={["sga"]} color={[chartColor.expense[1]]}/>
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
                <Center pt="2%"><Text fontSize="12px" ml="4%">${value}&nbsp;Depreciation and Amortization</Text></Center>
                <BarRechart data={profitData} title={["da"]} color={[chartColor.ebitda[0]]}/>
                <Text fontSize="calc(2px + 1vmin)" align="right" pr="5%" pb="3%"color="gray.400">swimgood.io</Text>
              </Flex>
            </Flex>
          </Flex>
        </Flex> */}

        {/* Ebitda */}
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
            <Text>&nbsp;&nbsp;■ Ebitda</Text>
          </Flex>
          <Flex
            h={["96%","96%","95%"]} 
            w="100%"
            justify="space-between"
            fontSize="xs"
            direction={["column","column", "row"]}
          >
            <Flex h={["40%","40%", "100%"]} w={["100%","100%", "39%"]}  direction="column" justify="space-between">
              <Highlight highlightData={highlightData_ebitda}/>
              <Flex
                direction="column"
                h="69%"
                w="100%"
                borderRadius="2xl"
                boxShadow="xl"
                bg="#ffffff"
                color="#000000"
              >
                <Center pt="2%"><Text fontSize="12px">${value}&nbsp;純利益からEBITDAまで</Text></Center>
                <AreaRechart data={profitData} keyword="ebitda" color={chartColor.ebitda}/>
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
                <Center pt="2%"><Text fontSize="12px">${value}&nbsp;EBITDAマージン</Text></Center>
                <LineRechart data={profitData} title={["EBITDA利益率"]} color={[chartColor.ebitda[0]]}/>
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
                <Center pt="2%"><Text fontSize="12px" ml="4%">${value}&nbsp;減価償却</Text></Center>
                <BarRechart data={profitData} title={["減価償却"]} color={[chartColor.ebitda[0]]}/>
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
                <Center pt="2%"><Text fontSize="12px">${value}&nbsp;支払利息</Text></Center>
                <BarRechart data={profitData} title={["支払利息"]} color={[chartColor.ebitda[1]]}/>
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
                <Center pt="2%"><Text fontSize="12px">${value}&nbsp;税金費用</Text></Center>
                <BarRechart data={profitData} title={["税金費用"]} color={[chartColor.ebitda[2]]}/>
                <Text fontSize="calc(2px + 1vmin)" align="right" pr="5%" pb="3%"color="gray.400">swimgood.io</Text>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
        
        {/* EPS & other Per Share items */}
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
            <Text>&nbsp;&nbsp;■ 1株当たりの指標</Text>
          </Flex>
          <Flex
            h={["96%","96%","95%"]} 
            w="100%"
            justify="space-between"
            fontSize="xs"
            direction={["column","column", "row"]}
          >
            <Flex h={["40%","40%", "100%"]} w={["100%","100%", "39%"]}  direction="column" justify="space-between">
              <Highlight highlightData={highlightData_pershare}/>
              <Flex
                direction="column"
                h="69%"
                w="100%"
                borderRadius="2xl"
                boxShadow="xl"
                bg="#ffffff"
                color="#000000"
              >
                <Center pt="2%"><Text fontSize="12px">${value}&nbsp;発行済株式数(希薄化後/加重平均)</Text></Center>
                <BarRechart data={profitData} title={["発行済み株式数"]} color={[chartColor.perShare[0]]}/>
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
                <Center pt="2%"><Text fontSize="12px">${value}&nbsp;1株当たり純利益 EPS</Text></Center>
                <BarRechart data={profitData} title={["1株当たり純利益"]} color={[chartColor.perShare[0]]}/>
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
                <Center pt="2%"><Text fontSize="12px">${value}&nbsp;1株当たり売上高</Text></Center>
                <BarRechart data={profitData} title={["1株当たり売上高"]} color={[chartColor.perShare[1]]}/>
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
                <Center pt="2%"><Text fontSize="12px">${value}&nbsp;1株当たり営業キャッシュフロー</Text></Center>
                <BarRechart data={profitData} title={["1株当たり営業キャッシュフロー"]} color={[chartColor.perShare[2]]}/>
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
                <Center pt="2%"><Text fontSize="12px">${value}&nbsp;1株当たりフリーキャッシュフロー</Text></Center>
                <BarRechart data={profitData} title={["1株当たりフリーキャッシュフロー"]} color={[chartColor.perShare[3]]}/>
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