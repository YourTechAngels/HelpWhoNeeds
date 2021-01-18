import React, { useState, useRef, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import { useParams, Link, useHistory } from "react-router-dom";
import Grid from '@material-ui/core/Grid';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from "@material-ui/core/Button";
import axios from "axios"
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import { ButtonGroup } from '@material-ui/core';
import { useAuth } from "../../contexts/AuthContext"

const useStyles = {
    textFld: { width: '85%', height: 40, paddingLeft: 8 },
    button: {
        border: '4px',
        fontWeight: 'bold',
        alignItems: 'center',
        marginRight: '20px',
        marginTop: '10px'    
    },

};

export default function Profile(props) {          

    const initialInputState = {
        firstname: "", lastName: "", dateOfBirth: "", phoneNumber: "", postcode: "", address1: "", address2: "",city: "", county: "", email:""
      }
    const [formData, setFormData,] = useState({ initialInputState })
    const { firstname, lastName, dateOfBirth, phoneNumber, postcode, address1, address2, city, county, email } = formData
    const [message, setMessage] = useState("")
    const emailRef = useRef()
    const postcodeRef = useRef()
    // const firstnameRef = useRef()
    const passwordConfirmRef = useRef()
    const passwordRef = useRef()
    const address1Ref = useRef()
    const address2Ref = useRef()
    const cityRef = useRef()
    const countyRef = useRef()    
    const { currentUser, updatePassword, updateEmail } = useAuth()
    const uID = currentUser.uid
    const emailID = currentUser.email
    const [DBSchecked, setDBSChecked] = useState(false);
    const [addressLine1, setAddressLine1] = useState("")
    const [addressLine2, setAddressLine2] = useState("")
    const [countyName, setCountyName] = useState("");
    const [cityName, setCityName] = useState("");
    const [addressList, setAddressList] = useState("");
    const [postCodeSearched, setpostCodeSearched] = useState(false);
    const [errors, setErrors] = useState("")
    const [errorpostcode, setErrorpostcode] = useState("")
    const [loading, setLoading] = useState(false)
    const history = useHistory()
    const param = useParams();
    const user = param.user;
    
    useEffect(() => {
        getProfile() ;
    }, []);
    
    const getProfile =(e) => {
        // e.preventDefault()
        axios
            .get("http://localhost:8000/api/accounts/", {
                params : { uid : `${uID}` }
            })
            .then(
                (response) => {
                    const dataSet =response.data[0];
                    console.log(dataSet);
                    console.log(dataSet.last_name);
                    setFormData({ ...formData, firstname : (dataSet.first_name)});
                    setFormData({ ...formData, lastname : (dataSet.last_name)});
                    setFormData({ ...formData, dateOfBirth : (dataSet.date_of_birth)});
                    setFormData({ ...formData, address1 : (dataSet.address_line_1)});
                    setFormData({ ...formData, address2 : (dataSet.address_line_2)});
                    setFormData({ ...formData, city : (dataSet.city)});
                    setFormData({ ...formData, county : (dataSet.county)});
                    setFormData({ ...formData, address1 : (dataSet.address_line_1)});
                    // console.log(formData.lastName)
                    console.log("database json out ");
                    
                    // const allTask= data.map(task => {
                        return ({

                            
                            // setFormData(lastName: data.last_name,
                            // firstname : data.first_name
                            // firstname: data.first_name,
                            // taskType: `${task.task_type}`,
                            // taskDetails: `${task.description}`,
                            // start: `${task.start_time}`,
                            // end: (`${task.end_time}`),
                            // distance: `${task.id}`,
                            // // volId:  (`${task.volunteer}` ?  `${task.volunteer.id}`: null) , //not working properlhy
                            // volId: (`${task.volunteer?.id}`), //need to find a way to assign null
                            // status: `${task.status}                          

                        });
                }
            )
            .catch(function (error) {
                console.log("error")
                console.log(error.request);
                console.log(error.config);
                console.log(error.message);

            });
        }
        
       
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }
    const handleChecked = (e) => {
        setDBSChecked(e.target.checked)
        console.log(DBSchecked)
    }

    async function handleSubmit(e) {
        e.preventDefault();
        console.log(county + ' ' + uID + ' ' + DBSchecked);
        const addLine1 = (addressLine1 === '' ? (address1Ref.current.value) : addressLine1)
        const addLine2 = (addressLine2 === '' ? (address2Ref.current.value) : addressLine2)
        const addCity = (cityName === '' ? (cityRef.current.value) : cityName)
        const addCounty = (countyName === '' ? (countyRef.current.value) : countyName)
        console.log(addLine1 + '' + addLine2 + ' ' + addCity+' '+addCounty)
        console.log(emailRef.current.value)
        if(emailRef.current.value === "" || emailRef.current.value === null) {
            setMessage("Data has been updated successfully")
                console.log(formData)
        }
        else {
        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            return setErrors("Passwords does not match")
        }
        const promises = []
        setLoading(true)
        setErrors("")
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
              setErrors("Failed to update account")
            })
            .finally(() => {
              setLoading(false)
            }) 
        }
    }
    const handleClick = (e) => {
        e.preventDefault();
        const API_Key = process.env.REACT_APP_POSTCODE_API_KEY
        axios.get(`https://api.getAddress.io/find/${postcodeRef.current.value}?api-key=${API_Key}`)
          .then(function (response) {
            const responseData = response.data
            setAddressList(responseData.addresses)
            addressList === ' ' ? setErrorpostcode('No addresses found at the given post code') :
              setpostCodeSearched(true)
            console.log(addressList)
          })
          .catch(error => {
            setErrorpostcode('No addresses found at the given post code')
            console.log(errorpostcode);
          })
      }
      const updateAddress = (e) => {
        const valueList = [...e.target.selectedOptions].map(opt => opt.value);
        if ({ valueList } !== '') {
          let addressStore = valueList.toString().split(',')
          console.log(addressStore)
          setAddressLine1(addressStore[0])
          setAddressLine2(addressStore[1])
          setCityName(addressStore[5])
          setCountyName(addressStore[6])
        }
      }
    

    return (

        <React.Fragment>
        <div style={{ width: "80vw" }}>
            <h2 align="center"> My Profile</h2>
            { !errors && message && <Alert severity="success">
                <AlertTitle>{message}</AlertTitle>
            </Alert>}
            { errors && <Alert severity="error">
                <AlertTitle>{errors}</AlertTitle>
            </Alert>}
            <Grid container flex-start="left" >
                <p style={{ paddingLeft: 8 }}>Please enter your details here</p> </Grid>

            <form onSubmit={handleSubmit} >
                <Grid container spacing={3} >
                    <Grid item xs={12} sm={6}>
                        <TextField                        
                            id="firstname"
                            type="text"
                            name="firstname"
                            label="First name"
                            variant="outlined"
                            // inputRef ={firstnameRef}
                            onChange={handleChange}
                            value={firstname||''}
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
                            value={lastName}
                            variant="outlined"
                            style={useStyles.textFld}
                            autoComplete="family-name"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            id="dateOfBirth"
                            name="dateOfBirth"
                            type="date"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            label="Date Of Birth"
                            onChange={handleChange}
                            value={dateOfBirth || ''}
                            variant="outlined"
                            style={useStyles.textFld}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                        id="phoneNumber"
                        name="phoneNumber"
                        type="number"
                        label="Phone Number"
                        onChange={handleChange}
                        value={phoneNumber || ''}
                        variant="outlined"
                        inputProps={{ maxLength: 12 }}
                        style={useStyles.textFld}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                    <ButtonGroup>
                    <TextField
                        required
                        id="postcode"
                        name="postcode"
                        label="Post code"
                        variant="outlined"
                        onChange={handleChange}
                        inputRef={postcodeRef}
                        value={postcode || ''}
                        style={useStyles.textFld}
                        autoComplete=" postal-code" />
                    <Grid item xs={12} sm={6}>
                        <Button variant="outlined" type='submit' onClick={handleClick}>Find Address</Button>
                    </Grid></ButtonGroup>  </Grid>

                    <Grid item xs={12} sm={6}>
                    {(postCodeSearched) &&
                    <FormControl variant="outlined" style={{ width: '100%', height: 40, paddingLeft: 8 }}>
                        <InputLabel htmlFor="outlined-age-native-simple">Select Addresses</InputLabel>
                        <Select
                        native
                        id="demo-simple-select-outlined"
                        labelId="demo-simple-select-outlined-label"
                        style={useStyles.textFld}
                        variant="outlined"
                        label="Select Addresses"
                        onChange={updateAddress}
                        >
                        {addressList.map(addressArray => <option key={addressArray} value={addressArray}>{addressArray}</option>)}
                        </Select>
                    </FormControl>}
                    {errorpostcode && <Alert severity="error">
                    <AlertTitle>Error: {errorpostcode}</AlertTitle>
                    </Alert>}
                    </Grid>

                    <Grid item xs={12}>
                    {(!postCodeSearched) &&
                    <TextField
                        required
                        id="address1"
                        name="address1"
                        label="Address line 1"
                        onChange={handleChange}
                        inputRef={address1Ref}
                        value={address1||''}
                        variant="outlined"
                        style={useStyles.textFld}
                        autoComplete="address-line1"
                    />}
                    {(postCodeSearched) &&
                    <TextField
                        required
                        id="address1"
                        name="address1"
                        label="Address line 1"
                        value={addressLine1||''}
                        variant="outlined"
                        style={useStyles.textFld}
                        autoComplete="address-line1"
                    />
                    }
                    </Grid>
                    <Grid item xs={12}>
                    {(!postCodeSearched) &&
                    <TextField
                        id="address2"
                        name="address2"
                        label="Address line 2"
                        onChange={handleChange}
                        inputRef={address2Ref}
                        value={address2||''}
                        variant="outlined"
                        style={useStyles.textFld}
                        autoComplete="address-line2"
                    />}
                    {(postCodeSearched) &&
                    <TextField
                        id="address2"
                        name="address2"
                        label="Address line 2"
                        value={addressLine2||''}
                        variant="outlined"
                        style={useStyles.textFld}
                        autoComplete="address-line2"
                    />
                    }
                    </Grid>
                    <Grid item xs={12} sm={6}>
                    {(!postCodeSearched) &&
                    <TextField
                        required
                        id="city"
                        name="city"
                        label="City"
                        onChange={handleChange}
                        inputRef={cityRef}
                        value={city||''}
                        variant="outlined"
                        style={useStyles.textFld}
                        autoComplete="city"
                    />}
                    {(postCodeSearched) &&
                    <TextField
                        required
                        id="city"
                        name="city"
                        label="City"
                        value={cityName||''}
                        variant="outlined"
                        style={useStyles.textFld}
                        autoComplete="city"
                    />
                    }
                    </Grid>
                    <Grid item xs={12} sm={6}>
                    {(!postCodeSearched) &&
                    <TextField
                        id="county"
                        name="county"
                        label="County"
                        onChange={handleChange}
                        inputRef={countyRef}
                        value={county||''}
                        variant="outlined"
                        style={useStyles.textFld}
                        autoComplete="county"
                    />}
                    {(postCodeSearched) &&
                    <TextField
                        id="county"
                        name="county"
                        label="County"
                        value={countyName || ''}
                        variant="outlined"
                        style={useStyles.textFld}
                        autoComplete="county"
                    />
                    }
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
                            variant="outlined"
                            style={useStyles.textFld}
                     />
                    </Grid>
                  
                    <Grid item xs={12}>

                        {(`${user}` === 'volunteer') &&
                            <FormControlLabel
                                control={<Checkbox color="secondary" style={{ marginLeft: '5px' }} name="dbsCheck" value={DBSchecked} onChange={handleChecked}  />}
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
                            <Button variant="contained" style={useStyles.button} className="btn btn-primary w-100" component={Link} to="/helpwhoneeds/" >Cancel</Button>
                        </Grid>
                    </ButtonGroup>
                </Grid>
            </form>
            </div>
        </React.Fragment>

    )
}