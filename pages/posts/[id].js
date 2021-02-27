import Layout from '../../components/layout'
import { getAllPostIds, getPostData } from '../../lib/posts'
import Head from 'next/head'
import Date from '../../components/date'
import ReactMarkdown from 'react-markdown'
import ChakraUIRenderer from 'chakra-ui-markdown-renderer';

import { 
  Box,
  Flex,
  Center,
  Text,
  Switch,
} from "@chakra-ui/react"



export async function getStaticProps({ params }) {
  const postData = await getPostData(params.id)
  return {
    props: {
      postData
    }
  }
}

export async function getStaticPaths() {
  const paths = getAllPostIds()
  return {
    paths,
    fallback: false
  }
}

export default function Post({postData}) {
  return (
    <Layout>
      <Head>
        <title>{postData.title}</title>
      </Head>
      <Box m="6%">
        <article>
          <Box mb="4%">
            <Text fontSize={["md", "md" , "xl"]} fontWeight="bold">{postData.title}</Text>
            <div>
              <Date dateString={postData.date} />
            </div>
          </Box>
          <Box fontSize="xs">
            {/* <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }}/> */}
            <ReactMarkdown 
              skipHtml={true}
              renderers={ChakraUIRenderer()}
            >
              {postData.contents}
            </ReactMarkdown>
          </Box>
        </article>
      </Box>
    </Layout>
  )
}