import React, { useState, useEffect } from 'react'
import NewTaskButtons from './NewTaskButtons'
import NewTaskForm from './NewTaskForm'
import TasksTable from './TaskTable'
import axios from "axios"
import moment from "moment";
import { useAuth } from "../../contexts/AuthContext";


function AddTask() {
    // const { currentUser } = useAuth()
    // const userUID = "WKERfsSJNM"  // user with no tasks
    const userUID = "WNVuNlpmfs" // currentUser.uid
    const [reqId, setReqId] = useState(-1)
    const [taskList, setTaskList] = useState([])

    const parseDbTask = (dbTask) => {
        let task = {}
        task.id = dbTask.id
        task.taskType = dbTask.task_type
        task.taskTypeName = dbTask.task_type_name
        task.taskDetails = dbTask.description
        task.start = dbTask.start_time
        task.end = dbTask.end_time
        task.dbsReq = dbTask.dbs_required
        task.status = dbTask.status
        task.statusName = dbTask.status_name
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
                console.log(response.data)
                const taskData = response.data.map(task => parseDbTask(task))
                setTaskList(taskData)

                if (response.data.length > 0) {
                    setReqId(response.data[0].requestee)
                    console.log("Requestee ID: ", reqId, typeof reqId)
                }
                else {
                    console.log("Asking user id..")
                    axios.get("/api/accounts/get_user_by_id/", {
                        params: { uId: userUID, },
                    })
                        .then((response) => {
                            console.log(response)
                            console.log("Requestee id: ", response.data[0]);
                            setReqId(response.data[0])
                        })
                        .catch(function (error) {
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

    const addTask = newTask => {
        const updatedTaskList = [...taskList, newTask]
        setTaskList(updatedTaskList)
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

    const taskDefaults = {
        taskDetails: "",
        startDate: null,
        startTime: "08:00",
        endDate: null,
        endTime: "20:00"
    }

    const [showAddDialog, setShowAddDialog] = React.useState(false);
    const [taskType, setTaskType] = React.useState(null);
    const [newTaskDefaults, setNewTaskDefaults] = React.useState(taskDefaults)
    const [updTaskId, setUpdTaskId] = React.useState(-1)

    const handleClickOpen = (e, taskType) => {
        setTaskType(taskType)
        setShowAddDialog(true)
    }

    const handleClose = () => {
        setTaskType(null)
        setShowAddDialog(false)
        setNewTaskDefaults(taskDefaults)
        setUpdTaskId(-1)
    }

    const handleCopy = id => {
        const taskToCopy = taskList.find(task => task.id === id)
        setTaskType(taskToCopy.taskType)
        setNewTaskDefaults({
            ...newTaskDefaults,
            taskDetails: taskToCopy.taskDetails,
        })
        setShowAddDialog(true)
    }

    const handleEdit = id => {
        const taskToEdit = taskList.find(task => task.id === id)
        setTaskType(taskToEdit.taskType)
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

    const handleRemove = id => {
        const copyTaskList = [...taskList]
        let taskToCancel = copyTaskList.find(task => task.id === id)
        taskToCancel.status = "Cancelled"
        setTaskList(copyTaskList)
    }


    return <div className="centered">

        <NewTaskButtons handleClickOpen={handleClickOpen} />

        <NewTaskForm open={showAddDialog} handleClose={handleClose} taskType={taskType}
            defaultValues={newTaskDefaults} updTaskId={updTaskId}
            updateTaskList={updateTaskList} reqId={reqId} />

        <TasksTable taskList={taskList} handleCopy={handleCopy}
            handleEdit={handleEdit} handleRemove={handleRemove} />
    </div>
}

export default AddTask