import { Heading, VStack, SectionList, Text } from "native-base";
import { ScreenHeader } from "./ScreenHeader";
import { HistoryCard } from "@components/HistoryCard";
import { useState } from "react";

export function History() {
  const [exercises, setExercises] = useState([
    {
      title: "26.08.22",
      data: [
        {
          id: "1",
          title: "Costas",
          description: "Puxada frontal",
          time: "08:00",
        },
        {
          id: "2",
          title: "Costas",
          description: "Remada lateral",
          time: "09:15",
        },
      ],
    },
    {
      title: "27.08.22",
      data: [
        {
          id: "3",
          title: "Costas",
          description: "Puxada frontal",
          time: "08:00",
        },
      ],
    },
  ]);
  return (
    <VStack flex={1}>
      <ScreenHeader title="Histórico de exercícios" />
      <SectionList
        sections={exercises}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <HistoryCard
            title={item.title}
            description={item.description}
            time={item.time}
          />
        )}
        renderSectionHeader={({ section }) => (
          <Heading color="gray.200" fontSize="md" mt={10} mb={3}>
            {section.title}
          </Heading>
        )}
        px={8}
        contentContainerStyle={
          exercises.length === 0 && { flex: 1, justifyContent: "center" }
        }
        ListEmptyComponent={() => (
          <Text color="gray.100" textAlign="center">
            Não há exercícios registrados ainda.{"\n"} Vamos fazer um exercício
            hoje?
          </Text>
        )}
        showsVerticalScrollIndicator={false}
      />
    </VStack>
  );
}
