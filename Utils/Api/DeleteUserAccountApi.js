import { executePost } from "../ServiceMethods";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const DeleteUserAccountApi = async () => {
  let data = {
    user_id : await AsyncStorage.getItem('userId')
  }
  try {
    const deleteAccountData = await executePost("/vms/deleteEndUser", data);
    const deleteAccountDataRes = deleteAccountData.data ? deleteAccountData.data : {};
    return deleteAccountDataRes;
  } catch (error) {
    console.error(error);
    return error;
  }
};