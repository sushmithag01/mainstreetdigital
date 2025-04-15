import { executePost } from "../ServiceMethods";

export const UpdateEditProfileAPI = async (data) => {
  try {
    const UpdateEditProfile = await executePost("/vms/updateProfile", data);
    const UpdateEditProfileData = UpdateEditProfile.data ? UpdateEditProfile.data : [];
    return UpdateEditProfileData;
  } catch (error) {
    return error;
  }
}; 