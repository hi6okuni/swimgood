import {useState } from 'react'
import { useRouter } from 'next/router'
import { useAppContext } from '../lib/context/state'
import { Box, Flex, Center, Text } from "@chakra-ui/react"
import Link from 'next/link'
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
  const [ toggleMenuBar, setToggleMenuBar ] = useState(false);

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

  const setMenuDjia = () => {
    setMenu("djia");
    setStockInfo("");
  }

  const navSlide = () => {
    setToggleMenuBar(!toggleMenuBar);
    const burgers = document.querySelectorAll('.burger')
    burgers.forEach((burger) => {
      if (burger.style.animation) {
        burger.style.animation = '';
      } else {
        burger.style.animation = 'Rotate 0.6s ease forwards';
      }
    });
  };

  return (
    <React.Fragment>
    <Flex
      display={{ base: "flex", md: "none" }}
      m="5%"
      cursor="pointer"
      direction="row"
      justify="space-between"
      onClick={() => navSlide()}
    >
      <Box>
        <Box color="#6263fb" fontSize="md" fontFamily="Pacifico, cursive" onClick={() => resetSymbol()}>
          <Link href="/">
            <a>Swimgood 🏊‍</a>
          </Link>
        </Box>
        <Box fontSize="calc(6px + 1vmin)">
          <Text>Visuals instantly inspire you</Text>
        </Box>
      </Box>
      <Box
        zIndex="5"
        position="relative"
      >
        <Box 
          w="25px"
          h="3px"
          bg="black"
          m="5px"
          className="burger"
        >
        </Box>
        <Box 
          w="25px"
          h="3px"
          bg="black"
          m="5px"
          className="burger"
        >
        </Box>
        <Box 
          w="25px"
          h="3px"
          bg="black"
          m="5px"
          className="burger"
        >
        </Box>
      </Box>
    </Flex>

    { toggleMenuBar ? 
    <Flex
      align="center"
      w="100%"
      p="3%"
      direction="column"
      position="absolute"
      top="0%"
      zIndex="4"
      bg="#2f706b"
      color="white"
      opacity="0.95"
    >
      <Flex
        justify="space-around"
        wrap="wrap"
      >
      {menuTitles.map((e) => {
        return(
          <Center
            fontSize="calc(6px + 1vmin)" 
            fontWeight="500"
            direction="row"
            w="40%"
          >
          {menu == e.url ? 
            <Center
              borderRadius="lg"
              bg="linear-gradient(to right top , #ffafbd,  #ffc3a0 )"
              color="#3f3356"
              m="2%"
              p="3%"
              w="100%"
              transition="all .2s ease-in-out"
              onClick={() => setMenu(e.url)}
            >
              { value ? 
                <Center>
                  <Link 
                    href={`/${value}/${e.url}`}
                  >
                    <a>{e.title}</a>
                  </Link>
                </Center> :
                <Center>
                  <Link 
                    href={`/about`}
                  >
                    <a>{e.title}</a>
                  </Link> 
                </Center>
              }
            </Center> :  
            <Center
              borderRadius="lg"
              m="2%"
              p="3%"
              w="100%"
              _hover={{ bg: "linear-gradient(to right top , #ffafbd,  #ffc3a0 )", color: "#3f3356" }}
              _activeLink
              transition="all .2s ease-in-out"
              onClick={() => setMenu(e.url)}
            >
              { value ? 
                <Center>
                  <Link 
                    href={`/${value}/${e.url}`}
                  >
                    <a>{e.title}</a>
                  </Link> 
                </Center> :
                <Center>
                  <Link 
                    href={`/about`}
                  >
                    <a>{e.title}</a>
                  </Link> 
                </Center>
              }
            </Center>
            }
          </Center>
        )
      })}
      </Flex>

      <Flex
        justify="space-around"
        wrap="wrap"
        w="100%"
      >
        <Center
          fontSize="calc(6px + 1vmin)" 
          w="40%"
        >
          {menu == "sp500" ? 
          <Center
            w="80%"
            borderRadius="lg"
            m="2%"
            p="3%"
            bg="linear-gradient(to right top , #ffafbd,  #ffc3a0 )"
            color="#3f3356"
            fontWeight="500"
            transition="all 0.3s ease-in-out"
            onClick={() => setMenuSp500()}
          >
            <Center w="100%">
              <Link 
                href={`/sp500`}
              >
                <a>S&P500 List</a>
              </Link>
            </Center>
          </Center> :  
          <Center
            w="80%"
            borderRadius="lg"
            m="2%"
            p="3%"
            fontWeight="500"
            _hover={{ bg: "linear-gradient(to right top , #ffafbd,  #ffc3a0 )", color: "#3f3356" }}
            _activeLink
            transition="all 0.3s ease-in-out"
            onClick={() => setMenuSp500()}
          >
            <Center w="100%">
              <Link 
                href={`/sp500`}
              >
                <a>S&P500 List</a>
              </Link>
            </Center>
          </Center>
          }
        </Center>

        <Center
          fontSize="calc(6px + 1vmin)" 
          w="40%"
        >
          {menu == "djia" ? 
          <Center
            w="80%"
            borderRadius="lg"
            m="2%"
            p="3%"
            fontWeight="500"
            bg="linear-gradient(to right top , #ffafbd,  #ffc3a0 )"
            color="#3f3356"
            transition="all 0.3s ease-in-out"
            onClick={() => setMenuDjia()}
          >
            <Center w="100%">
              <Link 
                href={`/djia`}
              >
                <a>DJIA List</a>
              </Link>
            </Center>
          </Center> :  
          <Center
            w="80%"
            borderRadius="lg"
            m="2%"
            p="3%"
            fontWeight="500"
            _hover={{ bg: "linear-gradient(to right top , #ffafbd,  #ffc3a0 )", color: "#3f3356" }}
            _activeLink
            transition="all 0.3s ease-in-out"
            onClick={() => setMenuDjia()}
          >
            <Center w="100%">
              <Link 
                href={`/djia`}
              >
                <a>DJIA List</a>
              </Link>
            </Center>
          </Center>
          }
        </Center>
      </Flex>
    </Flex>
    : null }

    <Flex 
      display={{ base: "none", md: "flex" }}
      minH="100vh"
      direction={{ base: "row", md: "column" }}
      pt="20%"
      wrap="nowrap"
      align="center"
      pos="sticky" 
      top="0px"
      boxShadow="xl"
      bg="white"
    >
      <Flex 
        h="30%"
        direction="column"
        align="center" 
        fontSize="md"
      >
        <Box color="#6263fb" fontSize="2xl" fontFamily="Pacifico" onClick={() => resetSymbol()}>
          <Link href="/">
            <a>Swimgood 🏊‍</a>
          </Link>
        </Box>
        <Box fontSize="calc(4px + 1vmin)">
          <Text>Visuals instantly inspire you</Text>
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
              fontSize="calc(6px + 1vmin)" 
              fontWeight="500"
              w="100%"
            >
            {menu == e.url ? 
              <Center
                w="80%"
                borderRadius="lg"
                bg="#e4eafb"
                m="2%"
                p="3%"
                transition="all .2s ease-in-out"
                onClick={() => setMenu(e.url)}
              >
                { value ? 
                  <Center w="100%">
                    <Link 
                      href={`/${value}/${e.url}`}
                    >
                      <a>{e.title}</a>
                    </Link>
                  </Center> :
                  <Center w="100%">
                    <Link 
                      href={`/about`}
                    >
                      <a>{e.title}</a>
                    </Link> 
                  </Center>
                }
              </Center> :  
              <Center
                w="80%"
                borderRadius="lg"
                m="2%"
                p="3%"
                color="gray.500"
                _hover={{ bg: "#e4eafb", color: "#3f3356"}}
                _activeLink
                transition="all 0.3s ease-in-out"
                onClick={() => setMenu(e.url)}
              >
                { value ? 
                  <Center w="100%">
                    <Link 
                      href={`/${value}/${e.url}`}
                    >
                      <a>{e.title}</a>
                    </Link> 
                  </Center> :
                  <Center w="100%">
                    <Link 
                      href={`/about`}
                    >
                      <a>{e.title}</a>
                    </Link> 
                  </Center>
                }
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
            borderRadius="lg"
            m="2%"
            p="3%"
            bg="#e4eafb"
            color="#3f3356"
            transition="all 0.3s ease-in-out"
            onClick={() => setMenuSp500()}
          >
            <Center w="100%">
              <Link 
                href={`/sp500`}
              >
                <a>S&P500 List</a>
              </Link>
            </Center>
          </Center> :  
          <Center
            w="80%"
            borderRadius="lg"
            m="2%"
            p="3%"
            color="gray.500"
            _hover={{ bg: "#e4eafb", color: "#3f3356"}}
            _activeLink
            transition="all 0.3s ease-in-out"
            onClick={() => setMenuSp500()}
          >
            <Center w="100%">
              <Link 
                href={`/sp500`}
              >
                <a>S&P500 List</a>
              </Link>
            </Center>
          </Center>
          }
        </Center>

        <Center
          fontSize="calc(6px + 1vmin)" 
          w="100%"
        >
          {menu == "djia" ? 
          <Center
            w="80%"
            borderRadius="lg"
            m="2%"
            p="3%"
            fontWeight="500"
            bg="#e4eafb"
            color="#3f3356"
            transition="all 0.3s ease-in-out"
            onClick={() => setMenuDjia()}
          >
            <Center w="100%">
              <Link 
                href={`/djia`}
              >
                <a>DJIA List</a>
              </Link>
            </Center>
          </Center> :  
          <Center
            w="80%"
            borderRadius="lg"
            m="2%"
            p="3%"
            color="gray.500"
            _hover={{ bg: "#e4eafb", color: "#3f3356"}}
            _activeLink
            transition="all 0.3s ease-in-out"
            onClick={() => setMenuDjia()}
          >
            <Center w="100%">
              <Link 
                href={`/djia`}
              >
                <a>DJIA List</a>
              </Link>
            </Center>
          </Center>
          }
        </Center>
      </Flex>

    </Flex>
    </React.Fragment>
  )
};