import Head from 'next/head'
import { useEffect } from 'react'
import Layout, { siteTitle } from '../components/layout'
import { useAppContext } from '../lib/context/state'
import { Box, Flex, Center, Text} from "@chakra-ui/react"
import AdsCard from '../components/adscard'
import Link from 'next/link'
import Category from '../components/category'

export default function Buffett () {

  const { setMenu , setValue } = useAppContext();

  function compare(a, b) {
    const stockA = a.name;
    const stockB = b.name;
  
    let comparison = 0;
      if (stockA > stockB) {
        comparison = 1;
      } else if (stockA < stockB) {
        comparison = -1;
      }
      return comparison;
  }

  const buffett = [
    {
      name: "ABBV",
      japanese: "アッヴィ",
      initial: "A"
    },
    {
      name: "AXP",
      japanese: "アメリカン・エキスプレス",
      initial: "A"
    },
    {
      name: "AAPL",
      japanese: "アップル",
      initial: "A"
    },
    {
      name: "BAC",
      japanese: " バンク・オブ・アメリカ",
      initial: "B"
    },
    {
      name: "BK",
      japanese: "バンク・オブ・ニューヨーク・メロン",
      initial: "B"
    },
    {
      name: "CHTR",
      japanese: "チャーター・コミュニケーションズ",
      initial: "C"
    },
    {
      name: "CVX",
      japanese: "シェブロン",
      initial: "C"
    },
    {
      name: "KO",
      japanese: "コカ・コーラ",
      initial: "K"
    },
    {
      name: "GM",
      japanese: "ゼネラル・モーターズ",
      initial: "G"
    },
    {
      name: "KHC",
      japanese: "クラフト・ハインツ",
      initial: "K"
    },
    {
      name: "MRK",
      japanese: "メルク",
      initial: "M"
    },
    {
      name: "MCO",
      japanese: "ムーディーズ",
      initial: "M"
    },
    {
      name: "USB",
      japanese: "U.S.バンコープ",
      initial: "U"
    },
    {
      name: "VZ",
      japanese: "ベライゾン・コミュニケ―ションズ",
      initial: "V"
    },
  ]

  const editedBuffett = buffett.sort(compare);


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
          <Flex fontSize="xl" mb="5px" alignItems="center">
            <Text fontSize="80px">🪤&nbsp;</Text>
            <Text fontSize="lg">バフェット銘柄</Text>
          </Flex>
          <Flex fontSize="sm"  mb="50px" alignItems="center">
            <Text>Warren Buffett's Letters to Berkshire Shareholders(2020)から抜粋</Text>
          </Flex>
          <Flex wrap="wrap">
           {
             editedBuffett.map((e) => {
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