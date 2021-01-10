import {useState, useContext} from 'react'
import { useRouter } from 'next/router'
import { useAppContext } from '../lib/context/state'
import { Box, Heading, Flex, Center, Img, Text } from "@chakra-ui/react"
import Link from 'next/link'
import Image from 'next/image'
import Search from './search'



const menuTitles = 
  [
    { title: "Income Statement", url: "pl"},
    { title: "Balance Sheet", url: "bs"},
    { title: "Cash Flow Statement", url: "cfs"},
    { title: "Dividends", url: "div"},
    { title: "Metrics", url: "metric"},
  ]


export default function SideBar(props) {

  const {value, setValue, menu, setMenu, setStockInfo} = useAppContext();

  const router = useRouter()

  const getSymbol = (e) => {
    setValue(e);
    if (menu == "") {
      setValue(e);
      setMenu("pl");
      router.push(`/${e}/pl`);
    } else {
      setValue(e);
      router.push(`/${e}/${menu}`);
    }
  }

  const resetSymbol = () => {
    setValue("");
    setMenu("");
    setStockInfo("");
  }

  const setMenuSp500 = () => {
    setMenu("sp500");
    setStockInfo("");
  }

  return (
    <Flex 
      minH="100vh"
      mt="20%"
      direction="column"
      align="center"
      pos="sticky" 
      top="40px"
    >
      <Flex 
        h="30%"
        direction="column"
        align="center" 
        fontSize="md"
      >
        <Box fontWeight="bold" fontSize="2xl" fontFamily="Pacifico" onClick={() => resetSymbol()}>
          <Link href="/">
            <a>$Cashmere🐐</a>
          </Link>
        </Box>
        <Box fontSize="xs">
          <Text color="teal.200">Visuals instantly inspire you</Text>
        </Box>
        <Center mt="10%">
          <Search getSymbol={getSymbol}/>
        </Center>
      </Flex>
      <Flex
        direction="column"
        justify="space-around"
        align="center"
        minH="50vh"
        mt="10%"
        w="100%"
      >
        {menuTitles.map((e) => {
          return(
            <Center 
              fontSize="calc(8px + 1vmin)" 
              w="100%"
            >
            {menu == e.url ? 
              <Center
                w="80%"
                borderRadius="2xl"
                m="2%"
                p="3%"
                color='teal.200'
                transition="all 0.3s ease-in-out"
                _hover={{ bg: 'gray.800'}}
                onClick={() => setMenu(e.url)}
              >
                <Link 
                  href={`/${value}/${e.url}`}
                >
                  {e.title}
                </Link>
              </Center> :  
              <Center
                w="80%"
                borderRadius="2xl"
                m="2%"
                p="3%"
                _hover={{ bg: 'gray.800' , color: 'teal.200' }}
                _activeLink
                transition="all 0.3s ease-in-out"
                onClick={() => setMenu(e.url)}
              >
                <Link 
                  href={`/${value}/${e.url}`}
                >
                  {e.title}
                </Link>
              </Center>
              }
            </Center>
          )
        })}

        <Center 
          my="3%"
          w="80%"
          borderBottom="2px"
          color="gray.800"
        >
        </Center>

        <Center
          fontSize="calc(6px + 1vmin)" 
          w="100%"
        >
          {menu == "sp500" ? 
          <Center
            w="80%"
            borderRadius="2xl"
            m="2%"
            p="3%"
            fontWeight="bold"
            color='teal.200'
            transition="all 0.3s ease-in-out"
            _hover={{ bg: 'gray.800'}}
            onClick={() => setMenuSp500()}
          >
            <Link 
              href={`/sp500`}
            >
              S&P500 List
            </Link>
          </Center> :  
          <Center
            w="80%"
            borderRadius="2xl"
            m="2%"
            p="3%"
            fontWeight="bold"
            _hover={{ bg: 'gray.800' , color: 'teal.200' }}
            _activeLink
            transition="all 0.3s ease-in-out"
            onClick={() => setMenuSp500()}
          >
            <Link 
              href={`/sp500`}
            >
              S&P500 List
            </Link>
          </Center>
          }
        </Center>
      </Flex>
    </Flex>
  )
};