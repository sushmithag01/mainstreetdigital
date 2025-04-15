import { executePost } from "../ServiceMethods";

export const RedeemVoucherApi = async (data) => {
  try {
    const redeem = await executePost("/vms/redeemVoucher", data);
    const redeemData = redeem.data ? redeem.data : {};
    return redeemData;
  } catch (error) {
    return error;
  }
};