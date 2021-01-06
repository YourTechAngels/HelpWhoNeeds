import MUIDataTable from "mui-datatables";

const options = {
    filterType: "multiselect",
    selectableRows: "none", //can also be single/mulitple
    selectableRowsOnClick: true,
    count: 5,
};

export default function TaskListTable({ taskListData, columnFields }) {
    return (
        <MUIDataTable
            title={"My Task List"}
            data={taskListData}
            columns={columnFields}
            options={options}
        />
    );
}
