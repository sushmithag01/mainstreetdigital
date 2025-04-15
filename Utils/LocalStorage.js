import AsyncStorage from '@react-native-async-storage/async-storage';

export const setUserCredentials = async (user) => {
  const token = user.jwt_token ? user.jwt_token : "";
  const UserId = user.uid ? user.uid : "";
  const userName = user.first_name ? user.first_name : "";
  const userEmail = user.eu_email ? user.eu_email : "";
  const userCityId = user.user_city_id ? user.user_city_id : "";
  const userCityName = user.user_city_name ? user.user_city_name : "";
  await AsyncStorage.setItem("token", token);
  await AsyncStorage.setItem("userId", JSON.stringify(UserId));
  await AsyncStorage.setItem("user", user ? JSON.stringify(user) : null);
  await AsyncStorage.setItem("username", user ? JSON.stringify(userName) : null);
  await AsyncStorage.setItem("userEmail", user ? userEmail : null);
  await AsyncStorage.setItem("city_id", user ? JSON.stringify(userCityId) : null);
  await AsyncStorage.setItem("user_city_name", user ? userCityName : null);
};

export const setUserEmailId = async (email) => {
  const useremail = email ? email : "";
  await AsyncStorage.setItem("userEmail", useremail);
}

export const getUser = async () => {
  const userData = await AsyncStorage.getItem("user");
  if (userData !== null) {
    return JSON.parse(userData);
    // console.log(JSON.parse(userData));
  }
  return null;
};

export const getCityId = async () => {
  const city_Id = await AsyncStorage.getItem("city_id");
  const cityId = JSON.parse(city_Id);
  if (cityId !== null) {
    return cityId;
  }
  return null;
};

export const getToken = async () => {
  const token = await AsyncStorage.getItem("token");
  // console.log(token);
  if (token !== null) {
    return token;
  }
  return null;
};

export const getUserName = async () => {
  const userName = await AsyncStorage.getItem("username");
  // console.log(token);
  if (userName !== null) {
    return userName;
  }
  return null;
};

export const userId = async () => {
  const userId = await AsyncStorage.getItem("userId");
  if (userId !== null) {
    return userId;
  }
  return null;
};

export const AddcityId = async (data) => {
  // console.log("local ",data)
  await AsyncStorage.setItem("city_id", data ? JSON.stringify(data) : null);
};

export const setCityNameLocale = async (data) => {
  await AsyncStorage.setItem("city_name", JSON.stringify(data));
  await AsyncStorage.setItem("user_city_name", data ? data : null);
}

export const setAppleResponse = async (data) => {
  await AsyncStorage.setItem("apple_token", JSON.stringify(data.authorizationCode));
  await AsyncStorage.setItem("apple_email", JSON.stringify(data.email));
  await AsyncStorage.setItem("apple_response", JSON.stringify(data));
}

export const removeUserData = async () => {
  await AsyncStorage.removeItem("userId");
  await AsyncStorage.removeItem("city_id");
  await AsyncStorage.removeItem("username");
  await AsyncStorage.removeItem("token");
  await AsyncStorage.removeItem("user");
  await AsyncStorage.removeItem("userEmail");
  await AsyncStorage.removeItem("city_name");
  await AsyncStorage.clear();
}

