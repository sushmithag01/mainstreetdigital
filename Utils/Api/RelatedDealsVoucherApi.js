import { executePost } from "../ServiceMethods";

export const RelatedDealsVoucherApi = async (data) => {
    try {
        const populardeals = await executePost("/vms/voucherCouponRelatedDeals", data);
        const populardealsData = populardeals.data ? populardeals.data : {};
        return populardealsData;
    } catch (error) {
        return error;
    }
};