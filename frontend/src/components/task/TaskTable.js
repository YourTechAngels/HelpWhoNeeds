import React from "react"
import moment from "moment";
import MUIDataTable from "mui-datatables"
import Button from "@material-ui/core/Button"
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";


export default function TaskTable({ taskList, handleCopy, handleEdit, handleRemove }) {

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
        selectableRows: "none",
        print: false,
        download: false,
        rowsPerPage: 20,
        rowsPerPageOptions: [5, 10, 20],
        // resizableColumns: true,
        sortOrder: {
            name: "start",
            direction: "desc",
        },
        // TODO customize when backend connected
        // serverSide: true,
        // onTableChange: (action, tableState) => {
        //     this.xhrRequest('my.api.com/tableData', result => {
        //       this.setState({ data: result });
        //     });
        //   }
    };

    const columns = [
        {
            name: "id",
            label: "ID",
            width: "5%",
            options: { display: false, sort: true, filter: false },
        },
        {
            name: "taskType",
            label: "Task Type",

            options: {
                filter: true,
                sort: true,
                width: "10%",
            },
        },
        {
            name: "taskDetails",    
            label: " Task Detail",

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
            label: "Start Time",
            options: {
                filter: true,
                sort: true,
                width: "10%",

                customBodyRender: (value) =>
                    moment(value).format('lll'),
            },
        },
        {
            name: "end",
            label: "End Time",
            options: {
                filter: true,
                sort: true,
                width: "10%",

                customBodyRender: (value) =>
                    moment(value).format('lll'),
            },
        },
        {
            name: "status",
            label: "State",
            options: {
                filter: true,
                sort: true,
                width: "10%",
            },
        },
        {
            name: "id",
            label: "Actions",

            options: {
                sort: false,
                filter: false,
                width: "40%",
                // customBodyRender: (value, tableMeta, updateValue) => {
                //     return (
                //         <Button
                //             variant="contained"
                //             color="primary"
                //             size="small"
                //             style={{ marginLeft: 16 }}
                //             value={value}
                //             onClick={(e) => handleClickOpen(e, value)}
                //         >
                //             View
                //         </Button>
                //     );
                // },
                customBodyRender: (value, tableMeta) => {
                    return (
                        <div>
                            <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                // disabled={tableMeta.rowData[1] === null ? false : true}
                                // style={{
                                //     marginLeft: 16,
                                //     backgroundColor:
                                //         tableMeta.rowData[1] === null ? "green" : "lightgrey",
                                // }}
                                className="button"
                                // value={value}
                                onClick={() => {
                                    console.log(tableMeta.rowData[0])
                                    handleCopy(tableMeta.rowData[0])
                                }}
                            >
                                Copy
                        </Button>
                            {["Open", "Expired"].includes(tableMeta.rowData[5]) ?
                                <Button
                                    variant="contained"
                                    color="default"
                                    size="small"
                                    className="button"
                                    style={{
                                        marginLeft: 10 }}
                                    onClick={() => {
                                        console.log(tableMeta.rowData[0])
                                        handleEdit(tableMeta.rowData[0])
                                    }}
                                >
                                    Edit
                    </Button>
                                : null}
                                {["Open"].includes(tableMeta.rowData[5]) ?
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    size="small"
                                    className="button"
                                    style={{
                                        marginLeft: 10 }}
                                    onClick={() => {
                                        console.log(tableMeta.rowData[0])
                                        handleRemove(tableMeta.rowData[0])
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