import { Button, Card, CardContent, Chip, Typography, Divider, Box, Grid, TextField, Select, MenuItem } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArchive, faClock, faNoteSticky, faTag, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useAllNoteStore, useTagsStore, useArchivedNoteStore } from "@/zustand";
import { useEffect, useState } from "react";
import axiosInstance from "@/services/axiosInstance";
import utils from "@/utils";
import TextEditor from "../textEditor";

export default function SelectedNote({ selectedNote, archivedNote }) {
    const { removeNote, getNotes } = useAllNoteStore();
    const { tags } = useTagsStore();
    const { archiveNote, removeArchiveNote, archiveNoteBack } = useArchivedNoteStore();

    const [editedTitle, setEditedTitle] = useState("");
    const [editedContent, setEditedContent] = useState("");
    const [editedTags, setEditedTags] = useState([]);

    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [isEditingContent, setIsEditingContent] = useState(false);
    const [isEditingTags, setIsEditingTags] = useState(false);

    useEffect(() => {
        setEditedTitle(selectedNote.title);
        setEditedContent(selectedNote.content);
        setEditedTags(selectedNote.tags || []);
    }, [selectedNote]);

    const handleArchive = async (id) => {
        archiveNote(id);
    }

    const handleSave = async () => {
        try {
            await axiosInstance.put(`/all_notes/${selectedNote.id}.json`, {
                id: selectedNote.id,
                title: editedTitle,
                content: editedContent,
                tags: editedTags,
                edited_date: utils.getCurrentDate(),
                created_date: selectedNote.created_date,
            }, {
                headers: { "Content-Type": "application/json" }
            });
            getNotes();
            console.log("Not düzenlendi:");
        } catch (error) {
            console.error("Düzenleme hatası:", error);
        }
        setIsEditingTitle(false);
        setIsEditingContent(false);
        setIsEditingTags(false);
    };

    const renderEditableText = ({
        isEditing,
        value,
        setValue,
        onFinishEdit,
        multiline = false,
        variant = "h5",
        setIsEditing, // dışarıdan prop olarak alınmalı
    }) => {
        if (isEditing) {
            return (
                <TextEditor
                    value={value}
                    onChange={setValue}
                    onBlur={onFinishEdit}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !multiline && !e.shiftKey) {
                            e.preventDefault();
                            onFinishEdit();
                        }
                    }}
                    autoFocus
                    multiline={multiline}
                    rows={multiline ? 6 : 1}
                />
            );
        }

        return (
            <Typography
                onClick={() => {
                    if (variant === "h5") setIsEditingTitle(true);
                    else setIsEditingContent(true);
                }}
                sx={{ cursor: "pointer", mb: variant === "h5" ? 3 : 0 }}
                variant={variant}
            >
                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: value }} />
            </Typography>
        );
    };

    const renderEditableSelect = ({
        isEditing,
        value,
        onChange,
        onFinishEdit,
        options = [],
    }) => isEditing ? (
        <Select
            multiple
            fullWidth
            value={value}
            onChange={onChange}
            onClose={onFinishEdit}
            autoFocus
        >
            {options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                    {option.name}
                </MenuItem>
            ))}
        </Select>
    ) : (
            value.map((tag, index) => (
                <Chip
                    key={index}
                    label={tag}
                    onClick={() => setIsEditingTags(true)}
                    sx={{ mr: 1, mb: 1, borderRadius: 1, height: 25 }}
                />
            ))
        );


    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={9}>
                <Card sx={{ p: 2 }} style={{ height: '100%' }}>
                    <CardContent>
                        {renderEditableText({
                            isEditing: isEditingTitle,
                            value: editedTitle,
                            setValue: setEditedTitle,
                            onFinishEdit: () => setIsEditingTitle(false),
                            variant: "h5"
                        })}

                        <Box mb={2}>
                            <Typography variant="subtitle2" sx={{ display: "inline", mr: 1 }}>
                                <FontAwesomeIcon icon={faTag} /> Tags:
                            </Typography>

                            {renderEditableSelect({
                                isEditing: isEditingTags,
                                value: editedTags,
                                onChange: (e) => setEditedTags(e.target.value),
                                onFinishEdit: () => setIsEditingTags(false),
                                options: tags,
                            })}
                        </Box>

                        <Typography variant="body2" color="text.secondary" mb={2}>
                            <FontAwesomeIcon icon={faClock} /> Last Edited: {selectedNote.edited_date}
                        </Typography>

                        <Divider sx={{ my: 2 }} />

                        {renderEditableText({
                            isEditing: isEditingContent,
                            value: editedContent,
                            setValue: setEditedContent,
                            onFinishEdit: () => setIsEditingContent(false),
                            multiline: true,
                            variant: "body1"
                        })}

                        <Box mt={3}>
                            <Button
                                variant="contained"
                                sx={{ mr: 1 }}
                                onClick={handleSave}
                            >
                                Save Note
                            </Button>
                            <Button variant="outlined" onClick={getNotes}>
                                Cancel
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>

            <Grid item xs={12} sm={3}>
                <Card sx={{ p: 2 }} style={{ height: '100%' }}>
                    <Box>
                        {
                            archivedNote ?
                                <Button
                                    variant="outlined"
                                    fullWidth
                                    sx={{ mb: 1 }}
                                    onClick={() => archiveNoteBack(selectedNote.id)}
                                    startIcon={<FontAwesomeIcon icon={faNoteSticky} />}
                                >
                                    Undo
                                </Button>
                                :
                                <Button
                                    variant="outlined"
                                    fullWidth
                                    sx={{ mb: 1 }}
                                    onClick={() => handleArchive(selectedNote.id)}
                                    startIcon={<FontAwesomeIcon icon={faArchive} />}
                                >
                                    Archive Note
                                </Button>
                        }
                        <Button
                            variant="outlined"
                            fullWidth
                            onClick={() => archivedNote ? removeArchiveNote(selectedNote.id) : removeNote(selectedNote.id)}
                            startIcon={<FontAwesomeIcon icon={faTrash} />}
                        >
                            Delete Note
                        </Button>
                    </Box>
                </Card>
            </Grid>
        </Grid>
    );
}