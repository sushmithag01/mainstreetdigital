import { executePost } from "../ServiceMethods";

export const VerifySignOtpApi = async (data) => {
  try {
    const VerifyOtp = await executePost("/vms/verifyUserEmail", data);
    const VerifyOtpRes = VerifyOtp.data ? VerifyOtp.data : {};
    return VerifyOtpRes;
  } catch (error) {
    // return "Something went wrong..!!";
    return error;
  }
};