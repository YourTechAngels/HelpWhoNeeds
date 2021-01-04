import Button from "@material-ui/core/Button";
import {

    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle
} from "@material-ui/core";

const TaskDialog = ({ open, handleClose, title, data }) => {
    //console.log(data);
    return (
            <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{title}</DialogTitle>              
                <DialogContent>                  
                    {data}
             </DialogContent>                         
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default TaskDialog;