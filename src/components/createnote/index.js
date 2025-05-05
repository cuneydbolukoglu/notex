import { Button, Card, CardContent, Divider, Box, TextField, Typography, InputLabel, FormControl, Select, MenuItem, OutlinedInput } from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import axiosInstance from "@/services/axiosInstance";
import utils from "@/utils";
import { useAllNoteStore, useTagsStore } from "@/zustand";

export default function CreateNote() {
  const { getNotes } = useAllNoteStore();
  const { tags } = useTagsStore();

  const saveNote = async (values) => {
    try {
      const response = await axiosInstance.post("/all_notes.json", {
        ...values,
        created_date: utils.getCurrentDate(),
      }, {
        headers: { "Content-Type": "application/json" }
      });
      getNotes();
    } catch (error) {
      console.error("Veri kaydetme hatası:", error);
    }
  };

  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    content: Yup.string().required("Content is required"),
  });

  return (
    <Card sx={{ p: 3 }}>
      <CardContent>
        <Formik
          initialValues={{ title: "", tags: [], content: "" }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            saveNote(values)
          }}
        >
          {({ errors, touched, handleChange, values }) => (
            <Form>
              <Typography
                variant="h5"
                color="text.secondary"
                sx={{ marginTop: 1 }}
              >
                Create Note
              </Typography>
              <TextField
                fullWidth
                margin="normal"
                id="title"
                name="title"
                label="Title"
                value={values.title}
                onChange={handleChange}
                error={touched.title && Boolean(errors.title)}
                helperText={touched.title && errors.title}
              />

              <Divider sx={{ my: 2 }} />

              <Box display="flex" alignItems="center" mb={2}>
                <FormControl fullWidth>
                  <InputLabel id="tags-label">Tags</InputLabel>
                  <Select
                    labelId="tags-label"
                    id="tags"
                    name="tags"
                    multiple
                    value={values.tags}
                    onChange={handleChange}
                    input={<OutlinedInput label="Tags" />}
                  >
                    {tags.map((tag) => (
                      <MenuItem key={tag.value} value={tag.value}>
                        {tag.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <TextField
                fullWidth
                multiline
                rows={7}
                id="content"
                name="content"
                label="Write your note..."
                value={values.content}
                onChange={handleChange}
                error={touched.content && Boolean(errors.content)}
                helperText={touched.content && errors.content}
              />

              <Box mt={3} display="flex" gap={1}>
                <Button variant="contained" type="submit">
                  Create
                </Button>
                <Button variant="outlined" type="reset" onClick={() => getNotes()}>
                  Cancel
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </CardContent>
    </Card>
  );
}