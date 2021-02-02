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
import Notification from "../structure/Notification"

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
        firstName: "", lastName: "", dateOfBirth: "", phoneNumber: "", postcode: "", address1: "", address2: "",city: "", county: "", email:""
      }
    const [formData, setFormData,] = useState({initialInputState})
    const { firstName, lastName, dateOfBirth, phoneNumber, postcode, address1, address2, city, county, email } = formData
    const [successMessage, setSuccessMessage] = useState("")
    const emailRef = useRef()
    const postcodeRef = useRef()
    const passwordConfirmRef = useRef()
    const passwordRef = useRef()
    const address1Ref = useRef()
    const address2Ref = useRef()
    const cityRef = useRef()
    const countyRef = useRef()    
    const { currentUser, updatePassword, updateEmail } = useAuth()
    const uID = currentUser.uid
    const emailID = currentUser.email
    const [DBSChecked, setDBSChecked] = useState(false);
    const [checked, setChecked] = React.useState(true);
    const [addressLine1, setAddressLine1] = useState("")
    const [addressLine2, setAddressLine2] = useState("")
    const [countyName, setCountyName] = useState("");
    const [cityName, setCityName] = useState("");
    const [addressList, setAddressList] = useState("");
    const [postCodeSearched, setpostCodeSearched] = useState(false);
    const [errors, setErrors] = useState("")
    const[id, setId] = useState("")
    const[isVolunteer, setIsVolunteer] = useState(false)
    const [errorpostcode, setErrorpostcode] = useState("")
    const [loading, setLoading] = useState(false)
    const history = useHistory()
    const [open, setOpen] = React.useState(false);
    const [long, setLong] = useState()
    const [lat, setLat] = useState()
    const [notifyMsg, setNotifyMsg] = useState({
        isOpen: false,
        message: " ",
        type: " ",
    });
    // const param = useParams();
    // const user = param.user;

    const getFormDate = date => {
        let year = date.getFullYear();
        let month = (1 + date.getMonth()).toString().padStart(2, '0');
        let day = date.getDate().toString().padStart(2, '0');
        return year + '-' + month + '-' + day
    }
     
    
    useEffect(() => {
          axios.get('https://letmeknow.uk/api/accounts/get_user_by_id/',
            {
                params : { uid : uID }
            })
            .then(
                (response) => {
                    const responseData = (response.data[0]);
                    console.log(responseData);
                    const userDataSet = {
                        firstName : `${responseData.first_name}`,
                        lastName : `${responseData.last_name}`,
                        dateOfBirth: `${responseData.date_of_birth === '1900-01-01'?'' : responseData.date_of_birth}`,
                        phoneNumber : `${responseData.phone_number}`,
                        postcode: `${responseData.post_code}`,
                        address1 : `${responseData.address_line_1}`,
                        address2 : `${responseData.address_line_2}`,
                        city : `${responseData.city}`,
                        county : `${responseData.county}`,
                        email : `${responseData.email}`
                    }
                    

                    setFormData({ lastName : (userDataSet.lastName), firstName: (userDataSet.firstName), dateOfBirth: (userDataSet.dateOfBirth),
                    postcode: (userDataSet.postcode), phoneNumber : (userDataSet.phoneNumber) , address1: (userDataSet.address1), address2: (userDataSet.address2),
                    city: (userDataSet.city), county: (userDataSet.county), email: (userDataSet.email)})
                    setId(responseData.id)
                    console.log(responseData.is_volunteer)
                    setIsVolunteer(responseData.is_volunteer)                   
                    setDBSChecked(responseData.dbs)
                    console.log(responseData.dbs)
                    console.log(formData)
                    console.log(isVolunteer+' '+DBSChecked);
                })
                .catch(function (error) {
                    console.log("error")
                    console.log(error.request);
                    console.log(error.config);
                    console.log(error.message);
    
                });            
        }, [uID]);
        
       
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }
    const handleChecked = (e) => {
        console.log('inside check handle'+DBSChecked)
        setDBSChecked(e.target.checked)
        console.log('after setting falsefor dbs '+DBSChecked)
    }

    async function handleSubmit(e) {
        e.preventDefault();
        
        const addLine1 = (addressLine1 === '' ? (address1Ref.current.value) : addressLine1)
        const addLine2 = (addressLine2 === '' ? (address2Ref.current.value) : addressLine2)
        const addCity = (cityName === '' ? (cityRef.current.value) : cityName)
        const addCounty = (countyName === '' ? (countyRef.current.value) : countyName)
        const dob = (dateOfBirth === '' ? '1900-01-01': dateOfBirth)
        const mail = (errors === ''? email : currentUser.email)
        console.log(mail)
        console.log(addLine1 + '' + addLine2 + ' ' + addCity+' '+addCounty)
        console.log(emailRef.current.value)
        console.log('dbs checked before sending to db is '+DBSChecked)
        console.log('longit before sending to db'+long)
        console.log('latit before sending to db'+lat)
        if(emailRef.current.value === "" || emailRef.current.value === null) {
            // setMessage("Data has been updated successfully")
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
            //   setFormData({ email : (emailRef.current.value) }
              promises.push(updateEmail(emailRef.current.value))
          }
          if (passwordRef.current.value) {
            promises.push(updatePassword(passwordRef.current.value))
          }
      
          Promise.all(promises)
            .then(() => {
            //   history.push("/helpwhoneeds/")
            
            })
            .catch((error) => {
              setErrors(error.message)
              console.log(errors)
            })
            .finally(() => {
              setLoading(false)
            }) 
        }
        axios.patch('https://letmeknow.uk/api/accounts/'+id+'/',
        
         { 
            first_name: `${formData.firstName}`,
            last_name: `${formData.lastName}`,
            email: `${mail}`,
            date_of_birth: `${dob}`,
            phone_number: `${formData.phoneNumber}`,
            post_code: `${formData.postcode}`,
            address_line_1: `${addLine1}`,
            address_line_2: `${addLine2}`,
            city: `${addCity}`,
            county: `${addCounty}`,
            dbs: DBSChecked,
            latitude: `${lat}`,
            longitude: `${long}`,
         },
        )
       .then(function (response) {
        console.log(response);
        setSuccessMessage("Data has been updated successfully")
        console.log('dbs when on databse is'+DBSChecked)
        console.log(successMessage)
        // history.push("/profile/")
      })
       .catch(function (error) {
        console.log(error);
      });
     console.log(successMessage)
    }
    const handleClick = (e) => {
        e.preventDefault();
        axios.get(`https://api.getAddress.io/find/${postcodeRef.current.value}?api-key=${process.env.REACT_APP_POSTCODE_API_KEY}`)
          .then(function (response) {
            const responseData = response.data
            setLat(responseData.latitude)
            setLong(responseData.longitude)
            console.log(responseData)
            console.log('lat is'+lat)
            console.log('long is'+long)
            setAddressList(responseData.addresses)
            addressList === ' ' ? setErrorpostcode('No addresses found at the given post code') :
              setpostCodeSearched(true)
            console.log(addressList)
          })
          .catch(error => {
            setNotifyMsg({
                isOpen: true,
                message:
                    "No addresses found at the given post code",
                type: "error",
            })
            console.log(errorpostcode);
          })
      }
      const updateAddress = (e) => {
        console.log(e)  
        const valueList = [...e.target.selectedOptions].map(opt => opt.value);
        if ({ valueList } !== '') {
          let addressStore = valueList.toString().split(',')
          console.log(addressStore)
        //   setLat()
          setAddressLine1(addressStore[0])
          setAddressLine2(addressStore[1])
          setCityName(addressStore[5])
          setCountyName(addressStore[6])
        }
      }    

    return (

        <React.Fragment>
        <div style={{ width: "80vw" }}> 
            <h4 align="center"> My Profile</h4>
             { !errors && successMessage && <Alert severity="success">
                <AlertTitle>{successMessage}</AlertTitle>
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
                            id="firstName"
                            type="text"
                            name="firstName"
                            label="First name"
                            variant="outlined"
                            // inputRef ={firstnameRef}
                            onChange={handleChange}
                            value={firstName||''}
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
                            variant="outlined"
                            onChange={handleChange}
                            value={lastName||''}
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
                            inputProps={{ max: getFormDate(new Date()) }}
                            label="Date Of Birth"
                            onChange={handleChange}
                            value={dateOfBirth||''}
                            variant="outlined"
                            style={useStyles.textFld}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                        required
                        id="phoneNumber"
                        name="phoneNumber"
                        // type="number"
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
                          <option value='' selected> </option>  
                        {addressList.map(addressArray => <option key={addressArray} value={addressArray}>{addressArray}</option>)}
                        </Select>
                    </FormControl>}
                     {errorpostcode &&  <Notification notify={notifyMsg} setNotify={setNotifyMsg} verticalPosTop={false}/>}
                
                     {/* <Alert severity="error">This is an error message!</Alert>
                    //                 <Alert severity="error">
                    // <AlertTitle>Error: {errorpostcode}</AlertTitle>
                    // </Alert> */}
                    
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

                        {(isVolunteer === true) && (DBSChecked === true) &&
                            <FormControlLabel
                                control={<Checkbox color="secondary" style={{ marginLeft: '5px' }} name="DBSChecked" value={DBSChecked} checked="checked" onChange={handleChecked}  />}
                                label="I have a valid DBS certificate"
                            />}
                          {(isVolunteer === true) && (DBSChecked === false) &&
                            <FormControlLabel
                                control={<Checkbox color="secondary" style={{ marginLeft: '5px' }} name="DBSChecked" value={DBSChecked} onChange={handleChecked}  />}
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
