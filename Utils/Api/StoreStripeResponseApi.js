import { executePost } from "../ServiceMethods";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const StoreStripeResponseApi = async (data) => {
  try {
    let payload = {
        user_id: await AsyncStorage.getItem("userId"),
        user_email: await AsyncStorage.getItem("userEmail"),
        business_id: data.productinfo.business_id,
        product_id: data.productinfo.city_voucher_id,
        amount: data.productinfo.voucher_offer_price,
        city_id: parseInt(await AsyncStorage.getItem("city_id")),
        transaction_id : data.stripeResponse.id,
        success : true
    }
    const StoreStripeResponse = await executePost(
      "/vms/storestriperesp",
      payload
    );
    const StoreStripeResponseData = StoreStripeResponse.data ? StoreStripeResponse.data : {};
    return StoreStripeResponseData;
  } catch (error) {
    return error;
  }
};
