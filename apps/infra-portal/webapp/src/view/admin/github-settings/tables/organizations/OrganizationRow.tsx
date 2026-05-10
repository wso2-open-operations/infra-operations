import { Box, IconButton, Tooltip, Typography, alpha, useTheme } from "@mui/material";
import { Pencil, RefreshCw, Trash2 } from "lucide-react";

import { Organization } from "@root/src/slices/organizationsSlice/organizations";

export function OrganizationRow({
  organization,
  isLast,
  onEdit,
  gridTemplateColumns,
  onDelete,
  onSync,
}: {
  organization: Organization;
  isLast: boolean;
  gridTemplateColumns: string;
  onEdit: (organization: Organization) => void;
  onDelete: (organizationId: number, organizationName: string) => void;
  onSync: (organizationName: string) => void;
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
          // fontFamily: "monospace",
          color: theme.palette.customText.primary.p3.active,
        }}
      >
        #{organization.organizationId}
      </Typography>

      {/* Organization name */}
      <Typography
        sx={{
          fontSize: 12,
          // fontFamily: "monospace",
          color: theme.palette.customText.primary.p1.active,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {organization.organizationName}
      </Typography>
      {/* Organization visibility */}
      <Typography
        sx={{
          fontSize: 12,
          // fontFamily: "monospace",
          color: theme.palette.customText.primary.p1.active,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {organization.organizationVisibility}
      </Typography>
      {/* Organization plan */}
      <Typography
        sx={{
          fontSize: 12,
          // fontFamily: "monospace",
          color: theme.palette.customText.primary.p1.active,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {organization.organizationPlan}
      </Typography>

      {/* Team */}
      <Typography
        sx={{
          fontSize: 12,
          // fontFamily: "monospace",
          color: theme.palette.customText.primary.p1.active,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {organization.defaultTeams || "No default teams"}
      </Typography>

      {/* Allow Issues */}
      <Typography
        sx={{
          fontSize: 12,
          // fontFamily: "monospace",
          color: theme.palette.customText.primary.p1.active,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          textAlign: "center",
        }}
      >
        {organization.enableIssues ? "Yes" : "No"}
      </Typography>

      {/* Actions */}
      <Box sx={{ display: "flex", gap: 0.375, justifyContent: "center" }}>
        <Tooltip title="Edit" arrow>
          <IconButton
            size="small"
            onClick={() => onEdit(organization)}
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
            onClick={() => onDelete(organization.organizationId, organization.organizationName)}
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
        <Tooltip title="Sync" arrow>
          <IconButton
            size="small"
            onClick={() => onSync(organization.organizationName)}
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
            <RefreshCw size={13} />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}
