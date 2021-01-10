import {useState, useContext} from 'react'
import { useRouter } from 'next/router'
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Brush, ResponsiveContainer
} from 'recharts';
import { useAppContext } from '../lib/context/state'
import { Box, Heading, Flex, Center, Text } from "@chakra-ui/react"
import Link from 'next/link'
import Search from './search'

export default function Overview() {

  const {stockPrice, stockInfo } = useAppContext();

  const priceData = 
  stockPrice.length 
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
  stockInfo.length 
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
        }
      )
    })
    : [];


  return (
    stockInfoData.length
    ? (
      <Flex h="30vh" w="95%">
        <Flex　flexBasis="60%" direction="column" p="2%">
          <Flex direction="column" flexBasis="50%">
            <Flex flexBasis="50%" align="baseline">
              <Text fontSize="3xl" display="inline" fontWeight="bold">{stockInfoData[0].symbol}&nbsp;</Text>
              <Text color="teal.300" fontSize="lg" display="inline" fontWeight="bold">{stockInfoData[0].name}&nbsp;|&nbsp;{stockInfoData[0].exchange}</Text>
            </Flex>
            <Flex flexBasis="50%">
              {stockInfoData[0].change > 0 ?
              <Box>
                <Text fontSize="md" display="inline" fontWeight="bold">${stockInfoData[0].price}</Text>&nbsp;&nbsp;
                <Text color="#00e7c3" fontSize="md" display="inline" fontWeight="bold">▲{stockInfoData[0].change}&nbsp;({stockInfoData[0].changesPercentage}%)</Text>
              </Box> :
              <Box>
                <Text fontSize="md" display="inline" fontWeight="bold">${stockInfoData[0].price}</Text>&nbsp;&nbsp;
                <Text color="#f8485f" fontSize="md" display="inline" fontWeight="bold">▼{Math.abs(stockInfoData[0].change)}&nbsp;({stockInfoData[0].changesPercentage}%)</Text>
              </Box> 
              }
            </Flex>
          </Flex>
          <Flex flexBasis="50%">
            <Flex flexBasis="50%" direction="column" mx="3%">
              <Flex justify="space-between">
                <Text>year-high</Text><Text>${stockInfoData[0].yearHigh}</Text>
              </Flex>
              <Flex justify="space-between">
                <Text>year-low</Text><Text>${stockInfoData[0].yearLow}</Text>
              </Flex>
              <Flex justify="space-between">
                <Text>Market Cap</Text><Text>${Math.round((stockInfoData[0].marketCap/ 1000000000) * 100) / 100}B</Text>
              </Flex>
            </Flex>
            <Flex flexBasis="50%" direction="column" mx="3%">
              <Flex justify="space-between">
                <Text>EPS</Text><Text>${stockInfoData[0].eps}</Text>
              </Flex>
              <Flex justify="space-between">
                <Text>PER</Text><Text>×{stockInfoData[0].pe}</Text>
              </Flex>
              <Flex justify="space-between">
                <Text>EV/EBITDA</Text><Text>abc</Text>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
        <Flex　flexBasis="40%">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={priceData}
              margin={{
                top: 0, right: 0, left: -20, bottom: 0,
              }}
            >
              <XAxis dataKey="date" tick={{ fill: 'white' , fontSize: 10}}/>
              <YAxis  color="white" tick={{ fill: 'white' , fontSize: 10}} tickFormatter={(value) => new Intl.NumberFormat('en').format(value)}/>
              <Tooltip formatter={(value) => new Intl.NumberFormat('en').format(value)} />
              <Area dataKey="price" dot={false} type="monotone" fillOpacity="0.8" stroke="#4FD1C5" fill="#4FD1C5"/>
              <Brush dataKey="date" height={15} stroke="#38B2AC"/>
            </AreaChart>
          </ResponsiveContainer>
        </Flex>
      </Flex>
    ) : null
  )
};