import { executePost } from "../ServiceMethods";

export const SocialLoginApi = async (LoginCredentials) => {
  try {
    const socialLoginApi = await executePost(
      "/vms/userSocioLogin",
      LoginCredentials
    );
    const SocialLoginApiData = socialLoginApi.data ? socialLoginApi.data : {};
    return SocialLoginApiData;
  } catch (error) {
    return error;
  }
};