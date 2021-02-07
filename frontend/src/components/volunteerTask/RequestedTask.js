import React from "react"
import { useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import Button from "@material-ui/core/Button"
import Grid from '@material-ui/core/Grid'
import axios from "axios"
import ConfirmDialog from "../structure/ConfirmDialog"
import Notification from "../structure/Notification"
import Alert from '@material-ui/lab/Alert'
import AlertTitle from '@material-ui/lab/AlertTitle'
import { CircularProgress } from "@material-ui/core"
import { TextField } from "@material-ui/core"
import moment from "moment/moment";

const useStyles = {
    textFld: { width: '85%', minHeight: 40, paddingLeft: 8,  },
    button: {
      border: '4px',
      fontWeight: 'bold',
      marginLeft: 10,
      marginTop: '10px',
    },
    div:{ fontSize: '20px',}
  };
  
const RequestedTask = () => {
    const param = useParams();
    const taskId = param.taskid;
    const [requestedTask, setRequestedTask] = useState(null);   
    const [errMessage, setErrMessage] = useState("");
    const [taskAccepted, setTaskAccepted] = useState(false);
    const [taskCancelled, setTaskCancelled] = useState(false);
    const [taskStateUpdated, setTaskStateUpdated] = useState(true);
    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false,
        title: "",
        subTitle: "",
    });
    const [notifyMsg, setNotifyMsg] = useState({
        isOpen: false,
        message: " ",
        type: " ",
    });
    console.log("set UserId");
    useEffect(() => {
        console.log("call task")
        axios.get("https://letmeknow.uk/api/tasks/" + taskId + "/")
            .then((response) => {
                const data = response.data;
                console.log(data);
                const task = response.data;
                const reqTask = {
                    id: `${task.id}`,
                    lastName: `${task.requestee_details.last_name}`,
                    firstName: `${task.requestee_details.first_name}`,
                    taskType: `${task.task_type_details.task_type_name}`,
                    taskDetails: `${task.description}`,
                    start: `${task.start_time}`,
                    end: `${task.end_time}`,
                    adressLine1: `${task.requestee_details.address_line_1}`,
                    adressLine2: `${task.requestee_details.address_line_2}`,
                    city: `${task.requestee_details.city}`,
                    county: `${task.requestee_details.county}`,
                    postCode: `${task.requestee_details.post_code}`,
                    reqVolId: `${task.requested_vol_details?.id}`,
                    status: `${task.status}`,
                    phoneNumber: `${task.requestee_details.phone_number}`,
                    email: `${task.requestee_details.email}`,
                    expiredTask: `${task.expired}`,
                }               
                setRequestedTask(reqTask);  
                setTaskCancelled(reqTask.status ==="CL" ? true :  false ) 
                setErrMessage(reqTask.expiredTask === "true" ? "The task has expired. You can no longer accept this task": 
                            reqTask.status === "CL" ? "Task has been cancelled by requestee and no longer available for assignment.":
                          (reqTask.status !== "OP" ? "Task has been assigned to a volunteer." :  ""))
            })
            .catch(function (error) {
                console.log("error");
                console.log(error.request);
                console.log(error.config);
                console.log(error.message);
            });
    }, [taskId]);
    console.log("requested tasks outside");
    console.log(requestedTask);

    const handleAccept = (reqTaskId) => {

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
                    .get("https://letmeknow.uk/api/tasks/" + reqTaskId + "/")
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
                            console.log(requestedTask.reqVolId)
                            axios
                                .patch("https://letmeknow.uk/api/tasks/" + reqTaskId + "/", {
                                    status: "AS",
                                    volId: requestedTask.reqVolId,
                                    isUpdatedByVol: true,
                                })
                                .then(function (response) {
                                    console.log(response);
                                    setTaskStateUpdated(true);
                                    setNotifyMsg({
                                        isOpen: true,
                                        message:
                                            "Task is successfully assigned to you.Email notification will be sent shortly.",
                                        type: "success",
                                    });
                                    setTaskAccepted(true)
                                })
                                .catch(function (error) {
                                    console.log(error);
                                });
                        } else {
                            setNotifyMsg({
                                isOpen: true,
                                message:
                                    "Task has been already accepted.",
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

    const handleReject = (reqTaskId) => {

        setConfirmDialog({
            isOpen: true,
            title: "Can't you help with this task?",
            subTitle:
                "This will only reject the request to complete the task. If you have already accepted this request and wish to return it, please do it from assigned tasks list in your cabinet.",
            onConfirm: () => {
                setConfirmDialog({
                    ...confirmDialog,
                    isOpen: false,
                });
                setTaskStateUpdated(false);
                axios.patch("https://letmeknow.uk/api/tasks/" + reqTaskId + "/", {
                    requested_vol: null,
                    })
                    .then(function (response) {
                        console.log(response);
                        setTaskStateUpdated(true);
                        setNotifyMsg({
                            isOpen: true,
                            message:
                                "The request has been rejected.",
                            type: "success",
                        });
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            },

        });
    };

    return (
        <React.Fragment>  
            {errMessage && <Alert severity="error">
            <AlertTitle>{errMessage}</AlertTitle>
            </Alert>}    
        <Grid container flex-start="center" >    
        {!taskStateUpdated && (
                            <div>
                                {" "}
                                <CircularProgress />
                                <CircularProgress color="secondary" />
                            </div>
                        )}        
            <div>
                {requestedTask? !taskCancelled &&
                    <div >
                        <h4>{"Requested Task Detail:"}</h4>
                        <Grid container spacing={1} flex-start="left">
                               
                                <Grid item xs={12} sm={12}>
                                    <TextField
                                        id="requestee"
                                        type="string"
                                        label="Requested By"
                                        value={requestedTask.firstName + " " + requestedTask.lastName}
                                        variant="outlined"
                                        style={useStyles.textFld}
                                        autoComplete="family-name"                                      
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12}>
                                    <TextField
                                        id="taskType"
                                        type="string"
                                        label="Task"
                                        value={requestedTask.taskType}
                                        variant="outlined"
                                        style={useStyles.textFld}
                                        autoComplete="family-name"                                      
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12}>
                                    <TextField
                                        id="taskDetails"
                                        type="string"
                                        label="Task Summary"
                                        value={requestedTask.taskDetails}
                                        variant="outlined"
                                        multiline
                                        rows={6}
                                        style={useStyles.textFld}
                                        autoComplete="family-name"                                       
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12}>
                                    <TextField
                                        id="reqAddress"
                                        type="string"
                                        label="Address"
                                        value={[requestedTask.adressLine1,
                                            requestedTask.adressLine2,
                                            requestedTask.city].filter(x => x).join(",")}
                                        variant="outlined"
                                        style={useStyles.textFld}
                                        autoComplete="family-name"                                       
                                    />
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <TextField
                                        id="postcode"
                                        type="string"
                                        label="Post Code"
                                        value={requestedTask.postCode}                                      
                                        variant="outlined"                                       
                                        style={useStyles.textFld}
                                        autoComplete="family-name"                                       
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12}>
                                    <TextField
                                        id="phone"
                                        type="string"
                                        label="Phone Number"
                                        value={requestedTask.phoneNumber}
                                        variant="outlined"
                                        style={useStyles.textFld}
                                        autoComplete="family-name"                                       
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12}>
                                    <TextField
                                        id="email"
                                        type="string"
                                        label="Email"
                                        value={requestedTask.email}
                                        variant="outlined"
                                        style={useStyles.textFld}
                                        autoComplete="family-name"                                        
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <TextField
                                        id="start"
                                        type="string"
                                        label="Start Time"
                                        value={moment(requestedTask.start).format('lll')}
                                        variant="outlined"
                                        style={useStyles.textFld}
                                        autoComplete="family-name"                                        
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <TextField
                                        id="end"
                                        type="string"
                                        label="End Time"
                                        value={moment(requestedTask.end).format('lll')}
                                        variant="outlined"
                                        style={useStyles.textFld}
                                        autoComplete="family-name"                                       
                                    />
                                </Grid>
                                
                                <Grid item xs={12} sm={6}></Grid>
                                <Grid item xs={12} sm={6}></Grid>
                            </Grid>

                            <Button variant="contained"
                                    color="primary"
                                    size="small"
                                    disabled={errMessage || taskAccepted ? true : false}
                                    style={{
                                        marginLeft: 2,
                                        backgroundColor: errMessage || taskAccepted ? "lightgrey" : "green",
                                    }}
                                    onClick={() => {
                                        handleAccept(`${taskId}`);
                                    }}
                            >
                                Accept
                            </Button>
                            <Button variant="contained"
                                    color="secondary"
                                    size="small"
                                    disabled={errMessage || taskAccepted ? true : false}
                                    style={{
                                        marginLeft: 2,
                                        backgroundColor: errMessage || taskAccepted ? "lightgrey" : "green",
                                    }}
                                    onClick={() => {
                                        handleReject(`${taskId}`);
                                    }} >
                                Reject
                            </Button>
                        </div>
                        : (taskCancelled? <div></div> :
                            <div >   Task not found. Invalid Request.</div>)}

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
        </Grid>
        </React.Fragment>
    );
};

export default RequestedTask;
