import { executePost } from "../ServiceMethods";
import { setUserCredentials } from "../LocalStorage";

export const SignInApi = async (LoginCredentials) => {
  try {
    const UserLogin = await executePost("/vms/SignIn", LoginCredentials);
    const UserLoginData = UserLogin.data ? UserLogin.data : {};
    setUserCredentials(UserLoginData);
    return UserLoginData;
  } catch (error) {
    return error;
  }
};