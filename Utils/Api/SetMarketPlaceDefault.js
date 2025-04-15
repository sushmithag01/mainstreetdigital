import { executePost } from "../ServiceMethods";


export const MakeDefaultMarketPlaceApi = async (LoginCredentials) => {
  try {
    const UserLogin = await executePost("/vms/set-default-marketplace", LoginCredentials);
    const UserLoginData = UserLogin.data ? UserLogin.data : {};
    return UserLoginData;
  } catch (error) {
    return error;
  }
};