import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart'
import PetsIcon from '@material-ui/icons/Pets'
import PhoneIcon from '@material-ui/icons/Phone'
import LocalPharmacyIcon from '@material-ui/icons/LocalPharmacy'
import LocalHospitalIcon from '@material-ui/icons/LocalHospital'
import LiveHelpIcon from '@material-ui/icons/LiveHelp'


const useStyles =
    makeStyles(
        {
            h1: {
                color: "#4C4B51"
            },
            largeButton: {
                border: 5,
                color: "#FF8E53",
                padding: "15px",
                margin: "15px",
                height: 100,
                width: 110,
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

export default function NewTaskButtons({handleClickOpen}) {

    const classes = useStyles();

    return <div className="centered">

        <h1>I need help with...</h1>

        <Button classes={{ root: classes.largeButton, label: classes.label }}
            onClick={(e) => handleClickOpen(e, "Shopping")}>
            <ShoppingCartIcon className={classes.largeIcon} />
            Shopping
        </Button>
        <Button classes={{ root: classes.largeButton, label: classes.label }}
            onClick={(e) => handleClickOpen(e, "Pharmacy")}>
            <LocalPharmacyIcon className={classes.largeIcon} />
            Pharmacy
        </Button>
        <Button classes={{ root: classes.largeButton, label: classes.label }}
            onClick={(e) => handleClickOpen(e, "Dog Walking")}>
            <PetsIcon className={classes.largeIcon} />
            Dog Walk
        </Button>
        <Button classes={{ root: classes.largeButton, label: classes.label }}
            onClick={(e) => handleClickOpen(e, "Hospital")}>
            <LocalHospitalIcon className={classes.largeIcon} />
            Hospital
        </Button>
        <Button classes={{ root: classes.largeButton, label: classes.label }}
            onClick={(e) => handleClickOpen(e, "Chat")}>
            <PhoneIcon className={classes.largeIcon} />
            Chat
        </Button>
        <Button classes={{ root: classes.largeButton, label: classes.label }}
            onClick={(e) => handleClickOpen(e, "Other")}>
            <LiveHelpIcon className={classes.largeIcon} />
            Other
        </Button>

    </div>
}