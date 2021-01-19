import React from "react";
import MUIDataTable from "mui-datatables";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import moment from "moment";
import axios from "axios";

const SPACED_DATE_FORMAT = "DD MMM YYYY";

const options = {
    filterType: "multiselect",
    selectableRows: "none", //can also be single/mulitple
    rowsPerPage: 5,
    rowsPerPageOptions: [5, 10, 15, 20],
    print: false,
    download: false,
    sortOrder: {
        name: "start",
        direction: "desc",
    },
};

export default function TaskListTable({
    taskListData,
    isMyTask,
    handleAccept,
    handleView,
    handleReject,
    handleComplete,
    volUserId,
}) {
    const theme = () =>
        createMuiTheme({
            overrides: {
                MuiDataTable: {
                    root: {
                        width: "min-content",
                    },
                    responsiveScroll: {
                        maxHeight: "none", //not working
                    },
                },
                MUIDataTableToolbar: {
                    root: {
                        background: "#AAF",
                    },
                },
                MUIDataTableBodyCell: {
                    root: {
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        position: "relative",
                        backgroundColor: "#FFF",
                    },
                },
            },
        });
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
            options: { display: true, sort: false, filter: false },
        },
        {
            name: "status",
            label: "State",
            viewColumns: false,
            options: {
                display: false,
                filter: false,
                sort: false,
                width: "10%",
            },
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
                            {tableMeta.rowData[3]} {tableMeta.rowData[4]}
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
            name: "start",
            label: "Start Time",
            options: {
                filter: false,
                sort: true,
                width: "10%",

                customBodyRender: (value) => moment(value).format("lll"),
            },
        },
        {
            name: "end",
            label: "End Time",
            options: {
                filter: false,
                sort: true,
                width: "10%",
                customBodyRender: (value) => moment(value).format("lll"),
            },
        },
        {
            name: "start",
            label: "Start Date",
            viewColumns: false,
            options: {
                filter: true,
                sort: true,
                display: false,
                customBodyRender: (value) =>
                    moment(new Date(value)).format(SPACED_DATE_FORMAT),
            },
        },
        {
            name: "end",
            label: "End Date",
            viewColumns: false,
            options: {
                filter: true,
                sort: true,
                display: false,
                customBodyRender: (value) =>
                    moment(new Date(value)).format(SPACED_DATE_FORMAT),
            },
        },
        {
            name: "distance",
            label: "Dist",
            options: {
                filter: true,
                sort: true,
                width: "5%",
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
                    //const volId = tableMeta.rowData[1];
                    const status = tableMeta.rowData[2];
                    return (
                        <Button
                            variant="contained"
                            color="secondary"
                            size="small"
                            //disabled={(volId === null ||status === "Completed") ? true : false}
                            disabled={status !== "DN" && status !== "CL" ? false : true}
                            style={{ marginLeft: 2, minWidth: "70px" }}
                            className="button"
                            value={value}
                            onClick={() => {
                                axios
                                .get("http://localhost:8000/api/tasks/" + value + "/")
                                .then((response) => {
                                    const data = response.data;
                                    console.log(data);
                                    const task = response.data;
                                    const selectedTask = {
                                        id: `${task.id}`,
                                        lastName: `${task.requestee.last_name}`,
                                        firstName: `${task.requestee.first_name}`,
                                        taskType: `${task.task_type.task_type}`,
                                        taskDetails: `${task.description}`,
                                        start: `${task.start_time}`,
                                        end: `${task.end_time}`,
                                        distance: `${task.id}`,
                                        volId: `${task.volunteer?.id}`, //need to find a way to assign null
                                        status: `${task.status}`,
                                        volEmail: `${task.volunteer?.email}`
                                    };
                                    console.log("slected tasks");
                                    console.log(selectedTask);
                                    if (selectedTask.status === "AS") {
                                        axios
                                            .patch(
                                                "http://localhost:8000/api/tasks/" + value + "/",
                                                {
                                                    status: "OP",
                                                    volId: null,
                                                    prevTaskState: selectedTask.status,
                                                    prevTaskVolEmail: selectedTask.volEmail
                                                }
                                            )
                                            .then(function (response) {
                                                console.log(response);
                                            })
                                            .catch(function (error) {
                                                console.log(error);
                                            });

                                            handleReject(value);
                                    } else {
                                        console.log("alert task already assigned");
                                    }
                                })
                                .catch(function (error) {
                                    console.log("error");
                                    console.log(error.request);
                                    console.log(error.config);
                                    console.log(error.message);
                                });
                               // handleReject(value);
                            }}
                        >
                            {status !== "CL" ? "Reject" : "Cancelled"}
                        </Button>
                    );
                },
            },
        },
        {
            name: "id",
            label: "Confirm",

            options: {
                sort: false,
                filter: false,
                viewColumns: false,
                display: isMyTask === true ? true : false,
                customBodyRender: (value, tableMeta) => {
                    const status = tableMeta.rowData[2];
                    return (
                        <Button
                            variant="contained"
                            color="default"
                            size="small"
                            // disabled={ status !== "Completed" ? false : true}
                            disabled={status !== "DN" && status !== "CL" ? false : true}
                            style={{ marginLeft: 2, minWidth: "90px" }}
                            className="button"
                            value={value}
                            onClick={() => {
                                axios
                                .get("http://localhost:8000/api/tasks/" + value + "/")
                                .then((response) => {
                                    const data = response.data;
                                    console.log(data);
                                    const task = response.data;
                                    const selectedTask = {
                                        id: `${task.id}`,
                                        lastName: `${task.requestee.last_name}`,
                                        firstName: `${task.requestee.first_name}`,
                                        taskType: `${task.task_type.task_type}`,
                                        taskDetails: `${task.description}`,
                                        start: `${task.start_time}`,
                                        end: `${task.end_time}`,
                                        distance: `${task.id}`,
                                        volId: `${task.volunteer?.id}`, //need to find a way to assign null
                                        status: `${task.status}`,
                                        volEmail: `${task.volunteer?.email}`
                                    };
                                    console.log("slected tasks");
                                    console.log(selectedTask);
                                    if (selectedTask.status === "AS") {
                                        axios
                                            .patch(
                                                "http://localhost:8000/api/tasks/" + value + "/",
                                                {
                                                    status: "DN",
                                                    prevTaskState: selectedTask.status,
                                                    prevTaskVolEmail: selectedTask.volEmail                                                  
                                                }
                                            )
                                            .then(function (response) {
                                                console.log(response);
                                            })
                                            .catch(function (error) {
                                                console.log(error);
                                            });

                                            handleComplete(value);
                                    } else {
                                        console.log("alert task already assigned");
                                    }
                                })
                                .catch(function (error) {
                                    console.log("error");
                                    console.log(error.request);
                                    console.log(error.config);
                                    console.log(error.message);
                                });
                               // handleComplete(value);
                            }}
                        >
                            {status !== "DN" ? "COMPLETE" : "DONE"}
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
                    //const volId = tableMeta.rowData[1];
                    const status = tableMeta.rowData[2];
                    return (
                        <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            //disabled={volId === null ? false : true}
                            disabled={status !== "OP" ? true : false}
                            style={{
                                marginLeft: 2,
                                backgroundColor: status !== "OP" ? "lightgrey" : "green",
                            }}
                            className="button"
                            value={value}
                            onClick={() => {
                                //console.log(tableMeta.rowData[1]);
                                console.log("value");
                                console.log(value);
                                axios
                                    .get("http://localhost:8000/api/tasks/" + value + "/")
                                    .then((response) => {
                                        const data = response.data;
                                        console.log(data);
                                        const task = response.data;
                                        const selectedTask = {
                                            id: `${task.id}`,
                                            lastName: `${task.requestee.last_name}`,
                                            firstName: `${task.requestee.first_name}`,
                                            taskType: `${task.task_type.task_type}`,
                                            taskDetails: `${task.description}`,
                                            start: `${task.start_time}`,
                                            end: `${task.end_time}`,
                                            distance: `${task.id}`,
                                            volId: `${task.volunteer?.id}`, //need to find a way to assign null
                                            status: `${task.status}`,
                                            volEmail: `${task.volunteer?.email}`
                                        };
                                        console.log("slected tasks");
                                        console.log(selectedTask);
                                        if (selectedTask.status === "OP") {
                                            axios
                                                .patch(
                                                    "http://localhost:8000/api/tasks/" + value + "/",
                                                    {
                                                        status: "AS",
                                                        volId: volUserId,
                                                        prevTaskState: selectedTask.status,
                                                        prevTaskVolEmail: null
                                                    }
                                                )
                                                .then(function (response) {
                                                    console.log(response);
                                                })
                                                .catch(function (error) {
                                                    console.log(error);
                                                });

                                            handleAccept(value,volUserId);
                                        } else {
                                            console.log("alert task already assigned");
                                        }
                                    })
                                    .catch(function (error) {
                                        console.log("error");
                                        console.log(error.request);
                                        console.log(error.config);
                                        console.log(error.message);
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
        <MuiThemeProvider theme={theme()}>
            <MUIDataTable
                title={isMyTask === false ? "New Tasks" : "My Pending Tasks"}
                data={taskListData}
                columns={taskCols}
                options={options}
            />
        </MuiThemeProvider>
    );
}
