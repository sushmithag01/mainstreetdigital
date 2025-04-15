import { executePost } from "../ServiceMethods";

export const ExplorePopularDealsApi = async (data) => {
    try {
        const populardeals = await executePost("/vms/explorepopulardeals", data);
        const populardealsData = populardeals.data ? populardeals.data : {};
        return populardealsData;
    } catch (error) {
        return error;
    }
};