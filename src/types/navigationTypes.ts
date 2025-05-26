import { User } from "../store/user/userSlices";

export type RootStackParamList = {
  LoginScreen: undefined;
  SignupScreen: undefined;
  HomeScreen: undefined;
  ChatScreen: undefined;
  MessageScreen: {selectedUser: User};
  NotificationScreen: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
