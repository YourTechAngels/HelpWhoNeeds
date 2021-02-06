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

// const useStyles = (theme) => ({
//     button: {
//         border: "4px",
//         color: "default",
//         fontWeight: "bold",
//         marginLeft: 10,
//         marginTop: "10px",
//     },
//     form: {
//         display: "flex",
//         flexDirection: "column",
//         margin: "auto",
//         width: "fit-content",
//     },
// });

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
        direction: "asc",
    },
};

const localVolData = [
    {
        taskId: 1,
        volId: 2,
        fullName: "Snow",
        firstName: "Jon",      
        distance: 1,        
    },
    {
        taskId: 1,
        volId: 3,
        fullName: "Kate",
        firstName: "Kelly",      
        distance: 0.8,  
    },
    {
        taskId: 1,
        volId: 4,
        fullName: "Caroline",
        firstName: "Gardener",      
        distance: 0.9,  
    },
];
const SearchVolunteerDialog = ({ open, handleClose, data, requestVolunteer }) => {
    const[selectedVol, setSelectedVol] = useState(-1) ;
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
console.log("Volunteers to show: ", data)
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
    //volId fullName distance taskId
    const cols = [
        {
            volId: "volId",
            label: "volunteer ID",
            options: {
                display: false,
                sort: false,
                filter: false,
                viewColumns: false,
            },
        },
        {
            taskId: "taskId",
            label: "task ID",
            options: {
                display: true,
                sort: false,
                filter: false,
                viewColumns: false,
            },
        },
        // {
        //     name: "fullName",
        //     label: "Full name",
        //
        //     options: {
        //         display: true,
        //         filter: true,
        //         sort: true,
        //     },
        // },
        // {
        //     name: "distance",
        //     label: "Dist (mi)",
        //     options: {
        //         filter: true,
        //         sort: true,
        //         // customBodyRender: (value, tableMeta, updateValue) => {
        //         //     //console.log(tableMeta.rowData, '......');
        //         //     return (
        //         //         <div>
        //         //             {distance / 1600}
        //         //         </div>
        //         //     );
        //         // },
        //     },
        // },
        // {
        //     name: "volId",
        //     label: "Request",
        //
        //     options: {
        //         filter: false,
        //         sort: false,
        //         // viewColumns: false,
        //         // customBodyRender: (value, tableMeta, updateValue) => {
        //         //     return (
        //         //         <Button
        //         //             variant="contained"
        //         //             color="primary"
        //         //             size="small"
        //         //             style={{
        //         //                 marginLeft: 2,
        //         //                 minWidth: "70px",
        //         //             }}
        //         //             value={value}
        //         //             onClick={(e) => {
        //         //
        //         //                 console.log("selectedtask" + data.taskId)
        //         //                 console.log("selected volunteer" + value)
        //         //                 // setSelectedVol(value)
        //         //                // requestVolunteer(value);
        //         //             }}
        //         //         >
        //         //             Request
        //         //         </Button>
        //         //     );
        //         // },
        //     },
        // },
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
                <DialogTitle>"Search Volunteer"</DialogTitle>
                <DialogContent>
                    {data && (
                        <div>
                            For your selected task you can send request to your local volunteer available below:
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

export default SearchVolunteerDialog;
