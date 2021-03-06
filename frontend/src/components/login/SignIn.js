import React, { useState, useRef } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { Link, useParams, useHistory } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { useAuth } from "../../contexts/AuthContext";

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {"Copyright © "}
            <Link color="inherit" to="https://material-ui.com/">
                Your Website
    </Link>{" "}
            {new Date().getFullYear()}
            {"."}
        </Typography>
    );
}

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: "100%", 
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export default function SignIn() {
    const classes = useStyles();
    const param = useParams();
    const user = param.userType;
    const emailRef = useRef()
    const passwordRef = useRef()
    const { login, currentUser } = useAuth()
    const [error, setError] = useState("")
    const [email,setEmail] = useState("")
    const [uID, setUID] = useState("")
    const [loading, setLoading] = useState(false)
    const history = useHistory()
    const nameLabel = (`${user}`==='AssistanceRequester'? 'Requestee': `${user}`)
    
  
    async function handleSubmit(e) {
      e.preventDefault()
  
      try {
        setError("")
        setLoading(true)
        await login(emailRef.current.value, passwordRef.current.value)

        if (`${user}` === 'volunteer')
        { history.push("/mytask");
          console.log(process.env.PUBLIC_URL) }
        else {
            history.push("/requestee/tasks") }
        }
     catch {
        setError("Failed to log in")
      }
  
      setLoading(false)
      if(currentUser) {
        setEmail(currentUser.email);
        setUID(currentUser.ui)
        console.log(email);
        console.log(uID); }

    }

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                   {nameLabel} Sign in
                </Typography>
            { error && <Alert severity="error">
            <AlertTitle>Error: {error}</AlertTitle>
            </Alert>}
                <form onSubmit={handleSubmit}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        type="email" 
                        inputRef={emailRef} 
                        id="email"
                        label="Email Address"
                        autoFocus
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        type="password" 
                        inputRef={passwordRef}
                        label="Password"
                        id="password"
                    />
                    <FormControlLabel
                        control={<Checkbox value="remember" color="primary" />}
                        label="Remember me"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        disabled = {loading}
                    >
                        Sign In
                    </Button>
                    <Grid container>
                        <Grid item xs>
                            <Link to={`/forgotPassword/${user}`} variant="body2">
                                Forgot password?
                            </Link>
                        </Grid>
                    <Grid container>
                        <Grid item xs>
                            <div  className="w-100 text-center mt-2">
                            New User ?<Link to={`/signup/${user}`} variant="body2">
                                Sign Up </Link> 
                            </div>
                        </Grid>
                     </Grid></Grid>
                </form>
            </div>
            <Box mt={8}>
                <Copyright />
            </Box>
        </Container>
    );
}
