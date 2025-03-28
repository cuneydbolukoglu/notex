import { useEffect, useState } from "react";
import { Button, Card, CardContent, Chip, Grid, Typography, Divider, Box } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faPlus, faTag } from "@fortawesome/free-solid-svg-icons";
import axiosInstance from "@/services/axiosInstance";
import SelectedNote from "../selectednote";

export default function AllNotes() {
    const [allNotes, setAllNotes] = useState([]);
    const [selectedNote, setSelectedNote] = useState(null);

    useEffect(() => {
        getAllNotes();
    }, []);

    const getAllNotes = async () => {
        try {
            const response = await axiosInstance.get("/all_notes.json");
            const notesArray = Object.values(response.data);
            setAllNotes(notesArray);
            if (notesArray.length > 0) {
                setSelectedNote(notesArray[0]); // İlk notu varsayılan olarak seç
            }
        } catch (error) {
            console.error("Veri çekme hatası:", error);
        }
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={3}>
                <Button fullWidth variant="contained">
                    <FontAwesomeIcon style={{ marginRight: 5 }} icon={faPlus} /> Create new note
                </Button>

                <Box mt={2}>
                    {allNotes.map((item, index) => (
                        <Card
                            key={index}
                            sx={{
                                marginBottom: 2,
                                cursor: "pointer",

                            }}
                            onClick={() => setSelectedNote(item)}
                        >
                            <CardContent>
                                <Typography variant="h6">{item.title}</Typography>
                                <Box mt={1}>
                                    {item.tags.map((tag, tagIndex) => (
                                        <Chip
                                            key={tagIndex}
                                            label={tag}
                                            sx={{ marginRight: 1, borderRadius: 1, height: 25 }}
                                        />
                                    ))}
                                </Box>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ marginTop: 1 }}
                                >
                                    {item.created_date}
                                </Typography>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            </Grid>

            <Grid item xs={12} sm={9}>
                {selectedNote ? (
                    <SelectedNote
                        selectedNote={selectedNote}
                    />
                ) : (
                    <Typography variant="body1" color="text.secondary">
                        Henüz bir not seçilmedi.
                    </Typography>
                )}
            </Grid>
        </Grid>
    );
}
