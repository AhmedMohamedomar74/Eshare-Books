import api, { setTokens } from "../../axiosInstance/axiosInstance.js";

export const login = async (email, password) => {
  try {
    const response = await api.post("/auth/login", { email, password });
    const { accessToken, refreshToken } = response.data.data;
    console.log({ accessToken, refreshToken });
    setTokens(accessToken, refreshToken);
    return response.data.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const register = async ( firstName , secondName, email, password) => {
  try {
    const response = await api.post("/auth/signup", { firstName , secondName, email, password });
    const registerresponse = response.data;
    return registerresponse;
  } catch (error) {
    console.log(error);
    throw error;
  }
};