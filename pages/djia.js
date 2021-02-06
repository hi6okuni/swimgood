import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import { useAppContext } from '../lib/context/state'
import { Box, Flex, Center, Text} from "@chakra-ui/react"
import Link from 'next/link'

export async function getStaticProps() {
  // Fetch data from external API
  const apikey = process.env.FMP_API_KEY;

  const [res1] = await Promise.all([
    fetch(`https://financialmodelingprep.com/api/v3/dowjones_constituent?apikey=${apikey}`).then(response => response.json()),
  ]);

  const Lists = res1.map((list) => ({
    symbol: list.symbol,
    name: list.name,
    sector: list.sector,
    subSector: list.subSector
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


  // Pass data to the page via props
  return { 
    props: { 
      editedLists
    } 
  }
}

export default function Djia ({ editedLists }) {

  const { setMenu , setValue } = useAppContext();

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
          <Flex fontSize="xl">
            <Text>Dow Jones Industorial Average List</Text>
          </Flex>
          <Flex direction="column" zIndex="2">
            <Box p="3%" mx="2%" my={["5%","4%","2%"]} borderRadius="2xl" bg="#e4eafb">
              <Flex justify="space-between" wrap="wrap">
                {editedLists.map((e) => {
                  return (
                    <Link
                      href={`/${e.symbol}/pl`}
                    >
                      <Flex 
                        bg="#6369f7"
                        color="white"
                        m={["2%","2%","1%"]}
                        px={["5%","3%","1.5%"]}
                        py={["1%","2%","0.5%"]}
                        w={["92%","46%","46%"]}
                        align="baseline" 
                        borderRadius="md"
                        _hover={{ bg:"#fd8db9"}}
                        transition="all 0.3s ease-in-out"
                        boxShadow="xl"
                        direction="column"
                        onClick={() => jumpToPage(e.symbol)}
                        cursor="pointer"
                      >
                        <Box>
                          <Text fontWeight="bold" fontSize={["xs","xs","sm"]}>{e.symbol}&nbsp;</Text>
                          <Text fontSize={["calc(4px + 2vmin)","xs","xs"]}>{e.name}</Text>
                        </Box>
                        <Box>
                          <Text fontSize={["calc(4px + 2vmin)","xs","xs"]} >‐&nbsp;{e.subSector}</Text>
                        </Box>
                      </Flex>
                    </Link>
                  )
                })}
              </Flex>
            </Box>
          </Flex>
        </Flex>
      </React.Fragment>
    </Layout>
  )
}