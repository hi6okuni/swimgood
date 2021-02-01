import { useRouter } from 'next/router'
import Layout from '../components/layout'
import { Box, Text } from "@chakra-ui/react"
import { useAppContext } from '../lib/context/state'
import Search from '../components/search'



export default function About () {

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
    <Layout>
      <Box position="relative" zIndex="2" my="8%">
        <Text fontSize="calc(2px + 6vmin)" color="#6263fb" lineHeight="100%" fontWeight="bold">Oops! <br></br>First Search Symbol.</Text>
        <Box my="3%" w="70%" >
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
        bg="linear-gradient(to right top , #eacda3,  #d6ae7b )"
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
    </Layout>
  )
}