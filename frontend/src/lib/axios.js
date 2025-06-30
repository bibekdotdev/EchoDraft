import axios from "axios";
export const axiosInstanace = axios.create({
  baseURL: "https://echo-draft-it48.onrender.com/api",
  withCredentials: true,
});
