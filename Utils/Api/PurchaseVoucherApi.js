import { executePost } from "../ServiceMethods";
import AsyncStorage from "@react-native-async-storage/async-storage";
export const PurchaseVoucherApi = async (data) => {

    try {
        let payload = {
            "amount": data.productinfo.voucher_offer_price,
            "business_id": data.productinfo.business_id,
            // "card_number": data.cardinfo.number.replace(/ /g, ''),
            "city_id": parseInt(await AsyncStorage.getItem("city_id")),
            // "cvv": data.cardinfo.cvc,
            "dataDescriptor": "COMMON.ACCEPT.INAPP.PAYMENT",
            // "expiry_date": data.cardinfo.expiry,
            "zipcode": "560108",
            "is_mobile": 1,
            "product_id": data.productinfo.city_voucher_id,
            "user_email": await AsyncStorage.getItem("userEmail"),
            "user_id": await AsyncStorage.getItem("userId")

        }
        // console.log("PurchaseVoucherApi payload",payload)
        const purchasevoucher = await executePost("/vms/purchaseVoucher", payload);
        const PurchasevoucherData = purchasevoucher.data ? purchasevoucher.data : {};
        // console.log("PurchasevoucherData", PurchasevoucherData)
        return PurchasevoucherData;
    } catch (error) {
        return error;
    }
};