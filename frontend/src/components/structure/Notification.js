import { Snackbar, makeStyles } from "@material-ui/core";
import { Alert } from "@material-ui/lab";

const useStyles = makeStyles((theme) => ({
    root: {
        top: theme.spacing(15),
    },
}));

function Notification(props) {
    const classes = useStyles();
    const { notify, setNotify, verticalPosTop } = props;

    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setNotify({
            ...notify,
            isOpen: false,
        });
    };
    return (
        <Snackbar
            className={classes.root}
            open={notify.isOpen}
            autoHideDuration={2000}
            anchorOrigin={{
                vertical: verticalPosTop ? "top" : "bottom",
                horizontal: "center",
            }}
            onClose={handleClose}
        >
            <Alert severity={notify.type} onClose={handleClose}>
                {notify.message}
            </Alert>
        </Snackbar>
    );
}


export default Notification;