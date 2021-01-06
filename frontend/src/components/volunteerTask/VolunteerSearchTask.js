import React from "react";
import MUIDataTable from "mui-datatables";
import Button from "@material-ui/core/Button";
import moment from "moment";
import { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles"; //not working
import TaskDialog from "./TaskDetail";
import Notification from "./Notification";
import ConfirmDailog from "./CofirmDailog";
import Grid from "@material-ui/core/Grid";

const SPACED_DATE_FORMAT = "DD MMM YYYY";

const options = {
    filterType: "multiselect",
    selectableRows: "none", //can also be single/mulitple
    selectableRowsOnClick: true,
};

const useStyles = makeStyles((theme) => ({
    h5: {
        color: "#4C4B51",
        textAlign: "center",
    },
}));

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
    {
        id: 11,
        lastName: "Paanas",
        firstName: "Thapa",
        taskType: "Medical",
        taskSummary: "I need help with picking up my prescription",
        date: "2021-01-20",
        distance: 3,
        volId: null,
    },
    {
        id: 12,
        lastName: "Paanas",
        firstName: "Thapa",
        taskType: "Medical",
        taskSummary: "I need help with picking up my prescription",
        date: "2021-01-20",
        distance: 3,
        volId: null,
    },
    {
        id: 13,
        lastName: "Kate",
        firstName: "Middleton",
        taskType: "Medical",
        taskSummary: "I need help with picking up my prescription",
        date: "2021-01-20",
        distance: 3,
        volId: null,
    },
    {
        id: 14,
        lastName: "Joe",
        firstName: "Kelly",
        taskType: "Shopping",
        taskSummary: "I need help with Shopping from Tesco",
        date: "2021-01-20",
        distance: 4,
        volId: null,
    },
    {
        id: 15,
        lastName: "Frances",
        firstName: "Rai",
        taskType: "Other",
        taskSummary: "I need help with mowing my garden",
        date: "2021-01-20",
        distance: 2,
        volId: null,
    },
    {
        id: 16,
        lastName: "Roxie",
        firstName: "Raymond",
        taskType: "Shopping",
        taskSummary: "I need help with Shopping from Sainsbuyrys",
        date: "2021-01-20",
        distance: 3,
        volId: null,
    },
];

export default function VolunteerSearchTask() {
    const classes = useStyles();

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

    const [pendingTasks, setPendingTasks] = useState(intialTasks);
    const myTasks = pendingTasks.filter(
        (task) => task.volId !== null && task.volId === 1
    );
    const unassignedTasks = pendingTasks.filter((task) => task.volId === null);

    const [showDialog, setShowDialog] = React.useState(false);
    const [dialogData, setDialogData] = React.useState(null);
    const [notifyMsg, setNotifyMsg] = useState({
        isOpen: false,
        message: " ",
        type: " ",
    });
    const [confirmDailog, setConfirmDialog] = useState({
        isOpen: false,
        title: "",
        subTitle: "",
    });

    const handleClickOpen = (e, dialogData) => {
        setShowDialog(true);
        setDialogData(dialogData);
    };

    const handleClose = () => {
        setShowDialog(false);
        setDialogData(null);
    };

    const myTaskCols = [
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
                        <div>{tableMeta.rowData[2]} {tableMeta.rowData[3]}</div>
                    );
                }
            }
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
        // { name: "startTime", label: "Start Time", width: 100, type: "time" },
        //  { name: "endTime", label: "End Time", width: 100, type: "time" },
      
        {
            name: "id",
            label: "Action",

            options: {
                sort: false,
                filter: false,
                viewColumns: false,
                display: false,
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
                                setConfirmDialog({
                                    isOpen: true,
                                    title: "Do you agree to accept this task?",
                                    subTitle:
                                        "Once accepted it will be assigned to you.To return the task you need to go to your task list and reject it.",
                                    onConfirm: () => {
                                        setConfirmDialog({
                                            ...confirmDailog,
                                            isOpen: false,
                                        });

                                        //const assignTask = unassignedTasks.map((task) =>
                                        const assignTask = intialTasks.map((task) =>
                                            task.id === value ? { ...task, volId: 1 } : task
                                        );
                                        setPendingTasks(assignTask);
                                        console.log("assignTasks")
                                        console.log(unassignedTasks)
                                        console.log("myTask")
                                        console.log(myTasks)                                        
                                        console.log(pendingTasks)

                                        setNotifyMsg({
                                            isOpen: true,
                                            message: "Task is successfully assigned to you.",
                                            type: "success",
                                        });
                                    },
                                });
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
            label: "Action",

            options: {
                sort: false,
                filter: false,
                viewColumns: false,
                display:  true,
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
                                
                                setConfirmDialog({
                                    isOpen: true,
                                    title: "Are you sure to return your assigned Task?",
                                    subTitle:
                                        "Once rejected it will be unassigned from you.To reassign the task you need to go to search task and accept it again.",
                                    onConfirm: () => {
                                        setConfirmDialog({
                                            ...confirmDailog,
                                            isOpen: false,
                                        });
                                        console.log(tableMeta.rowData[1]);

                                        //const returnTask = myTasks.map((task) =>
                                        const returnTask = intialTasks.map((task) =>
                                            task.id === value ? { ...task, volId: null } : task
                                        );
                                        setPendingTasks(returnTask);
                                        console.log("myTask")
                                        console.log(myTasks) 
                                        console.log("assignTasks")
                                        console.log(unassignedTasks)                                                                              
                                        console.log(pendingTasks)

                                        setNotifyMsg({
                                            isOpen: true,
                                            message: "Task is unssigned from you",
                                            type: "warning",
                                        });
                                    },
                                });
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
                            style={{ marginLeft: 2,
                                    minWidth: "70px" }}
                            value={value}
                            onClick={(e) => {
                                const selectedTask = pendingTasks.find(
                                    (task) => task.id === value
                                );
                                console.log(selectedTask);
                                if (selectedTask != null) {
                                    handleClickOpen(e, selectedTask);
                                }
                            }}
                        >
                            View
                        </Button>
                    );
                },
            },
        },

    ];

    const unassignedTaskCols = [
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
                        <div>{tableMeta.rowData[2]} {tableMeta.rowData[3]}</div>
                    );
                }
            }
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
        // { name: "startTime", label: "Start Time", width: 100, type: "time" },
        //  { name: "endTime", label: "End Time", width: 100, type: "time" },      
        {
            name: "id",
            label: "Action",

            options: {
                sort: false,
                filter: false,
                viewColumns: false,
                display: true,
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
                                setConfirmDialog({
                                    isOpen: true,
                                    title: "Do you agree to accept this task?",
                                    subTitle:
                                        "Once accepted it will be assigned to you.To return the task you need to go to your task list and reject it.",
                                    onConfirm: () => {
                                        setConfirmDialog({
                                            ...confirmDailog,
                                            isOpen: false,
                                        });

                                       // const assignTask = unassignedTasks.map((task) =>
                                    const assignTask = intialTasks.map((task) =>
                                            task.id === value ? { ...task, volId: 1 } : task
                                        );
                                        setPendingTasks(assignTask);
                                        console.log("assignTasks")
                                        console.log(unassignedTasks)
                                        console.log("myTask")
                                        console.log(myTasks)                                        
                                        console.log(pendingTasks)
                                        setNotifyMsg({
                                            isOpen: true,
                                            message: "Task is successfully assigned to you.",
                                            type: "success",
                                        });
                                    },
                                });
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
            label: "Action",

            options: {
                sort: false,
                filter: false,
                viewColumns: false,
                display: false,
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
                                
                                setConfirmDialog({
                                    isOpen: true,
                                    title: "Are you sure to return your assigned Task?",
                                    subTitle:
                                        "Once rejected it will be unassigned from you.To reassign the task you need to go to search task and accept it again.",
                                    onConfirm: () => {
                                        setConfirmDialog({
                                            ...confirmDailog,
                                            isOpen: false,
                                        });
                                        console.log(tableMeta.rowData[1]);

                                        //const returnTask = myTasks.map((task) =>
                                        const returnTask = intialTasks.map((task) =>
                                            task.id === value ? { ...task, volId: null } : task
                                        );
                                        setPendingTasks(returnTask);

                                        setNotifyMsg({
                                            isOpen: true,
                                            message: "Task is unssigned from you",
                                            type: "warning",
                                        });
                                    },
                                });
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
                            style={{ marginLeft: 2,
                                minWidth: "70px" }}
                            value={value}
                            onClick={(e) => {
                                const selectedTask = pendingTasks.find(
                                    (task) => task.id === value
                                );
                                console.log(selectedTask);
                                if (selectedTask != null) {
                                    handleClickOpen(e, selectedTask);
                                }
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
        <React.Fragment>

            <div style={{ height: "100%" }}>
            <Grid id="start-time" container spacing={2}>
                <Grid item xs={12} sm={6}>
                <h4 className={classes.h5}>
                    {"My Assigned Tasks"}
                </h4>

                <MuiThemeProvider theme={theme}>
                    <MUIDataTable
                        title={
                        "My Task List"
                        }
                        // data={pendingTasks}
                        data={myTasks}
                        columns={myTaskCols}
                        options={options}
                    />
                </MuiThemeProvider>
                
                </Grid>
                <Grid item xs={12} sm={6}>
                <h4 className={classes.h5}>
                    {"Search New Tasks"}
                </h4>

                <MuiThemeProvider theme={theme}>
                    <MUIDataTable
                        title={
                            "New Unassigned Task List"
                        }
                        // data={pendingTasks}
                        data={unassignedTasks}
                        columns={unassignedTaskCols}
                        options={options}
                    />
                </MuiThemeProvider>
            
                </Grid>
            </Grid>
            
                <TaskDialog
                    open={showDialog}
                    handleClose={handleClose}
                    title="Task Summary"
                    data={dialogData}
                />
                <Notification notify={notifyMsg} setNotify={setNotifyMsg} />
                <ConfirmDailog
                    confirmDialog={confirmDailog}
                    setConfirmDialog={setConfirmDialog}
                />
            </div>
        </React.Fragment>
    );
}
