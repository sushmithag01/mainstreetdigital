import { executePost } from "../ServiceMethods";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const ExploreprofileImgApi = async () => {
    let data = {
        user_id : await AsyncStorage.getItem("userId")
}
    try {
        const getprofile = await executePost("/vms/profile_image", data);
        const getprofileData = getprofile.data ? getprofile.data : {};
        return getprofileData;
    } catch (error) {
        return error;
    }
};