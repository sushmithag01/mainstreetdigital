import { executePost } from "../ServiceMethods";

export const SendVerficationCodeAPI = async (data) => {
  try {
    const SendVerficationCode = await executePost("/vms/changeMobileNumber", data);
    const SendVerficationCodeAPIData = SendVerficationCode.data ? SendVerficationCode.data : [];
    return SendVerficationCodeAPIData;
  } catch (error) {
    return error;
  }
}; 