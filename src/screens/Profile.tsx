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

import { ScreenHeader } from "../components/ScreenHeader";
import { UserPhoto } from "@components/UserPhoto";
import { useState } from "react";
import { TouchableOpacity } from "react-native";
import { Input } from "@components/Input";
import { Button } from "@components/Button";

import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import * as Yup from "yup";

import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "@hooks/useAuth";
import { AppError } from "@utils/AppError";
import { api } from "@services/api";

type FormDataProps = {
  name: string;
  email: string;
  old_password: string;
  password: string;
  confirm_password: string;
};

const profileSchema = Yup.object({
  name: Yup.string().required("Informe o nome."),

  password: Yup.string()
    .min(6, "A nova senha precisa ter pelo menos 6 dígitos")
    .nullable()
    .transform((value) => (!!value ? value : null)),
  confirm_password: Yup.string()
    .nullable()
    .transform((value) => (!!value ? value : null))
    .oneOf([Yup.ref("password")], "A confirmação da nova senha não confere.")
    .when("password", {
      is: (Field: any) => Field,
      then: (schema) =>
        schema
          .nullable()
          .required("Informe a confirmação da nova senha")
          .transform((value) => (!!value ? value : null)),
    }),
});

const PHOTO_SIZE = 33;

export function Profile() {
  const [isUpdating, setIsUpdating] = useState(false);
  const { user, updateUserProfile } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataProps>({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      name: user?.name,
      email: user?.email,
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
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Não foi possível atualizar a foto";

      toast.show({
        title,
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setPhotoIsLoading(false);
    }
  }

  async function handleProfileUpdate(data: FormDataProps) {
    try {
      setIsUpdating(true);

      const userUpdated = user;
      userUpdated.name = data.name;

      await api.put("/users", data);

      await updateUserProfile(userUpdated);

      toast.show({
        title: "Perfil atualizado com sucesso!",
        placement: "top",
        bgColor: "green.500",
      });
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : "Não foi possível atualizar o perfil. Tente novamente mais tarde.";

      toast.show({
        title,
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setIsUpdating(false);
    }
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
            render={({ field: { onChange } }) => (
              <Input
                onChangeText={onChange}
                placeholder="Senha antiga"
                secureTextEntry
                bg="gray.600"
              />
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <Input
                onChangeText={onChange}
                value={value}
                placeholder="Nova senha"
                secureTextEntry
                bg="gray.600"
                returnKeyType="send"
                errorMessage={errors.password?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="confirm_password"
            render={({ field: { onChange, value } }) => (
              <Input
                onChangeText={onChange}
                value={value}
                placeholder="Confirme a nova senha"
                secureTextEntry
                bg="gray.600"
                returnKeyType="send"
                errorMessage={errors.confirm_password?.message}
                onSubmitEditing={handleSubmit(handleProfileUpdate)}
              />
            )}
          />

          <Button
            title="Atualizar"
            onPress={handleSubmit(handleProfileUpdate)}
            isLoading={isUpdating}
          />
        </Center>
      </ScrollView>
    </VStack>
  );
}
