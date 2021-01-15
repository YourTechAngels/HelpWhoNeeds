import React from "react";
import { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TaskDialog from "./TaskDetail";
import Notification from "./Notification";
import ConfirmDialog from "./CofirmDialog";
import Grid from "@material-ui/core/Grid";
//import initialTasks from "./TaskListData";
import TaskListTable from "./TaskListTable";
import Button from "@material-ui/core/Button";
import Hidden from "@material-ui/core/Hidden";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
    h5: {
        color: "#4C4B51",
        textAlign: "center",
    },
}));

let allTasks = null;
const getAllTasks = axios
   // .get("http://localhost:8000/api/tasks")
    .get("http://localhost:8000/api/newVoltasks/",{
        params:{
            volId: 4
        }
    })
    .then(
        /*(response) => {
            allTasks = response.data
            console.log(allTasks)
        }*/
        (response) => {
            const data = response.data;
            console.log(data);
            allTasks = data.map(task =>
                {
                    return ({
                        id: `${task.id}`,
                        lastName: `${task.owner.last_name}`,
                        firstName: `${task.owner.first_name}`,
                        taskType: `${task.task_type}`,
                        taskDetails: `${task.description}`,
                        start: `${task.start_time}`,
                        end: (`${task.end_time}`),
                        distance: `${task.id}`,
                       // volId:  (`${task.volunteer}` ?  `${task.volunteer.id}`: null) , //not working properlhy
                        volId: (`${task.volunteer?.id}`), //need to find a way to assign null
                        status: `${task.status}`
                        
                    });
                })
            //console.log("tasks");
            //console.log(allTasks);
        }
    )
    .catch(function (error) {
        console.log("error")
        console.log(error.request);
        console.log(error.config);
        console.log(error.message);

    });
    

//const intialTasks = allTasks;
export default function VolunteerSearchTask() {
    console.log("database json")
    console.log(allTasks);
    const classes = useStyles();
    const [pendingTasks, setPendingTasks] = useState(allTasks)//useState(intialTasks); 
    console.log("pendingTask")
    console.log(pendingTasks)   
    const myTasks = pendingTasks ? pendingTasks.filter(
        (task) =>
            //task.volId !== undefined && task.status === "AS" && task.volId === 3
            task.status === "AS" || task.status === "CL"//&& Number(task.volId) === 3
    ): null;
    const unassignedTasks = pendingTasks.filter((task) => 
                                                       //task.volId === null
                                                    task.status === "OP");

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
            title: "Are you sure to return your assigned Task?",
            subTitle:
                "Once rejected it will be unassigned from you.To reassign the task you need to go to search task and accept it again.",
            onConfirm: () => {
                setConfirmDialog({
                    ...confirmDialog,
                    isOpen: false,
                });
                const returnTask = pendingTasks.map((task) =>
                    task.id === taskId ? { ...task, volId: null, status: "OP" } : task
                );
                setPendingTasks(returnTask);
                console.log("myTask");
                console.log(myTasks);
                console.log("assignTasks");
                console.log(unassignedTasks);
                console.log(pendingTasks);

                setNotifyMsg({
                    isOpen: true,
                    message: "Task is unssigned from you",
                    type: "warning",
                });
            },
        });
    };

    const handleAccept = (taskId) => {
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

                const assignTask = pendingTasks.map((task) =>
                    task.id === taskId ? { ...task, volId: 4, status: "AS" } : task
                );
                setPendingTasks(assignTask);
                console.log("assignTasks");
                console.log(unassignedTasks);
                console.log("myTask");
                console.log(myTasks);
                console.log(pendingTasks);
                setNotifyMsg({
                    isOpen: true,
                    message: "Task is successfully assigned to you.",
                    type: "success",
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

                const assignTask = pendingTasks.map((task) =>
                    task.id === taskId ? { ...task, status: "DN" } : task
                );
                setPendingTasks(assignTask);
                console.log("assignTasks");
                console.log(unassignedTasks);
                console.log("myTask");
                console.log(myTasks);
                console.log(pendingTasks);
                setNotifyMsg({
                    isOpen: true,
                    message: "Task is successfully marked as completed",
                    type: "success",
                });
            },
        });
    };

    return (
        <React.Fragment>
            <div style={{ height: "100%" }}>
                <Grid id="tasks" container spacing={2} direction="row" justify="center">
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
                <Notification notify={notifyMsg} setNotify={setNotifyMsg} />
                <ConfirmDialog
                    confirmDialog={confirmDialog}
                    setConfirmDialog={setConfirmDialog}
                />
            </div>
        </React.Fragment>
    );
}
