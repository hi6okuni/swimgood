"use client";

import {
  Flex,
  Text,
  Box,
  Stat,
  StatArrow,
  StatHelpText,
  StatLabel,
  StatNumber,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  SliderMark,
} from "@chakra-ui/react";

export type BaseInfo = {
  symbol: string;
  name: string;
  price: number;
  marketCap: number;
  changesPercentage: number;
  change: number;
  yearHigh: number;
  yearLow: number;
  exchange: string;
  eps: number;
  pe: number;
  earningsAnnouncement: string;
} | null;

interface OverviewProps {
  baseInfo: BaseInfo;
}

export const Overview = ({ baseInfo }: OverviewProps) => {
  if (!baseInfo) {
    return null;
  }

  return (
    <Box
      display="inline-block"
      border="1px solid black"
      borderRadius="12px"
      px="16px"
      py="12px"
    >
      <Flex direction="column">
        <Text fontSize="xs" color="gray.700">
          {baseInfo.name}
        </Text>
        <Flex alignItems="baseline">
          <Text fontWeight="700" fontSize="24px">
            {baseInfo.symbol}
          </Text>
          <Text pl="12px">${baseInfo.price}</Text>
          <Text
            pl="12px"
            fontSize="xs"
            color={baseInfo.changesPercentage > 0 ? "green.500" : "red.500"}
          >
            {baseInfo.changesPercentage > 0 ? "▲" : "▼"}
          </Text>
          <Text>{Math.abs(baseInfo.changesPercentage)}%</Text>
        </Flex>
      </Flex>
      <Flex direction="column" fontSize="xs" color="gray.700">
        <Flex justify="space-between">
          <Text>52 Week High</Text>
          <Text>${baseInfo.yearHigh}</Text>
        </Flex>
        <Flex justify="space-between">
          <Text>52 Week Low</Text>
          <Text>${baseInfo.yearLow}</Text>
        </Flex>
      </Flex>
    </Box>
  );
};
