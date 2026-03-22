import { Stack, Typography, alpha, useTheme } from "@mui/material";

import ServiceIconBox from "@root/src/component/ui/ServiceIconBox";

interface HeadingProps {
  title: string;
  icon: React.ReactNode;
  description: string;
}

export default function Heading(props: HeadingProps) {
  const theme = useTheme();
  return (
    <Stack spacing={2} mb={4} direction="row" alignItems="center">
      {/* Icon */}
      <ServiceIconBox
        icon={props.icon}
        borderRadius={"18px"}
        boxHeight={60}
        boxWidth={60}
        iconHeight={30}
        iconWidth={30}
        background={alpha(theme.palette.background.paper, 1)}
      />
      {/* Title and Description */}
      <Stack spacing={0.5}>
        {/* title */}
        <Typography
          variant="h5"
          letterSpacing={0.5}
          fontWeight={600}
          color={theme.palette.customText.primary.p1.active}
        >
          {props.title}
        </Typography>
        {/* description */}
        <Typography variant="body2" color={theme.palette.customText.primary.p3.active}>
          {props.description}
        </Typography>
      </Stack>
    </Stack>
  );
}
