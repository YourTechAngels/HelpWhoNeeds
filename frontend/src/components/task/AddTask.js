import React, { useState, useEffect } from 'react'
import NewTaskButtons from './NewTaskButtons'
import NewTaskForm from './NewTaskForm'
import TasksTable from './TaskTable'
import SearchVolunteerDialog from './SearchVolunteer'
import VolDetails from './VolDetails'
import ConfirmDialog from "../structure/ConfirmDialog";
import axios from "axios"
import moment from "moment";
import { useAuth } from "../../contexts/AuthContext";
import Notification from "../structure/Notification";



function AddTask() {
    const { currentUser } = useAuth()
    // const userUID = "TfZgotIRogvPmoGEcKiB" // currentUser.uid
    const userUID = currentUser.uid
    const [reqId, setReqId] = useState(-1)
    const [taskList, setTaskList] = useState([])
    const [taskTypeList, setTaskTypeList] = useState({})
    const [notifyMsg, setNotifyMsg] = useState({
        isOpen: false,
        message: " ",
        type: " ",
    });

    const parseDbTask = (dbTask) => {
        let task = {}
        task.id = dbTask.id
        task.taskType = dbTask.task_type
        task.taskTypeName = dbTask.task_type_details.task_type_name
        task.taskDetails = dbTask.description
        task.start = dbTask.start_time
        task.end = dbTask.end_time
        task.expired = dbTask.expired
        task.dbsReq = dbTask.dbs_required
        task.status = dbTask.status
        task.statusName = dbTask.status_name
        task.requesteeId = dbTask.requestee
        task.requestee = dbTask.requestee_details
        task.reqPostcode = dbTask.requestee_details.post_code
        task.volunteerId = dbTask.volunteer
        task.volunteer = dbTask.volunteer ? dbTask.volunteer_details : null
        task.requestedVol = dbTask.requested_vol ?
            dbTask.requested_vol_details.first_name + ' ' +
            dbTask.requested_vol_details.last_name : null
        return task
    }

    useEffect(() => {
        const options = {
            method: 'GET',
            url: "/api/requestee/tasks/",
            timeout: 8000,
            params: {
                requid: userUID,
            },
        }
        axios(options)
            .then((response) => {
                // console.log("All user' tasks: ", response.data)
                const taskData = response.data.map(task => parseDbTask(task))
                setTaskList(taskData)

                if (response.data.length > 0) {
                    setReqId(response.data[0].requestee)
                    console.log("Requestee ID: ", reqId, typeof reqId)
                }
                else {
                    console.log("Asking user id..")
                    axios.get("/api/accounts/get_user_by_id/", {
                        params: { uid: userUID, },
                    })
                        .then((response) => {
                            // console.log(response)
                            console.log("Requestee id: ", response.data.id);
                            setReqId(response.data.id)
                        })
                        .catch(error => {
                            console.log("error");
                            console.log(error.message, error.request);
                        })
                }
            })
            .catch(error => {
                console.log("error")
                console.log(error.message);
                console.log(error.request);
                console.log(error.config);
            })
    }, [])

    useEffect(() => {
        axios.get("/api/tasktypes/")
            .then((response) => {
                setTaskTypeList(response.data)
                if (response.data.length == 0) {
                    setNotifyMsg({
                        isOpen: true,
                        message: "Please reload the page. Vital data has not been received from server. Application may be functioning wrong.",
                        type: "warning",
                    });
                }
            })
            .catch(error => {
                console.log("error")
                console.log(error.message);
                console.log(error.request);
                console.log(error.config);
            })
    }, [])

    const addTask = newTask => {
        const updatedTaskList = [...taskList, newTask]
        setTaskList(updatedTaskList)
        console.log("All Tasks:", taskList)
    }

    const updateTask = (updTask, id) => {
        let updatedTaskList = taskList.filter(task => task.id !== id)
        updatedTaskList = [...updatedTaskList, updTask]
        setTaskList(updatedTaskList)
    }

    const updateTaskList = (dbTask, id) => {
        if (id < 0)
            addTask(parseDbTask(dbTask))
        else
            updateTask(parseDbTask(dbTask), id)
    }

    const requestVolunteer =(volId, taskId)=> {
        console.log("Vol num: ", volId)
        axios.patch("/api/tasks/" + taskId + "/", {
            requested_vol: volId
        })
            .then(function (response) {
                console.log(response)
                if (response.status === 200) {
                    const updatedTask = response.data
                    updateTaskList(updatedTask, response.data.id)
                    console.log("onSubmit: updated task with id: ", updTaskId)
                    updateTaskList(updatedTask, taskId)
                    setNotifyMsg({
                        isOpen: true,
                        message: "Your request has been sent to the volunteer.",
                        type: "success",
                    })
                }
                else console.log("Something went wrong on task update..",
                    "Response status: ", response.status)
            })
            .catch(function (error) {
                console.log(error.request)
                console.log(error.config)
            })
    }


    const taskDefaults = {
        taskDetails: "",
        startDate: null,
        startTime: "08:00",
        endDate: null,
        endTime: "20:00"
    }

    const [showAddDialog, setShowAddDialog] = React.useState(false)
    const [taskType, setTaskType] = React.useState(null)
    const [newTaskDefaults, setNewTaskDefaults] = React.useState(taskDefaults)
    const [updTaskId, setUpdTaskId] = React.useState(-1)

    const [showSearchDialog, setShowSearchDialog] = React.useState(false)
    const [dialogSearchData, setDialogSearchData] = React.useState({})

    const [showVolDetails, setShowVolDetails] = React.useState(false)
    const [volDetails, setVolDetails] = React.useState({})

    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false, title: "", subTitle: "",
    })

    const findTaskType = id => {
        return taskTypeList.find(type => type.id == id)
    }

    const findTask = id => {
        return taskList.find(task => task.id === id)
    }

    const handleClickOpen = (e, taskType) => {
        setTaskType(taskTypeList.find(type => type.task_type == taskType))
        setShowAddDialog(true)
    }

    const handleClose = () => {
        setTaskType(null)
        setShowAddDialog(false)
        setNewTaskDefaults(taskDefaults)
        setUpdTaskId(-1)
    }

    const handleSearchVol = (e, taskId) => {
        const taskToRequest = findTask(taskId)
        axios.get("/api/requestee/nearby_vols?req_id=" + reqId)
            .then((response) => {
                console.log("Nearby Volunteers:", response.data)
                const volunteers = response.data.map(vol => {
                    return {
                        volId: `${vol.id}`,
                        fullName: `${vol.first_name} ${vol.last_name}`,
                        distance: (parseFloat(`${vol.distance}`) / 1609).toFixed(2),
                        "taskId": taskId
                    }
                })
                if(volunteers != null ){
                    setDialogSearchData(volunteers)
                    setShowSearchDialog(true)
                }
            })
            .catch(error => {
                console.log("Error: ", error.message);
                console.log("Request error: ", error.request);
            })
    }

    const handleSearchClose = () => {
        setShowSearchDialog(false)
        setDialogSearchData([])
    }

    const handleContactVol = (e, id) => {
        setVolDetails(findTask(id).volunteer)
        setShowVolDetails(true)
    }

    const handleVolDetailsClose = () => {
        setShowVolDetails(false)
        setVolDetails({})
    }

    const handleCopy = id => {
        const taskToCopy = taskList.find(task => task.id === id)
        setTaskType(findTaskType(taskToCopy.taskType))
        setNewTaskDefaults({
            ...newTaskDefaults,
            taskDetails: taskToCopy.taskDetails,
        })
        setShowAddDialog(true)
    }

    const handleEdit = id => {
        const taskToEdit = findTask(id)
        setTaskType(findTaskType(taskToEdit.taskType))
        setNewTaskDefaults({
            taskDetails: taskToEdit.taskDetails,
            startDate: moment(taskToEdit.start).format('YYYY-MM-DD'),
            startTime: moment(taskToEdit.start).format('HH:mm'),
            endDate: moment(taskToEdit.end).format('YYYY-MM-DD'),
            endTime: moment(taskToEdit.end).format('HH:mm'),
        })
        setUpdTaskId(id)
        setShowAddDialog(true)
    }

    const handleCancel = id => {
        setConfirmDialog({
            isOpen: true,
            title: "Are you sure you wish to cancel your Task?",
            subTitle:
                "Once canceled nobody will be able to help you with the task.",
            onConfirm: () => {
                setConfirmDialog({
                    ...confirmDialog,
                    isOpen: false,
                })
                axios.patch("/api/tasks/" + id + '/', {status: "CL"})
                    .then(function (response) {
                        // console.log("PATCH RESPONSE: ", response)
                        // console.log("PATCH RESPONSE DATA: ", response.data.id)
                        if (response.status === 200) {
                            const updatedTask = response.data
                            updateTaskList(updatedTask, response.data.id)
                            console.log("onSubmit: updated task with id: ", updTaskId)
                            // update frontend list of task
                            // console.log(updateTask)
                            updateTaskList(updatedTask, id)
                        }
                        else console.log("Something went wrong on task update..",
                            "Response status: ", response.status)
                    })
                    .catch(function (error) {
                        console.log(error.request)
                        console.log(error.config)
                    })
            }
        })
    }

    return <div className="centered">

        <NewTaskButtons handleClickOpen={handleClickOpen} />

        <NewTaskForm open={showAddDialog} handleClose={handleClose} taskType={taskType}
                     defaultValues={newTaskDefaults} updTaskId={updTaskId}
                     updateTaskList={updateTaskList} reqId={reqId} />

        <TasksTable taskList={taskList} handleCopy={handleCopy} handleEdit={handleEdit}
                    handleCancel={handleCancel} handleContact={handleContactVol}
                    handleSearchVol={handleSearchVol} />

        <VolDetails  open={showVolDetails} handleClose={handleVolDetailsClose}
                     volunteer={volDetails} />

        <SearchVolunteerDialog open={showSearchDialog} handleClose={handleSearchClose}
                               data={dialogSearchData} requestVolunteer={requestVolunteer} />

        <ConfirmDialog confirmDialog={confirmDialog}
                       setConfirmDialog={setConfirmDialog} />

        <Notification notify={notifyMsg} setNotify={setNotifyMsg}
                      verticalPosTop={true} />

    </div>
}

export default AddTask