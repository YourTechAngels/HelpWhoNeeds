import React, { useState, useEffect } from 'react'
import NewTaskButtons from './NewTaskButtons'
import NewTaskForm from './NewTaskForm'
import TasksTable from './TaskTable'
import axios from "axios"
import moment from "moment";
import { useAuth } from "../../contexts/AuthContext";
import SearchVolunteerDialog from './SearchVolunteer'


function AddTask() {
    // const { currentUser } = useAuth()
    // const userUID = "WKERfsSJNM"  // user with no tasks
    const userUID = "BeCXXLBaHB" // currentUser.uid
    const [reqId, setReqId] = useState(-1)
    const [taskList, setTaskList] = useState([])
    const [taskTypeList, setTaskTypeList] = useState({})

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
            url: "https://letmeknow.uk/api/requestee/tasks/",
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
                    axios.get("https://letmeknow.uk/api/accounts/get_user_by_id/", {
                        params: { uId: userUID, },
                    })
                        .then((response) => {
                            console.log(response)
                            console.log("Requestee id: ", response.data[0]);
                            setReqId(response.data[0])
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
        axios.get("https://letmeknow.uk/api/tasktypes/")
            .then((response) => {
                // console.log("Task types:", response.data)
                setTaskTypeList(response.data)
                // TODO notification not all data got
                // if (response.data.length == 0) {
                //     alert()
                // }
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

    const requestVolunteer =(dbTask, volId)=>
    {

    }
    

    const taskDefaults = {
        taskDetails: "",
        startDate: null,
        startTime: "08:00",
        endDate: null,
        endTime: "20:00"
    }

    const [showAddDialog, setShowAddDialog] = React.useState(false);
    const [showSearchDialog, setShowSearchDialog] = React.useState(false);
    const [dialogData, setDialogData] = React.useState(null);
    const [taskType, setTaskType] = React.useState(null);
    const [newTaskDefaults, setNewTaskDefaults] = React.useState(taskDefaults)
    const [updTaskId, setUpdTaskId] = React.useState(-1)

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

    const handleSearchOpen = (e, dialogData) => {        
        setShowSearchDialog(true);
        setDialogData(dialogData);
    }

    const handleSearchClose = () => {      
        setShowSearchDialog(false);
        setDialogData(null);       
    }

    const findTaskType = id => {
        return taskTypeList.find(type => type.id == id)
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
        const taskToEdit = taskList.find(task => task.id === id)
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

    const handleSearchVol = (e, id) => {
        const taskToRequest = taskList.find(task => task.id === id)
        console.log(taskToRequest);
        if (taskToRequest != null) {
            handleSearchOpen(e, taskToRequest);
        }
    };
    const handleCancel = id => {
        axios.patch("https://letmeknow.uk/api/tasks/" + id + '/', { status: "CL" })
            .then(function (response) {
                console.log("PATCH RESPONSE: ", response)
                console.log("PATCH RESPONSE DATA: ", response.data.id)
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


    return <div className="centered">

        <NewTaskButtons handleClickOpen={handleClickOpen} />

        <NewTaskForm open={showAddDialog} handleClose={handleClose} taskType={taskType}
            defaultValues={newTaskDefaults} updTaskId={updTaskId}
            updateTaskList={updateTaskList} reqId={reqId} />

        <TasksTable taskList={taskList} handleCopy={handleCopy}
            handleEdit={handleEdit} handleCancel={handleCancel} handleSearchVol={handleSearchVol}/>
        
        <SearchVolunteerDialog
                            open={showSearchDialog}
                            handleClose={handleSearchClose}
                            title="Search Volunteer"
                            data={dialogData}
                        />
    </div>
}

export default AddTask