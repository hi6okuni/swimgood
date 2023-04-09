import Head from "next/head";
import Layout, { siteTitle } from "../components/layout";
import AdsCard from "../components/adscard";
import { useAppContext } from "../lib/context/state";
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Stack,
  StackDivider,
  Text,
} from "@chakra-ui/react";
import Link from "next/link";

export async function getStaticProps() {
  // Fetch data from external API
  const apikey = process.env.FMP_API_KEY;

  const [res1] = await Promise.all([
    fetch(
      `https://financialmodelingprep.com/api/v3/sp500_constituent?apikey=${apikey}`
    ).then((response) => response.json()),
  ]);

  const Lists = res1.map((list) => ({
    symbol: list.symbol,
    name: list.name,
    sector: list.sector,
    subSector: list.subSector,
  }));

  function compare(a, b) {
    const stockA = a.symbol;
    const stockB = b.symbol;

    let comparison = 0;
    if (stockA > stockB) {
      comparison = 1;
    } else if (stockA < stockB) {
      comparison = -1;
    }
    return comparison;
  }

  const editedLists = Lists.sort(compare);

  const targetSector = [
    "Communication Services",
    "Consumer Staples",
    "Consumer Discretionary",
    "Energy",
    "Financials",
    "Health Care",
    "Industrials",
    "Information Technology",
    "Materials",
    "Real Estate",
    "Utilities",
  ];

  const cs1Stocks = editedLists.filter(function (stock) {
    return stock.sector == targetSector[0];
  });
  const cs2Stocks = editedLists.filter(function (stock) {
    return stock.sector == targetSector[1];
  });
  const cdStocks = editedLists.filter(function (stock) {
    return stock.sector == targetSector[2];
  });
  const eStocks = editedLists.filter(function (stock) {
    return stock.sector == targetSector[3];
  });
  const fStocks = editedLists.filter(function (stock) {
    return stock.sector == targetSector[4];
  });
  const hcStocks = editedLists.filter(function (stock) {
    return stock.sector == targetSector[5];
  });
  const iStocks = editedLists.filter(function (stock) {
    return stock.sector == targetSector[6];
  });
  const itStocks = editedLists.filter(function (stock) {
    return stock.sector == targetSector[7];
  });
  const mStocks = editedLists.filter(function (stock) {
    return stock.sector == targetSector[8];
  });
  const reStocks = editedLists.filter(function (stock) {
    return stock.sector == targetSector[9];
  });
  const uStocks = editedLists.filter(function (stock) {
    return stock.sector == targetSector[10];
  });

  const sp500Stocks = [
    cs1Stocks,
    cs2Stocks,
    cdStocks,
    eStocks,
    fStocks,
    hcStocks,
    iStocks,
    itStocks,
    mStocks,
    reStocks,
    uStocks,
  ];

  // Pass data to the page via props
  return {
    props: {
      sp500Stocks,
    },
  };
}

export default function Sp500({ sp500Stocks }) {
  const { setMenu, setValue } = useAppContext();

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
          <Flex fontSize="xl">
            <Text>S&P 500 List</Text>
          </Flex>
          <section>
            <AdsCard />
          </section>
          <Flex direction="column">
            {sp500Stocks.map((stocks) => {
              return (
                <Box
                  p="3%"
                  mx="2%"
                  my={["5%", "4%", "2%"]}
                  borderRadius="2xl"
                  bg="#e4eafb"
                >
                  <Text fontSize={["xs", "md", "lg"]} fontWeight="bold">
                    ■&nbsp;{stocks[0].sector}
                  </Text>
                  <Flex justify="space-around" wrap="wrap">
                    {stocks.map((e) => {
                      return (
                        <Link href={`/${e.symbol}/pl`}>
                          <Box mx="4" mb="3">
                            <Card
                              variant="outline"
                              bg="gray.50"
                              w="240px"
                              h="full"
                              onClick={() => jumpToPage(e.symbol)}
                            >
                              <CardBody>
                                <Stack divider={<StackDivider />} spacing="2">
                                  <Box>
                                    <Heading size="xs">{e.symbol}</Heading>
                                    <Text
                                      fontSize={[
                                        "calc(4px + 2vmin)",
                                        "11px",
                                        "11px",
                                      ]}
                                      wordBreak="break-all"
                                      color="gray.500"
                                    >
                                      {e.name}
                                    </Text>
                                  </Box>
                                  <Text
                                    fontSize={[
                                      "calc(4px + 2vmin)",
                                      "11px",
                                      "11px",
                                    ]}
                                    wordBreak="break-all"
                                  >
                                    {e.subSector}
                                  </Text>
                                </Stack>
                              </CardBody>
                            </Card>
                            {/* <Flex
                            bg="white"
                            border="medium double pink"
                            mb="4"
                            p="3"
                            w="180px"
                            h="100px"
                            align="baseline"
                            borderRadius="sm"
                            _hover={{ bg: "gray.200" }}
                            transition="all 0.3s ease-in-out"
                            direction="column"
                            onClick={() => jumpToPage(e.symbol)}
                            cursor="pointer"
                          >
                            <Text
                              fontWeight="bold"
                              fontSize={["xs", "xs", "sm"]}
                            >
                              {e.symbol}&nbsp;
                            </Text>
                            <Text
                              fontSize={["calc(4px + 2vmin)", "11px", "11px"]}
                              wordBreak="break-all"
                            >
                              {e.name}
                            </Text>
                            <Text
                              fontSize={["calc(4px + 2vmin)", "11px", "11px"]}
                              color="gray.500"
                              wordBreak="break-all"
                            >
                              {e.subSector}
                            </Text>
                          </Flex> */}
                          </Box>
                        </Link>
                      );
                    })}
                  </Flex>
                </Box>
              );
            })}
          </Flex>
        </Flex>
      </>
    </Layout>
  );
}
