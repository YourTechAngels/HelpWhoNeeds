import React, { useState, useRef } from 'react';
import TextField from '@material-ui/core/TextField';
import { useParams } from "react-router-dom";
import Grid from '@material-ui/core/Grid';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from "@material-ui/core/Button";
import axios from "axios"
import { ButtonGroup, Input } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import { useAuth } from "../../contexts/AuthContext"
import Notification from "../structure/Notification"

const useStyles = {
  textFld: { width: '85%', height: 40, paddingLeft: 8 },
  button: {
    border: '4px',
    fontWeight: 'bold',
    marginLeft: 10,
    marginTop: '10px',
  },
};

export default function RegistrationPage(props) {

  const initialInputState = {
    firstName: "", lastName: "", dateOfBirth: "", phoneNumber: "", postcode: "", address1: "", address2: "",city: "", county: ""
  }
  const [formData, setFormData] = useState({ initialInputState })
  const { firstName, lastName, dateOfBirth, phoneNumber, postcode, address1, address2, city, county } = formData
  const [message, setMessage] = useState("")
  const postcodeRef = useRef()
  const address1Ref = useRef()
  const address2Ref = useRef()
  const cityRef = useRef()
  const countyRef = useRef()
  const [countyName, setCountyName] = useState("");
  const [cityName, setCityName] = useState("");
  const param = useParams();
  const user = param.user;
  const { currentUser } = useAuth()
  const uID = currentUser.uid
  const email = currentUser.email
  const [DBSchecked, setDBSChecked] = useState(false);
  const [addressLine1, setAddressLine1] = useState("")
  const [addressLine2, setAddressLine2] = useState("")
  const [addressList, setAddressList] = useState("");
  const [errors, setErrors] = useState("");
  // const [errorDob, setErrorDob] = useState("");
  const [long, setLong] = useState()
  const [lat, setLat] = useState()
  const [postCodeSearched, setpostCodeSearched] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [notifyMsg, setNotifyMsg] = useState({
      isOpen: false,
      message: " ",
      type: " ",
  });
  // const [isVolunteer, setIsVolunteer] = useState(false);

  const getFormDate = date => {
    let year = date.getFullYear();
    let month = (1 + date.getMonth()).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');
    return year + '-' + month + '-' + day
}
  const handleChange = (e) => {
    
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const handleChecked = (e) => {
    setDBSChecked(e.target.checked)
    console.log(DBSchecked)
  }
  async function handleSubmit(evt) {
    evt.preventDefault();
    const is_volunteer = (user === 'volunteer' ? true : false)
    console.log(is_volunteer + ' ' + county + ' ' + uID + ' ' + DBSchecked);
    const addLine1 = (addressLine1 === '' ? (address1Ref.current.value) : addressLine1)
    const addLine2 = (addressLine2 === '' ? (address2Ref.current.value) : addressLine2)
    const addCity = (cityName === '' ? (cityRef.current.value) : cityName)
    const addCounty = (countyName === '' ? (countyRef.current.value) : countyName)
    console.log('dob before'+dateOfBirth)
    const dob = (dateOfBirth === undefined ? '1900-01-01' : dateOfBirth)
    console.log('dob after'+dob)
    console.log(addLine1 + '' + addLine2 + ' ' + addCity+' '+addCounty)
    console.log('longit before sending to db'+long)
    console.log('latit before sending to db'+lat)

    axios.post("/api/accounts/", {
      first_name: `${formData.firstName}`,
      last_name: `${formData.lastName}`,
      uid: `${uID}`,
      email: `${email}`,
      date_of_birth: `${dob}`,
      phone_number: `${formData.phoneNumber}`,
      post_code: `${formData.postcode}`,
      address_line_1: `${addLine1}`,
      address_line_2: `${addLine2}`,
      city: `${addCity}`,
      county: `${addCounty}`,
      dbs: `${DBSchecked}`,
      is_volunteer: `${is_volunteer}`,
      latitude: lat,
      longitude: long,
    })
      .then(function (response) {
        console.log(response);
        setMessage("Data has been saved successfully")
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  const handleClick = (e) => {
    e.preventDefault();
    const API_Key = process.env.REACT_APP_POSTCODE_API_KEY
    axios.get(`https://api.getAddress.io/find/${postcodeRef.current.value}?api-key=${API_Key}`)
      .then(function (response) {
        const responseData = response.data
        console.log(responseData.latitude)
        setLat(responseData.latitude)
        setLong(responseData.longitude)
        console.log('lat is'+lat)
        console.log('long is'+long)
        setAddressList(responseData.addresses)
        addressList === ' ' ? setErrors('No addresses found at the given post code') :
          setpostCodeSearched(true)
        console.log(addressList)
      })
      .catch(error => {
        setErrors('No addresses found at the given post code')
        setNotifyMsg({
          isOpen: true,
          message:
              "No addresses found at the given post code",
          type: "error",
      })
        console.log(error);
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

      <h2 align="center"> Registration form</h2>
      { message && <Alert severity="success">
        <AlertTitle>{message}</AlertTitle>
      </Alert>}
      <Grid container flex-start="left" >
        <p style={{ paddingLeft: 8 }}>Please enter your details here</p> </Grid>

      <form onSubmit={handleSubmit} >
        <Grid container spacing={3} >
          <Grid item xs={12} sm={6}>
            <TextField
              required
              id="firstName"
              type="text"
              name="firstName"
              label="First name"
              variant="outlined"
              onChange={handleChange}
              value={firstName || ''}
              inputProps={{ maxLength: 20 }}
              style={useStyles.textFld}
              autoComplete="given-name"
            />
          </Grid>
          <Grid item xs={12} sm={6} >
            <TextField
              required
              id="lastName"
              name="lastName"
              type="text"
              label="Last name"
              onChange={handleChange}
              value={lastName || ''}
              inputProps={{ maxLength: 20 }}
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
              inputProps={{ max: getFormDate(new Date()) }}
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
              label="Phone Number"
              type='number'
              onChange={handleChange}
              value={phoneNumber || ''}
              variant="outlined"
              inputProps={{ maxLength: 11 }}
              style={useStyles.textFld}
              // helperText='Phone number should start with 0 or +44'
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

              {errors &&  <Notification notify={notifyMsg} setNotify={setNotifyMsg} verticalPosTop={false}/>}

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
          <Grid item xs={12}>

            {(`${user}` === 'volunteer') &&
              <FormControlLabel
                control={<Checkbox color="secondary" style={{ marginLeft: '5px' }} name="DBSchecked" value={DBSchecked} onChange={handleChecked} />}
                label="I have a valid DBS certificate"
              />}
          </Grid>
        </Grid>
        <Grid container justify="center" spacing={3} direction="row">
          <Grid item xs={12} align="center">
            <Button variant="contained" className="btn btn-primary w-100" type="submit">Submit</Button>
          </Grid>
        </Grid>
      </form>
    </React.Fragment>

  )
}