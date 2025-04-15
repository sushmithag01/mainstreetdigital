import { executePost } from "../ServiceMethods";

export const CouponsDownloadAPI = async (data) => {
  try {
    const CouponsDownloadApi = await executePost("/vms/downloadCoupon", data);
    const CouponsDownloadApiData = CouponsDownloadApi.data ? CouponsDownloadApi.data : [];
    return CouponsDownloadApiData;
  } catch (error) {
    return error;
  }
}; 