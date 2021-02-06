import React from 'react';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent';
import Dialog from '@material-ui/core/Dialog';


function VolDetails({open, handleClose, volunteer}) {
  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Volunteer Contact Details</DialogTitle>
        <DialogContent>
            Name: <b>{volunteer.first_name + " " + volunteer.last_name}</b> <br /><br />
            Email: <b>{volunteer.email}</b> <br /><br />
            Phone: <b>{volunteer.phone_number}</b> <br /><br />
        </DialogContent>
        <Button onClick={handleClose}>Close</Button>
    </Dialog>
  );
}

export default VolDetails
