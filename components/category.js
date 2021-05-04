import { useState } from 'react'
import { 
  Box,
  Flex,
  Text,
} from "@chakra-ui/react"
import Link from 'next/link'
import styled , { css } from "styled-components";
import { motion, AnimateSharedLayout, AnimatePresence } from "framer-motion";

// const Card = styled(motion.div)`
//   background: pink;
//   border-radius: 30px;
//   width: 400px;
//   height: 50px;

//   ${props => props.big && css`
//     background: blue;
//     width: 300px;
//     height: 300px;
//   `}
// `;

// const items = [
//     {
//       id: 0,
//       title: "S&P 500",
//       description: "Go to the list of S&P 500"
//     }, 
//     {
//       id: 1,
//       title: "ダウ平均",
//       description: "Go to the list of ダウ平均"
//     }, 
//     {
//       id: 2,
//       title: "Hot Stock",
//       description: "Go to the list of Hot Stock"
//     }
//   ];

//   function Item() {
//     const [isOpen, setIsOpen] = useState(false);
  
//     const toggleOpen = () => setIsOpen(!isOpen);
  
//     return (
//       <motion.li layout onClick={toggleOpen} initial={{ borderRadius: 10 }}>
//         <motion.div className="avatar" layout />
//         <AnimatePresence>{isOpen && <Content />}</AnimatePresence>
//       </motion.li>
//     );
//   }
  
//   function Content() {
//     return (
//       <motion.div
//         layout
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         exit={{ opacity: 0 }}
//       >
//         <div className="row" />
//         <div className="row" />
//         <div className="row" />
//       </motion.div>
//     );
//   }


export default function Category (props) {

  return (
    <Box　fontFamily='Noto Sans JP'>
      <Box mt="10%" mb="4%">
        <Text 
          fontSize="calc(6px + 4vmin)"
        >
          🌀テーマ別に調べる
        </Text>
      </Box>

      {/* <AnimateSharedLayout>
        <motion.ul layout initial={{ borderRadius: 25 }}>
          {items.map(item => (
            <Item key={item.id} />
          ))}
        </motion.ul>
      </AnimateSharedLayout> */}

      <Flex
        wrap="wrap"
        justify="space-around"
        mb="10%"
      >
        <Link href={`/sp500`}>
          <Flex
            h={["120px","200px","200px"]}
            w={["120px","200px","200px"]}
            p={["10px","20px","20px"]}
            m="2%"
            bg="white"
            direction="column"
            borderRadius="xl"
            color="#3f3455"
            boxShadow="lg"
            fontWeight="bold"
            fontSize={["xs","sm","lg"]}
            transition="transform 450ms"
            justify="center"
            align="center"
            will-change="transform"
            _hover={{transform: "scale(1.03)", transition: "transform 150ms"}}
            cursor="pointer"
          >
             <Text
              fontSize={["40px","60px","70px"]}
            >
              🍯
            </Text>
            <Text>S&P500<br></br>500銘柄
            </Text>
          </Flex>
        </Link>

        <Link href={`/djia`}>
          <Flex
            h={["120px","200px","200px"]}
            w={["120px","200px","200px"]}
            p={["10px","20px","20px"]}
            m="2%"
            bg="white"
            direction="column"
            borderRadius="xl"
            color="#3f3455"
            boxShadow="lg"
            fontWeight="bold"
            fontSize={["xs","sm","lg"]}
            transition="transform 450ms"
            justify="center"
            align="center"
            will-change="transform"
            _hover={{transform: "scale(1.03)", transition: "transform 150ms"}}
            cursor="pointer"
          >
            <Text
              fontSize={["40px","60px","70px"]}
            >
              🔩
            </Text>
            <Text>ダウ工業平均<br></br>30銘柄
            </Text>
          </Flex>
        </Link>

        <Link href={`/buffett`}>
          <Flex
            position="relative"
            h={["120px","200px","200px"]}
            w={["120px","200px","200px"]}
            p={["10px","20px","20px"]}
            m="2%"
            bg="white"
            direction="column"
            borderRadius="xl"
            color="#3f3455"
            boxShadow="lg"
            fontWeight="bold"
            fontSize={["xs","sm","lg"]}
            transition="transform 450ms"
            justify="center"
            align="center"
            will-change="transform"
            _hover={{transform: "scale(1.03)", transition: "transform 150ms"}}
            cursor="pointer"
          >
            <Flex
              position="absolute"
              right={["0px","-5px","-5px"]}
              top={["0px","-10px","-10px"]}
              bg="#626afb"
              color="white"
              w={["30px","40px","50px"]}
              h={["30px","40px","50px"]}
              borderRadius="50%"
              alignItems="center"
              justify="center"
            >
              new
            </Flex>
            <Text
              fontSize={["40px","60px","70px"]}
            >
              🪤
            </Text>
            <Text>バフェット銘柄<br></br>
            </Text>
          </Flex>
        </Link>

        <Link href={`/gafam`}>
          <Flex
            position="relative"
            h={["120px","200px","200px"]}
            w={["120px","200px","200px"]}
            p={["10px","20px","20px"]}
            m="2%"
            bg="white"
            direction="column"
            borderRadius="xl"
            color="#3f3455"
            boxShadow="lg"
            fontWeight="bold"
            fontSize={["xs","sm","lg"]}
            transition="transform 450ms"
            justify="center"
            align="center"
            will-change="transform"
            _hover={{transform: "scale(1.03)", transition: "transform 150ms"}}
            cursor="pointer"
          >
             <Flex
              position="absolute"
              right={["0px","-5px","-5px"]}
              top={["0px","-10px","-10px"]}
              bg="#626afb"
              color="white"
              w={["30px","40px","50px"]}
              h={["30px","40px","50px"]}
              borderRadius="50%"
              alignItems="center"
              justify="center"
            >
              new
            </Flex>
            <Text
              fontSize={["40px","60px","70px"]}
            >
              🧘🏼‍♂️
            </Text>
            <Text>とりまGAFAM<br></br>
            </Text>
          </Flex>
        </Link>

        <Link href={`/me`}>
          <Flex
            position="relative"
            h={["120px","200px","200px"]}
            w={["120px","200px","200px"]}
            p={["10px","20px","20px"]}
            m="2%"
            bg="white"
            direction="column"
            borderRadius="xl"
            color="#3f3455"
            boxShadow="lg"
            fontWeight="bold"
            fontSize={["xs","sm","lg"]}
            transition="transform 450ms"
            justify="center"
            align="center"
            will-change="transform"
            _hover={{transform: "scale(1.03)", transition: "transform 150ms"}}
            cursor="pointer"
          >
             <Flex
              position="absolute"
              right={["0px","-5px","-5px"]}
              top={["0px","-10px","-10px"]}
              bg="#626afb"
              color="white"
              w={["30px","40px","50px"]}
              h={["30px","40px","50px"]}
              borderRadius="50%"
              alignItems="center"
              justify="center"
            >
              new
            </Flex>
            <Text
              fontSize={["40px","60px","70px"]}
            >
              🏜
            </Text>
            <Text>開発者の<br></br>保有銘柄
            </Text>
          </Flex>
        </Link>

        <Link href={`/`}>
          <Flex
            position="relative"
            h={["120px","200px","200px"]}
            w={["120px","200px","200px"]}
            p={["10px","20px","20px"]}
            m="2%"
            bg="gray.200"
            direction="column"
            borderRadius="xl"
            color="#3f3455"
            boxShadow="lg"
            fontWeight="bold"
            fontSize={["xs","sm","lg"]}
            transition="transform 450ms"
            justify="center"
            align="center"
            will-change="transform"
            _hover={{transform: "scale(1.03)", transition: "transform 150ms"}}
            cursor="pointer"
          >
             {/* <Flex
              position="absolute"
              right={["0px","-5px","-5px"]}
              top={["0px","-10px","-10px"]}
              bg="#626afb"
              color="white"
              w={["30px","40px","50px"]}
              h={["30px","40px","50px"]}
              borderRadius="50%"
              alignItems="center"
              justify="center"
            >
              new
            </Flex> */}
            <Text
              fontSize={["40px","60px","70px"]}
            >
             🔫
            </Text>
            <Text>期待のSaaS銘柄(製作中)
            </Text>
          </Flex>
        </Link>

      </Flex>
    </Box>
  )
}