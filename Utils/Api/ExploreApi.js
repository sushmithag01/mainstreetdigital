import { executePost } from "../ServiceMethods";
import { userId } from "../LocalStorage";

const uid = userId();

export const ExploreApi = async (data) => {

  try {

    // const ExploreData = await executePost("/vms/voucherCouponLastest", data);
    const ExploreData = await executePost("/vms/mobilehomepage", data);
    const exploredata = ExploreData.data ? ExploreData.data : [];
    return (exploredata);
  } catch (error) {
    return error;
  }
};