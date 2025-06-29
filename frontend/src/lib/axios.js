import axios from "axios";
export const axiosInstanace = axios.create({
  baseURL: "https://echo-draft-lym8.onrender.com/api",
  withCredentials: true,
});
