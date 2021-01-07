/* eslint-disable no-extend-native */


export default function intialTasks() {

    Date.prototype.addHours= function(h){
        this.setHours(this.getHours()+h);
        return this;
    }
     
 const tList = [
    {
        id: 1,
        taskType: "Shopping",
        taskDetails: "I need help with Shopping from Tesco",
        start: new Date().addHours(2),
        end: new Date().addHours(4),
        status: "Cancelled",
    },
    {
        id: 2,
        taskType: "Dog Walking",
        taskDetails: "I need help with dog walkingevery morning and afternoon",
        start: new Date().addHours(5),
        end: new Date().addHours(10),
        status: "Open",
    },
    {
        id: 3,
        taskType: "Shopping",
        taskDetails: "I need help with Shopping from Asda",
        start: new Date().addHours(20),
        end: new Date().addHours(24),
        status: "Assigned",
    },
    {
        id: 4,
        taskType: "Pharmacy",
        taskDetails: "I need help with picking up my prescription from local gp",
        start: new Date().addHours(-20),
        end: new Date().addHours(-16),
        status: "Expired",
    },
    {
        id: 5,
        taskType: "Hospital",
        taskDetails: "I need help to drop off and pick up from my hospital",
        start: new Date().addHours(-100),
        end: new Date().addHours(-80),
        status: "Completed",
    },
    {
        id: 6,
        taskType: "Phone Call",
        taskDetails: "I need someone to give me a call to have a chat",
        start: new Date().addHours(20),
        end: new Date().addHours(40),
        status: "Open",
    },
    // {
    //     id: 7,
    //     taskType: "Shopping",
    //     taskDetails: "I need help with Shopping from Tesco",
    //     start: new Date().addHours(70),
    //     end: new Date().addHours(74),
    //     status: "Assigned",
    // },
    {
        id: 8,
        taskType: "Other",
        taskDetails: "I need help with mowing my garden",
        start: new Date().addHours(-5),
        end: new Date().addHours(4),
        status: "Open",
    },
    {
        id: 9,
        taskType: "Shopping",
        taskDetails: "I need help with Shopping from Sainsbuyrys",
        start: new Date(2020, 11, 10, 10),
        end: new Date(2020, 11, 10, 16),
        status: "Expired",
    },
    // {
    //     id: 10,
    //     taskType: "Medical",
    //     taskDetails: "I need help with picking up my prescription",
    //     start: new Date().addHours(2),
    //     end: new Date().addHours(4),
    //     status: "done",
    // },
]
return tList
}