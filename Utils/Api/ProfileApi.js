import { executePost } from "../ServiceMethods";

export const ProfileApi = async (data) => {
  try {
    const ProfileInfo = await executePost("/vms/endUserProfile", data);
    const ProfileApiData = ProfileInfo.data ? ProfileInfo.data : [];
    // console.log("ProfileApiData",ProfileApiData)
    return ProfileApiData;
  } catch (error) {
    console.log("data",error)
    return error;
   
  }
}; 