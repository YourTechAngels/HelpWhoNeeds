import { isBefore, getHours, getMinutes, setHours, setMinutes } from "date-fns"
import React from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Checkbox from '@material-ui/core/Checkbox'
import Typography from '@material-ui/core/Typography'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Grid from "@material-ui/core/Grid"
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import { useForm } from 'react-hook-form'
import { makeStyles } from '@material-ui/core/styles'
// import axios from "axios"

const useStyles = makeStyles({
    p: { margin: "10px 2px 10px 2px" },
})

function FormDialog({ open, handleClose, taskType, addTask }) {

    const createItem = (data) => {
        const backendTaskTypes = {
            "shop": "GRO",
            "pharm": "PHA",
            "dog": "DOG",
            "hospital": "HOS",
            "phone": "CHAT",
            "any": "ANY",
        }
        let item = {}
        item["task_type"] = backendTaskTypes[taskType]
        item["description"] = data.taskDetails || null
        item["dbs_needed"] = data.dbsReq
        item["start_time"] = data.startDate
        item["end_time"] = data.endDate
        console.log("item created: ", item)
        return item
    }

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
        taskDetails: null,
        startDate: null,
        startTime: "08:00",
        endDate: null,
        endTime: "20:00"
    };

    const resetAndClose = () => {
        clearErrors()
        reset()
        handleClose()
    }

    const { register, handleSubmit, reset, errors, clearErrors, watch, setValue } =
        useForm({ defaultValues: defaultValues, mode: "all"})

    const onSubmit = (data) => {
        console.log("SUBMITTED: ", data)
        // setSubmittedData(data)
        // const startHours = getHours(data.startTime)
        // const startMins = getMinutes(data.startTime)
        // const endHours = getHours(data.endTime)
        // const endMins = getMinutes(data.endTime)
        // data.startDate = setMinutes(setHours(data.startDate, startHours), startMins)
        // data.endDate = setMinutes(setHours(data.endDate, endHours), endMins)

        // const item = createItem(data)
        // axios.post("http://localhost:8000/api/tasks/", item).catch(function (error) {
        //     console.log(error.request)
        //     // console.log(error.config)
        // })
        addTask({
            tasType: taskType, taskDetails: data.taskDetails,
            startTime: data.startDate, endTime: data.endTime, dbsReq: false
        })
        resetAndClose()
    };

    const watchEndDate = watch("endDate", "")
    const watchStartDate = watch("startDate", "")

    const handleStartDate = e => {
        if (!e.target.value) return
        if ((!watchEndDate) ||
            (watchEndDate && (watchEndDate < e.target.value))) 
            setValue("endDate", e.target.value)
    }

    const handleEndDate = e => {
        if (!e.target.value) return
        if (watchStartDate && (watchStartDate > e.target.value)) 
            setValue("startDate", e.target.value) 
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
                        <TextField
                            id="taskDetails"
                            name="taskDetails"
                            inputRef={register({ required: ["shop", "any"].includes(taskType) })}
                            // autoFocus
                            label="Details"
                            multiline
                            rows={6}
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
                                    inputRef={register({ required: reqFieldMsg})}
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
                                    inputRef={register({ required: reqFieldMsg })}
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


                        <FormControlLabel disabled
                            control={
                                <Checkbox
                                    name="dbsRequired"
                                    checked={false}
                                />}
                            label="Only volunteers with DBS certificate"
                        />
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