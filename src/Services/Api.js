import axios from "axios";
import { BASE_URL } from "../Api/Api_variables.js";

export async function apiRequest(options) {
  const { endpoint, method = "GET", data, headers } = options;

  const config = {
    url: `${BASE_URL}${endpoint}`,
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    data,
  };

  try {
    const response = await axios.request(config);
    // console.log("✅ API Response:", response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError && axios.isAxiosError(error)) {
      console.error(" API Error:", error.response?.data || error.message);
      // console.log("Error response data:", error.response?.data);
      // console.log("Error message:", error.response?.data?.message);
      throw error;
    } else {
      console.error(" Unexpected Error:", error);
      throw error;
    }
  }
}
