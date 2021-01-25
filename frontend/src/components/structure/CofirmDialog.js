import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    makeStyles,
} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({

    dailog: {
        padding: theme.spacing(2),
        position: "absolute",
        top: theme.spacing(15),
    },
    dailogContent: {
        textAlign: "center",
    },
    dailogAction: {
        justifyContent: "center",
    }

}));

const ConfirmDialog = (props) => {
    const classes = useStyles();
    const { confirmDialog, setConfirmDialog } = props;

    return (
        <Dialog open={confirmDialog.isOpen}
            className={classes.dailog}>
            <DialogTitle>
                <Typography variant="h6">{confirmDialog.title}</Typography>
            </DialogTitle>
            <DialogContent className={classes.dailogContent}>
                <Typography variant="subtitle2">{confirmDialog.subTitle}</Typography>
            </DialogContent>
            <DialogActions className={classes.dailogAction}>
                <Button variant="contained"
                    size="small"
                    style={{ minWidth: '90px' }}
                    onClick={confirmDialog.onConfirm}
                >
                    OK
        </Button>
                <Button variant="contained"
                    size="small"
                    style={{ minWidth: '90px' }}
                    onClick={() => setConfirmDialog({ ...ConfirmDialog, isOpen: false })}
                >
                    Cancel
        </Button>
            </DialogActions>
        </Dialog>
    );
}


export default ConfirmDialog;