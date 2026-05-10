import { Box, Skeleton, useTheme } from "@mui/material";

export function SkeletonRows({
  gridTemplateColumns,
  headers,
}: {
  gridTemplateColumns: string;
  headers: string[];
}) {
  const theme = useTheme();
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <Box
          key={i}
          sx={{
            display: "grid",
            gridTemplateColumns: gridTemplateColumns,
            alignItems: "center",
            px: 1.75,
            py: 1.1,
            borderBottom: i < 4 ? `1px solid ${theme.palette.divider}` : "none",
          }}
        >
          {headers.map((header, index) =>
            header === "Actions" ? (
              <Box key={index} sx={{ display: "flex", gap: 0.375, justifyContent: "center" }}>
                <Skeleton variant="rounded" width={26} height={26} sx={{ borderRadius: "6px" }} />
                <Skeleton variant="rounded" width={26} height={26} sx={{ borderRadius: "6px" }} />
              </Box>
            ) : (
              <Skeleton key={index} variant="rounded" width={"80%"} height={12} />
            ),
          )}
        </Box>
      ))}
    </>
  );
}
