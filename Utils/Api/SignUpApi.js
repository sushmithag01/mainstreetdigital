import { executePost } from "../ServiceMethods";
import { setUserEmailId } from "../LocalStorage";
import { setUserCredentials } from "../LocalStorage";

export const SignUpApi = async (SignUpCredentials) => {
    
  try {
    const UserSignUp = await executePost("/vms/SignUp", SignUpCredentials);
    const UserSignUpData = UserSignUp.data.status ? UserSignUp.data.status : {};
    const UserEmail = UserSignUp.data.eu_email ? UserSignUp.data.eu_email:"";
    setUserCredentials(UserSignUp.data);
    setUserEmailId(UserEmail);
    return UserSignUp.data;
  } catch (error) {
    return error;
  }
};