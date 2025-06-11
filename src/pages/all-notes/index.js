import { useEffect, useState } from "react";
import { Button, Card, CardContent, Chip, Grid, Typography, Box } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import SelectedNote from "../../components/selectednote";
import CreateNote from "../../components/createnote";
import { useAllNoteStore } from "@/zustand";

export default function AllNotes() {
    const [allNotes, setAllNotes] = useState([]);
    const [selectedNote, setSelectedNote] = useState(null);
    const [createNote, setCreateNote] = useState(false);
    const { notes, getNotes, currentNote } = useAllNoteStore();

    useEffect(() => {
        getNotes();
    }, []);

    useEffect(() => {
        setAllNotes(notes);
    }, [notes]);

    useEffect(() => {
        setSelectedNote(currentNote);
    }, [currentNote]);

    const createNewNote = () => {
        setCreateNote(true);
        setSelectedNote(null);
    }

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={3}>
                <Button
                    fullWidth
                    variant="contained"
                    style={{ height: 40 }}
                    onClick={() => createNewNote()}
                    startIcon={<FontAwesomeIcon icon={faPlus} />}
                >
                    Create new note
                </Button>
                <Box mt={3}>
                    {allNotes?.map((item, index) => {
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
                                        {item.tags?.map((tag, tagIndex) => (
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
                        );
                    })}

                    {/* {allNotes?.map((item, index) => (
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
                    ))} */}
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
                {
                    selectedNote === null && createNote &&
                    (
                        <CreateNote />
                    )
                }
            </Grid>
        </Grid>
    );
}

AllNotes.pageTitle = "All Notes";