import { executePost } from "../ServiceMethods";
export const VoucherDetailApi = async (voucherId) => {
  try {
    const voucherdetail = await executePost("/vms/voucherdetail", voucherId);    
    const voucherdetailData = voucherdetail.data ? voucherdetail.data : {};
    return voucherdetailData;
  } catch (error) {
    return error;
  }
};