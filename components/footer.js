import {useState, useContext} from 'react'
import { useRouter } from 'next/router'
import { useAppContext } from '../lib/context/state'
import { Box, Heading, Flex, Center, Image, Text } from "@chakra-ui/react"
import Link from 'next/link'
import Search from './search'

export default function Footer() {

  return (
    <Flex 
      w="100%"
      m="5%"
      align="center"
    >
      <Text fontSize="xs">
       © 2021-present&nbsp;<a target="_blank" href="https://hirokuni-honda-portfolio.surge.sh/"><strong>Hirokuni Honda</strong>🎸</a> &nbsp;All Rights Reserved.
      </Text>
      <Box mr="0.5%" ml="1%">
        <a target="_blank" href="https://twitter.com/__quaalude__">
          <Image 
            boxSize="20px"
            src='/images/twitter.svg' 
            alt="twitter" 
          />
        </a>
      </Box>
      <Box mr="0.5%" ml="1%">
        <a target="_blank" href="https://github.com/hiropalla1692/">
          <Image 
            mx="0.5%"
            boxSize="20px"
            src='/images/github.svg' 
            alt="github" 
          />
        </a>
      </Box>
    </Flex>
  )
};