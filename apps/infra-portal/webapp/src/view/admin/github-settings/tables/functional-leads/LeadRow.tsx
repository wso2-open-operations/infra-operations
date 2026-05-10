import { Box, IconButton, Tooltip, Typography, alpha, useTheme } from "@mui/material";
import { Pencil, Trash2 } from "lucide-react";

import { Lead } from "@root/src/slices/leadsSlice/leads";

export function LeadRow({
  lead,
  isLast,
  onEdit,
  gridTemplateColumns,
  onDelete,
}: {
  lead: Lead;
  isLast: boolean;
  gridTemplateColumns: string;
  onEdit: (lead: Lead) => void;
  onDelete: (leadId: number, leadEmail: string) => void;
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
        #{lead.leadId}
      </Typography>

      {/* Lead email */}
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
        {lead.leadEmail}
      </Typography>

      {/* Team */}
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
        {lead.teamName}
      </Typography>

      {/* Actions */}
      <Box sx={{ display: "flex", gap: 0.375, justifyContent: "center" }}>
        <Tooltip title="Edit" arrow>
          <IconButton
            size="small"
            onClick={() => onEdit(lead)}
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
            onClick={() => onDelete(lead.leadId, lead.leadEmail)}
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
