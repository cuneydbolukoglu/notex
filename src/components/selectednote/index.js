import { Button, Card, CardContent, Chip, Typography, Divider, Box } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faTag } from "@fortawesome/free-solid-svg-icons";

export default function SelectedNote({ selectedNote }) {
    return (
        <Card sx={{ padding: 2 }}>
            <CardContent>
                <Typography sx={{ marginBottom: 3 }} variant="h5">{selectedNote.title}</Typography>
                <Box mb={2}>
                    <FontAwesomeIcon icon={faTag} /> Tags
                    {selectedNote.tags.map((tag, index) => (
                        <Chip
                            key={index}
                            label={tag}
                            sx={{ marginRight: 1, borderRadius: 1, height: 25 }}
                        />
                    ))}
                </Box>
                <Typography variant="body2" color="text.secondary" mt={2}>
                    <FontAwesomeIcon icon={faClock} /> Last Edited: {selectedNote.last_edited}
                </Typography>
                <Divider sx={{ marginY: 2 }} />
                <Typography variant="body1" color="text.primary">
                    {selectedNote.content}
                </Typography>
                <Box display="flex" justifyContent="space-between" mt={3}>
                    <Button variant="outlined" color="secondary">
                        Archive Note
                    </Button>
                    <Button variant="contained" color="error" onClick={() => console.log(selectedNote)}>
                        Delete Note
                    </Button>
                </Box>
                <Divider sx={{ marginY: 2 }} />
                <Box mt={3}>
                    <Button variant="contained" sx={{ marginRight: 1 }} >
                        Save Note
                    </Button>
                    <Button variant="outlined">
                        Cancel
                    </Button>
                </Box>
            </CardContent>
        </Card>
    )
}
