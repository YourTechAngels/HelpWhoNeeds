import { isBefore, getHours, getMinutes, setHours, setMinutes } from "date-fns"
import React from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Checkbox from '@material-ui/core/Checkbox'
import Grid from "@material-ui/core/Grid"
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker
} from "@material-ui/pickers"
import DateFnsUtils from '@date-io/date-fns'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import { useForm, Controller } from 'react-hook-form'
import { makeStyles } from '@material-ui/core/styles'
import axios from "axios"

const useStyles =
    makeStyles({
        root: {
            padding: "8px 0px 8px 0px"
        }
    })

function FormDialog({ open, handleClose, taskType, addTask }) {

    const dialogHeader = {
        "shop": "I need help with shoping",
        "pharm": "I need help to collect medicine",
        "dog": "I need help with walking with my dog",
        "hospital": "I need help to visit hospital appointment?",
        "phone": "I'd like to chat",
        "any": "I need help with ...",
    }

    const classes = useStyles();

    const defaultTimeSlotValues = {
        startDate: null,
        startTime: new Date(2021, 11, 17, 8, 0, 0),
        endDate: null,
        endTime: new Date(2021, 11, 17, 20, 0, 0)
    };

    const { errors, getValues, handleSubmit, register, setValue, control } = useForm({
        defaultTimeSlotValues
    });

    const handleStartDate = date => {
        console.log("startDate CHANGED: ", date);
        setValue("startDate", date);
        console.log("(!values.endDate) :", (!values.endDate))
        console.log("isBefore(values.endDate, values.startDate):", isBefore(values.endDate, values.startDate))
        if ((!values.endDate) || isBefore(values.endDate, values.startDate))
            setValue("endDate", date);
        return values
    };

    const handleStartTime = time => {
        setValue("startTime", time);
    };

    const handleEndDate = date => {
        console.log("endDate CHANGED: ", date);
        setValue("endDate", date);
    };

    const handleEndTime = time => {
        setValue("endTime", time);
    };

    // const [submittedData, setSubmittedData] = React.useState({});

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

    const values = getValues();

    return (
        <div>
            <Dialog open={open} onClose={handleClose}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogTitle id="dialog-add-task">
                        {dialogHeader[taskType]}
                    </DialogTitle>
                    <DialogContent>
                        <Controller
                            as={<TextField />}
                            control={control}
                            name="taskDetails"
                            inputRef={register}
                            autoFocus
                            label="Details"
                            multiline
                            rows={3}
                            defaultValue=""
                            variant="outlined"
                            fullWidth
                            // rules={{ required: true }}
                            // errors={errors.taskDetails}
                            // helperText={errors.taskDetails ? "Details are required" : ""}
                        />
                        <DialogContentText >
                            <p> When do you need it? <br />
                                Note, providing wider time window will increase your chances to find a volunteer. </p>
                        </DialogContentText>

                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <Grid id="start-time" container spacing={3}>
                                <Grid item xs={12} sm={6} >
                                    <Controller
                                        as={<KeyboardDatePicker />}
                                        control={control}
                                        rules={{ required: true }}
                                        defaultValue={defaultTimeSlotValues.startDate}
                                        id="startDate"
                                        name="startDate"
                                        label="Starting from"
                                        format="dd.MM.yyyy"
                                        disablePast
                                        margin="normal"
                                        disableToolbar
                                        fullWidth
                                        value={values.startDate}
                                        onChange={handleStartDate}
                                        KeyboardButtonProps={{
                                            "aria-label": "change date"
                                        }}
                                        error={errors.hasOwnProperty("startDate")}
                                        helperText={errors.startDate && errors.startDate.message}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Controller
                                        as={<KeyboardTimePicker />}
                                        control={control}
                                        rules={{ required: true }}
                                        defaultValue={defaultTimeSlotValues.startTime}
                                        id="startTime"
                                        name="startTime"
                                        label="Time"
                                        margin="normal"
                                        ampm={true}
                                        fullWidth
                                        value={values.startTime}
                                        onChange={handleStartTime}
                                        KeyboardButtonProps={{
                                            "aria-label": "change start time"
                                        }}
                                        error={errors.hasOwnProperty("startTime")}
                                        helperText={errors.startTime && errors.startTime.message}
                                    />
                                </Grid>
                            </Grid>
                            <Grid id="finish-time" container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <Controller
                                        as={<KeyboardDatePicker />}
                                        control={control}
                                        rules={{ required: true }}
                                        defaultValue={defaultTimeSlotValues.endDate}
                                        id="endDate"
                                        name="endDate"
                                        label="Ending at"
                                        format="dd.MM.yyyy"
                                        clearable
                                        disablePast
                                        margin="normal"
                                        disableToolbar
                                        fullWidth
                                        value={values.endDate}
                                        onChange={handleEndDate}
                                        KeyboardButtonProps={{
                                            "aria-label": "change date"
                                        }}
                                        error={errors.hasOwnProperty("needDate")}
                                        message='Hi!'
                                        helperText={errors.endDate && errors.endDate.message}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Controller
                                        as={<KeyboardTimePicker />}
                                        defaultValue={defaultTimeSlotValues.endTime}
                                        control={control}
                                        rules={{ required: true }}
                                        id="endTime"
                                        name="endTime"
                                        label="Time"
                                        margin="normal"
                                        ampm={true}
                                        fullWidth
                                        value={values.endTime}
                                        onChange={handleEndTime}
                                        KeyboardButtonProps={{
                                            "aria-label": "change end time"
                                        }}
                                        error={errors.hasOwnProperty("endTime")}
                                        helperText={errors.endTime && errors.endTime.message}
                                    />
                                </Grid>
                            </Grid>
                        </MuiPickersUtilsProvider>

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
                        <Button onClick={handleClose} color="primary">
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