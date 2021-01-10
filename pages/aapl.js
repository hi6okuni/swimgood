import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import Link from 'next/link'
import Date from '../components/date'

export async function getServerSideProps() {
  // Fetch data from external API
  const [res1, res2] = await Promise.all([
    fetch(`https://financialmodelingprep.com/api/v3/income-statement/AAPL?limit=10&apikey=fea107802693a9f21cc94def10b870da`).then(response => response.json()),
    fetch(`https://financialmodelingprep.com/api/v3/key-metrics/AAPL?limit=10&apikey=fea107802693a9f21cc94def10b870da`).then(response => response.json())
  ]);

  const plData = res1.map((info) => ({
    revenue: info.revenue/1000000,
  }));

  const keyMetrics = res2.map((info) => ({
    payoutRatio: Math.round(info.payoutRatio*100 * 100) / 100,
  }));

  // Pass data to the page via props
  return { 
    props: { 
      plData,
      keyMetrics
    } 
  }
}

export default function Aapl ({ plData, keyMetrics }) {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section>
          {plData.map(({revenue}) => {
            return <h1>{revenue}</h1>
          })}
      </section>
      <section>
          {keyMetrics.map(({payoutRatio}) => {
            return <h1>{payoutRatio}</h1>
          })}
      </section>
    </Layout>
  )
}