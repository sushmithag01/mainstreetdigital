import axios from "axios";
import { REACT_APP_BASE_URL } from "./Constants";
import AsyncStorage from "@react-native-async-storage/async-storage";



export const executePost = async (endpoint, data) => {
    let Auth_Token = await AsyncStorage.getItem("token");
    const header = {
        Accept: "application/json",
        "Content-Type": "application/json",
        Token: await AsyncStorage.getItem("token"),
    }
    // console.log("header", header)
    return await axios.post(REACT_APP_BASE_URL + endpoint, data, { headers: header });
}

export const executeGET = async (endPoint) => {
    let Auth_Token = await AsyncStorage.getItem("token");
    const header = {
        Accept: "application/json",
        "Content-Type": "application/json",
        Token: Auth_Token,
    }
    return await axios.get(REACT_APP_BASE_URL + endPoint, { headers: header });
};