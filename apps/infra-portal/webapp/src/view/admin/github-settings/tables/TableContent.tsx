import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";

import type { ReactNode } from "react";

interface TableBodyProps {
  children: ReactNode;
  isEmpty?: boolean;
  emptyMessage?: string;
  height?: number;
}

export default function TableBody({
  children,
  isEmpty = false,
  emptyMessage = "No data available.",
  height: height = 220,
}: TableBodyProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        height: height,
        overflowY: "auto",
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": { width: "none" },

        maskImage: `none`,
        WebkitMaskImage: `none`,

        "@keyframes revealTop": {
          from: {
            maskImage: `linear-gradient(to bottom, black 0%, black 0%, black 80%, transparent 100%)`,
            WebkitMaskImage: `linear-gradient(to bottom, black 0%, black 0%, black 80%, transparent 100%)`,
          },
          to: {
            maskImage: `linear-gradient(to bottom, transparent 0%, black 15%, black 80%, transparent 100%)`,
            WebkitMaskImage: `linear-gradient(to bottom, transparent 0%, black 15%, black 80%, transparent 100%)`,
          },
        },

        "@keyframes hideBottom": {
          from: {
            maskImage: `linear-gradient(to bottom, transparent 0%, black 15%, black 80%, transparent 100%)`,
            WebkitMaskImage: `linear-gradient(to bottom, transparent 0%, black 15%, black 80%, transparent 100%)`,
          },
          to: {
            maskImage: `linear-gradient(to bottom, transparent 0%, black 15%, black 80%, black 100%)`,
            WebkitMaskImage: `linear-gradient(to bottom, transparent 0%, black 15%, black 80%, black 100%)`,
          },
        },

        animationName: "revealTop, hideBottom",
        animationTimeline: "scroll(self), scroll(self)",
        animationFillMode: "none, forwards",
        animationDuration: "1ms, 1ms",
        animationRange: "0% 100%, 100% 100%",
      }}
    >
      {isEmpty ? (
        <Box sx={{ px: 1.75, py: 3, textAlign: "center" }}>
          <Typography
            sx={{
              fontSize: 12,
              color: theme.palette.customText.primary.p3.active,
            }}
          >
            {emptyMessage}
          </Typography>
        </Box>
      ) : (
        children
      )}
    </Box>
  );
}
