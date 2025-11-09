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


export const uploadImage = async (file , id) => {
  try {
    // Create FormData object
    const formData = new FormData();
    formData.append('image', file); // 'image' must match the field name in upload.single("image")
    formData.append("id", id);
    // Optional: Add additional data if needed
    // formData.append('userId', '123');
    // formData.append('description', 'Profile picture');
    
    const response = await api.post('/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};