import { Box, Typography, useTheme } from "@mui/material";
import { ChevronRight } from "lucide-react";

import ServiceIconBox from "@root/src/component/ui/ServiceIconBox";

export default function ServiceCardHeader({
  title,
  onNavigate,
  icon,
}: {
  title: string;
  onNavigate: () => void;
  icon: React.ReactNode;
}) {
  const theme = useTheme();
  return (
    <Box
      onClick={onNavigate}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.4,
        px: 2.25,
        pt: 2,
        pb: 1.75,
        borderBottom: `1px solid ${theme.palette.divider}`,
        cursor: "pointer",
        transition: "background 0.18s ease",
        "&:hover": { background: theme.palette.action.hover },
      }}
    >
      <ServiceIconBox icon={icon} />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          sx={{
            fontSize: 14,
            color: theme.palette.customText.primary.p1.active,
          }}
        >
          {title}
        </Typography>
      </Box>
      <ChevronRight size={13} color={theme.palette.customText.primary.p3.active} />
    </Box>
  );
}
