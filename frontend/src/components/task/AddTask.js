import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useState } from "react"
import Button from '@material-ui/core/Button'
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart'
import PetsIcon from '@material-ui/icons/Pets'
import PhoneIcon from '@material-ui/icons/Phone'
import LocalPharmacyIcon from '@material-ui/icons/LocalPharmacy'
import LocalHospitalIcon from '@material-ui/icons/LocalHospital'
import LiveHelpIcon from '@material-ui/icons/LiveHelp'
import NewTaskForm from './NewTaskForm'
import TasksTable from './TaskTable'
import initialTasks from "./tasksDataOnly"

const useStyles =
    makeStyles(
        {
            h1: {
                color: "#4C4B51"
            },
            largeButton: {
                border: 5,
                color: "#FF8E53",
                padding: "15px",
                margin: "15px",
                height: 100,
                width: 110,
            },
            largeIcon:
                { fontSize: 60 },

            label: {
                flexDirection: 'column',
                // color: '#4C4B51'
            },
            icon: {
                fontSize: '32px !important',
                marginBottom: 5
            }
        })


function AddTask() {

    const [taskList, setTaskList] = useState(initialTasks())
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
            return }
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

    const classes = useStyles();

    return <div className="centered">

        <h1>I need help with...</h1>

        <Button classes={{ root: classes.largeButton, label: classes.label }}
            onClick={(e) => handleClickOpen(e, "Shopping")}>
            <ShoppingCartIcon className={classes.largeIcon} />
            Shopping
        </Button>
        <Button classes={{ root: classes.largeButton, label: classes.label }}
            onClick={(e) => handleClickOpen(e, "Pharmacy")}>
            <LocalPharmacyIcon className={classes.largeIcon} />
            Pharmacy
        </Button>
        <Button classes={{ root: classes.largeButton, label: classes.label }}
            onClick={(e) => handleClickOpen(e, "Dog Walking")}>
            <PetsIcon className={classes.largeIcon} />
            Dog Walk
        </Button>
        <Button classes={{ root: classes.largeButton, label: classes.label }}
            onClick={(e) => handleClickOpen(e, "Hospital")}>
            <LocalHospitalIcon className={classes.largeIcon} />
            Hospital
        </Button>
        <Button classes={{ root: classes.largeButton, label: classes.label }}
            onClick={(e) => handleClickOpen(e, "Chat")}>
            <PhoneIcon className={classes.largeIcon} />
            Chat
        </Button>
        <Button classes={{ root: classes.largeButton, label: classes.label }}
            onClick={(e) => handleClickOpen(e, "Other")}>
            <LiveHelpIcon className={classes.largeIcon} />
            Other
        </Button>

        <NewTaskForm open={showAddDialog} handleClose={handleClose} taskType={taskType}
            addTask={addTask} defaultValues={newTaskDefaults} updateTask={updateTask} updTaskId={updTaskId} />

        <TasksTable taskList={taskList} handleCopy={handleCopy}
            handleEdit={handleEdit} handleRemove={handleRemove} />
    </div>
}

export default AddTask