import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useAppContext } from '../../lib/context/state'
import Layout, { siteTitle } from '../../components/layout'
import colorPallet from '../../lib/color-pallet'
import BarRechart from '../../components/bar_rechart'
import VerticalBarRechart from '../../components/vertical_bar_rechart'
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

    const [res1, res2, res3, res4] = await Promise.all([
      fetch(`https://financialmodelingprep.com/api/v3/balance-sheet-statement/${symbol}?limit=10&apikey=${apikey}`),
      fetch(`https://financialmodelingprep.com/api/v3/historical-price-full/${symbol}?from=${fiveYearsAgoForApi}&to=${yesterdayForApi}&apikey=${apikey}`),
      fetch(`https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=${apikey}`),
      fetch(`https://financialmodelingprep.com/api/v3/income-statement/${symbol}?limit=10&apikey=${apikey}`),
    ]).then( responses => {
      return Promise.all(responses.map((response) => { 
        return response.json();
      }));
    }).catch(function (error) {
      // if there's an error, log it
      console.log(error);
    });
    
    const bs = res1.length ? res1.map((bsInfo) => ({
      date: bsInfo.date.split('-'),
      cashAndCashEquivalents: bsInfo.cashAndCashEquivalents /1000000,
      inventory: bsInfo.inventory /1000000,
      netReceivables: bsInfo.netReceivables /1000000,
      otherCurrentAssets: (bsInfo.totalCurrentAssets - bsInfo.netReceivables - bsInfo.inventory - bsInfo.cashAndCashEquivalents) /1000000,
      totalCurrentAssets: bsInfo.totalCurrentAssets /1000000,
      propertyPlantEquipmentNet: bsInfo.propertyPlantEquipmentNet /1000000,
      otherNonCurrentAssets: (bsInfo.totalNonCurrentAssets - bsInfo.propertyPlantEquipmentNet) /1000000,
      totalNonCurrentAssets: bsInfo.totalNonCurrentAssets /1000000,
      totalAssets: bsInfo.totalAssets /1000000,
      accountPayables: bsInfo.accountPayables /1000000,
      totalCurrentLiabilities: bsInfo.totalCurrentLiabilities/1000000,
      deferredRevenue: bsInfo.deferredRevenue/1000000,
      deferredRevenueNonCurrent: bsInfo.deferredRevenueNonCurrent/1000000,
      totalNonCurrentLiabilities: bsInfo.totalNonCurrentLiabilities/1000000,
      retainedEarnings: bsInfo.retainedEarnings/1000000,
      totalStockholdersEquity: bsInfo.totalStockholdersEquity/1000000,
      finalLink: bsInfo.finalLink
    })) : null ;

    const historicalPrice = res2.symbol ? res2.historical.map((dailyPrice) => ({
      price: dailyPrice.close,
      date: dailyPrice.date.split('-'),
      volume: dailyPrice.volume,
    })) : null ;

    const pl = res4.length ? res4.map((each) => ({
      revenue: each.revenue /1000000,
      date: each.date.split('-'),
      costOfRevenue: each.costOfRevenue /1000000,
    })) : null;


    const basicInfo = res4.length && res3.length ? res3.map((Info) => ({
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
    })) :null
  
    return { 
      props: { 
        bs,
        historicalPrice,
        basicInfo,
        pl
      } 
    }
  }

export default function BalanceSheet ({ bs, historicalPrice, basicInfo, pl }) {

  const {setStockPrice, setStockInfo} = useAppContext();
  const [isPercent, setIsPercent] = useState(false);
  const [isAnnual, setIsAnnual] = useState(true);

  useEffect(() => {
    setStockPrice(historicalPrice);
    setStockInfo(basicInfo);
  }, [basicInfo])

  if (bs == null) {
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

  const bsData = 
  (bs.length) ? 
  bs.map((each) => {
    return (
      {
        date: each.date[0],
        cashAndCashEquivalents: each.cashAndCashEquivalents,
        cashAndCashEquivalentsR: each.cashAndCashEquivalents*100 / each.totalAssets,
        inventory: each.inventory,
        inventoryR: each.inventory*100 / each.totalAssets,
        netReceivables: each.netReceivables,
        netReceivablesR: each.netReceivables*100 / each.totalAssets,
        currentAssets: each.totalCurrentAssets,
        otherCurrentAssets: each.otherCurrentAssets,
        otherCurrentAssetsR: each.otherCurrentAssets*100 / each.totalAssets,
        propertyPlantEquipmentNet: each.propertyPlantEquipmentNet,
        propertyPlantEquipmentNetR: each.propertyPlantEquipmentNet*100 / each.totalAssets,
        otherNonCurrentAssets: each.otherNonCurrentAssets,
        otherNonCurrentAssetsR: each.otherNonCurrentAssets*100 / each.totalAssets,
        nonCurrentAssets: each.totalNonCurrentAssets,
        accountPayables: each.accountPayables,
        currentLiabilities: each.totalCurrentLiabilities,
        deferredRevenue: each.deferredRevenue,
        deferredRevenueNonCurrent: each.deferredRevenueNonCurrent,
        nonCurrentLiabilities: each.totalNonCurrentLiabilities,
        retainedEarnings: each.retainedEarnings,
        stockholdersEquity: each.totalStockholdersEquity,
        finalLink: each.finalLink
      }
    )
  }).reverse(): [];

  const cccData = 
  (bs.length && pl.length) ? 
  bs.reduce(((prev, current, index, arr) => {
    if (bs.length > index + 1)
    prev.push(
      { 
        date: current.date[0],
        dio: Math.round((((current.inventory + bs[index + 1].inventory)/2) / (pl[index + 1].costOfRevenue /365)) * 10) / 10,
        dso: Math.round((((current.netReceivables + bs[index + 1].netReceivables)/2) / (pl[index + 1].revenue /365)) * 10) / 10,
        dpo: Math.round((((current.accountPayables + bs[index + 1].accountPayables)/2) / (pl[index + 1].costOfRevenue /365)) * 10) / 10,
        ccc: (Math.round((((current.inventory + bs[index + 1].inventory)/2) / (pl[index + 1].costOfRevenue /365)) * 10) / 10) + (Math.round((((current.netReceivables + bs[index + 1].netReceivables)/2) / (pl[index + 1].revenue /365)) * 10) / 10) - (Math.round((((current.accountPayables + bs[index + 1].accountPayables)/2) / (pl[index + 1].costOfRevenue /365)) * 10) / 10),
      }
    );
    return prev;
  }),[]).reverse(): [];

  const bsDebitKeyword = 
  (isPercent === true) 
  ? "bsDebitR" : "bsDebit";


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
          <Center fontSize={["xs", "lg"]}  align="center" direction="row" m="2%">
            <Text>$&nbsp;</Text>
            <Switch size="md" onChange={() => setIsPercent(!isPercent)}/>
            <Text>&nbsp;%</Text>
          </Center>
          <Text fontSize="xs" m="2%" align="center">In Millions of USD except per share items</Text>
        </Flex>

        {/* Debit Side */}
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
            <Text>&nbsp;&nbsp;■ Debit Side</Text>
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
                <Center><Text fontSize="xs" mt="2%">B/S Overview</Text></Center>
                <ComposedRechart data={bsData} keyword={bsDebitKeyword} color={colorPallet.bs}/>
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
                <Center><Text fontSize="xs" mt="2%">Cash & Cash Equivalents </Text></Center>
                { isPercent === true ? 
                  <LineRechart  data={bsData} title={["cashAndCashEquivalentsR"]} color={[colorPallet.bs.debit1]}/> 
                  : 
                  <BarRechart  data={bsData} title={["cashAndCashEquivalents"]} color={[colorPallet.bs.debit1]}/>
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
                <Center><Text fontSize="xs" mt="2%">Account Receivables</Text></Center>
                { isPercent === true ? 
                  <LineRechart  data={bsData} title={["netReceivablesR"]} color={[colorPallet.bs.debit2]}/> 
                  : 
                  <BarRechart  data={bsData} title={["netReceivables"]} color={[colorPallet.bs.debit2]}/>
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
                <Center><Text fontSize="xs" mt="2%">Inventory</Text></Center>
                { isPercent === true ? 
                  <LineRechart  data={bsData} title={["inventoryR"]} color={[colorPallet.bs.debit3]}/> 
                  : 
                  <BarRechart  data={bsData} title={["inventory"]} color={[colorPallet.bs.debit3]}/>
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
                <Center><Text fontSize="xs" mt="2%">PP&E</Text></Center>
                { isPercent === true ? 
                  <LineRechart  data={bsData} title={["propertyPlantEquipmentNetR"]} color={[colorPallet.bs.debit5]}/> 
                  : 
                  <BarRechart  data={bsData} title={["propertyPlantEquipmentNet"]} color={[colorPallet.bs.debit5]}/>
                }
                <Text fontSize="calc(2px + 1vmin)" align="right" pr="5%" pb="3%"color="gray.400">swimgood.io</Text>
              </Flex>
            </Flex>
          </Flex>
        </Flex>


        {/* Credit Side */}
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
            <Text>&nbsp;&nbsp;■ Debit Side</Text>
          </Flex>
          <Flex
            h={["96%","96%","92.5%"]} 
            w="100%"
            justify="space-around"
            fontSize="xs"
            align="center"
            direction={["column","column", "row"]}
          >
            <Text align="center" fontSize="md">🏕Under Development</Text>
          </Flex>
        </Flex>

        {/* Cash Conversion Cycle */}
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
            <Text>&nbsp;&nbsp;■ Cash Conversion Cycle</Text>
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
                <Center><Text fontSize="xs" mt="2%"> Sales Cycle</Text></Center>
                <VerticalBarRechart data={cccData} color={[colorPallet.bs.pink, colorPallet.bs.orange, colorPallet.bs.purple, colorPallet.bs.green]}/>
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
                <Center><Text fontSize="xs" mt="2%">DIO/棚卸資産回転日数 </Text></Center>
                <BarRechart data={cccData} title={["dio"]} color={[colorPallet.bs.pink]}/>
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
                <Center><Text fontSize="xs" mt="2%">DSO/売上債権回転日数</Text></Center>
                <BarRechart data={cccData} title={["dso"]} color={[colorPallet.bs.orange]}/>
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
                <Center><Text fontSize="xs" mt="2%">DPO/支払債務回転日数</Text></Center>
                <BarRechart data={cccData} title={["dpo"]} color={[colorPallet.bs.purple]}/>
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
                <Center><Text fontSize="xs" mt="2%">CCC</Text></Center>
                <BarRechart data={cccData} title={["ccc"]} color={[colorPallet.bs.green]}/>
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