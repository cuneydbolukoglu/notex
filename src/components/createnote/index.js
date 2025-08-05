import { Button, Card, CardContent, Divider, Box, Typography, FormLabel, FormHelperText, Stack } from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import axiosInstance from "@/services/axiosInstance";
import utils from "@/utils";
import { useAllNoteStore, useTagsStore } from "@/zustand";
import CustomInput from '@/components/customInput';
import AutocompleteSelect from '@/components/autoCompleteSelect';
import NoteEditor from "../noteEditor";

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
                sx={{ marginTop: 1, marginBottom: 3 }}
              >
                Create Note
              </Typography>
              <FormLabel htmlFor="title">Title</FormLabel>
              <Field
                fullWidth
                id="title"
                name="title"
                label="Title"
                as={CustomInput}
                value={values.title}
                onChange={handleChange}
                error={touched.title && Boolean(errors.title)}
                helperText={touched.title && errors.title}
              />
              {touched.title && errors.title && (
                <FormHelperText error>{errors.title}</FormHelperText>
              )}

              <Divider sx={{ my: 2 }} />

              <FormLabel htmlFor="tags">Tags</FormLabel>
              <Field
                as={AutocompleteSelect}
                value={values.tags}
                onChange={handleChange}
                options={tags?.map(tag => ({
                  value: tag.value,
                  name: tag.name
                }))}
              />
              {touched.tags && errors.tags && (
                <FormHelperText error>{errors.tags}</FormHelperText>
              )}

              <FormLabel htmlFor="content">Content</FormLabel>
              <Field name="content">
                {({ field, form }) => (
                  <>
                    <NoteEditor
                      value={field.value}
                      onChange={(val) => form.setFieldValue(field.name, val)}
                    />
                    {form.touched.content && form.errors.content && (
                      <FormHelperText error>{form.errors.content}</FormHelperText>
                    )}
                  </>
                )}
              </Field>
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