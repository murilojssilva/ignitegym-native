import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NativeStackNavigationProp } from "@react-navigation/native-stack/lib/typescript/src/types";
import { SignIn } from "@screens/SignIn";
import { SignUp } from "@screens/SignUp";

type AuthRoutesProps = {
  signIn: undefined;
  signUp: undefined;
};

export type AuthNavigatorRoutesProps =
  NativeStackNavigationProp<AuthRoutesProps>;

const { Navigator, Screen } = createNativeStackNavigator<AuthRoutesProps>();

export function AuthRoutes() {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen name="signIn" component={SignIn} />
      <Screen name="signUp" component={SignUp} />
    </Navigator>
  );
}
