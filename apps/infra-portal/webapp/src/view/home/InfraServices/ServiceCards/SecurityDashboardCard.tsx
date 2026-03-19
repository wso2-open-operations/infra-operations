// Copyright (c) 2025 WSO2 LLC. (https://www.wso2.com).
//
// WSO2 LLC. licenses this file to you under the Apache License,
// Version 2.0 (the "License"); you may not use this file except
// in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
// KIND, either express or implied.  See the License for the
// specific language governing permissions and limitations
// under the License.
import { Security } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { ChevronRight } from "lucide-react";

import {
  SecurityDashboard_Device_Compliance,
  SecurityDashboard_Security_Score,
  SecurityDashboard_Software_Compliance,
} from "@config/config";

import ServiceRow from "./ServiceRow";

function SecurityIcon({ color }: { color: string }) {
  return (
    <Box
      component="svg"
      width={18}
      height={18}
      viewBox="0 0 24 24"
      sx={{ color: color, display: "block" }}
    >
      <Security />
    </Box>
  );
}

export default function SecurityDashboardCard() {
  const theme = useTheme();

  const accent = theme.palette.primary.main;
  const greenColor = theme.palette.success.main;
  const greenBg = alpha(greenColor, 0.1);
  const amberColor = theme.palette.warning.main;
  const amberBg = alpha(amberColor, 0.1);
  const blueColor = theme.palette.info.main;

  return (
    <Box
      sx={{
        background: theme.palette.surface.primary.active,
        border: `1px solid ${theme.palette.divider}`,
        height: "100%",
        borderRadius: "18px",
        overflow: "hidden",
        transition: "box-shadow 0.18s ease",
        "&:hover": { boxShadow: theme.shadows[1] },
      }}
    >
      {/* Header */}
      <Box
        onClick={() =>
          window.open(SecurityDashboard_Device_Compliance, "_blank", "noopener noreferrer")
        }
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
        <Box
          sx={{
            width: 34,
            height: 34,
            borderRadius: "9px",
            border: `1px solid ${theme.palette.divider}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <SecurityIcon color={theme.palette.text.primary} />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            sx={{
              fontSize: 14,
              // fontWeight: 600,
              color: theme.palette.customText.primary.p1.active,
            }}
          >
            Security Dashboard
          </Typography>
        </Box>
        <ChevronRight size={13} color={theme.palette.customText.primary.p3.active} />
      </Box>

      {/* Service rows */}
      <Box>
        <ServiceRow
          dotColor={accent}
          label="Device compliance overview"
          tag={{ tagName: "all", tagBackground: greenBg, tagColor: greenColor }}
          onClick={() =>
            window.open(SecurityDashboard_Device_Compliance, "_blank", "noopener noreferrer")
          }
        />
        <ServiceRow
          dotColor={blueColor}
          label="Software compliance overview"
          tag={{ tagName: "all", tagBackground: greenBg, tagColor: greenColor }}
          onClick={() =>
            window.open(SecurityDashboard_Software_Compliance, "_blank", "noopener noreferrer")
          }
        />

        <ServiceRow
          dotColor={amberColor}
          label="Security score overview"
          tag={{ tagName: "all", tagBackground: amberBg, tagColor: amberColor }}
          onClick={() =>
            window.open(SecurityDashboard_Security_Score, "_blank", "noopener noreferrer")
          }
          isLast
        />
      </Box>
    </Box>
  );
}
