import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart'
import PetsIcon from '@material-ui/icons/Pets'
import PhoneIcon from '@material-ui/icons/Phone'
import LocalPharmacyIcon from '@material-ui/icons/LocalPharmacy'
import LocalHospitalIcon from '@material-ui/icons/LocalHospital'
import LiveHelpIcon from '@material-ui/icons/LiveHelp'
import NewTaskForm from './NewTaskForm'

const useStyles =
    makeStyles(
        {
            h1: {
                color: "#4C4B51"
            },
            largeButton: {
                border: 5,
                color: "#FF8E53",
                padding: "15px 15px",
                margin: "5px 15px 10px 15px",
                height: 100,
                width: 100,
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

let taskList = []

function AddTask() {

    const addTask = newTask => {
        taskList = [...taskList, newTask]
        console.log("New task added: ", newTask)
        console.log("Tasks list :", taskList)
    }

    const [showAddDialog, setShowAddDialog] = React.useState(false);
    const [taskType, setTaskType] = React.useState(null);

    const handleClickOpen = (e, taskType) => {
        setTaskType(taskType)
        setShowAddDialog(true)
    }

    const handleClose = () => {
        setTaskType(null)
        setShowAddDialog(false)
    }

    const classes = useStyles();
    // return <ThemeProvider theme={theme}>
    return <div className="App">

        <h1 className={classes.h1}>I need help with...</h1>

        <Button classes={{ root: classes.largeButton, label: classes.label }}
            onClick={(e) => handleClickOpen(e, "shop")}>
            <ShoppingCartIcon className={classes.largeIcon} />
            Shopping
        </Button>
        <Button classes={{ root: classes.largeButton, label: classes.label }}
            onClick={(e) => handleClickOpen(e, "pharm")}>
            <LocalPharmacyIcon className={classes.largeIcon} />
            Pharmacy
        </Button>
        <Button classes={{ root: classes.largeButton, label: classes.label }}
            onClick={(e) => handleClickOpen(e, "dog")}>
            <PetsIcon className={classes.largeIcon} />
            Dog Walk
        </Button>
        <Button classes={{ root: classes.largeButton, label: classes.label }}
            onClick={(e) => handleClickOpen(e, "hospital")}>
            <LocalHospitalIcon className={classes.largeIcon} />
            Hospital
        </Button>
        <Button classes={{ root: classes.largeButton, label: classes.label }}
            onClick={(e) => handleClickOpen(e, "phone")}>
            <PhoneIcon className={classes.largeIcon} />
            Phone Call
        </Button>
        <Button classes={{ root: classes.largeButton, label: classes.label }}
            onClick={(e) => handleClickOpen(e, "any")}>
            <LiveHelpIcon className={classes.largeIcon} />
            Other
        </Button>

        <NewTaskForm open={showAddDialog} handleClose={handleClose} taskType={taskType} addTask={addTask} />
    </div>
}

export default AddTask