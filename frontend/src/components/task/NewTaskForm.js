import React, { useEffect, useState } from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
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

function FormDialog({ open, handleClose, taskType, defaultValues, 
    updTaskId, updateTaskList, reqId }) {

    useEffect(() => {
        reset(defaultValues);
    }, [defaultValues])


    const dialogHeader = {
        "GRO": "Shopping",
        "PHA": "Collect medicine",
        "DOG": "Dog Walking",
        "HOS": "Visit Hospital Appointment",
        "CHAT": "Friendly Chat",
        "ANY": "I need help with ...",
    }

    const taskTypeId = taskType ? taskType.id : null
    const taskTypeCode = taskType ? taskType.task_type : null
    const minDuration = taskType ? taskType.min_duration : null

    const getFormDate = date => {
        let year = date.getFullYear();
        let month = (1 + date.getMonth()).toString().padStart(2, '0');
        let day = date.getDate().toString().padStart(2, '0');
        return year + '-' + month + '-' + day
    }

    const { register, handleSubmit, reset, errors, watch, setValue, clearErrors } =
        useForm({ defaultValues: defaultValues, mode: "all" })

    const resetAndClose = () => {
        reset()
        handleClose()
    }

    const createItem = (data, start, end) => {
        let item = {}
        item["task_type"] = taskTypeId
        item["description"] = data.taskDetails || ""
        item["dbs_required"] = data.dbsReq
        item["start_time"] = start
        item["end_time"] = end
        // TODO correct!!!! Requestee ID hardcoded!!!!!
        console.log("Requestee ID: ", reqId)
        item["requestee"] = reqId > 0 ? reqId : 100
        item["volunteer"] = null
        console.log("item created: ", item)
        return item
    }

    const onSubmit = (data) => {
        const start = new Date(data.startDate + "T" + data.startTime)
        const end = new Date(data.endDate + "T" + data.endTime)
        const item = createItem(data, start, end)
        console.log("Submitting item: ", item)
        // adding new task
        if (updTaskId < 0)
            axios.post("https://letmeknow.uk/api/tasks/", item)
                .then(function (response) {
                    console.log("POST RESPONSE: ", response)
                    console.log("POST RESPONSE DATA: ", response.data)
                    const newTaskId = (response.status === 201) ? response.data.id : -1
                    if (newTaskId > 0) {
                        console.log("Adding new item to the list of tasks... New Task id=", newTaskId)
                        const newTask = response.data
                        updateTaskList(newTask, -1)
                        console.log("onSubmit: newTaskId: ", newTaskId)
                    }
                    else
                        console.log("Something was unsuccessful. Request status: ", response.status)
                })
                .catch(function (error) {
                    console.log(error.request)
                    console.log(error.config)
                })
        // updating existing task
        else
            axios.put("https://letmeknow.uk/api/tasks/" + updTaskId + '/', item)
                .then(function (response) {
                    console.log("PUT RESPONSE: ", response)
                    console.log("PUT RESPONSE DATA: ", response.data.id)
                    if (response.status === 200) {
                        const updatedTask = response.data
                        updateTaskList(updatedTask, response.data.id)
                        console.log("onSubmit: updated task with id: ", updTaskId)
                    }
                    else console.log("Something went wrong on task update.. Response status: ", response.status)
                }
                )
                .catch(function (error) {
                    console.log(error.request)
                    console.log(error.config)
                })

        console.log("onSubmit: updTaskId: ", updTaskId)
        resetAndClose()
    };

    const watchAll = watch()

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
                        {dialogHeader[taskTypeCode]}
                    </DialogTitle>
                    <DialogContent>
                        < TextField
                            id="taskDetails"
                            name="taskDetails"
                            inputRef={register({ required: ["GRO", "ANY"].includes(taskTypeCode) })}
                            // autoFocus
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
                            Submit
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </div>
    );
}

export default FormDialog