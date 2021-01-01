import React from "react"
import MUIDataTable from "mui-datatables"
import Button from "@material-ui/core/Button"
import moment from "moment"
import { useState } from "react"
import { makeStyles } from "@material-ui/core/styles"
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles"; //not working
import TaskDialog from "./TaskDetail"
import { Link } from "react-router-dom"
//import Alert from "@material-ui/lab/Alert"

const SPACED_DATE_FORMAT = "DD MMM YYYY";

const options = {
    filterType: "multiselect",
    selectableRows: "none", //can also be single/mulitple
    selectableRowsOnClick: true,
    count: 5,
};

const useStyles = makeStyles({
    h5: {
        color: "#4C4B51",
        textAlign: "center",
    },
});
const intialTasks = [
    {
        id: 1,
        lastName: "Snow",
        firstName: "Jon",
        taskType: "Shopping",
        taskSummary: "I need help with Shopping from Tesco",
        date: "2020-12-28",
        distance: 1,
        volId: 1,
    },
    {
        id: 2,
        lastName: "Lannister",
        firstName: "Cersei",
        taskType: "Dog Walking",
        taskSummary: "I need help with dog walkingevery morning and afternoon",
        date: "2021-01-20",
        distance: 1,
        volId: 1,
    },
    {
        id: 3,
        lastName: "Lannister",
        firstName: "Jaime",
        taskType: "Shopping",
        taskSummary: "I need help with Shopping from Asda",
        date: "2021-01-28",
        distance: 2.3,
        volId: null,
    },
    {
        id: 4,
        lastName: "Stark",
        firstName: "Arya",
        taskType: "Pharmacy",
        taskSummary: "I need help with picking up my prescription from local gp",
        date: "2021-03-20",
        distance: 0.8,
        volId: null,
    },
    {
        id: 5,
        lastName: "Targaryen",
        firstName: "Daenerys",
        taskType: "Hospital",
        taskSummary: "I need help to drop off and pick up from my hospital",
        date: "2021-01-10",
        distance: 2,
        volId: null,
    },
    {
        id: 6,
        lastName: "Melisandre",
        firstName: null,
        taskType: "Phone Call",
        taskSummary: "I need someone to give me a call to have a chat",
        date: "2021-01-20",
        distance: 5,
        volId: null,
    },
    {
        id: 7,
        lastName: "Clifford",
        firstName: "Ferrara",
        taskType: "Shopping",
        taskSummary: "I need help with Shopping from Tesco",
        date: "2021-01-20",
        distance: 4,
        volId: null,
    },
    {
        id: 8,
        lastName: "Frances",
        firstName: "Rossini",
        taskType: "Other",
        taskSummary: "I need help with mowing my garden",
        date: "2021-01-20",
        distance: 2,
        volId: null,
    },
    {
        id: 9,
        lastName: "Roxie",
        firstName: "Harvey",
        taskType: "Shopping",
        taskSummary: "I need help with Shopping from Sainsbuyrys",
        date: "2021-01-20",
        distance: 3,
        volId: null,
    },
    {
        id: 10,
        lastName: "Indra",
        firstName: "Thapa",
        taskType: "Medical",
        taskSummary: "I need help with picking up my prescription",
        date: "2021-01-20",
        distance: 3,
        volId: null,
    },
];

export default function VolunteerSearchTask({ myTask }) {
    const classes = useStyles();

    const theme = createMuiTheme({
        overrides: {
            MuiDataTable: {
                root: {
                    width: "min-content",
                },
                responsiveScroll: {
                    maxHeight: "300px", //not working
                },
            },
            MUIDataTableBodyCell: {
                root: {
                    backgroundColor: "#FFF",
                    width: "100px",
                },
            },
        },
    });

    const isMyTask = myTask === undefined ? false : myTask;
    console.log(myTask);
    const [pendingTasks, setPendingTasks] = useState(
        isMyTask === false
            ? intialTasks.filter((task) => task.volId === null)
            : intialTasks.filter((task) => task.volId != null && task.volId === 1)
    );
    const [showDialog, setShowDialog] = React.useState(false);
    const [dialogData, setDialogData] = React.useState(null);

    const handleClickOpen = (e, dialogData) => {
        setShowDialog(true);
        setDialogData(dialogData);
    };

    const handleClose = () => {
        setDialogData(null);
        setShowDialog(false);
    };

    const columns = [
        {
            name: "id",
            label: "ID",
            options: { display: false, sort: false, filter: false },
        },
        {
            name: "volId",
            label: "volunteer ID",
            options: { display: false, sort: false, filter: false },
        },
        {
            name: "firstName",
            label: "First Name",

            options: {
                filter: true,
                sort: true,
            },
        },
        {
            name: "lastName",
            label: "Last name",

            options: {
                filter: true,
                sort: true,
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
            label: "Distance(miles)",
            options: {
                filter: true,
                sort: true,
            },
        },
        // { name: "startTime", label: "Start Time", width: 100, type: "time" },
        //  { name: "endTime", label: "End Time", width: 100, type: "time" },
        {
            name: "taskSummary",
            label: " Task Detail",

            options: {
                filter: false,
                sort: false,
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            style={{ marginLeft: 16 }}
                            value={value}
                            onClick={(e) => handleClickOpen(e, value)}
                        >
                            View
                        </Button>
                    );
                },
            },
        },

        {
            name: "id",
            label: "Accept",

            options: {
                sort: false,
                filter: false,
                customBodyRender: (value, tableMeta) => {
                    return (
                        <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            disabled={tableMeta.rowData[1] === null ? false : true}
                            style={{
                                marginLeft: 16,
                                backgroundColor:
                                    tableMeta.rowData[1] === null ? "green" : "lightgrey",
                            }}
                            className="button"
                            value={value}
                            onClick={() => {
                                console.log(tableMeta.rowData[1]);

                                setPendingTasks(
                                    pendingTasks.map((task) =>
                                        task.id === value ? { ...task, volId: 1 } : task
                                    )
                                );
                                if (isMyTask === false) {
                                    const updatedPendingTask = pendingTasks.filter(
                                        (task) => task.id !== value
                                    );
                                    setPendingTasks(updatedPendingTask);
                                }
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
            label: "Cancel",

            options: {
                sort: false,
                filter: false,
                display: isMyTask === true ? true : false,
                customBodyRender: (value, tableMeta) => {
                    return (
                        <Button
                            variant="contained"
                            color="secondary"
                            size="small"
                            disabled={tableMeta.rowData[1] === null ? true : false}
                            style={{ marginLeft: 16 }}
                            className="button"
                            value={value}
                            onClick={() => {
                                console.log(tableMeta.rowData[1]);
                                setPendingTasks(
                                    pendingTasks.map((task) =>
                                        task.id === value ? { ...task, volId: null } : task
                                    )
                                );
                            }}
                        >
                            Reject
                        </Button>
                    );
                },
            },
        },
    ];

    return (
        <React.Fragment>
            <div style={{ height: "100%" }}>
                <h4 className={classes.h5}>
                    {" "}
                    {isMyTask === false ? "Search New Tasks" : "My Assigned Tasks"}
                </h4>

                <MuiThemeProvider theme={theme}>
                    <MUIDataTable
                        title={
                            isMyTask === false ? "New Unassigned Task List" : "My Task List"
                        }
                        data={pendingTasks}
                        columns={columns}
                        options={options}
                    />
                </MuiThemeProvider>
                {isMyTask === false && (
                    <Button
                        variant="outlined"
                        color="default"
                        style={{ marginLeft: 16 }}
                        component={Link}
                        to={"/myTask"}
                    >
                        View My Tasks
                    </Button>
                )}

                <TaskDialog
                    open={showDialog}
                    handleClose={handleClose}
                    title="Task Summary"
                    data={dialogData}
                />
            </div>
        </React.Fragment>
    );
}
