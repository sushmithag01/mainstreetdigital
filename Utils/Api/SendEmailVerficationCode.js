import { executePost } from "../ServiceMethods";

export const SendEmailVerficationCodeAPI = async (data) => {
  try {
    const SendEmailVerficationCode = await executePost("/vms/changeEmailAddress", data);
    const SendEmailVerficationCodeData = SendEmailVerficationCode.data ? SendEmailVerficationCode.data : [];
    return SendEmailVerficationCodeData;
  } catch (error) {
    return error;
  }
}; 