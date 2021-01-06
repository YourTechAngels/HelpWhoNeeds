import React from "react"
import MUIDataTable from "mui-datatables"
import Button from "@material-ui/core/Button"


const options = {
    filterType: "multiselect",
    selectableRows: "none", //can also be single/mulitple
    selectableRowsOnClick: true,
    count: 5,
};

export default function TaskTable({taskList}) {
    const columns = [
        {
            name: "id",
            label: "ID",
            options: { display: false, sort: false, filter: false },
        },
        {
            name: "taskType",
            label: "Task Type",

            options: {
                filter: true,
                sort: true,
            },
        },
        {
            name: "taskDetails",
            label: " Task Detail",

            options: {
                filter: false,
                sort: false,
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
            },
        },
        {
            name: "start",
            label: "Start Time",
            options: {
                filter: true,
                sort: true,

                // customBodyRender: (value) =>
                //     moment(new Date(value)).format(SPACED_DATE_FORMAT),
            },
        },
        {
            name: "end",
            label: "End Time",
            options: {
                filter: true,
                sort: true,

                // customBodyRender: (value) =>
                //     moment(new Date(value)).format(SPACED_DATE_FORMAT),
            },
        },
        {
            name: "status",
            label: "State",
            options: {
                filter: true,
                sort: true,

                // customBodyRender: (value) =>
                //     moment(new Date(value)).format(SPACED_DATE_FORMAT),
            },
        },
        {
            name: "actions",
            label: "Actions",

            options: {
                sort: false,
                filter: false,
                // customBodyRender: (value, tableMeta) => {
                //     return (
                //         <Button
                //             variant="contained"
                //             color="primary"
                //             size="small"
                //             disabled={tableMeta.rowData[1] === null ? false : true}
                //             style={{
                //                 marginLeft: 16,
                //                 backgroundColor:
                //                     tableMeta.rowData[1] === null ? "green" : "lightgrey",
                //             }}
                //             className="button"
                //             value={value}
                //             onClick={() => {
                //                 console.log(tableMeta.rowData[1]);
                        //     }}
                        // >
                        //     Accept
                        // </Button>
                //     );
                // },
            },
        },
    ];

    return (
        <React.Fragment>
            {/* <div style={{ height: "100%" }}> */}
                {/* <MuiThemeProvider theme={theme}> */}
                    <MUIDataTable
                        title="All Tasks"
                        data={taskList}
                        columns={columns}
                        options={options}
                    />
                {/* </MuiThemeProvider> */}
            {/* </div> */}
        </React.Fragment>
    );
}