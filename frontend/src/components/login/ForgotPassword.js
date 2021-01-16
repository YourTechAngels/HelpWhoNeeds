import React, { useRef, useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import { useAuth } from "../../contexts/AuthContext";
import { Link, useParams } from "react-router-dom";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";


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


export default function ForgotPassword() {

  const classes = useStyles();  
  const emailRef = useRef()
  const { resetPassword } = useAuth()
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const param = useParams();
  const user = param.user;

  async function handleSubmit(e) {
    e.preventDefault()

    try {
      setMessage("")
      setError("")
      setLoading(true)
      await resetPassword(emailRef.current.value)
      setMessage("Check your inbox for password reset instructions")
    } catch {
      setError("Failed to reset password")
    }

    setLoading(false)
  }

  return (
    <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
            <Avatar className={classes.avatar}>
                <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5"> Forgot Password </Typography>
            { error && <Alert severity="error">
            <AlertTitle>Error: {error}</AlertTitle>
            </Alert>}
            { message && <Alert severity="success">
            <AlertTitle>{message}</AlertTitle>
            </Alert>}
            <form onSubmit={handleSubmit} > 
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    type="email" 
                    inputRef={emailRef} 
                    id="email"
                    label="Email Address"
                    // autoFocus
                />
                <Button            
                                type="submit"
                                fullWidth
                                variant="contained"
                                disabled = {loading}
                                color="primary"
                            >Reset Password
                </Button>
              </form>
             <Grid container>
                        <Grid item xs>
                            <div  className="w-100 text-center mt-2">
                            Go to <Link to={`/login/${user}`} variant="body2">
                                Sign In</Link> 
                            </div>
                        </Grid>
              </Grid>
              <Grid container>          
                        <Grid item xs>
                            <div  className="w-100 text-center mt-3">
                            New User ?<Link to={`/signup/${user}`} variant="body2">
                                Sign Up </Link> 
                            </div>
                        </Grid>
                       
        </Grid>

    </div>  <Box mt={8}>
    <Copyright />
</Box>
</Container>
)
}