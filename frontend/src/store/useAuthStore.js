import { create } from "zustand";
import axios from "axios";
import { axiosInstanace } from "../lib/axios";
const useAutStore = create((set, get) => ({
  id: null,
  Auth: null,
  forOtpWithData: (payload) => {
    return axiosInstanace.post("/Auth/otp", payload);
  },

  pushId: (id) => {
    set({ id });
    console.log("id is saved ");
  },
  signUPRequestWith_verifyOtp: async (otp) => {
    let id = get().id;
    console.log(otp, id);
    let output = await axiosInstanace.post("/Auth/verify-otp", { otp, id });
    set({ Auth: output.data.email });
    console.log(get().Auth);
    return output;
  },
  call_Signin_routes: async (payload) => {
    let output = await axiosInstanace.post("/Auth/signin", { payload });
    set({ Auth: output.data.email });
    console.log(get().Auth);
    return output;
  },

  clerk_auth: async (payload) => {
    console.log("brfore call", get().Auth);
    let output = await axiosInstanace.post("/Auth/clerk-auth", { payload });
    set({ Auth: output.data.email });
    console.log("after call", get().Auth);
    return output;
  },
  callSingout: async () => {
    try {
      set({ Auth: null });
      console.log("auth is", get().Auth);
      let output = await axiosInstanace.post("/Auth/signOut");
      set({ Auth: null });
      console.log(get().Auth);
      return output;
    } catch (err) {
      console.error(
        "Logout error:",
        err.response?.data?.message || err.message
      );

      return null;
    }
  },

  checkLogin: async () => {
    try {
      const output = await axiosInstanace.get("/Auth/checkLogin");
      set({ Auth: output.data.user });
    } catch (error) {
      console.error(
        "Login check failed:",
        error.response?.data || error.message
      );
      set({ Auth: null }); // Optional: clear auth state on failure
    }
  },
}));

export default useAutStore;
