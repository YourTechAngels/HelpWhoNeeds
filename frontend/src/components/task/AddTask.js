import React, { useState, useEffect } from 'react'
import NewTaskButtons from './NewTaskButtons'
import NewTaskForm from './NewTaskForm'
import TasksTable from './TaskTable'
import axios from "axios"
import { useAuth } from "../../contexts/AuthContext";


function AddTask() {

    const readableTaskTypes = {
        "GRO": "Shopping",
        "PHA": "Pharmacy",
        "DOG": "Dog Walking",
        "HOS": "Hospital",
        "CHAT": "Chat",
        "ANY": "Other",
    }

    const readableStatus = {
        "OP": "Open",
        "EXP": "Expired",
        "AS": "Assigned",
        "CL": "Canceled",
        "DN": "Completed",}

const { currentUser } = useAuth()
const userUID = "WNVuNlpmfs" // currentUser.uid
const [taskList, setTaskList] = useState([])

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
            const taskData = response.data.map(task => {
                return (
                    {
                        id: `${task.id}`,
                        taskType: readableTaskTypes[`${task.task_type.task_type}`],
                        taskDetails: `${task.description}`,
                        start: `${task.start_time}`,
                        end: (`${task.end_time}`),
                        status: readableStatus[`${task.status}`]
                    })
            })
            setTaskList(taskData)
        })
        .catch(error => {
            console.log("error")
            console.log(error.request);
            console.log(error.config);
            console.log(error.message);
        })
}, [])

const [nextId, setNextId] = useState(11)

const addTask = newTask => {
    newTask.id = nextId
    setNextId(nextId + 1)
    newTask.status = "Open"
    const updatedTaskList = [...taskList, newTask]
    setTaskList(updatedTaskList)
}

const updateTask = (updTask, id) => {
    if (id < 0) { // should not happen but in case
        console.log("ERROR: task to be updated does not exists")
        return
    }
    if (updTask.end > new Date())  // expected to be so but just in case
        updTask.status = "Open"
    updTask.id = id
    let updatedTaskList = taskList.filter(task => task.id !== id)
    updatedTaskList = [...updatedTaskList, updTask]
    setTaskList(updatedTaskList)
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
        ...newTaskDefaults,
        taskDetails: taskToEdit.taskDetails,
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
        addTask={addTask} defaultValues={newTaskDefaults} updateTask={updateTask} updTaskId={updTaskId} />

    <TasksTable taskList={taskList} handleCopy={handleCopy}
        handleEdit={handleEdit} handleRemove={handleRemove} />
</div>
}

export default AddTask