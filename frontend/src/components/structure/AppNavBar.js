import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    IconButton,
    Switch,
    FormControlLabel,
    FormGroup,
    MenuItem,
    Menu,
    SvgIcon,
} from "@material-ui/core";
import AccountCircle from "@material-ui/icons/AccountCircle";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        "& > svg": {
            margin: theme.spacing(2),
        },
    },
    title: {
        flexGrow: 1,
    },
    appBar: {
        backgroundColor: "#9370db",
    },
}));

function HomeIcon(props) {
    return (
        <SvgIcon {...props}>
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </SvgIcon>
    );
} /*For HomeIcons */

const AppNavBar = () => {
    const classes = useStyles();
    const { currentUser, signout } = useAuth();
    const [auth, setAuth] = React.useState(false); // React.useState(currentUser === null ? false : true); //change to true
    const [anchorEl, setAnchorEl] = React.useState(null);

    useEffect(() => {
        setAuth(currentUser === null ? false : true);
    }, [currentUser]);
    console.log("user" + currentUser);
    console.log("auth" + auth);
    const open = Boolean(anchorEl);
    const history = useHistory();

    const handleChange = (event) => {
        setAuth(event.target.checked);
    };

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    async function handleSignOut() {
        try {
            await signout();
            setAuth(false);
            history.push("/");
        } catch (error) {
            setAuth(currentUser === null ? false : true);
            console.log(error);
            alert("failed to log out");
        }

        console.log("auth" + auth);
        handleClose();
    }

    return (
        <div className={classes.root}>
            <FormGroup>
                <FormControlLabel
                    control={
                        <Switch
                            checked={auth}
                            onChange={handleChange}
                            aria-label="login switch"
                        />
                    }
                    label={auth ? "Logout" : "Login"}
                />
            </FormGroup>
            <AppBar position="static" className={classes.appBar}>
                <Toolbar>
                    <HomeIcon
                        color="action"
                        fontSize="large"
                        onClick={(event) => (window.location.href = "/")}
                    />
                    <Typography variant="h6" className={classes.title}>
                        Help Who Needs
          </Typography>

                    <Button color="inherit" component={Link} to={"/about"}>
                        About
          </Button>
                    <Button color="inherit" component={Link} to={"/contact"}>
                        Contact
          </Button>
                    {auth && (
                        <div>
                            <IconButton
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleMenu}
                                color="inherit"
                            >
                                <AccountCircle />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: "top",
                                    horizontal: "right",
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: "top",
                                    horizontal: "right",
                                }}
                                open={open}
                                onClose={handleClose}
                            >
                                <MenuItem onClick={handleClose}>Profile</MenuItem>
                                <MenuItem onClick={handleClose}>My account</MenuItem>
                                <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
                            </Menu>
                        </div>
                    )}
                </Toolbar>
            </AppBar>
        </div>
    );
};

export default AppNavBar;
