import {useState} from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import { getSortedPostsData } from '../lib/posts'
import Link from 'next/link'
import Date from '../components/date'
import Search from '../components/search'

import { 
  Box,
  Flex,
  Center,
  Input,
  InputGroup,
  InputLeftElement,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
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

  const [symbol, setSymbol] = useState("");

  const router = useRouter()
  const getSymbol = (e) => {
    console.log(e);
    setSymbol(e);
    router.push(`/pl?symbol=${e}`);
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
        <section className={utilStyles.headingMd}>
          <p>Cashmere🐐へようこそ！</p>
          <p>
            米国企業の決算情報を即ビジュアル化！
          </p>
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