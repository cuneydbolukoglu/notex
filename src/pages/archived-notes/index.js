import { useEffect, useState } from "react";
import { Card, CardContent, Chip, Grid, Typography, Box } from "@mui/material";
import { useArchivedNoteStore } from "@/zustand";
import SelectedNote from "@/components/selectednote";

export default function ArchivedNotes() {
    const [archivedNote, setArchivedNote] = useState([]);
    const [selectedNote, setSelectedNote] = useState(null);
    const { getArchivedNotes, archivedNotes, currentNote } = useArchivedNoteStore();

    useEffect(() => {
        getArchivedNotes();
    }, []);

    useEffect(() => {
        setArchivedNote(archivedNotes);
    }, [archivedNotes]);

    useEffect(() => {
        setSelectedNote(currentNote);
    }, [currentNote]);

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={3}>
                <Box>
                    {archivedNotes?.map((item, index) => {
                        const isSelected =
                            selectedNote?.title === item.title &&
                            selectedNote?.created_date === item.created_date;

                        return (
                            <Card
                                key={index}
                                sx={{
                                    marginBottom: 2,
                                    cursor: "pointer",
                                    opacity: isSelected ? 1 : 0.6,
                                    transition: "opacity 0.3s ease, box-shadow 0.3s ease",
                                    "&:hover": {
                                        opacity: 1,
                                        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                                    },
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
                        )
                    })}
                </Box>
            </Grid>
            <Grid item xs={12} sm={9}>
                {
                    selectedNote != null &&
                    (
                        <SelectedNote
                            selectedNote={selectedNote}
                            archivedNote={true}
                        />
                    )
                }
            </Grid>
        </Grid>
    );
}

ArchivedNotes.pageTitle = "Archived Notes";