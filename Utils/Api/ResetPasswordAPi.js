import { executePost } from "../ServiceMethods";

export const ResetPasswordAPI = async (data) => {
  try {
    const ResetPasswordAPi = await executePost("/vms/resetPwdEndUser", data);
    const ResetPasswordAPiData = ResetPasswordAPi.data ? ResetPasswordAPi.data : [];
    return ResetPasswordAPiData;
  } catch (error) {
    return error;
  }
}; 