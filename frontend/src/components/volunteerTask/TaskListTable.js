import MUIDataTable from "mui-datatables";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import moment from "moment";

const SPACED_DATE_FORMAT = "DD MMM YYYY";

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

export default function TaskListTable({ taskListData, isMyTask, handleAccept, handleView,handleReject }) {

    const taskCols = [
        {
            name: "id",
            label: "ID",
            options: {
                display: false,
                sort: false,
                filter: false,
                viewColumns: false,
            },
        },
        {
            name: "volId",
            label: "volunteer ID",
            viewColumns: false,
            options: { display: false, sort: false, filter: false },
        },
        {
            name: "firstName",
            label: "First name",

            options: {
                display: false,
                filter: true,
                sort: true,
            },
        },
        {
            name: "lastName",
            label: "Last name",

            options: {
                display: false,
                filter: true,
                sort: true,
            },
        },
        {
            name: "firstName",
            label: "Full Name",
            options: {
                filter: false,
                sort: false,
                customBodyRender: (value, tableMeta, updateValue) => {
                    //console.log(tableMeta.rowData, '......');
                    return (
                        <div>
                            {tableMeta.rowData[2]} {tableMeta.rowData[3]}
                        </div>
                    );
                },
            },
        },
        {
            name: "taskType",
            label: "Task",

            options: {
                filter: true,
                sort: true,
            },
        },
        {
            name: "date",
            label: "Start Date",
            options: {
                filter: true,
                sort: true,
                customBodyRender: (value) =>
                    moment(new Date(value)).format(SPACED_DATE_FORMAT),
            },
        },
        {
            name: "distance",
            label: "Distance",
            options: {
                filter: true,
                sort: true,
            },
        },
        {
            name: "id",
            label: "Action",

            options: {
                sort: false,
                filter: false,
                viewColumns: false,
                display: isMyTask === true ? true : false,
                customBodyRender: (value, tableMeta) => {
                    return (
                        <Button
                            variant="contained"
                            color="secondary"
                            size="small"
                            disabled={tableMeta.rowData[1] === null ? true : false}
                            style={{ marginLeft: 2 }}
                            className="button"
                            value={value}
                            onClick={() => {
                                handleReject(value);
                        }}
                        >
                            Reject
                        </Button>
                    );
                },
            },
        },
        {
            name: "id",
            label: "Action",

            options: {
                sort: false,
                filter: false,
                viewColumns: false,
                display: isMyTask ? false : true,
                customBodyRender: (value, tableMeta) => {
                    return (
                        <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            disabled={tableMeta.rowData[1] === null ? false : true}
                            style={{
                                marginLeft: 2,
                                backgroundColor:
                                    tableMeta.rowData[1] === null ? "green" : "lightgrey",
                            }}
                            className="button"
                            value={value}
                            onClick={() => {
                                //console.log(tableMeta.rowData[1]);
                                handleAccept(value);                             
                            }}
                        >
                            Accept
                        </Button>
                    );
                },
            },
        },
        {
            name: "id",
            label: " Task Detail",

            options: {
                filter: false,
                sort: false,
                viewColumns: false,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            style={{
                                marginLeft: 2,
                                minWidth: "70px",
                            }}
                            value={value}
                            onClick={(e) => {
                            handleView(e, value);
                            }}
                        >
                            View
                        </Button>
                    );
                },
            },
        },
    ];

    return (
        <MuiThemeProvider theme={theme}>
            <MUIDataTable
                title=  {isMyTask === false ? "Search New Tasks" : "My Assigned Tasks"}
                data={taskListData}
                columns={taskCols}
                options={options}
            />
        </MuiThemeProvider>
    );
}
