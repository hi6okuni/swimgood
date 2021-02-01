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
      fetch(`https://financialmodelingprep.com/api/v3/balance-sheet-statement/${symbol}?limit=10&apikey=${apikey}`).then(response => response.json()),
      fetch(`https://financialmodelingprep.com/api/v3/historical-price-full/${symbol}?from=${fiveYearsAgoForApi}&to=${yesterdayForApi}&apikey=${apikey}`).then(response => response.json()),
      fetch(`https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=${apikey}`).then(response => response.json()),
      fetch(`https://financialmodelingprep.com/api/v3/income-statement/${symbol}?limit=10&apikey=${apikey}`).then(response => response.json()),
    ]);
    
    const bs = res1.map((bsInfo) => ({
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
    }));

    const historicalPrice = res2.historical.map((dailyPrice) => ({
      price: dailyPrice.close,
      date: dailyPrice.date.split('-'),
      volume: dailyPrice.volume,
    }));

    const pl = res4.map((each) => ({
      revenue: each.revenue /1000000,
      date: each.date.split('-'),
      costOfRevenue: each.costOfRevenue /1000000,
    }));

    const basicInfo = res3.map((Info) => ({
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
                 <Center><Text fontSize="xs" mt="2%">B/S Overview</Text></Center>
                <ComposedRechart data={bsData} keyword={bsDebitKeyword} color={colorPallet.bs}/>
              </Flex>
            </Flex>
            <Flex 
              h={["75%","75%", "100%"]} 
              w={["100%","100%", "59%"]}
              wrap="wrap"
              justify="space-around"
              direction="column"
            >
              <Flex
                direction="column"
                h={["22%", "44%","47%"]} 
                w={["100%", "47%","47%"]} 
                borderRadius="2xl"
                boxShadow="xl"
                my="1"
                align="center"
                bg="#ffffff"
                color="#000000"
              >
                <Text fontSize="xs" mt="2%">Cash & Cash Equivalents </Text>
                { isPercent === true ? 
                  <LineRechart  data={bsData} title={["cashAndCashEquivalentsR"]} color={[colorPallet.bs.blue]}/> 
                  : 
                  <BarRechart  data={bsData} title={["cashAndCashEquivalents"]} color={[colorPallet.bs.blue]}/>
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
                align="center"
              >
                <Text fontSize="xs" mt="2%">Account Receivables</Text>
                { isPercent === true ? 
                  <LineRechart  data={bsData} title={["netReceivablesR"]} color={[colorPallet.bs.dark_green]}/> 
                  : 
                  <BarRechart  data={bsData} title={["netReceivables"]} color={[colorPallet.bs.dark_green]}/>
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
                align="center"
              >
                 <Text fontSize="xs" mt="2%">Inventory</Text>
                { isPercent === true ? 
                  <LineRechart  data={bsData} title={["inventoryR"]} color={[colorPallet.bs.light_green]}/> 
                  : 
                  <BarRechart  data={bsData} title={["inventory"]} color={[colorPallet.bs.light_green]}/>
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
                align="center"
              >
                <Text fontSize="xs" mt="2%">PP&E</Text>
                { isPercent === true ? 
                  <LineRechart  data={bsData} title={["propertyPlantEquipmentNetR"]} color={[colorPallet.bs.light_red]}/> 
                  : 
                  <BarRechart  data={bsData} title={["propertyPlantEquipmentNet"]} color={[colorPallet.bs.light_red]}/>
                }
              </Flex>
            </Flex>
          </Flex>
        </Flex>

        {/* Cash Conversion Cycle */}
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
            <Text>&nbsp;&nbsp;■ Cash Conversion Cycle</Text>
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
                <Center><Text fontSize="xs" mt="2%">CCC</Text></Center>
                <VerticalBarRechart data={cccData} color={[colorPallet.bs.green, colorPallet.bs.purple, colorPallet.bs.pink, colorPallet.bs.blue]}/>
              </Flex>
            </Flex>
            <Flex 
              h={["75%","75%", "100%"]} 
              w={["100%","100%", "59%"]}
              wrap="wrap"
              justify="space-around"
              direction="column"
            >
              <Flex
                direction="column"
                h={["22%", "44%","47%"]} 
                w={["100%", "47%","47%"]} 
                borderRadius="2xl"
                boxShadow="xl"
                my="1"
                align="center"
                bg="#ffffff"
                color="#000000"
              >
                <Text fontSize="xs" mt="2%">DIO </Text>
                <BarRechart data={cccData} title={["dio"]} color={[colorPallet.bs.green]}/>
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
                align="center"
              >
                <Text fontSize="xs" mt="2%">DSO</Text>
                <BarRechart data={cccData} title={["dso"]} color={[colorPallet.bs.green]}/>
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
                align="center"
              >
                <Text fontSize="xs" mt="2%">DPO </Text>
                <BarRechart data={cccData} title={["dpo"]} color={[colorPallet.bs.green]}/>
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
                align="center"
              >
                <Text fontSize="xs" mt="2%">CCC</Text>
                <BarRechart data={cccData} title={["ccc"]} color={[colorPallet.bs.green]}/>
              </Flex>
            </Flex>
          </Flex>
        </Flex>

      </Flex>
    </Layout>
  )
}