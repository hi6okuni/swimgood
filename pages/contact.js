import Layout, { siteTitle } from '../components/layout'
import Head from 'next/head'
import { 
  Box,
  Flex,
  Center,
  Text,
  Switch,
} from "@chakra-ui/react"


export default function Terms() { 
  return (
    <Layout>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <Flex
        direction="column"
        m="3%"
      >

         {/* TERMS OF USE */}
         <Flex
          direction="column"
          w="100%"
          h={["240px", "960px", "60vh"]} 
          p={["10%","4%","2%"]} 
          my="4%"
          pt="1%"
          bg="#e4e9fb"
          color="#3f3356"
          justify="space-around"
          borderRadius="lg"
          z-index="5"
        >
          <Center>
            <Text align="center" fontSize="md"><a href="mailto:swimgoodisgood@gmail.com">📩ご連絡はこちらから</a></Text>
          </Center>
        </Flex>

      </Flex>
    </Layout>
  )
}