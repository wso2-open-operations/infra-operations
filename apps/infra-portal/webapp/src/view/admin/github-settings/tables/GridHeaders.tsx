import { Box, Typography, alpha, useTheme } from "@mui/material";

export function GridHeader({
  gridTemplateColumns,
  headers,
}: {
  gridTemplateColumns: string;
  headers: string[];
}) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: gridTemplateColumns,
        alignItems: "center",
        px: 1.75,
        py: 0.75,
        background:
          theme.palette.mode === "dark"
            ? alpha(theme.palette.common.white, 0.03)
            : alpha(theme.palette.common.black, 0.02),
        borderBottom: `1px solid ${theme.palette.divider}`,
        position: "sticky",
        top: 0,
        zIndex: 1,
      }}
    >
      {headers.map((header) => (
        <Typography
          key={header}
          sx={{
            fontSize: 11,
            // fontFamily: "monospace",
            textTransform: "Capitalize",
            letterSpacing: "0.05em",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            color: theme.palette.customText.primary.p2.active,
          }}
        >
          {header}
        </Typography>
      ))}
    </Box>
  );
}
