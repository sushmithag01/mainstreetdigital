import { executePost } from "../ServiceMethods";

export const VerifyEmailOTPAPI = async (data) => {
  try {
    const VerifyEmailOtpCode = await executePost("/vms/validateChangeEmailOtp", data);
    const VerifyEmailOtpCodeData = VerifyEmailOtpCode.data ? VerifyEmailOtpCode.data : [];
    return VerifyEmailOtpCodeData;
  } catch (error) {
    return error;
  }
}; 