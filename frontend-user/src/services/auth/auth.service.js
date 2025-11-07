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