import { Link } from "react-router-dom"
import { makeStyles, Button } from "@material-ui/core"

const useStyles = makeStyles({
    button:{
        margin:"10px",
    },
    pInfo:{
        textAlign: "center",
    },
    divContentWrapper:{
        textAlign: "center",
        minHeight: "100%",
        paddingLeft: "50px",
    }

});
const Landing = () => {
    
    const classes = useStyles();
   
    return (
            <div className={classes.divContentWrapper} >
                <h1>Help Who Needs</h1>
                <p>
                    Our TechForGood project aims to match a volunteer with a vulnerable
                    person who is shielding in these unprecedented times. Hence our
                    application is called HelpWhoNeeds. The app will aim to match a
                    volunteer with a vulnerable person in their immediate local area
                    helping with chores such as shopping, GP visits, prescriptions, dog
                    walking or just some social contact with the appropriate measures in
                    place. We hope this app brings some comfort and relief to the users
                    with a sense of moral and social obligation. 
        </p>

        <p className={classes.pInfo}> If you would like help or need any assistant using our system, please call <strong>0800 123 4567</strong>.</p>
                <Button
                    className= {classes.button}
                    variant="outlined"
                    color="default"
                    component={Link}
                    to={"/login/AssistanceRequester"}                   
                >
                    I need Help
                </Button>
                
                <Button
                    className= {classes.button} 
                    variant="outlined"
                    color="default"
                    component={Link}
                    to={"/login/Volunteer"}                  
                >
                    I can Help
        </Button>
        </div>
        
    );
};

export default Landing;
