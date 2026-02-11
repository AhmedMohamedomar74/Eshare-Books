import api, { clearTokens, setTokens } from "../../axiosInstance/axiosInstance";
import {
  loginStart,
  loginSuccess,
  loginFailure,
  registerStart,
  registerSuccess,
  registerFailure,
  setUserFromToken,
  logout as logoutAction,
} from "../slices/authReducer";

// Login action
export const login = (credentials) => async (dispatch) => {
  try {
    dispatch(loginStart());
    const response = await api.post("/auth/login", credentials);

    // According to the response structure from the backend
    const { user, accessToken, refreshToken } =
      response.data.data || response.data;

    // Save tokens using the helper function
    setTokens(accessToken, refreshToken);

    dispatch(
      loginSuccess({
        user,
      })
    );

    return { success: true };
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Login failed";
    dispatch(loginFailure(errorMessage));
    return { success: false, error: errorMessage };
  }
};

// Register action
export const register = (userData) => async (dispatch) => {
  try {
    dispatch(registerStart());
    const response = await api.post("/auth/signup", userData);

    const { user, accessToken, refreshToken } =
      response.data.data || response.data;

    // Save tokens
    setTokens(accessToken, refreshToken);

    dispatch(
      registerSuccess({
        user,
      })
    );

    return { success: true };
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Registration failed";
    dispatch(registerFailure(errorMessage));
    return { success: false, error: errorMessage };
  }
};

// Check auth (for auto-login from token)
export const checkAuth = () => async (dispatch) => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) return;

    // Make a request to the backend to get user data
    // Change this endpoint according to your API
    const response = await api.get("/user/profile");

    dispatch(
      setUserFromToken(
        response.data.data || response.data.user || response.data
      )
    );
  } catch (error) {
    // If the token is invalid, axios interceptor will handle it
    console.error("Auth check failed:", error);
    clearTokens();
  }
};

// Logout action
export const logoutUser = () => async (dispatch) => {
  try {
    // If you have a logout endpoint in the backend
    await api.post("/auth/logout");
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    // Clear tokens using the helper function
    clearTokens();
    dispatch(logoutAction());
  }
};
