import React, { useState, useRef } from 'react';
import TextField from '@material-ui/core/TextField';
import { useParams, Link, useHistory } from "react-router-dom";
import Grid from '@material-ui/core/Grid';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from "@material-ui/core/Button";
// import AddressForm from './AddressForm';
import { ButtonGroup } from '@material-ui/core';
import { useAuth } from "../../contexts/AuthContext"


const useStyles = {
    textFld: { width: '85%', height: 40, paddingLeft: 8 },
    button: {
        border: '4px',
        fontWeight: 'bold',
        alignItems: 'center',
        marginRight: '20px',
        // marginLeft: '10px'    
    },

};

export default function Profile(props) {

    const initialInputState = {
        firstName: "", lastName: "", DateOfBirth: "",
        postcode: "", address1: "", address2: "", city: "", county: "", email:""
    }
    const [formData, setFormData] = useState({ initialInputState })
    const { firstName, lastName, DateOfBirth, postcode, address1, address2, city, county, email } = formData
    const [message, setMessage] = useState("")


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()
    const { currentUser, updatePassword, updateEmail } = useAuth()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const history = useHistory()
    const param = useParams();
    const user = param.user;


    async function handleSubmit(e) {
        e.preventDefault()
        console.log(emailRef.current.value)
        if(emailRef.current.value === "" || emailRef.current.value === null) {
            setMessage("Data has been saved successfully")
                console.log(formData)
        }
        else {
        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            return setError("Passwords does not match")
        }
        const promises = []
        setLoading(true)
        setError("")
          if  (emailRef.current.value !== currentUser.email) { 
            promises.push(updateEmail(emailRef.current.value))
          }
          if (passwordRef.current.value) {
            promises.push(updatePassword(passwordRef.current.value))
          }
      
          Promise.all(promises)
            .then(() => {
               history.push("/")
            })
            .catch(() => {
              setError("Failed to update account")
            })
            .finally(() => {
              setLoading(false)
            }) 
        }
    }
    return (

        <React.Fragment>

            <h2 align="center"> My Profile</h2>
            { !error && message && <Alert severity="success">
                <AlertTitle>{message}</AlertTitle>
            </Alert>}
            { error && <Alert severity="error">
                <AlertTitle>{error}</AlertTitle>
            </Alert>}
            <Grid container flex-start="left" >
                <p style={{ paddingLeft: 8 }}>Please enter your details here</p> </Grid>

            <form onSubmit={handleSubmit} >
                <Grid container spacing={3} >
                    <Grid item xs={12} sm={6}>
                        <TextField                        
                            id="firstName"
                            type="text"
                            name="firstName"
                            label="First name"
                            variant="outlined"
                            onChange={handleChange}
                            value={firstName || ''}
                            style={useStyles.textFld}
                            autoComplete="given-name"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} >
                        <TextField                            
                            id="lastName"
                            name="lastName"
                            type="text"
                            label="Last name"
                            onChange={handleChange}
                            value={lastName || ''}
                            variant="outlined"
                            style={useStyles.textFld}
                            autoComplete="family-name"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            id="DateOfBirth"
                            name="DateOfBirth"
                            type="date"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            label="Date Of Birth"
                            onChange={handleChange}
                            value={DateOfBirth || ''}
                            variant="outlined"
                            style={useStyles.textFld}
                        />
                    </Grid>

                    <Grid item xs={12} sm={12}>
                        <ButtonGroup>
                            <TextField
                                id="postcode"
                                name="postcode"
                                label="Post code"
                                variant="outlined"
                                onChange={handleChange}
                                value={postcode || ''}
                                style={useStyles.textFld}
                                autoComplete=" postal-code" />

                            <Grid item xs={12} sm={6}>
                                <Button variant="outlined" className="btn btn-secondary w-100" onClick={() => { console.log('Find Address button clicked') }}>Find Address</Button>
                            </Grid></ButtonGroup>  </Grid>

                    <Grid item xs={12}>
                        <TextField
                            id="address1"
                            name="address1"
                            onChange={handleChange}
                            value={address1 || ''}
                            label="Address line 1"
                            variant="outlined"
                            style={useStyles.textFld}
                            autoComplete="address-line1"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            id="address2"
                            name="address2"
                            label="Address line 2"
                            variant="outlined"
                            onChange={handleChange}
                            value={address2 || ''}
                            style={useStyles.textFld}
                            autoComplete="address-line2"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            id="city"
                            name="city"
                            label="City"
                            onChange={handleChange}
                            value={city || ''}
                            variant="outlined"
                            style={useStyles.textFld}
                            autoComplete="address-level2"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            id="county"
                            name="county"
                            variant="outlined"
                            onChange={handleChange}
                            value={county || ''}
                            style={useStyles.textFld}
                            label="County" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                    <TextField
                            id="email"
                            name="email"
                            type = "email"
                            label="Email Address"
                            inputRef={emailRef || ''}
                            onChange={handleChange}
                            value={email || ''}
                            variant="outlined"
                            style={useStyles.textFld}
                     />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                    <TextField
                            id="password"
                            name="password"
                            type = "password"
                            label="Password"
                            inputRef={passwordRef}
                            // onChange={handleChange}
                            variant="outlined"
                            style={useStyles.textFld}
                     />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                    <TextField
                            id="passwordConfirm"
                            name="city"
                            type = "password"
                            label="Confirm Password"
                            inputRef={passwordConfirmRef}
                            // onChange={handleChange}
                            variant="outlined"
                            style={useStyles.textFld}
                     />
                    </Grid>
                  
                    <Grid item xs={12}>

                        {(`${user}` === 'Volunteer') &&
                            <FormControlLabel
                                control={<Checkbox color="secondary" style={{ marginLeft: '5px' }} name="dbsCheck" value="yes" />}
                                label="I have a valid DBS certificate"
                            />}

                    </Grid>
                </Grid>
                <Grid container justify="center" spacing={3} direction="row">
                    <ButtonGroup className="w-100 text-center mt-2">
                        <Grid item xs={12} >
                            <Button disabled = {loading} variant="contained" style={useStyles.button} className="btn btn-primary w-100" type="submit">Update</Button>
                        </Grid>
                        <Grid item xs={12} >
                            <Button variant="contained" style={useStyles.button} className="btn btn-primary w-100" component={Link} to="/" >Cancel</Button>
                        </Grid>
                    </ButtonGroup>
                </Grid>
            </form>
        </React.Fragment>

    )
}