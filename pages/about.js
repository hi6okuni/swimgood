import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import { Box, Heading, Flex, Center, Img, Text } from "@chakra-ui/react"
import utilStyles from '../styles/utils.module.css'
import Link from 'next/link'
import Date from '../components/date'


export default function About () {
  return (
    <Layout>
      <Box>
        <Text>First you have to search symbol.</Text>
      </Box>
    </Layout>
  )
}