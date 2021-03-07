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
    <Box>
      <Box mt="10%" mb="4%">
        <Text fontWeight="bold" fontSize="calc(6px + 4vmin)">🌀カテゴリー</Text>
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
            bg="#5759fb"
            borderRadius="xl"
            color="white"
            fontWeight="bold"
            fontSize={["xs","sm","lg"]}
            align="flex-end"
            transition="transform 450ms"
            will-change="transform"
            _hover={{transform: "scale(1.03)", transition: "transform 150ms"}}
            cursor="pointer"
          >
            <Text>S&P 500<br></br>構成銘柄</Text>
          </Flex>
        </Link>

        <Link href={`/djia`}>
          <Flex
            h={["120px","200px","200px"]}
            w={["120px","200px","200px"]}
            p={["10px","20px","20px"]}
            m="2%"
            bg="#e8f0fe"
            borderRadius="xl"
            color="black"
            fontWeight="bold"
            fontSize={["xs","sm","lg"]}
            align="flex-end"
            transition="transform 450ms"
            will-change="transform"
            border="solid 2px #5759fb"
            _hover={{transform: "scale(1.03)", transition: "transform 150ms"}}
            cursor="pointer"
            >
            <Text>ダウ平均 <br></br>
              構成銘柄
            </Text>
          </Flex>
        </Link>

        {/* <Flex
          h={["120px","200px","200px"]}
          w={["120px","200px","200px"]}
          p={["10px","20px","20px"]}
          m="2%"
          bg="#e8f0fe"
          borderRadius="xl"
          color="black"
          fontWeight="bold"
          fontSize={["xs","sm","lg"]}
          align="flex-end"
          transition="transform 450ms"
          will-change="transform"
          border="solid 2px #5759fb"
          _hover={{transform: "scale(1.03)", transition: "transform 150ms"}}
          cursor="pointer"
        >
          <Text>Dow Jones <br></br>
            Industrial Average
          </Text>
        </Flex>

        <Flex
          h={["120px","200px","200px"]}
          w={["120px","200px","200px"]}
          p={["10px","20px","20px"]}
          m="2%"
          bg="#fd867a"
          borderRadius="xl"
          color="white"
          fontWeight="bold"
          fontSize={["xs","sm","lg"]}
          align="flex-end"
          transition="transform 450ms"
          will-change="transform"
          _hover={{transform: "scale(1.03)", transition: "transform 150ms"}}
          cursor="pointer"
        >
          <Text>ダウ平均 <br></br>
            構成銘柄
          </Text>
        </Flex> */}
      </Flex>
    </Box>
  )
}