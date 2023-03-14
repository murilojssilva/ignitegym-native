import {
  Center,
  Heading,
  ScrollView,
  Skeleton,
  Text,
  VStack,
  useToast,
} from "native-base";
import { useForm, Controller } from "react-hook-form";

import { ScreenHeader } from "./ScreenHeader";
import { UserPhoto } from "@components/UserPhoto";
import { useState } from "react";
import { TouchableOpacity } from "react-native";
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

type FormDataProps = {
  name: string;
  email: string;
  old_password: string;
  new_password: string;
  new_password_confirm: string;
};

const editSchema = Yup.object({
  name: Yup.string().required("Informe o nome."),
  email: Yup.string().required("Informe o e-mail.").email("E-mail inválido"),
  old_password: Yup.string()
    .required("Informe a senha.")
    .min(6, "A senha antiga possui, pelo menos, 6 dígitos"),
  new_password: Yup.string()
    .required("Informe a senha.")
    .min(6, "A nova senha precisa ter pelo menos 6 dígitos"),
  new_password_confirm: Yup.string()
    .required("Confirme a senha.")
    .oneOf(
      [Yup.ref("new_password")],
      "A confirmação da nova senha não confere."
    ),
});

const PHOTO_SIZE = 33;

export function Profile() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataProps>({
    resolver: yupResolver(editSchema),
    defaultValues: {
      name: "Murilo",
      email: "murilojssilva@outlook.com",
    },
  });
  const [photoIsLoading, setPhotoIsLoading] = useState(false);
  const [userPhoto, setUserPhoto] = useState(
    "https://github.com/murilojssilva.png"
  );

  const toast = useToast();

  async function handleUserPhotoSelect() {
    setPhotoIsLoading(true);
    try {
      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true,
      });

      if (photoSelected.canceled) {
        return;
      }

      if (photoSelected.assets[0].uri) {
        const photoInfo = await FileSystem.getInfoAsync(
          photoSelected.assets[0].uri
        );

        if (photoInfo.size && photoInfo.size / 1024 / 1024 > 5) {
          return toast.show({
            title: "Essa imagem é muito grande. Escolha uma de até 5MB.",
            placement: "top",
            bgColor: "red.500",
          });
        }

        setUserPhoto(photoSelected.assets[0].uri);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setPhotoIsLoading(false);
    }
  }

  function handleEditProfile(data: FormDataProps) {
    console.log(data);
  }
  return (
    <VStack flex={1}>
      <ScreenHeader title="Perfil" />
      <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
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
              source={{ uri: userPhoto }}
            />
          )}
          <TouchableOpacity onPress={handleUserPhotoSelect}>
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
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <Input
                onChangeText={onChange}
                value={value}
                placeholder="Nome"
                errorMessage={errors.name?.message}
                bg="gray.600"
              />
            )}
          />
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <Input
                onChangeText={onChange}
                value={value}
                placeholder="E-mail"
                keyboardType="email-address"
                autoCapitalize="none"
                errorMessage={errors.email?.message}
                bg="gray.600"
                isDisabled
              />
            )}
          />
        </Center>
        <Center px={10} mt={12}>
          <Heading
            color="gray.200"
            fontSize="md"
            mb={2}
            alignSelf="flex-start"
            fontFamily="heading"
            mt={12}
          >
            Alterar senha
          </Heading>
          <Controller
            control={control}
            name="old_password"
            render={({ field: { onChange, value } }) => (
              <Input
                onChangeText={onChange}
                value={value}
                placeholder="Senha antiga"
                secureTextEntry
                errorMessage={errors.old_password?.message}
                bg="gray.600"
              />
            )}
          />
          <Controller
            control={control}
            name="new_password"
            render={({ field: { onChange, value } }) => (
              <Input
                onChangeText={onChange}
                value={value}
                placeholder="Nova senha"
                secureTextEntry
                bg="gray.600"
                returnKeyType="send"
                errorMessage={errors.new_password?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="new_password_confirm"
            render={({ field: { onChange, value } }) => (
              <Input
                onChangeText={onChange}
                value={value}
                placeholder="Confirme a nova senha"
                secureTextEntry
                bg="gray.600"
                returnKeyType="send"
                errorMessage={errors.new_password_confirm?.message}
                onSubmitEditing={handleSubmit(handleEditProfile)}
              />
            )}
          />

          <Button title="Atualizar" onPress={handleSubmit(handleEditProfile)} />
        </Center>
      </ScrollView>
    </VStack>
  );
}
