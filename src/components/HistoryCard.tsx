import { Heading, HStack, Text, VStack } from "native-base";

type HistoryCardProps = {
  title: string;
  description: string;
  time: string;
};

export function HistoryCard({ time, title, description }: HistoryCardProps) {
  return (
    <HStack
      w="full"
      px={5}
      py={4}
      mb={3}
      bg="gray.600"
      rounded="md"
      alignItems="center"
      justifyContent="space-between"
    >
      <VStack mr={5}>
        <Heading
          color="white"
          fontSize="md"
          textTransform="capitalize"
          fontFamily="heading"
        >
          {title}
        </Heading>
        <Text color="gray.100" fontSize="lg" numberOfLines={1}>
          {description}
        </Text>
      </VStack>
      <Text color="gray.300" fontSize="md" numberOfLines={1}>
        {time}
      </Text>
    </HStack>
  );
}
