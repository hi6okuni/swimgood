
import { Box, Flex, Center, Text } from "@chakra-ui/react"

export default function Highlight( {highlightData} ) {
  return (
    <Flex
      h="29%"
      w="100%"
      borderRadius="2xl"
      direction="column"
      boxShadow="xl"
      color="white"
      bg="#6369f7"
      align="center"
      justify="space-around"
      p="5%"
      fontSize={["calc(6px + 2vmin)","xs", "xs" ]}
    >
      <Text textAlign="center" fontWeight="bold">💫 Summary&nbsp;&nbsp;&nbsp;&nbsp;${highlightData.symbol}&nbsp;&nbsp;{highlightData.period}</Text>
      {highlightData.data ? highlightData.data.map((e) => {
        return (
          <Flex w={["70%","70%", "80%" ]} justify="space-between" >
            <Text>{e.title}</Text>
            <Text>{e.unit_forth}{e.value}{e.unit_back}</Text>
          </Flex>
        )
      }) : null}
    </Flex>
  )
};