import {
  Center,
  Heading,
  ScrollView,
  Skeleton,
  Text,
  VStack,
} from "native-base";
import { ScreenHeader } from "./ScreenHeader";
import { UserPhoto } from "@components/UserPhoto";
import { useState } from "react";
import { TouchableOpacity } from "react-native";
import { Input } from "@components/Input";
import { Button } from "@components/Button";

const PHOTO_SIZE = 33;

export function Profile() {
  const [photoIsLoading, setPhotoIsLoading] = useState(false);

  return (
    <VStack flex={1}>
      <ScreenHeader title="Perfil" />
      <ScrollView>
        <Center mt={6} px={10}>
          {photoIsLoading ? (
            <Skeleton
              w={PHOTO_SIZE}
              h={PHOTO_SIZE}
              rounded="full"
              startColor="gray.500"
              endColor="gray.400"
            />
          ) : (
            <UserPhoto
              alt="Foto do usuário"
              size={PHOTO_SIZE}
              source={{ uri: "https://github.com/murilojssilva.png" }}
            />
          )}
          <TouchableOpacity>
            <Text
              color="green.500"
              fontWeight="bold"
              fontSize="md"
              mt={2}
              mb={8}
            >
              Alterar foto
            </Text>
          </TouchableOpacity>
          <Input placeholder="Nome" bg="gray.600" />
          <Input value="murilojssilva@outlook.com" bg="gray.600" isDisabled />
        </Center>
        <VStack px={10} mt={12}>
          <Heading color="gray.200" fontSize="md" mb={2}>
            Alterar senha
          </Heading>
          <Input placeholder="Senha antiga" secureTextEntry bg="gray.600" />
          <Input placeholder="Nova senha" secureTextEntry bg="gray.600" />
          <Input
            placeholder="Confirme nova senha"
            secureTextEntry
            bg="gray.600"
          />
          <Button title="Atualizar" />
        </VStack>
      </ScrollView>
    </VStack>
  );
}
