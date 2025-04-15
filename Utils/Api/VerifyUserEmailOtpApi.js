import { executePost } from "../ServiceMethods";
export const VerifyUserEmailOtpApi = async (email) => {
  try {
    const emailVerification = await executePost(
      "/vms/validateChangeEmailOtp",
      email
    );
    const emailVerificationData = emailVerification.data
      ? emailVerification.data
      : {};
    return emailVerificationData;
  } catch (error) {
    return error;
  }
};