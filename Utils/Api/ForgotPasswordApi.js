import { executePost } from "../ServiceMethods";

export const ForgotPasswordApi = async (ForgotPsswordCredentials) => {
  try {
    const forgotPassword = await executePost(
      "/vms/forgotPasswordnew",
      ForgotPsswordCredentials
    );
    const forgotpasswordData = forgotPassword.data ? forgotPassword.data : {};
    console.log(forgotpasswordData);
    return forgotpasswordData;

  } catch (error) {
    return error;
  }
};