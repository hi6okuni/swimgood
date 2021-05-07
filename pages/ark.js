import Head from 'next/head'
import { useEffect } from 'react'
import Layout, { siteTitle } from '../components/layout'
import { useAppContext } from '../lib/context/state'
import { Box, Flex, Center, Text} from "@chakra-ui/react"
import AdsCard from '../components/adscard'
import Link from 'next/link'
import Category from '../components/category'

export default function Ark () {

  const { setMenu , setValue } = useAppContext();

  const ark = [
    {
      name: "TSLA",
      japanese: "テスラ",
      initial: "T"
    },
    {
      name: "TDOC",
      japanese: "テラドック",
      initial: "T"
    },
    {
      name: "SQ",
      japanese: "スクエア",
      initial: "S"
    },
    {
      name: "ROKU",
      japanese: "ロク",
      initial: "R"
    },
    {
      name: "SHOP",
      japanese: "ショッピファイ",
      initial: "S"
    },
    {
      name: "EXAS",
      japanese: "イグザクト・サイエンシズ",
      initial: "E"
    },
    {
      name: "Z",
      japanese: "ジロー・グループ",
      initial: "Z"
    },
    {
      name: "SPOT",
      japanese: "スポティファイ・テクノロジー",
      initial: "S"
    },
    {
      name: "BIDU",
      japanese: "バイドゥ",
      initial: "B"
    },
    {
      name: "ZM",
      japanese: "ズーム・ビデオ・コミュニケーションズ",
      initial: "Z"
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
          <Flex fontSize="xl" mb="5px" alignItems="center">
            <Text fontSize="80px">🎮&nbsp;</Text>
            <Text fontSize="lg">ARK銘柄</Text>
          </Flex>
          <Flex fontSize="sm"  mb="50px" alignItems="center">
            <Text>ARK Innovation ETF保有割合上位10銘柄 (2021.5.3時点)</Text>
          </Flex>
          <section>
            <AdsCard/>
          </section>
          <Flex wrap="wrap">
           {
             ark.map((e) => {
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
          <AdsCard/>
        </section>
        <section>
          <Category/>
        </section>
      </React.Fragment>
    </Layout>
  )
}