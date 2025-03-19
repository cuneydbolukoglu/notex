import Button from '@mui/material/Button';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useEffect } from 'react';
import axiosInstance from "@/services/axiosInstance";
import utils from '@/utils';

export default function AllNotes() {
    useEffect(() => {
        // addNote();
        getAllNotes();
    }, []);

    const addNote = async () => {
        try {
            const response = await axiosInstance.post("/all_notes.json", {
                title: "React Performance",
                content: "Lorem ipsum dolar",
                tags: ["react"],
                created_date: utils.getCurrentDate(),
                updated_date: null,
            }, {
                headers: {
                    "Content-Type": "application/json"
                }
            });

            console.log(response.data);
        } catch (error) {
            console.error("Not ekleme hatası:", error);
        }
    };

    const getAllNotes = async () => {
        try {
            const response = await axiosInstance.get("/all_notes.json");
            console.log(response.data);
        } catch (error) {
            console.error("Veri çekme hatası:", error);
        }
    };

    return (
        <div>All notes</div>
    )
}
