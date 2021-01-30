import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import { useAppContext } from '../lib/context/state'
import { Box, Heading, Flex, Center, Text} from "@chakra-ui/react"
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
            <Box bg="linear-gradient(to right top , rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.05) )" p="3%" m="2%">
              <Flex justify="space-between" wrap="wrap">
                {editedLists.map((e) => {
                  return (
                    <Link
                      href={`/${e.symbol}/pl`}
                    >
                      <Flex 
                        bg="gray.800" 
                        m="1%" 
                        px="1.5%" 
                        py="0.5%" 
                        w="46%"
                        align="baseline" 
                        boxShadow="md" 
                        borderRadius="md"
                        _hover={{ bg: 'teal.700'}}
                        transition="all 0.3s ease-in-out"
                        direction="column"
                        onClick={() => jumpToPage(e.symbol)}
                      >
                        <Box>
                          <Text fontWeight="bold" fontSize="sm" display="inline">{e.symbol}&nbsp;</Text>
                          <Text color="teal.300" fontWeight="bold" fontSize="calc(4px + 1vmin)" display="inline">{e.name}</Text>
                        </Box>
                        <Box>
                          <Text fontSize="calc(4px + 1vmin)">‐&nbsp;{e.subSector}</Text>
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