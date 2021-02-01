
import { Box, Flex, Center, Image, Text } from "@chakra-ui/react"

export default function Footer() {

  return (
    <Flex
      direction="column"
    >
      <Flex
        mx="3%"
        align="center"
      >
        <Text fontSize="xs">
        * This site is for informational purposes only. It is not intended to serve as investment advice.<br></br>
        * All data is sourced from <a href="https://financialmodelingprep.com/">FMP</a> via a public API.
        </Text>
      </Flex>

      <Flex 
        m="3%"
        align="center"
      >
        <Text fontSize="xs">
        © 2021-present&nbsp;<strong>Swimgood</strong>&nbsp;All Rights Reserved.
        </Text>
        <Box mr="0.5%" ml="1%">
          <a target="_blank" href="https://twitter.com/swimgood_io">
            <Image 
              boxSize="20px"
              src='/images/twitter.svg' 
              alt="twitter" 
            />
          </a>
        </Box>
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