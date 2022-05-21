import Head from "next/head";
import Layout, { siteTitle } from "../components/layout";
import { useAppContext } from "../lib/context/state";
import { Flex, Text } from "@chakra-ui/react";
import AdsCard from "../components/adscard";
import Link from "next/link";
import Category from "../components/category";

export default function SaaS() {
  const { setMenu, setValue } = useAppContext();

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

  const saas = [
    {
      name: "OKTA",
      japanese: "オクタ | ID管理",
      initial: "O",
    },
    {
      name: "NOW",
      japanese: "サービスナウ | ワークフロー管理",
      initial: "N",
    },
    {
      name: "INTU",
      japanese: "イントゥイット| 財務管理",
      initial: "I",
    },
    {
      name: "DDOG",
      japanese: "データドッグ| 運用監視・分析",
      initial: "D",
    },
    {
      name: "WDAY",
      japanese: "ワークデイ | 人事と財務管理",
      initial: "W",
    },
    {
      name: "CRM",
      japanese: "セールスフォース・ドットコム | 顧客関係管理",
      initial: "C",
    },
    {
      name: "VEEV",
      japanese: "ヴィーヴァ・システムズ | 製薬業界向けCRM",
      initial: "V",
    },
    {
      name: "SHOP",
      japanese: "ショッピファイ | 商取引・EC",
      initial: "S",
    },
    {
      name: "MDB",
      japanese: "モンゴDB | データベース",
      initial: "M",
    },
    {
      name: "DOCU",
      japanese: "ドキュサイン | 電子署名",
      initial: "D",
    },
    {
      name: "CRWD",
      japanese: "クラウドストライク | セキュリティ",
      initial: "C",
    },
    {
      name: "ESTC",
      japanese: "エラスティック | デ―タ検索・分析",
      initial: "E",
    },
    {
      name: "TWLO",
      japanese: "トゥイリオ | コミュニケーション",
      initial: "T",
    },
    {
      name: "ZM",
      japanese: "ズーム・ビデオ・コミュニケーションズ | ウェブ会議",
      initial: "Z",
    },
    {
      name: "ADBE",
      japanese: "アドビ | 画像&映像編集",
      initial: "A",
    },
  ];

  const editedSaas = saas.sort(compare);

  const jumpToPage = (e) => {
    setMenu("pl");
    setValue(e);
  };

  return (
    <Layout>
      <>
        <Head>
          <title>{siteTitle}</title>
        </Head>
        <Flex direction="column" m="3%">
          <Flex fontSize="xl" mb="5px" alignItems="center">
            <Text fontSize="80px">🔫&nbsp;</Text>
            <Text fontSize="lg">期待のSaaS銘柄</Text>
          </Flex>
          <Flex fontSize="sm" mb="50px" alignItems="center">
            <Text>独断と偏見のセレクト。</Text>
          </Flex>
          <section>
            <AdsCard />
          </section>
          <Flex wrap="wrap" mt="50px">
            {editedSaas.map((e) => {
              return (
                <Link href={`/${e.name}/pl`}>
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
                    _hover={{ boxShadow: "lg" }}
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
                    <Flex display="column" w="150px" mr="30px">
                      <Text>{e.name}</Text>
                      <Text color="gray.400" fontSize="11px">
                        {e.japanese}
                      </Text>
                    </Flex>
                  </Flex>
                </Link>
              );
            })}
          </Flex>
        </Flex>
        <section>
          <AdsCard />
        </section>
        <section>
          <Category />
        </section>
      </>
    </Layout>
  );
}
