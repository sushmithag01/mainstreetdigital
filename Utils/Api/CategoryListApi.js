import AsyncStorage from "@react-native-async-storage/async-storage";
import { executePost } from "../ServiceMethods";

export const CategoryListApi = async (data) => {
 
  try {
    const categorylist = await executePost("/vms/categorieslist", data);
    const CategoryListData = categorylist.data ? categorylist.data : [];
    return CategoryListData;
  } catch (error) {
    return error;
  }
};