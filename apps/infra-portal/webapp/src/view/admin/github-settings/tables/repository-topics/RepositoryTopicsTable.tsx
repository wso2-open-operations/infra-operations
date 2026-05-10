import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Popover,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { Field, Form, Formik } from "formik";
import { Plus, User } from "lucide-react";
import * as Yup from "yup";

import { useEffect, useState } from "react";

import BackgroundLoader from "@root/src/component/common/BackgroundLoader";
import ErrorHandler from "@root/src/component/common/ErrorHandler";
import { useConfirmationModalContext } from "@root/src/context";
import { useAppDispatch, useAppSelector } from "@root/src/slices/store";
import {
  AddTopicPayload,
  Topic,
  addTopic,
  deleteTopic,
  fetchTopics,
  updateTopic,
} from "@root/src/slices/topicsSlice/topics";
import { ConfirmationType, State } from "@root/src/types/types";

import { CardHeader } from "../CardHeader";
import { GridHeader } from "../GridHeaders";
import { SkeletonRows } from "../SkeletonRow";
import TableContent from "../TableContent";
import { TopicRow } from "./TopicRow";

const TopicSchema = Yup.object().shape({
  topicName: Yup.string().required("Topic name is required"),
});

const GRID_COLUMNS = "36px 1fr 52px";
const COLUMN_HEADERS = ["ID", "Topic Name", "Actions"];

export default function RepositoryTopicsTable({ gridArea }: { gridArea?: string }) {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const topicsState = useAppSelector((state) => state.topics);
  const dialogContext = useConfirmationModalContext();
  const [editTarget, setEditTarget] = useState<Topic | undefined>();
  const [addAnchorEl, setAddAnchorEl] = useState<HTMLElement | null>(null);

  const topics = topicsState.topics || [];

  useEffect(() => {
    dispatch(fetchTopics());
  }, [dispatch]);

  const handleDeleteTopic = (topicId: number, topicName: string) => {
    dialogContext.showConfirmation(
      "Delete Topic",
      <Typography variant="body1">
        Are you sure you want to delete the topic <strong>{topicName}</strong>?
      </Typography>,
      ConfirmationType.accept,
      async () => {
        try {
          await dispatch(deleteTopic(topicId));
          dispatch(fetchTopics());
        } catch {
          /* empty */
        }
      },
      "Delete",
      "Cancel",
    );
  };

  const handleAddTopic = (values: { topicName: string }, resetForm: () => void) => {
    dialogContext.showConfirmation(
      "Add New Topic",
      <Typography variant="body1">
        Are you sure you want to add <strong>{values.topicName}</strong>?
      </Typography>,
      ConfirmationType.accept,
      async () => {
        try {
          await dispatch(addTopic({ topicName: values.topicName }));
          dispatch(fetchTopics());
          setAddAnchorEl(null);
          resetForm();
        } catch {
          // no-op; slice will handle error state
        }
      },
      "Add",
      "Cancel",
    );
  };

  const handleEdit = (updated: Topic) => {
    dialogContext.showConfirmation(
      "Edit Topic",
      <Typography variant="body1">
        Are you sure you want to edit <strong>{editTarget?.topicName}</strong>?
      </Typography>,
      ConfirmationType.accept,
      async () => {
        setEditTarget(undefined);
        await dispatch(updateTopic(updated));
        dispatch(fetchTopics());
      },
      "Edit",
      "Cancel",
    );
  };

  const isLoading = topicsState.state === State.loading;
  const isFetching = topicsState.functionType === "fetch";
  const isMutating = isLoading && !isFetching && !!topicsState.topics;
  if (topicsState.state === State.failed) {
    return <ErrorHandler message="Failed to fetch topics." />;
  }
  return (
    <Box sx={{ gridArea }}>
      <BackgroundLoader open={isMutating} message={topicsState.errorMessage} />
      <Box
        sx={{
          background:
            theme.palette.mode === "dark"
              ? theme.palette.surface.primary.active
              : theme.palette.neutral["white"],
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow:
            theme.palette.mode === "dark"
              ? "0 1px 3px rgba(0,0,0,0.3)"
              : "0 1px 3px rgba(0,0,0,0.06)",
        }}
      >
        <CardHeader
          icon={<User size={15} />}
          itemCount={topics.length}
          iconColor={theme.palette.success.main}
          title={"Repository Topics"}
          itemType={"topic"}
          action={
            <IconButton
              size="small"
              onClick={(e) => setAddAnchorEl(e.currentTarget)}
              sx={{
                borderRadius: "7px",
                background: theme.palette.primary.main,
                color: "#fff",
                "&:hover": { background: theme.palette.primary.dark },
              }}
            >
              <Plus size={14} />
            </IconButton>
          }
        />
        {/* Grid header */}
        <GridHeader gridTemplateColumns={GRID_COLUMNS} headers={COLUMN_HEADERS} />

        {/* Topics list (scrollable) */}
        <TableContent
          isEmpty={!isFetching && topics.length === 0}
          emptyMessage="No functional leads configured."
        >
          {isFetching || !topicsState.topics ? (
            <SkeletonRows gridTemplateColumns={GRID_COLUMNS} headers={COLUMN_HEADERS} />
          ) : (
            topics.map((topic, idx) => (
              <TopicRow
                key={topic.topicId}
                gridTemplateColumns={GRID_COLUMNS}
                topic={topic}
                isLast={idx === topics.length - 1}
                onEdit={setEditTarget}
                onDelete={handleDeleteTopic}
              />
            ))
          )}
        </TableContent>
      </Box>
      {/* Add topic popover */}
      <Popover
        open={Boolean(addAnchorEl)}
        anchorEl={addAnchorEl}
        onClose={() => setAddAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        disableRestoreFocus
        slotProps={{
          paper: {
            sx: {
              width: 300,
              borderRadius: "16px",
              border: `1px solid ${theme.palette.divider}`,
              boxShadow:
                theme.palette.mode === "dark"
                  ? "0 4px 20px rgba(0,0,0,0.5)"
                  : "0 4px 20px rgba(0,0,0,0.1)",
              mt: 0.5,
              p: 2,
            },
          },
        }}
      >
        <Typography sx={{ fontSize: 14, fontWeight: 600, mb: 2 }}>Add Topic</Typography>
        <Formik
          initialValues={{ topicName: "" } satisfies AddTopicPayload}
          validationSchema={TopicSchema}
          onSubmit={(values, { resetForm }) => handleAddTopic(values, resetForm)}
        >
          {({ errors, touched }) => (
            <Form>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Field
                  as={TextField}
                  name="topicName"
                  label="Topic Name"
                  size="small"
                  fullWidth
                  error={touched.topicName && !!errors.topicName}
                  helperText={touched.topicName && errors.topicName}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "7px" } }}
                />
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <IconButton
                    type="submit"
                    sx={{
                      borderRadius: "8px",
                      px: 1.5,
                      fontSize: 13,
                      background: theme.palette.primary.main,
                      color: "#fff",
                      "&:hover": { background: theme.palette.primary.dark },
                    }}
                  >
                    Add
                  </IconButton>
                </Box>
              </Box>
            </Form>
          )}
        </Formik>
      </Popover>

      {/* Edit dialog */}
      <Dialog
        open={!!editTarget}
        onClose={() => setEditTarget(undefined)}
        PaperProps={{
          sx: {
            borderRadius: "16px",
            border: `1px solid ${theme.palette.divider}`,
            boxShadow:
              theme.palette.mode === "dark"
                ? "0 4px 20px rgba(0,0,0,0.5)"
                : "0 4px 20px rgba(0,0,0,0.1)",
          },
        }}
      >
        <DialogTitle sx={{ fontSize: 15, fontWeight: 600, pb: 1 }}>
          Edit Functional Lead
        </DialogTitle>
        <DialogContent sx={{ pt: "8px !important" }}>
          <Formik
            enableReinitialize
            initialValues={
              {
                topicName: editTarget?.topicName ?? "",
              } satisfies Partial<Topic>
            }
            validationSchema={TopicSchema}
            onSubmit={(values) => {
              if (editTarget && values.topicName !== editTarget.topicName) {
                handleEdit({
                  topicId: editTarget.topicId,
                  topicName: values.topicName,
                });
              }
            }}
          >
            {({ errors, touched }) => (
              <Form>
                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 0.5, minWidth: 360 }}
                >
                  <Field
                    as={TextField}
                    name="topicName"
                    label="Topic"
                    size="small"
                    fullWidth
                    sx={{
                      "& .MuiOutlinedInput-root": { borderRadius: "7px" },
                    }}
                    error={touched.topicName && !!errors.topicName}
                    helperText={touched.topicName && errors.topicName}
                  />
                  <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 0.5 }}>
                    <IconButton
                      onClick={() => setEditTarget(undefined)}
                      sx={{
                        borderRadius: "8px",
                        px: 1.5,
                        fontSize: 13,
                        color: theme.palette.customText.primary.p3.active,
                        border: `1px solid ${theme.palette.divider}`,
                      }}
                    >
                      Cancel
                    </IconButton>
                    <IconButton
                      type="submit"
                      sx={{
                        borderRadius: "8px",
                        px: 1.5,
                        fontSize: 13,
                        background: theme.palette.warning.main,
                        color: "#fff",
                        "&:hover": { background: theme.palette.warning.dark },
                      }}
                    >
                      Save
                    </IconButton>
                  </Box>
                </Box>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
