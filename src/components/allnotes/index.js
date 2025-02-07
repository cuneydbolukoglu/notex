import Button from '@mui/material/Button';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

export default function AllNotes() {
    return (
        <Button variant="contained"><FontAwesomeIcon icon={faPlus} /> Create new note</Button>
    )
}
