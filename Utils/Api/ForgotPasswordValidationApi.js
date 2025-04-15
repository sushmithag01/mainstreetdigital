import { executePost } from "../ServiceMethods";

export const ForgotPasswordValidationApi = async (data) => {
  try {
    const validateOtp = await executePost("/vms/validateOtpForgot", data);
    const validateOtpData = validateOtp.data ? validateOtp.data : {};
    return validateOtpData;
  } catch (error) {
    return error;
  }
};