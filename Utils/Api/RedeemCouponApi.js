import { executePost } from "../ServiceMethods";

export const RedeemCopounApi = async (data) => {
  try {
    const redeem = await executePost("/vms/redeemCoupon", data);
    const redeemData = redeem.data ? redeem.data : {};
    return redeemData;
  } catch (error) {
    return error;
  }
};