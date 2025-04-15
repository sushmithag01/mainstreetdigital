import AsyncStorage from "@react-native-async-storage/async-storage";
import { executePost } from "../ServiceMethods";

export const CheckoutApi = async (data) => {
  try {
    const categorylist = await executePost("/vms/payment_check_out", data);
    const CategoryListData = categorylist.data ? categorylist.data : [];
    return CategoryListData;
  } catch (error) {
    return error;
  }
};