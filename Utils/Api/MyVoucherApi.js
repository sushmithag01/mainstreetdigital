import { executePost } from "../ServiceMethods";

export const MyVoucherApi = async (data) => {
  try {
    const activeVouchers = await executePost("/vms/myVouchers",data);
    const activeVouchersData = activeVouchers.data ? activeVouchers.data : {};
    return activeVouchersData;
  } catch (error) {
    return error;
  }
};