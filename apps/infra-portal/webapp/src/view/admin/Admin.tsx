import { Box, Grid, alpha, useTheme } from "@mui/material";
import { Settings } from "lucide-react";
import { Outlet, useMatch, useNavigate } from "react-router-dom";

import Heading from "@root/src/component/ui/Heading";
import SectionLabel from "@root/src/component/ui/SectionLabel";
import ServiceCard, { ServiceCardProps } from "@root/src/component/ui/Service";
import { Role } from "@root/src/slices/authSlice/auth";

export default function Admin() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isIndex = useMatch({ path: "/admin", end: true });

  const accent = theme.palette.primary.main;
  const accentBg = alpha(accent, 0.1);
  //   const greenColor = theme.palette.success.main;
  //   const greenBg = alpha(greenColor, 0.1);
  //   const amberColor = theme.palette.warning.main;
  //   const amberBg = alpha(amberColor, 0.1);
  //   const blueColor = theme.palette.info.main;
  //   const blueBg = alpha(blueColor, 0.1);

  const services: ServiceCardProps[] = [
    {
      icon: <Settings size={16} />,
      title: "GitHub Settings",
      description:
        "Manage GitHub integration settings, including repository templates and access policies.",
      iconColor: accent,
      iconBg: accentBg,
      roles: [Role.ADMIN],
      tag: {
        tagName: "configuration",
        tagBackground: accentBg,
        tagColor: accent,
      },
      features: [
        {
          label: "Manage GitHub settings",
          onClick: () => navigate("github-settings"),
          tag: {
            tagName: "configuration",
            tagBackground: accentBg,
            tagColor: accent,
          },
        },
      ],
    },
  ];
  return (
    <Box
      sx={{
        mx: "auto",
        px: { xs: 2, sm: 3.5 },
        pt: { xs: 3, sm: 1 },
      }}
    >
      <Heading
        title="Admin panel"
        description="Manage administrative settings and configurations for the Infra Portal."
        icon={<Settings />}
      />

      {isIndex ? (
        <>
          <SectionLabel>Services</SectionLabel>
          <Grid container spacing={1.5} mb={4}>
            {services.map((service, index) => (
              <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
                <ServiceCard {...service} />
              </Grid>
            ))}
          </Grid>
        </>
      ) : (
        <Outlet />
      )}
    </Box>
  );
}
