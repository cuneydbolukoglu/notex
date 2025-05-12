import axiosInstance from "@/services/axiosInstance";

const useAllNoteStore = (set, get) => ({
  notes: [],
  isLoading: false,
  currentNote: null,

  removeNote: async (id) => {
    try {
      await axiosInstance.delete(`/all_notes/${id}.json`);
      console.log("Not silindi:", id);
      await get().getNotes(); 
    } catch (error) {
      console.error("Silme hatası:", error);
    }
  },

  setLoading: (loading) => set({ isLoading: loading }),

  getNotes: async () => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get("/all_notes.json");
      const notesArray = response?.data
        ? Object.entries(response.data)
          .map(([id, note]) => ({ id, ...note }))
          .sort((a, b) => b.id.localeCompare(a.created_date))
        : [];
      set({ notes: notesArray, isLoading: false });

      if (notesArray.length > 0) {
        set({ currentNote: notesArray[0] });
      }
    } catch (error) {
      console.error("Veri çekme hatası:", error);
      set({ isLoading: false });
    }
  },

  setCurrentNote: (currentNote) => set({ currentNote: currentNote }),

});

export default useAllNoteStore;