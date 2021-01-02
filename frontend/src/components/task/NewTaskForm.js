import React from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
// import Checkbox from '@material-ui/core/Checkbox'
import Typography from '@material-ui/core/Typography'
import Grid from "@material-ui/core/Grid"
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import { useForm, Controller } from 'react-hook-form'
import axios from "axios"
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
    p: { margin: "10px 2px 10px 2px" },
    root: {
        padding: "8px 0px 8px 0px"
    }
})

function FormDialog({ open, handleClose, taskType, addTask }) {

    const dialogHeader = {
        "shop": "Shopping",
        "pharm": "Collect medicine",
        "dog": "Dog Walking",
        "hospital": "Visit Hospital Appointment",
        "phone": "Friendly Chat",
        "any": "I need help with ...",
    }

    const getFormDate = date => {
        let year = date.getFullYear();
        let month = (1 + date.getMonth()).toString().padStart(2, '0');
        let day = date.getDate().toString().padStart(2, '0');
        return year + '-' + month + '-' + day
    }

    const defaultValues = {
        taskDetails: "",
        startDate: null,
        startTime: "08:00",
        endDate: null,
        endTime: "20:00"
    };


    const { register, handleSubmit, reset, errors, watch, setValue, clearErrors, control } =
        useForm({ defaultValues: defaultValues, mode: "all" })

    const resetAndClose = () => {
        reset()
        handleClose()
    }

    const onSubmit = (data) => {
        const start = new Date(data.startDate + "T" + data.startTime)
        const end = new Date(data.endDate + "T" + data.endTime)

        addTask({
            taskType: taskType, taskDetails: data.taskDetails,
            start: start, end: end
        })
        resetAndClose()
    };

    const watchAll = watch()

<<<<<<< HEAD
    // TODO Call through DB
    // Minimum time needed to perform a task *in minutes*
    const minDuration = 30
=======
    const createItem = (data) => {
        const backendTaskTypes = {
            "shop": "GRO",
            "pharm": "PHA",
            "dog": "DOG",
            "hospital": "HOS",
            "phone": "CHAT",
            "any": "ANY", }
        let item = {}
        item["task_type"] = backendTaskTypes[taskType]
        item["description"] = data.taskDetails || null
        item["dbs_needed"] = data.dbsReq
        item["start_time"] = data.startDate
        item["end_time"] = data.endDate
        console.log("item created: ", item)
        return item
    }

    const onSubmit = (data) => {
        console.log("SUBMITTED: ", data)
        // setSubmittedData(data)
        const startHours = getHours(data.startTime)
        const startMins = getMinutes(data.startTime)
        const endHours = getHours(data.endTime)
        const endMins = getMinutes(data.endTime)
        data.startDate = setMinutes(setHours(data.startDate, startHours), startMins)
        data.endDate = setMinutes(setHours(data.endDate, endHours), endMins)

        const item = createItem(data)
        axios.post("http://localhost:8000/api/tasks/", item).catch(function (error) {
            console.log(error.request); console.log(error.config)})
        addTask({tasType: taskType, taskDetails: data.taskDetails,
                startTime: data.startDate, endTime: data.endTime, dbsReq: false})
        handleClose()
    };
>>>>>>> implement initial API call to add tasks to backend DB

    const validateTimes = () => {
        const start = new Date(watchAll.startDate + "T" + watchAll.startTime)
        const end = new Date(watchAll.endDate + "T" + watchAll.endTime)

        if (!watchAll.startDate || !watchAll.startTime ||
            !watchAll.endDate || !watchAll.endTime) {
            clearErrors("endTime")
            return
        }

        const minEnd = start.setMinutes(start.getMinutes() + minDuration)
        if (minEnd > end)
            return "Not enough time to complete your task. " +
                "Consider at least " + minDuration + " minutes." 
    }

    const handleStartDate = e => {
        if (!e.target.value) return
        if ((!watchAll.endDate) ||
            (watchAll.endDate && (watchAll.endDate < e.target.value))) {
            setValue("endDate", e.target.value)
        }
    }

    const handleEndDate = e => {
        if (!e.target.value) return
        if (watchAll.startDate && (watchAll.startDate > e.target.value)) {
            setValue("startDate", e.target.value)
        }
    }

    const classes = useStyles();

    const reqFieldMsg = "Required field"

    return (
        <div>
            <Dialog open={open} onClose={resetAndClose} fullWidth maxWidth="sm">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogTitle id="dialog-add-task">
                        {dialogHeader[taskType]}
                    </DialogTitle>
                    <DialogContent>
                        < TextField
                            id="taskDetails"
                            name="taskDetails"
                            inputRef={register({ required: ["shop", "any"].includes(taskType) })}
                            autoFocus
                            label="Details"
                            multiline
                            rows={5}
                            variant="outlined"
                            fullWidth
                            InputLabelProps={{
                                shrink: true,
                            }}
                            error={errors.taskDetails}
                            helperText={errors.taskDetails && "Details are required for this task type"}
                        />

                        <p className={classes.p}>
                            <br />
                            Set dates when you need it: < br />
                            <Typography variant="caption">
                                Providing wider time window will increase your chances to find a volunteer.
                            </ Typography >
                        </p>

                        <Grid id="start-time" container spacing={3}>
                            <Grid item xs={12} sm={6} >
                                <TextField
                                    inputRef={register({ required: reqFieldMsg })}
                                    id="startDate"
                                    name="startDate"
                                    label="Starting from"
                                    type="date"
                                    margin="dense"
                                    fullWidth
                                    inputProps={{ min: getFormDate(new Date()) }}
                                    onChange={handleStartDate}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    error={errors.hasOwnProperty("startDate")}
                                    helperText={errors.startDate && errors.startDate.message}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    inputRef={register({ required: reqFieldMsg })}
                                    type="time"
                                    id="startTime"
                                    name="startTime"
                                    label="Time"
                                    margin="dense"
                                    fullWidth
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    error={errors.hasOwnProperty("startTime")}
                                    helperText={errors.startTime && errors.startTime.message}
                                />
                            </Grid>
                        </Grid>
                        <Grid id="finish-time" container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    inputRef={register({ required: reqFieldMsg })}
                                    type="date"
                                    margin="dense"
                                    inputProps={{ min: getFormDate(new Date()) }}
                                    id="endDate"
                                    name="endDate"
                                    label="Ending at"
                                    fullWidth
                                    onChange={handleEndDate}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    error={errors.hasOwnProperty("endDate")}
                                    helperText={errors.endDate && errors.endDate.message}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    inputRef={register({
                                        required: reqFieldMsg,
                                        validate: validateTimes
                                    })}
                                    type="time"
                                    id="endTime"
                                    name="endTime"
                                    label="Time"
                                    margin="dense"
                                    fullWidth
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    error={errors.hasOwnProperty("endTime")}
                                    helperText={errors.endTime && errors.endTime.message}
                                />
                            </Grid>
                        </Grid>

                        {/* TODO */}
                        {/* <FormControlLabel disabled
                            control={
                                <Checkbox
                                    name="dbsRequired"
                                    checked={false}
                                />}
                            label="Only volunteers with DBS certificate"
                        /> */}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={resetAndClose} color="primary">
                            Cancel
                        </Button>
                        <Button type="Submit" color="primary">
                            Add
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </div>
    );
}

export default FormDialog