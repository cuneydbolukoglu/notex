import axiosInstance from "@/services/axiosInstance";

const useArchivedNoteStore = (set, get) => ({
  archivedNotes: [],
  isLoading: false,
  currentNote: null,

  removeArchiveNote: async (id) => {
    try {
      await axiosInstance.delete(`/archived_notes/${id}.json`);
      console.log("Not silindi:", id);
      await get().getArchivedNotes();
    } catch (error) {
      console.error("Silme hatası:", error);
    }
  },

  archiveNote: async (noteId) => {
    try {
      // 1. Notu all_notes'tan al
      const response = await axiosInstance.get(`/all_notes/${noteId}.json`);
      const noteData = response.data;

      if (!noteData) {
        console.error("Taşınacak not bulunamadı");
        return;
      }

      // 2. archived_notes içine yaz
      await axiosInstance.put(`/archived_notes/${noteId}.json`, noteData);

      // 3. all_notes'tan sil
      await axiosInstance.delete(`/all_notes/${noteId}.json`);

      console.log("Not arşive taşındı:", noteId);

      // Opsiyonel: arşivli notları yeniden getir
      await get().getArchivedNotes();
    } catch (error) {
      console.error("Arşivleme hatası:", error);
    }
  },

  archiveNoteBack: async (noteId) => {
    try {
      const response = await axiosInstance.get(`/archived_notes/${noteId}.json`);
      const noteData = response.data;

      if (!noteData) {
        console.error("Taşınacak not bulunamadı");
        return;
      }

      await axiosInstance.put(`/all_notes/${noteId}.json`, noteData);

      await axiosInstance.delete(`/archived_notes/${noteId}.json`);

      console.log("Not taşındı:", noteId);

      // Opsiyonel: arşivli notları yeniden getir
      await get().getArchivedNotes();
    } catch (error) {
      console.error("Arşivleme hatası:", error);
    }
  },

  getArchivedNotes: async () => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get("/archived_notes.json");
      const archivedNotesArray = response?.data
        ? Object.entries(response.data)
          .map(([id, note]) => ({ id, ...note }))
          .sort((a, b) => b.id.localeCompare(a.created_date))
        : [];

      set({ archivedNotes: archivedNotesArray, isLoading: false });

      if (archivedNotesArray.length > 0) {
        set({ currentNote: archivedNotesArray[0] });
      }
    } catch (error) {
      console.error("Arşivlenmiş notları alma hatası:", error);
      set({ isLoading: false });
    }
  },
});

export default useArchivedNoteStore;