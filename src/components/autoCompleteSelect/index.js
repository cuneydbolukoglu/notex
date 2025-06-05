import { useState, useEffect, Fragment } from 'react';
import { TextField, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { useTagsStore } from '@/zustand';

const filter = createFilterOptions();

export default function AutocompleteTagSelect({ value, onChange, options }) {
    const { getTags, addTag } = useTagsStore();
    const [open, toggleOpen] = useState(false);
    const [dialogValue, setDialogValue] = useState({ value: '' });

    useEffect(() => {
        getTags();
    }, [getTags]);

    const handleClose = () => {
        setDialogValue({ value: '' });
        toggleOpen(false);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const newTag = dialogValue.value.charAt(0).toUpperCase() + dialogValue.value.slice(1);

        const newTagArray = { value: dialogValue.value, name: newTag };
        await addTag(newTagArray);

        onChange({
            target: {
                name: 'tags',
                value: [...(value || []), dialogValue.value],
            },
        });

        handleClose();
    };

    return (
        <Fragment>
            <Autocomplete
                multiple
                value={options.filter(opt => (value || []).includes(opt.value))}
                onChange={(event, newValue) => {
                    const lastItem = newValue[newValue.length - 1];

                    if (typeof lastItem === 'string' || lastItem?.inputValue) {
                        toggleOpen(true);
                        setDialogValue({ value: lastItem.inputValue || lastItem });
                    } else {
                        const valuesAsStrings = newValue.map((item) =>
                            typeof item === 'string' ? item : item.value
                        );
                        onChange({ target: { name: 'tags', value: valuesAsStrings } });
                    }
                }}
                filterOptions={(options, params) => {
                    const filtered = filter(options, params);

                    if (params.inputValue !== '') {
                        const isExisting = options.some((option) => option.value === params.inputValue);
                        if (!isExisting) {
                            filtered.push({
                                inputValue: params.inputValue,
                                value: `Add "${params.inputValue}"`,
                            });
                        }
                    }

                    return filtered;
                }}
                options={options}
                getOptionLabel={(option) => {
                    if (typeof option === 'string') return option;
                    if (option.inputValue) return option.inputValue;
                    return option.value;
                }}
                renderOption={(props, option) => (
                    <li {...props}>{option.value}</li>
                )}
                renderInput={(params) => <TextField {...params} />}
                selectOnFocus
                clearOnBlur
                handleHomeEndKeys
                freeSolo
            />
            <Dialog open={open} onClose={handleClose}>
                <form onSubmit={handleSubmit}>
                    <DialogTitle>Add New Tag</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            You are about to add a new tag that is not in the list.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Tag"
                            fullWidth
                            variant="standard"
                            value={dialogValue.value}
                            onChange={(e) =>
                                setDialogValue({ value: e.target.value })
                            }
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button type="submit">Add</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Fragment>
    );
}