import Button from "@material-ui/core/Button";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import { TextField } from '@material-ui/core';



const useStyles = theme => ({
    textFld: { width: '85%', height: 40, paddingLeft: 8 } , 
    button: {
      border: '4px',
      color: "default",
      fontWeight: 'bold',
      marginLeft: 10,
      marginTop: '10px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        margin: 'auto',
        width: 'fit-content',
      },
    
    });

const TaskDialog = ({ open, handleClose, title, data }) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
    console.log(data);
    return (
        <div>
            <Dialog
                open={open}
                onClose={handleClose}
                fullScreen={fullScreen}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                <form className={useStyles.form} noValidate>
                        {data && (
                            <Grid container spacing={3}>
                                 {data.firstName} {data.lastName}
                                <Grid item xs={12} sm={12} >
                                <TextField id="taskType" type="string" label="Task" value={data.taskType}  variant="outlined"
                                style = {useStyles.textFld}
                                autoComplete="family-name" />
                                </Grid>
                                <Grid item xs={12} sm={12} >
                                <TextField id="taskSummary" type="string" label="Task Summary" value={data.taskSummary}  variant="outlined"
                                multiline
                                rows={6}
                                style = {useStyles.textFld}
                                autoComplete="family-name" />
                                </Grid>
                                <Grid item xs={12} sm={6} >
                                    
                                </Grid>
                                <Grid item xs={12} sm={6} >
                                    
                                </Grid>
                            </Grid>
                        )}
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleClose} color="primary">
                        Close
          </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default TaskDialog;
