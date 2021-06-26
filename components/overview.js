import {
  AreaChart, Area, XAxis, YAxis, Tooltip, Brush, ResponsiveContainer
} from 'recharts';
import { useAppContext } from '../lib/context/state'
import { Box, Flex, Text } from "@chakra-ui/react"

export default function Overview() {

  const {stockPrice, stockInfo } = useAppContext();

  const priceData = 
  stockPrice 
    ? stockPrice.map((each) => {
      return (
        {
          date: each.date[1] + "-" + each.date[0],
          price: each.price,
        }
      )
    }).reverse()
    : [];
  
  const stockInfoData = 
  stockInfo
    ? stockInfo.map((Info) => {
      return (
        {
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
          psr: Info.psr,
        }
      )
    })
    : [];


  return (
    stockInfoData.length
    ? (
      <Flex h={["360px", "50vh","30vh"]} w="100%" direction={{ base: "column", md: "row" }} >
        <Flex　flexBasis={["50%", "60%"]} direction="column" p="2%">
          <Flex direction="column">
            <Flex flexBasis="50%" align="baseline">
              <Text fontSize={["2xl", "2xl", "3xl"]} display="inline" fontWeight="bold">{stockInfoData[0].symbol}&nbsp;</Text>
              <Text color="#6263fb" fontSize={["sm", "md", "lg"]} display="inline" fontWeight="bold">{stockInfoData[0].name}&nbsp;|&nbsp;{stockInfoData[0].exchange}</Text>
            </Flex>
            <Flex>
              {stockInfoData[0].change > 0 ?
              <Box>
                <Text fontSize={["sm", "md", "lg"]} display="inline" fontWeight="bold">${stockInfoData[0].price}</Text>&nbsp;&nbsp;
                <Text color="#00e7c3" fontSize={["sm", "md", "lg"]} display="inline" fontWeight="bold">▲{stockInfoData[0].change}&nbsp;({stockInfoData[0].changesPercentage}%)</Text>
              </Box> :
              <Box>
                <Text fontSize={["sm", "md", "lg"]} display="inline" fontWeight="bold">${stockInfoData[0].price}</Text>&nbsp;&nbsp;
                <Text color="#f8485f" fontSize={["sm", "md", "lg"]} display="inline" fontWeight="bold">▼{Math.abs(stockInfoData[0].change)}&nbsp;({stockInfoData[0].changesPercentage}%)</Text>
              </Box> 
              }
            </Flex>
          </Flex>
          <Flex flexBasis="50%" fontSize="calc(4px + 2vmin)">
            <Flex flexBasis="50%" direction="column" mx="3%">
              <Flex justify="space-between">
                <Text>年初来高値</Text><Text>${stockInfoData[0].yearHigh}</Text>
              </Flex>
              <Flex justify="space-between">
                <Text>年初来底値</Text><Text>${stockInfoData[0].yearLow}</Text>
              </Flex>
              <Flex justify="space-between">
                <Text>時価総額</Text><Text>${Math.round((stockInfoData[0].marketCap/ 1000000000) * 100) / 100}B</Text>
              </Flex>
            </Flex>
            <Flex flexBasis="50%" direction="column" mx="3%">
              <Flex justify="space-between">
                <Text>1株当たり利益 EPS</Text><Text>${stockInfoData[0].eps}</Text>
              </Flex>
              <Flex justify="space-between">
                <Text>PER</Text><Text>×{stockInfoData[0].pe}</Text>
              </Flex>
              <Flex justify="space-between">
                <Text>PSR</Text><Text>×{stockInfoData[0].psr}</Text>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
        <Flex flexBasis={["250px", "40%"]}  p={["4%", "0"]} h={["180px", "100%"]}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={priceData}
              margin={{
                top: 0, right: 0, left: -20, bottom: 0,
              }}
            >
              <XAxis dataKey="date" tick={{ fontSize: 10}}/>
              <YAxis  tick={{ fontSize: 10}} tickFormatter={(value) => new Intl.NumberFormat('en').format(value)}/>
              <Tooltip formatter={(value) => new Intl.NumberFormat('en').format(value)} />
              <Area dataKey="price" dot={false} type="monotone" fillOpacity="0.8" stroke="#6263fb" fill="#6263fb"/>
              <Brush dataKey="date" height={15} stroke="#ffafbd"/>
            </AreaChart>
          </ResponsiveContainer>
        </Flex>
      </Flex>
    ) : null
  )
};