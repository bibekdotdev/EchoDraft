// src/store/useBlogStore.js
import { create } from "zustand";
import { axiosInstanace } from "../lib/axios";

const useAdminStore = create((set, get) => ({
  form: { type: "" },
  content: [],
  images: {},
  previews: {},
  selectedBlock: "",
  typeError: false,
  allData: null,
  comments: null,

  fetchBlogs: async () => {
    return await axiosInstanace.get("/admin/adminBlogs");
  },

  storeAllData: (allData) => {
    set({ allData });
  },

  getscarchResult: async (value) => {
    return await axiosInstanace.get(`/admin/adminscarchResult/${value}`);
  },

  onFilterChange: async (selectedType, selectedSort, selectedTime) => {
    return await axiosInstanace.get(
      `/admin/onFilterChange?type=${selectedType}&sort=${selectedSort}&time=${selectedTime}`
    );
  },

  deletBlog: async (blogToDelete) => {
    await axiosInstanace.delete(`/admin/deleteBlog/${blogToDelete}`);
  },

  fetchBlogById: async (blogId) => {
    console.log(blogId);
    return await axiosInstanace.get(`/admin/fetchBlogById/${blogId}`);
  },
  sendForUPdateBLogs: async (blogId, formData) => {
    try {
      return await axiosInstanace.put(
        `/admin/updateBLogs/${blogId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
    } catch (err) {
      console.error("createBlock error:", err);
      throw err;
    }
  },
}));

export default useAdminStore;
