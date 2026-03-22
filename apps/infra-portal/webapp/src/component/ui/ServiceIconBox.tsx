import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";

interface ServiceIconBoxProps {
  borderRadius?: number | string;
  boxHeight?: number | string;
  boxWidth?: number | string;
  iconHeight?: number | string;
  iconWidth?: number | string;
  background?: string;
  icon: React.ReactNode;
}

export default function ServiceIconBox(props: ServiceIconBoxProps) {
  const theme = useTheme();
  return (
    <Box
      sx={{
        width: props.boxWidth || 34,
        height: props.boxHeight || 34,
        borderRadius: props.borderRadius || "9px",
        background: props.background || "transparent",
        border: `1px solid ${theme.palette.divider}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <Box
        component="svg"
        width={props.iconWidth || 18}
        height={props.iconHeight || 18}
        viewBox="0 0 24 24"
        sx={{
          color: theme.palette.text.primary,
          display: "block",
        }}
      >
        {props.icon}
      </Box>
    </Box>
  );
}
