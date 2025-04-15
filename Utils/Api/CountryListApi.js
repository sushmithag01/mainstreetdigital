import { executeGET, executePost } from "../ServiceMethods";

export const CountryListApi = async (data) => {
  try {
    const countrylist = await executePost("/vms/listofcountries",data);
    const CountryListData = countrylist.data ? countrylist.data : [];
    return CountryListData;
  } catch (error) {
    console.error(error);
    return error;
  }
};