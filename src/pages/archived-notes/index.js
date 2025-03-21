import { useEffect } from 'react';
import axiosInstance from "@/services/axiosInstance";

export default function ArchivedNotes() {
    useEffect(() => {
        getArchivedNotes();
    }, []);

    const getArchivedNotes = async () => {
        try {
            const response = await axiosInstance.get("/archived_notes.json");
            console.log(response.data);
        } catch (error) {
            console.error("Veri çekme hatası:", error);
        }
    };

    return (
        <div>Archived notes</div>
    )
}