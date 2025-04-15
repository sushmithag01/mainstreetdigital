import { executePost } from "../ServiceMethods";

export const VerifyRedeemVoucherApi = async (data) => {
  try {
    const redeem = await executePost("/vms/verifyVoucherOtp", data);
    const redeemData = redeem.data ? redeem.data : {};
    return redeemData;
  } catch (error) {
    return error;
  }
};