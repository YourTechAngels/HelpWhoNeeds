import React from "react";
import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TaskDialog from "./TaskDetail";
import ConfirmDialog from "../structure/ConfirmDialog";
import Grid from "@material-ui/core/Grid";
import TaskListTable from "./TaskListTable";
import Button from "@material-ui/core/Button";
import Hidden from "@material-ui/core/Hidden";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import { CircularProgress } from "@material-ui/core";
import Notification from "../structure/Notification";

const useStyles = makeStyles((theme) => ({
    h5: {
        color: "#4C4B51",
        textAlign: "center",
    },
}));

export default function VolunteerSearchTask() {
    const { currentUser } = useAuth();
    const userUID = currentUser.uid;
    console.log(userUID);
    const [userId, setUserId] = useState(null);
    const [pendingTasks, setPendingTasks] = useState([]);
    const [dataFetched, setDataFetched] = useState(false);
    const [taskStateUpdated, setTaskStateUpdated] = useState(true);
    useEffect(() => {
        axios
            .get("/api/accounts/get_user_by_id/", {
                params: { uid: userUID },
            })
            .then((response) => {
                const data = response.data;
                console.log("userdata");
                console.log(data);
                const user = {
                    id: `${data.id}`,
                };

                console.log("userId by uuid");
                console.log(user.id);
                setUserId(user.id);                
            })
            .catch(function (error) {
                console.log("error");
                console.log(error.request);
                console.log(error.config);
                console.log(error.message);
            });
    }, [userUID]);

    useEffect(() => {
        if (userId != null) {
            axios
                .get("/api/tasks/get_vol_task", {
                    params: {
                        volId: userId,
                    },
                })
                .then((response) => {
                    const data = response.data;
                    //console.log(data);
                    const allTask = data.map((task) => {
                        return {
                            id: `${task.id}`,
                            lastName: `${task.requestee_details.last_name}`,
                            firstName: `${task.requestee_details.first_name}`,
                            taskType: `${task.task_type_details.task_type_name}`,
                            taskDetails: `${task.description}`,
                            start: `${task.start_time}`,
                            end: `${task.end_time}`,
                            distance: `${task.distance}`,
                            volId: `${task.volunteer}`,
                            status: `${task.status}`,
                            postCode: `${task.requestee_details.post_code}`,
                            expiredTask: `${task.expired}`,
                        };
                    });
                    setPendingTasks(allTask);
                    setDataFetched(true);
                    console.log("tasks");
                    console.log(allTask);
                })
                .catch(function (error) {
                    console.log("error");
                    console.log(error.request);
                    console.log(error.config);
                    console.log(error.message);
                });
        }
    }, [userId]);

    console.log("database task");
    // console.log(pendingTasks);
    const classes = useStyles();

    const myTasks = pendingTasks
        ? pendingTasks.filter(
            (task) => task.status === "AS"
        )
        : null;
    const unassignedTasks = pendingTasks.filter(
        (task) => task.status === "OP" && task.expiredTask === "false"
    );

    const [hideMyTask, setHideMyTask] = useState(false);
    const [hideNewTask, setHideNewTask] = useState(false);
    const [showDialog, setShowDialog] = React.useState(false);
    const [dialogData, setDialogData] = React.useState(null);
    const [notifyMsg, setNotifyMsg] = useState({
        isOpen: false,
        message: " ",
        type: " ",
    });
    const [confirmDialog, setConfirmDialog] = useState({
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

    const handleView = (e, taskId) => {
        const selectedTask = pendingTasks.find((task) => task.id === taskId);
        console.log(selectedTask);
        if (selectedTask != null) {
            handleClickOpen(e, selectedTask);
        }
    };

    const handleReject = (taskId) => {
        setConfirmDialog({
            isOpen: true,
            title: "Are you sure to cancel your assigned Task?",
            subTitle:
                "Once rejected you will no longer be able to see the task.To retake the task you need to go to Search Task and Accept it again.",
            onConfirm: () => {
                setConfirmDialog({
                    ...confirmDialog,
                    isOpen: false,
                });
                setTaskStateUpdated(false);
                axios
                    .get("/api/tasks/" + taskId + "/")
                    .then((response) => {
                        const data = response.data;
                        console.log(data);
                        const task = response.data;
                        const selectedTask = {
                            status: `${task.status}`,
                        };
                        console.log("slected tasks");
                        console.log(selectedTask);
                        if (selectedTask.status === "AS") {
                            axios
                                .patch("/api/tasks/" + taskId + "/", {
                                    status: "OP",
                                    volId: null,
                                    isUpdatedByVol: true,
                                })
                                .then(function (response) {
                                    console.log(response);
                                    //change status is frontend
                                    const returnTask = pendingTasks.map((task) =>
                                        task.id === taskId
                                            ? { ...task, volId: null, status: "OP" }
                                            : task
                                    );
                                    setPendingTasks(returnTask);
                                    console.log("myTask");
                                    console.log(myTasks);
                                    console.log("assignTasks");
                                    console.log(unassignedTasks);
                                    console.log(pendingTasks);
                                    setTaskStateUpdated(true);
                                    setNotifyMsg({
                                        isOpen: true,
                                        message:
                                            "Task is unssigned from you. Email notification will be sent shortly.",
                                        type: "warning",
                                    });
                                })
                                .catch(function (error) {
                                    console.log(error);
                                });
                        } else {
                            console.log("alert task already returned");
                        }
                    })
                    .catch(function (error) {
                        console.log("error");
                        console.log(error.request);
                        console.log(error.config);
                        console.log(error.message);
                    });
            },
        });
    };

    const handleAccept = (taskId) => {
        console.log("Accepted userID");
        console.log(userId);
        setConfirmDialog({
            isOpen: true,
            title: "Do you agree to accept this task?",
            subTitle:
                "Once accepted it will be assigned to you.To return the task you need to go to your task list and reject it.",
            onConfirm: () => {
                setConfirmDialog({
                    ...confirmDialog,
                    isOpen: false,
                });
                setTaskStateUpdated(false);
                axios
                    .get("/api/tasks/" + taskId + "/")
                    .then((response) => {
                        const data = response.data;
                        console.log(data);
                        const task = response.data;
                        const selectedTask = {
                            status: `${task.status}`,
                        };
                        console.log("slected tasks");
                        console.log(selectedTask);
                        if (selectedTask.status === "OP") {
                            axios
                                .patch("/api/tasks/" + taskId + "/", {
                                    status: "AS",
                                    volId: userId,
                                    isUpdatedByVol: true,
                                })
                                .then(function (response) {
                                    console.log(response);

                                    const assignTask = pendingTasks.map((task) =>
                                        task.id === taskId
                                            ? { ...task, volId: userId, status: "AS" }
                                            : task
                                    );
                                    setPendingTasks(assignTask);
                                    console.log("assignTasks");
                                    console.log(unassignedTasks);
                                    console.log("myTask");
                                    console.log(myTasks);
                                    console.log(pendingTasks);
                                    setTaskStateUpdated(true);
                                    setNotifyMsg({
                                        isOpen: true,
                                        message:
                                            "Task is successfully assigned to you.Email notification will be sent shortly.",
                                        type: "success",
                                    });
                                })
                                .catch(function (error) {
                                    console.log(error);
                                });
                        } else {
                            setTaskStateUpdated(true);
                            setNotifyMsg({
                                isOpen: true,
                                message:
                                    "Task has already been accepted by another volunteer. Please refresh the page to get the latest new tasks",
                                type: "error",
                            });
                            console.log("alert task already assigned");
                        }
                    })
                    .catch(function (error) {
                        console.log("error");
                        console.log(error.request);
                        console.log(error.config);
                        console.log(error.message);
                    });
            },
        });
    };

    const handleComplete = (taskId) => {
        setConfirmDialog({
            isOpen: true,
            title: "Have you completed this task?",
            subTitle:
                "Once completed it will be marked as done will be removed from your list.",
            onConfirm: () => {
                setConfirmDialog({
                    ...confirmDialog,
                    isOpen: false,
                });
                setTaskStateUpdated(false);
                axios
                    .get("/api/tasks/" + taskId + "/")
                    .then((response) => {
                        const data = response.data;
                        console.log(data);
                        const task = response.data;
                        const selectedTask = {
                            status: `${task.status}`,
                        };
                        console.log("slected tasks");
                        console.log(selectedTask);
                        if (selectedTask.status === "AS") {
                            axios
                                .patch("/api/tasks/" + taskId + "/", {
                                    status: "DN",
                                    isUpdatedByVol: true,
                                })
                                .then(function (response) {
                                    console.log(response);
                                    const assignTask = pendingTasks.map((task) =>
                                        task.id === taskId ? { ...task, status: "DN" } : task
                                    );
                                    setPendingTasks(assignTask);
                                    console.log("assignTasks");
                                    console.log(unassignedTasks);
                                    console.log("myTask");
                                    console.log(myTasks);
                                    console.log(pendingTasks);
                                    setTaskStateUpdated(true);
                                    setNotifyMsg({
                                        isOpen: true,
                                        message:
                                            "Task is successfully marked as completed.Email notification will be sent shortly.",
                                        type: "success",
                                    });
                                })
                                .catch(function (error) {
                                    console.log(error);
                                });
                        } else {
                            console.log("alert task already marked completed");
                        }
                    })
                    .catch(function (error) {
                        console.log("error");
                        console.log(error.request);
                        console.log(error.config);
                        console.log(error.message);
                    });
            },
        });
    };

    return (
        <React.Fragment>          
            {!dataFetched ? (
                <div>
                    <CircularProgress />
                    <CircularProgress color="secondary" />
                </div>
            ) : (
                    <div style={{ height: "100%" }}>
                        {!taskStateUpdated && (
                            <div>
                                {" "}
                                <CircularProgress />
                                <CircularProgress color="secondary" />
                            </div>
                        )}

                        <Grid
                            id="tasks"
                            container
                            spacing={2}
                            direction="row"
                            justify="left"
                        >
                            {!hideMyTask && (
                                <Grid className="my-tasks" item xs={12} sm={6} align="right">
                                    <Hidden smUp>
                                        <Button
                                            variant="contained"
                                            color="default"
                                            size="small"
                                            onClick={() => {
                                                setHideMyTask(true);
                                                setHideNewTask(false);
                                            }}
                                        >
                                            Search New Tasks
                  </Button>{" "}
                                    </Hidden>

                                    <h4 className={classes.h5}>{"My Assigned Tasks"}</h4>
                                    <TaskListTable
                                        taskListData={myTasks}
                                        isMyTask={true}
                                        handleAccept={handleAccept}
                                        handleReject={handleReject}
                                        handleView={handleView}
                                        handleComplete={handleComplete}
                                    />
                                </Grid>
                            )}

                            {!hideNewTask && (
                                <Grid className="new-tasks" item xs={12} sm={6} align="right">
                                    <Hidden smUp>
                                        {" "}
                                        <Button
                                            variant="contained"
                                            color="default"
                                            size="small"
                                            onClick={() => {
                                                setHideNewTask(true);
                                                setHideMyTask(false);
                                            }}
                                        >
                                            View My Tasks
                  </Button>
                                    </Hidden>
                                    <h4 className={classes.h5}>{"Search New Tasks"}</h4>
                                    <TaskListTable
                                        taskListData={unassignedTasks}
                                        isMyTask={false}
                                        handleAccept={handleAccept}
                                        handleReject={handleReject}
                                        handleView={handleView}
                                        handleComplete={handleComplete}
                                    />
                                </Grid>
                            )}
                        </Grid>

                        <TaskDialog
                            open={showDialog}
                            handleClose={handleClose}
                            title="Task Summary"
                            data={dialogData}
                        />
                        <Notification
                            notify={notifyMsg}
                            setNotify={setNotifyMsg}
                            verticalPosTop={true}
                        />
                        <ConfirmDialog
                            confirmDialog={confirmDialog}
                            setConfirmDialog={setConfirmDialog}
                        />
                    </div>
                )}
                
        </React.Fragment>
    );
}
