import { Box, IconButton, Tooltip, Typography, alpha, useTheme } from "@mui/material";
import { Pencil, Trash2 } from "lucide-react";

import { Topic } from "@root/src/slices/topicsSlice/topics";

export function TopicRow({
  topic,
  isLast,
  onEdit,
  gridTemplateColumns,
  onDelete,
}: {
  topic: Topic;
  isLast: boolean;
  gridTemplateColumns: string;
  onEdit: (topic: Topic) => void;
  onDelete: (topicId: number, topicName: string) => void;
}) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: gridTemplateColumns,
        alignItems: "center",
        px: 1.75,
        py: 1.1,
        borderBottom: isLast ? "none" : `1px solid ${theme.palette.divider}`,
        transition: "background 0.15s ease",
        "&:hover": { background: theme.palette.action.hover },
      }}
    >
      {/* ID */}
      <Typography
        sx={{
          fontSize: 10,
          fontFamily: "monospace",
          color: theme.palette.customText.primary.p3.active,
        }}
      >
        #{topic.topicId}
      </Typography>

      {/* Topic name */}
      <Typography
        sx={{
          fontSize: 12,
          fontFamily: "monospace",
          color: theme.palette.customText.primary.p1.active,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {topic.topicName}
      </Typography>

      {/* Actions */}
      <Box sx={{ display: "flex", gap: 0.375, justifyContent: "center" }}>
        <Tooltip title="Edit" arrow>
          <IconButton
            size="small"
            onClick={() => onEdit(topic)}
            sx={{
              width: 26,
              height: 26,
              borderRadius: "6px",
              color: theme.palette.customText.primary.p3.active,
              "&:hover": {
                color: theme.palette.warning.main,
                background: alpha(theme.palette.warning.main, 0.1),
              },
            }}
          >
            <Pencil size={13} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete" arrow>
          <IconButton
            size="small"
            onClick={() => onDelete(topic.topicId, topic.topicName)}
            sx={{
              width: 26,
              height: 26,
              borderRadius: "6px",
              color: theme.palette.customText.primary.p3.active,
              "&:hover": {
                color: theme.palette.error.main,
                background: alpha(theme.palette.error.main, 0.1),
              },
            }}
          >
            <Trash2 size={13} />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}
