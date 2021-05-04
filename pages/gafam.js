import Head from 'next/head'
import { useEffect } from 'react'
import Layout, { siteTitle } from '../components/layout'
import { useAppContext } from '../lib/context/state'
import { Box, Flex, Center, Text} from "@chakra-ui/react"
import AdsCard from '../components/adscard'
import Link from 'next/link'
import Category from '../components/category'

export default function Gafam () {

  const { setMenu , setValue } = useAppContext();

  const gafam = [
    {
      name: "GOOG",
      japanese: "アルファベット",
      initial: "G"
    },
    {
      name: "AAPL",
      japanese: "アップル",
      initial: "A"
    },
    {
      name: "FB",
      japanese: "フェイスブック",
      initial: "F"
    },
    {
      name: "AMZN",
      japanese: "アマゾン",
      initial: "A"
    },
    {
      name: "MSFT",
      japanese: "マイクロソフト",
      initial: "M"
    },
  ]

  const jumpToPage = (e) => {
    setMenu("pl");
    setValue(e);
  }


  return (
    <Layout>
      <React.Fragment>
        <Head>
          <title>{siteTitle}</title>
        </Head>
        <Flex
          direction="column"
          m="3%"
        >
          <section>
            <AdsCard/>
          </section>
          <Flex fontSize="xl" mb="50px" alignItems="center">
            <Text fontSize="80px">🧘🏼‍♂️</Text>
            <Text fontSize="lg">とりまGAFAM</Text>
          </Flex>
          <Flex wrap="wrap">
           {
             gafam.map((e) => {
               return (
                <Link
                  href={`/${e.name}/pl`}
                >
                  <Flex 
                    mb="40px"
                    mr="15px"
                    p="8px"
                    h="68px"
                    bg="white"
                    borderRadius="40px"
                    alignItems="center"
                    cursor="pointer"
                    border="solid 1px #CBD5E0"
                    _hover={{ boxShadow:"lg" }}
                    transition="all .2s ease-in-out"
                    onClick={() => jumpToPage(e.name)}
                  >
                      <Flex
                        bg="#626afb" 
                        color="white"
                        h="50px"
                        w="50px"
                        borderRadius="50%"
                        mr="15px"
                        alignItems="center"
                        justify="center"
                        fontWeight="800"
                      >
                        {e.initial}
                      </Flex>
                      <Flex 
                        display="column" 
                        w="150px"
                        mr="30px"
                      >
                        <Text>
                          {e.name}
                        </Text>
                        <Text color="gray.400" fontSize="11px">
                          {e.japanese}
                        </Text>
                      </Flex>
                  </Flex>
                </Link>
               )
             })
           }
          </Flex>
        </Flex>
        <section>
          <Category/>
        </section>
      </React.Fragment>
    </Layout>
  )
}