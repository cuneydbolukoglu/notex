import axiosInstance from "@/services/axiosInstance";

const useTagsStore = (set, get) => ({
  tags: [],

  addTag: async (newTag) => {
    try {
      const response = await axiosInstance.post("/tags.json", newTag);
      const id = response.data?.name;

      const tagWithId = { id, ...newTag };
      set({ tags: [...get().tags, tagWithId] });

      console.log("Yeni tag eklendi:", tagWithId);
    } catch (error) {
      console.error("Tag ekleme hatası:", error);
    }
  },

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
      set({ tags: response && Object.entries(response.data).map(([id, note]) => ({ id, ...note })) });
    } catch (error) {
      console.error("Veri çekme hatası:", error);
    }
  },

});

export default useTagsStore;