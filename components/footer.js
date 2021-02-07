import Link from 'next/link'
import { Box, Flex, Center, Image, Text } from "@chakra-ui/react"

export default function Footer() {

  return (
    <Flex
      direction="column"
    >
      <Flex
        mx="5%"
        align="center"
      >
        <Text fontSize={["calc(4px + 2vmin)", "xs", "xs"]}>
        * This site is for informational purposes only. It is not intended to serve as investment advice.<br></br>
        * All data is sourced from <a href="https://financialmodelingprep.com/">FMP</a> via a public API.<br></br>
        * Sadly some data seem not accurate😢. You must check out primary sources before making any decision.
        </Text>
      </Flex>

      <Flex 
        m="3%"
        align="center"
        direction={["column", "row", "row"]}
      >
        <Text fontSize={["calc(4px + 2vmin)", "xs", "xs"]}>
          © 2021-present&nbsp;<strong>Swimgood</strong>&nbsp;All Rights Reserved.
        </Text>
        <Flex justify={["space-around", "flex-start", "flex-start"]} w={["100%", "25%", "25%"]} mt={["4%", "0%", "0%"]}>
          <Box mr="2%" mx="2%">
            <a target="_blank" href="https://twitter.com/swimgood_io">
              <Image 
                boxSize="20px"
                src='/images/twitter.svg' 
                alt="twitter_icon" 
                w="20px"
                h="20px"
              />
            </a>
          </Box>
          <Box mx="2%">
            <a href='https://ko-fi.com/P5P23KJ4R' target='_blank'>
                <Image 
                  h='24px' 
                  src='https://cdn.ko-fi.com/cdn/kofi5.png?v=2' 
                  b='0' 
                  alt='Buy Me a Coffee at ko-fi.com' 

                />
            </a>
          </Box>
        </Flex>
        {/* <Box mr="0.5%" ml="1%">
          <a target="_blank" href="https://github.com/hiropalla1692/">
            <Image 
              mx="0.5%"
              boxSize="20px"
              src='/images/github.svg' 
              alt="github" 
            />
          </a>
        </Box> */}
      </Flex>
    </Flex>
  )
};