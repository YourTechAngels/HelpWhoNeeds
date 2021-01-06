import MUIDataTable from "mui-datatables";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";

const options = {
    filterType: "multiselect",
    selectableRows: "none", //can also be single/mulitple
    selectableRowsOnClick: true,
    rowsPerPage: "5",
    rowsPerPageOptions: [5,10, 15, 20],
};

const theme = createMuiTheme({
    overrides: {
        MuiDataTable: {
            root: {
                width: "min-content",
            },
            responsiveScroll: {
                maxHeight: "none", //not working
            },
        },
        MUIDataTableBodyCell: {
            root: {
                backgroundColor: "#FFF",
                width: "90px",
            },
        },
    },
});

export default function TaskListTable({ taskListData, columnFields }) {
    return (
        <MuiThemeProvider theme={theme}>
            <MUIDataTable
                title={"My Task List"}
                data={taskListData}
                columns={columnFields}
                options={options}
            />
        </MuiThemeProvider>
    );
}
