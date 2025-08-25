// userApi.js
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL_USERS || "http://localhost:5000/api/users";

export const getUserByUsername = async (username) => {
  const res = await axios.get(`${BASE_URL}/search/${username}`);
  return res.data;
};
