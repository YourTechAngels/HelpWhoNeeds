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
import { TextField } from "@material-ui/core";
import MUIDataTable from "mui-datatables";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import React, { useState, useEffect } from 'react'

const useStyles = (theme) => ({
    button: {
        border: "4px",
        color: "default",
        fontWeight: "bold",
        marginLeft: 10,
        marginTop: "10px",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        margin: "auto",
        width: "fit-content",
    },
});

const options = {
    selectableRows: "none", //can also be single/mulitple
    rowsPerPage: 5,
    rowsPerPageOptions: [5, 10, 15, 20],
    print: false,
    download: false,
    filter: false,
    viewColumns: false,
    sortOrder: {
        name: "distance",
        direction: "desc",
    },
};

const localVolData = [
    {
        reqId: 1,
        reqVolId: 2, 
        lastName: "Snow", 
        firstName: "Jon",      
        distance: 1,        
    },
    {
        reqId: 1,
        reqVolId: 3, 
        lastName: "Kate", 
        firstName: "Kelly",      
        distance: 0.8,  
    },
    {
        reqId: 1,
        reqVolId: 4, 
        lastName: "Caroline", 
        firstName: "Gardener",      
        distance: 0.9,  
    },
];
const SearchVolunteer = ({ open, handleClose, title, data, requestVolunteer }) => {
    const selectedtask = data;
    const[selectedVol, setSelectedVol] = useState(null) ;
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

    const muiTheme = () =>
        createMuiTheme({
            overrides: {
                MuiDataTable: {
                    root: {
                        width: "min-content",
                    },
                    responsiveScroll: {
                        maxHeight: "none", //not working
                    },
                },
                MUIDataTableToolbar: {
                    root: {
                        background: "#AAF",
                    },
                },
                MUIDataTableBodyCell: {
                    root: {
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        position: "relative",
                        backgroundColor: "#FFF",
                    },
                },
            },
        });

    const cols = [
        {
            name: "reqId",
            label: "requestee ID",
            options: {
                display: false,
                sort: false,
                filter: false,
                viewColumns: false,
            },
        },
        {
            name: "reqVolId",
            label: "volunteer ID",
            options: {
                display: false,
                sort: false,
                filter: false,
                viewColumns: false,
            },
        },
        {
            name: "firstName",
            label: "First name",

            options: {
                display: false,
                filter: true,
                sort: true,
            },
        },
        {
            name: "lastName",
            label: "Last name",

            options: {
                display: false,
                filter: true,
                sort: true,
            },
        },
        {
            name: "firstName",
            label: "Full Name",
            options: {
                filter: false,
                sort: false,
                customBodyRender: (value, tableMeta, updateValue) => {
                    //console.log(tableMeta.rowData, '......');
                    return (
                        <div>
                            {tableMeta.rowData[2]} {tableMeta.rowData[3]}
                        </div>
                    );
                },
            },
        },
        {
            name: "distance",
            label: "Dist",
            options: {
                filter: true,
                sort: true,
                // width: "5%",
            },
        },
        {
            name: "reqVolId",
            label: "Request",

            options: {
                filter: false,
                sort: false,
                viewColumns: false,                
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            style={{
                                marginLeft: 2,
                                minWidth: "70px",
                            }}
                            value={value}
                            onClick={(e) => {
                                
                                console.log("selectedtask" + data.id)
                                console.log("selected volunteer" + value)
                                setSelectedVol(value)
                               // requestVolunteer(value);
                            }}
                        >
                            Request
                        </Button>
                    );
                },
            },
        },
    ];
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
                    {data && (
                        <div>
                            <p>For your selected task you can send request to your local volunteer available below: </p>
                            <MuiThemeProvider theme={muiTheme()}>
                                <MUIDataTable
                                    title="Request volunteer"
                                    data={localVolData}

                                    columns={cols}
                                    options={options}
                                />
                            </MuiThemeProvider>
                        </div>
                    )}
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

export default SearchVolunteer;
