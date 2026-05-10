import { useTheme } from "@mui/material";
import { DataGrid, DataGridProps, GridValidRowModel } from "@mui/x-data-grid";

export default function CustomDataGrid<R extends GridValidRowModel>(props: DataGridProps<R>) {
  const theme = useTheme();

  return (
    <DataGrid
      {...props}
      density="compact"
      disableRowSelectionOnClick
      initialState={{
        pagination: {
          paginationModel: { pageSize: 10 },
        },
        ...props.initialState,
      }}
      pageSizeOptions={[10, 20, 50]}
      sx={{
        border: "none",
        borderRadius: 0,
        background:
          theme.palette.mode === "dark"
            ? theme.palette.neutral["1800"]
            : theme.palette.common.white,
        "& .MuiDataGrid-columnHeaders": {
          background: "transparent !important",
          borderBottom: `1px solid ${theme.palette.divider}`,
        },
        "& .MuiDataGrid-columnHeader": {
          background:
            theme.palette.mode === "dark"
              ? theme.palette.neutral["1800"]
              : theme.palette.common.white,
        },
        "& .MuiDataGrid-columnHeaderTitle": {
          fontSize: 11,
          textTransform: "Capitalize",
          letterSpacing: "0.05em",
          color: theme.palette.customText.primary.p2.active,
        },
        "& .MuiDataGrid-cell": {
          border: "none",
          borderBottom: `1px solid ${theme.palette.divider}`,
        },
        "& .MuiDataGrid-row": {
          borderBottom: `1px solid ${theme.palette.divider}`,
        },
        "& .MuiDataGrid-footerContainer": {
          borderTop: `1px solid ${theme.palette.divider}`,
        },
        "& .MuiDataGrid-filler": {
          display: "none",
        },
        ...props.sx,
      }}
    />
  );
}
