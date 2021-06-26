import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useAppContext } from '../../lib/context/state'
import colorPallet from '../../lib/color-pallet'
import Layout, { siteTitle } from '../../components/layout'
import BarRechart from '../../components/bar_rechart'
import LineRechart from '../../components/line_rechart'
import AdsCard from '../../components/adscard'
import Highlight from '../../components/highlight'
import ComposedRechart from '../../components/composed_rechart'
import { 
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
      fetch(`https://financialmodelingprep.com/api/v3/cash-flow-statement/${symbol}?limit=10&apikey=${apikey}`),
      fetch(`https://financialmodelingprep.com/api/v3/income-statement/${symbol}?limit=10&apikey=${apikey}`),
      fetch(`https://financialmodelingprep.com/api/v3/historical-price-full/${symbol}?from=${fiveYearsAgoForApi}&to=${yesterdayForApi}&apikey=${apikey}`),
      fetch(`https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=${apikey}`),
      fetch(`https://financialmodelingprep.com/api/v3/cash-flow-statement/${symbol}?period=quarter&limit=10&apikey=${apikey}`),
      fetch(`https://financialmodelingprep.com/api/v3/income-statement/${symbol}?period=quarter&limit=10&apikey=${apikey}`),
    ]).then( responses => {
      return Promise.all(responses.map((response) => { 
        return response.json();
      }));
    }).catch(function (error) {
      // if there's an error, log it
      console.log(error);
    });
  
    const cfs = res1.length ? res1.map((cfsInfo) => ({
      date: cfsInfo.date.split('-'),
      operatingCashFlow: Math.round((cfsInfo.operatingCashFlow/1000000) * 10) / 10,
      capitalExpenditure: Math.abs(cfsInfo.capitalExpenditure/1000000),
      freeCashFlow: Math.round((cfsInfo.freeCashFlow/1000000) * 10) / 10,
      acquisitionsNet: - Math.round((cfsInfo.acquisitionsNet/1000000) * 10) / 10,
      debtRepayment: - Math.round((cfsInfo.debtRepayment/1000000) * 10) / 10,
      commonStockRepurchased: - Math.round((cfsInfo.commonStockRepurchased/1000000) * 10) / 10,
      dividendsPaid: - Math.round((cfsInfo.dividendsPaid/1000000) * 10) / 10,
    })) : null;
  
    const pl = res2.length ? res2.map((plInfo) => ({
      revenue: plInfo.revenue/1000000,
      netIncome: plInfo.netIncome/1000000,
      eps: plInfo.eps,
    })) : null;

    const historicalPrice = res3.symbol ? res3.historical.map((dailyPrice) => ({
      price: dailyPrice.close,
      date: dailyPrice.date.split('-'),
      volume: dailyPrice.volume,
    })) : null;
  
    const basicInfo = res2.length && res4.length ? res4.map((Info) => ({
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

    const cfsQ = res5.length ? res5.map((cfsInfo) => ({
      date: cfsInfo.date.split('-'),
      operatingCashFlow: Math.round((cfsInfo.operatingCashFlow/1000000) * 10) / 10,
      capitalExpenditure: Math.abs(cfsInfo.capitalExpenditure/1000000),
      freeCashFlow: Math.round((cfsInfo.freeCashFlow/1000000) * 10) / 10,
      acquisitionsNet: - Math.round((cfsInfo.acquisitionsNet/1000000) * 10) / 10,
      debtRepayment: - Math.round((cfsInfo.debtRepayment/1000000) * 10) / 10,
      commonStockRepurchased: - Math.round((cfsInfo.commonStockRepurchased/1000000) * 10) / 10,
      dividendsPaid: - Math.round((cfsInfo.dividendsPaid/1000000) * 10) / 10,
    })) : null;

    const plQ = res6.length ? res6.map((plInfo) => ({
      revenue: plInfo.revenue/1000000,
      netIncome: plInfo.netIncome/1000000,
      eps: plInfo.eps,
    })) : null;
  
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

  if (cfs == null) {
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

  const cfsData = 
  (cfs.length && cfsQ.length && cfs.length == pl.length && isAnnual === true)
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

    const highlightData = cfsData ? {
      symbol: value,
      period: cfsData[cfsData.length - 1].date,
      data: [
        {
          title: "営業キャッシュフロー",
          value: cfsData[cfsData.length - 1].operatingCashFlow.toLocaleString(),
          unit_forth: "$",
          unit_back: ""
        },
        {
          title: "フリーキャッシュフロー",
          value: cfsData[cfsData.length - 1].freeCashFlow.toLocaleString(),
          unit_forth: "$",
          unit_back: ""
        },
        {
          title: "自社株買い",
          value: cfsData[cfsData.length - 1].commonStockRepurchased.toLocaleString(),
          unit_forth: "$",
          unit_back: ""
        },
        {
          title: "支払配当金",
          value: cfsData[cfsData.length - 1].dividendsPaid.toLocaleString(),
          unit_forth: "$",
          unit_back: ""
        },
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

        <Flex direction={["column","column","row"]} align="center">
          <Flex fontSize={["xs", "sm"]} direction="row" my="1%" w="70%">
            <Switch size="md" colorScheme="pink"  onChange={() => setIsAnnual(!isAnnual)}/>
            <Text px="2%">年間 ⇄ 四半期</Text>
          </Flex>
          <Text fontSize="10px">In Millions of USD except per share items</Text>
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
            <Text>&nbsp;&nbsp;■ 資本配分</Text>
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
                <Center pt="2%"><Text fontSize="12px">${value}&nbsp;キャッシュの使い道</Text></Center>
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
                <Center pt="2%"><Text fontSize="12px">${value}&nbsp;マージン</Text></Center>
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
                <Center pt="2%"><Text fontSize="12px">${value}&nbsp;営業キャッシュフロー</Text></Center>
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
                <Center pt="2%"><Text fontSize="12px">${value}&nbsp;株主還元</Text></Center>
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
                <Center pt="2%"><Text fontSize="12px">${value}&nbsp;借入金返済</Text></Center>
                <BarRechart data={cfsData} title={["debtRepayment"]} color={[colorPallet.cfs.pink1]}/>
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
}