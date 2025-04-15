import { executePost } from "../ServiceMethods";

export const CreateNewPasswordApi = async (data) => {
  try {
    const CreatePswd = await executePost("/vms/resetPassword_U", data);
    const CreatePswdRes = CreatePswd.data ? CreatePswd.data : {};
    return CreatePswdRes;
  } catch (error) {
    return error;
  }
};