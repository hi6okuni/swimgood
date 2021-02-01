import { useRouter } from 'next/router'
import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import { getSortedPostsData } from '../lib/posts'
import { useAppContext } from '../lib/context/state'
import Link from 'next/link'
import Date from '../components/date'
import Search from '../components/search'

import { 
  Box,
  Flex,
  Text,
  Center,
} from "@chakra-ui/react"


export async function getStaticProps() {
  const allPostsData = getSortedPostsData()
  return {
    props: {
      allPostsData
    }
  }
}


export default function Home ({ allPostsData }) {

  const {value, setValue, menu, setMenu, setStockInfo} = useAppContext();

  const router = useRouter()

  const getSymbol = (e) => {
    setValue(e);
    if (menu == "") {
      setValue(e);
      setMenu("pl");
      router.push(`/${e}/pl`);
    } else {
      setValue(e);
      router.push(`/${e}/${menu}`);
    }
  }

  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <Flex
        direction="column"
        m="3%"
        >
        <section>
          <Box position="relative" zIndex="2">
            <Text fontSize="calc(2px + 12vmin)" color="#6263fb" lineHeight="100%" fontWeight="bold">Broaden<br></br>Your Insight</Text>
            <Box className="gradient" mb="6%">
              <span className="gradient-text">into U.S. Stocks</span><br></br>
              <span className="gradient-text">with Beautiful Visuals</span>
            </Box>
            <Box my="3%" w={["100%", "90%", "70%"]} >
              <Search getSymbol={getSymbol}/>
            </Box>
          </Box>
          <Box
            className="circle"
            top="5%"
            right="20%"
            h={[100, 200, 300]}
            w={[100, 200, 300]}
            position="absolute"
            borderRadius="50%"
            bg="linear-gradient(to right top , #ffafbd,  #ffc3a0 )"
            zIndex="1"
          >
          </Box>
          <Box
            className="circle2"
            top="6%"
            right="18%"
            h={[90, 180, 270]}
            w={[90, 180, 270]}
            position="absolute"
            borderRadius="50%"
            border="solid 3px #3f3356"
            bg="transparent"
            zIndex="1"
          >
          </Box>
        </section>

        <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
          <h2 className={utilStyles.headingLg}>記事</h2>
          <ul className={utilStyles.list}>
            {allPostsData.map(({ id, date, title }) => (
              <li className={utilStyles.listItem} key={id}>
                <Link href={`/posts/${id}`}>
                  <a>{title}</a>
                </Link>
                <br />
                <small className={utilStyles.lightText}>
                  <Date dateString={date} />
                </small>
              </li>
            ))}
          </ul>
        </section>
      </Flex>
    </Layout>
  )
}