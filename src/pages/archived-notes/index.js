import Button from '@mui/material/Button';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useEffect } from 'react';
import utils from '@/utils';
import axios from 'axios';

export default function ArchivedNotes() {
    const API = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL;
    const token = utils.cookieManager.get("token");

    useEffect(() => {
        // axios.post(`${API}/archived_notes.json?auth=${token}`, {
        //     title: "React Performance",
        //     content: "Lorem ipsum dolar",
        //     tags: ["react"],
        //     created_date: utils.getCurrentDate(),
        //     updated_date: null,
        // }, {
        //     headers: {
        //         "Content-Type": "application/json"
        //     }
        // })
        //     .then((response) => {
        //         console.log(response);
        //     })
        //     .catch((error) => {
        //         console.log(error);
        //     });

        axios.get(`${API}/archived_notes.json?auth=${token}`)
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    return (
        <div>Archived notes</div>
    )
}
