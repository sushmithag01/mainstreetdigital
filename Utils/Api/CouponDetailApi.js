import { executePost } from "../ServiceMethods";
export const CouponDetailApi = async (couponId) => {
  try {
    const coupondetail = await executePost("/vms/viewCouponDetails", couponId);
    const coupondetailData = coupondetail.data ? coupondetail.data : {};
    return coupondetailData;
  } catch (error) {
    console.error(error);
    return error;
  }
};