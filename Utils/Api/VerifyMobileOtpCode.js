import { executePost } from "../ServiceMethods";

export const VerifyMobileOtpCodeAPI = async (data) => {
  try {
    const VerifyMobileOtpCode = await executePost("/vms/validateChangeMobileOtp", data);
    const VerifyMobileOtpCodeData = VerifyMobileOtpCode.data ? VerifyMobileOtpCode.data : [];
    return VerifyMobileOtpCodeData;
  } catch (error) {
    return error;
  }
}; 