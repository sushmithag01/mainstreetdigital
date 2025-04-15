import { executePost } from "../ServiceMethods";

export const MyCouponApi = async (data) => {
  try {
    const couponsData = await executePost("/vms/myCoupons", data);
    const CouponsData = couponsData.data ? couponsData.data : [];
    return CouponsData;
  } catch (error) {
    return error;
  }
};