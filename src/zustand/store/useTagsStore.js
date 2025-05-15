import axiosInstance from "@/services/axiosInstance";

const useTagsStore = (set, get) => ({
  tags: [],

  removeTags: async (id) => {
    try {
      await axiosInstance.delete(`/tags/${id}.json`);
      console.log("Tag silindi:", id);
    } catch (error) {
      console.error("Silme hatası:", error);
    }
  },

  getTags: async () => {
    try {
      const response = await axiosInstance.get("/tags.json");
      set({ tags: response && Object.values(response.data) });
    } catch (error) {
      console.error("Veri çekme hatası:", error);
    }
  },

});

export default useTagsStore;