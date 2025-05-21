import { useEffect, useState } from "react";
import { Card, CardContent, Chip, Grid, Typography, Box } from "@mui/material";
import { useArchivedNoteStore } from "@/zustand";
import SelectedNote from "@/components/selectednote";

export default function ArchivedNotes() {
    // const [archivedNotes, setArchivedNotes] = useState([]);
    const [selectedNote, setSelectedNote] = useState(null);
    const { getArchivedNotes, archivedNotes } = useArchivedNoteStore();

    useEffect(() => {
        getArchivedNotes();
    }, []);

    useEffect(() => {
        // setArchivedNotes(archivedNotes);
        console.log(archivedNotes);
    }, [archivedNotes]);

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={3}>
                <Box>
                    {archivedNotes?.map((item, index) => (
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
                {
                    selectedNote != null &&
                    (
                        <SelectedNote
                            selectedNote={selectedNote}
                        />
                    )
                }
            </Grid>
        </Grid>
    );
}

ArchivedNotes.pageTitle = "Archived Notes";