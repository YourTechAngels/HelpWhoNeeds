import React from "react"
import moment from "moment";
import MUIDataTable from "mui-datatables"
import Button from "@material-ui/core/Button"
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";


export default function TaskTable({ taskList, handleCopy, handleEdit, handleCancel,
                                      handleContact, handleSearchVol }) {


    const theme = () => createMuiTheme({
        overrides: {
            // MUIDataTableToolbar: {
            //     root: {
            //         // width: "min-content",
            //         // margin: "20px 0px 0px 0px",
            //         backgroundColor: '#AAF',
            //     },
            // },
            MuiPaper: {
                root: {
                    // width: "min-content",
                    margin: "20px 0px 0px 0px",
                    // backgroundColor: '#AAF',
                },
            },
            MuiTableCell: {
                root: {
                    //  maxWidth: "120px",
                    padding: "5px 5px 5px 15px"
                },
            },
            MUIDataTableToolbar: {
                root: {
                    background: '#AAF',
                }
            },
            MUIDataTableHeadCell: {
                root: {
                    //   height: 56,
                    //   fontSize: 12,
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    position: "relative"
                }
            },
            MUIDataTableBodyCell: {
                root: {
                    //   height: 20,
                    //   fontFamily: "Oxygen",
                    //   fontSize: 13,
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    position: "relative",
                    //   maxWidth: 0
                }
            },
            // MUIDataTablePagination: {
            //     root: {
            //         display: "flex",
            //         justifyContent: "center",
            //         alignItems: "center",
            //         textAlign: "center"
            //     },
            //     caption: {
            //         fontSize: 16
            //     }
            // }
        },
    });

    const options = {
        selectableRows: false,
        print: false,
        download: false,
        rowsPerPage: 20,
        rowsPerPageOptions: [5, 10, 20],
        setRowProps: row => {
            if (row[6] === "Assigned") {
                return {
                    style: { background: "palegreen" }
                }
            }
            if (row[6] === "Open") {
                return {
                    style: { background: "lemonchiffon" }
                }
            }
            if (row[6] === "Expired") {
                return {
                    style: { background: "lightpink" }
                }
            }
        },
        // resizableColumns: true,
        sortOrder: {
            name: "start",
            direction: "desc",
        },
    };

    const columns = [
        {
            name: "id",
            label: "ID",

            options: {
                display: false,
                sort: true,
                filter: false,
                width: "5%",
                /*viewColumns: false*/
            },
        },
        {
            name: "taskTypeName",
            label: "Task Type",

            options: {
                filter: true,
                sort: true,
                width: "10%",
            },
        },
        {
            name: "taskDetails",
            label: "Task Detail",

            options: {
                display: true,
                filter: false,
                sort: false,
                width: "15%",

                customBodyRender: (value) => {
                    const maxSymb = 30
                    return value.slice(0, maxSymb) + (value.length > maxSymb ? "..." : "")
                },
            },
        },
        {
            name: "start",
            label: "Time Period",
            options: {
                filter: false,
                sort: true,
                width: "10%",

                customBodyRender: (value, tableMeta) => {
                    return <div>
                        {moment(value).format('lll')}<br/>
                        {moment(tableMeta.rowData[4]).format('lll')}</div>},
            },
        },
        {
            name: "end",
            label: "End Time",
            options: {
                display: false,
                filter: false,
                sort: false,
                viewColumns: false,
                // width: "10%",

                //     customBodyRender: (value) =>
                //         moment(value).format('lll'),
            },
        },
        {
            name: "volunteerId",
            label: "Volunteer",
            options: {
                filter: false,
                sort: true,
                width: "10%",
                customBodyRender: (value, tableMeta) => {
                    return <div>
                        {tableMeta.rowData[6] === "Open" && !tableMeta.rowData[8] ?
                            /* Open status*/
                            (tableMeta.rowData[9] ?
                                <b>Requested</b> :
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="small"
                                    className="button"
                                    onClick={(e) => {
                                        handleSearchVol(e, tableMeta.rowData[0])
                                    }} >
                                    Search
                                </Button> ) : null
                        }
                        {tableMeta.rowData[6] === "Open" && tableMeta.rowData[8] ?
                            /* Open Expired*/
                            tableMeta.rowData[9]
                            : null
                        }
                        {value ?
                            /* All other states*/
                            <Button
                                variant="contained"
                                color="default"
                                size="small"
                                className="button"
                                onClick={(e) => handleContact(e, tableMeta.rowData[0])}
                            >
                                Contact
                            </Button> : null}
                    </div>
                },
            },
        },
        {
            name: "statusName",
            label: "State",
            options: {
                filter: true,
                sort: true,
                width: "10%",
                customBodyRender: (value, tableMeta) =>
                    tableMeta.rowData[8] &&
                    (["Open", "Assigned"].includes(value)) ? "Expired" : value ,
            },
        },
        {
            name: "id",
            label: "Actions",

            options: {
                sort: false,
                filter: false,
                width: "30%",
                customBodyRender: (value, tableMeta) => {
                    return (
                        <div>
                            <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                className="button"
                                onClick={() => {
                                    console.log(tableMeta.rowData[0])
                                    handleCopy(tableMeta.rowData[0])
                                }}
                            >
                                Copy
                            </Button>
                            {["Open", "Expired"].includes(tableMeta.rowData[6]) ?
                                <Button
                                    variant="contained"
                                    color="default"
                                    size="small"
                                    className="button"
                                    style={{
                                        marginLeft: 10
                                    }}
                                    onClick={() => {
                                        console.log(tableMeta.rowData[0])
                                        handleEdit(tableMeta.rowData[0])
                                    }}
                                >
                                    Edit
                                </Button>
                                : null}
                            {["Open"].includes(tableMeta.rowData[6]) && !tableMeta.rowData[8] ?
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    size="small"
                                    className="button"
                                    style={{
                                        marginLeft: 10
                                    }}
                                    onClick={() => {
                                        console.log(tableMeta.rowData[0])
                                        handleCancel(tableMeta.rowData[0])
                                    }}
                                >
                                    Cancel
                                </Button>
                                : null}
                        </div>
                    );
                },
            },
        },
        {
            name: "expired",
            label: "Expired",
            options: {
                display: false,
                filter: false,
                viewColumns: false,
                // width: "5%",
            },
        },
        {
            name: "requestedVol",
            label: "Requested Vol",
            options: {
                display: false,
                filter: false,
                viewColumns: false,
                // width: "5%",
            },
        },
    ];

    return (
        <React.Fragment>
            <MuiThemeProvider theme={theme()}>
                <MUIDataTable
                    title="All Tasks"
                    data={taskList}
                    columns={columns}
                    options={options}
                />
            </MuiThemeProvider>
        </React.Fragment>
    );
}