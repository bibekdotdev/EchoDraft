// src/store/useBlogStore.js
import { create } from "zustand";
import { axiosInstanace } from "../lib/axios";

const useBlogStore = create((set, get) => ({
  form: { type: "" },
  content: [],
  images: {},
  previews: {},
  selectedBlock: "",
  typeError: false,
  allData: null,
  comments: null,

  // 🔧 State Setters
  setForm: (form) => set({ form }),
  setSelectedBlock: (block) => set({ selectedBlock: block }),
  setTypeError: (val) => set({ typeError: val }),
  setPreviews: (previews) => set({ previews }),

  // ➕ Add a block
  addBlock: (type, id = Date.now(), value = "") =>
    set((state) => {
      if (
        type !== "title" &&
        !state.content.some((item) => item.type === "title")
      ) {
        return state;
      }

      const newBlock = {
        id,
        type,
        value: value || (type === "image" ? null : ""),
      };

      // 🆕 If it's an image block and a value is provided, store in previews
      const updatedPreviews =
        type === "image" && value
          ? { ...state.previews, [id]: value }
          : { ...state.previews };

      return {
        content: [...state.content, newBlock],
        previews: updatedPreviews,
      };
    }),

  // 🔄 Update text/image block value
  updateValue: (id, value) =>
    set((state) => ({
      content: state.content.map((item) =>
        item.id === id ? { ...item, value } : item
      ),
    })),

  // 📷 Handle image file and preview
  handleImage: (id, file) => {
    const url = URL.createObjectURL(file);
    set((state) => ({
      images: { ...state.images, [id]: file },
      previews: { ...state.previews, [id]: url },
      content: state.content.map((item) =>
        item.id === id ? { ...item, value: url } : item
      ),
    }));
  },

  // ❌ Remove block by ID
  removeBlock: (id) =>
    set((state) => {
      const { [id]: _, ...restImages } = state.images;
      const { [id]: __, ...restPreviews } = state.previews;
      return {
        content: state.content.filter((item) => item.id !== id),
        images: restImages,
        previews: restPreviews,
      };
    }),

  // 🔄 Reset entire form
  resetForm: () =>
    set({
      form: { type: "" },
      content: [],
      images: {},
      previews: {},
      selectedBlock: "",
      typeError: false,
    }),

  // 📤 Create new blog block
  createBlock: async (formData) => {
    try {
      return await axiosInstanace.post("/blocks/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
    } catch (err) {
      console.error("createBlock error:", err);
      throw err;
    }
  },

  // 📥 Fetch all blogs
  fetchBlogs: async () => {
    return await axiosInstanace.get("/blocks/fetchBlogs");
  },

  // 📌 Store all blogs locally
  storeAllData: (allData) => {
    set({ allData });
  },

  // 🔍 Search blogs
  getSearchResult: async (value) => {
    return await axiosInstanace.get(`/blocks/getSearchResult/${value}`);
  },

  // 🔃 Filter blogs
  onFilterChange: async (selectedType, selectedSort, selectedTime) => {
    return await axiosInstanace.get(
      `/blocks/onFilterChange?type=${selectedType}&sort=${selectedSort}&time=${selectedTime}`
    );
  },

  // 👤 Get personal blog details
  getPeosonalDetails: async (id) => {
    return await axiosInstanace.get(`/blocks/getPeosonalDetails/${id}`);
  },

  // 👍 / 👎 Like or dislike handler
  hendleLikeDislike: async (id, likeordislike) => {
    return await axiosInstanace.put("/blocks/hendleLikeDislike", {
      id,
      likeordislike,
    });
  },

  // 💬 Fetch reviews/comments
  fetchReview: async (id) => {
    let comments = await axiosInstanace.put("/blocks/fetchReview", {
      id,
    });
    console.log("HI", comments.data.reviews);
    set({ comments: comments.data.reviews });
  },

  // ✍️ Submit review and refresh
  hendleReview: async (id, rating, comment) => {
    try {
      await axiosInstanace.post("/blocks/handleReview", {
        id,
        rating,
        comment,
      });

      await get().fetchReview(id);
    } catch (error) {
      console.error(
        "Failed to submit review:",
        error?.response?.data || error.message
      );
    }
  },
}));

export default useBlogStore;
