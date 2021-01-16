import React,{useState, useRef} from 'react';
import TextField from '@material-ui/core/TextField';
import { useParams } from "react-router-dom";
import Grid from '@material-ui/core/Grid';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from "@material-ui/core/Button";
import axios from "axios"
import { ButtonGroup } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import { useAuth } from "../../contexts/AuthContext"

const useStyles = {
  textFld: { width: '85%', height: 40, paddingLeft: 8 } , 
  button: {
    border: '4px',
    fontWeight: 'bold',
    marginLeft: 10,
    marginTop: '10px',
  },
  };

  export default function RegistrationPage(props) {

    const initialInputState = { firstName : "" , lastName:"" , dateOfBirth:"",phoneNumber:"", postcode:""}     
    const [formData, setFormData] = useState({initialInputState})
    const { firstName , lastName, dateOfBirth, phoneNumber, postcode} = formData
    const [message, setMessage] = useState("")
    const postcodeRef = useRef()
    const [county, setCounty] = useState("");
    const [city, setCity] = useState("");  
    const param = useParams();
    const user  = param.user;
    const { currentUser } = useAuth()
    const uID = currentUser.uid
    const email = currentUser.email
    const [DBSchecked, setDBSChecked] = useState("False"); 
    const [address1, setAddress1] = useState("")
    const [address2, setAddress2] = useState("")
    const [addressList, setAddressList] = useState("");
    const [errors, setErrors] = useState("");
    const [postCodeSearched, setpostCodeSearched] = useState(false);
        
    const handleChange= (e) => {
      setFormData({...formData,[e.target.name]: e.target.value});
    }
    
    const handleChecked = (e) => {
      setDBSChecked(e.target.checked) 
      console.log(DBSchecked)
    }
    async function handleSubmit(evt) {
      evt.preventDefault();
      console.log(formData.firstName)
      console.log(city+' '+county+' '+uID+' '+DBSchecked, +email);
      axios.post("http://localhost:8000/api/accounts/", {
        first_name: `${formData.firstName}`,
        last_name: `${formData.lastName}`,
        uid: `${uID}`,        
        email: `${email}`,
        date_of_birth: `${formData.dateOfBirth}`,
        phone_number: `${formData.phoneNumber}`,
        post_code: `${formData.postcode}`,
        address_line_1: `${address1}`,
        address_line_2: `${address2}`,
        city: `${city}`,        
        county: `${county}`,
        DBS_required: `${DBSchecked}`,
        user_type: `${user}`,        
        })
        .then(function (response) {
          console.log(response);
          setMessage("Data has been saved successfully")
        })
        .catch(function (error) {
          console.log(error);
        }); 
    }

    const handleClick= (e) => {
      e.preventDefault();
      const API_KEY = process.env.REACT_APP_POSTCODE_API_KEY
      axios.get(`https://api.getAddress.io/find/${postcodeRef.current.value}?${API_KEY}`)
        .then(function(response){ 
              const responseData = response.data
              setAddressList(responseData.addresses)
              setpostCodeSearched(true)
              console.log(addressList)
        })
        .catch(error => {
          setErrors('No addresses found at the given post code')
          console.log(error);
        })        
    }    
    const updateAddress=(e) => {
      const valueList = [...e.target.selectedOptions].map(opt => opt.value);  
      if({valueList} !== '') {
          let addressStore = valueList.toString().split(',')
          console.log(addressStore)
          setAddress1(addressStore[0])
          setAddress2(addressStore[1])
          setCity(addressStore[5])
          setCounty(addressStore[6])
            }
        else {
              console.log('null')
              setAddress1('')
              setAddress2('')
              setCity('')
              setCounty('')
        }    
      }
                
   return (     
   <React.Fragment>
     
      <h2 align="center"> Registration form</h2>
      { message && <Alert severity="success">
            <AlertTitle>{message}</AlertTitle>
            </Alert>}
      <Grid container flex-start="left" >
      <p style={{paddingLeft:8}}>Please enter your details here</p> </Grid>
     
      <form onSubmit={handleSubmit} >      
      <Grid container spacing={3} >
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="firstName"
            type ="text"
            name="firstName"
            label="First name"
            variant="outlined"
            onChange = { handleChange }
            value= {firstName || ''}
            style = {useStyles.textFld}
            autoComplete="given-name"
          />
        </Grid>
         <Grid item xs={12} sm={6} >
          <TextField
            required
            id="lastName"
            name="lastName"
            type ="text"
            label="Last name"
            onChange = { handleChange }
            value= {lastName || ''}
            variant="outlined"
            style = {useStyles.textFld}
            autoComplete="family-name"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="dateOfBirth"
            name="dateOfBirth"
            type= "date"
            InputLabelProps={{
              shrink: true,
            }}
            label="Date Of Birth"
            onChange = { handleChange }
            value= {dateOfBirth || ''}
            variant="outlined"
            style = {useStyles.textFld}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            id="phoneNumber"
            name="phoneNumber"
            type= "number"
            label="Phone Number"
            onChange = { handleChange }
            value= {phoneNumber || ''}
            variant="outlined"
            style = {useStyles.textFld}
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
            onChange = { handleChange }
            inputRef = {postcodeRef}
            value= {postcode ||''}
            style = {useStyles.textFld}
            autoComplete=" postal-code"/>       
          <Grid item xs={12} sm={6}>            
            <Button variant="outlined" type='submit' onClick={handleClick}>Find Address</Button>
        </Grid></ButtonGroup>  </Grid> 

        <Grid item xs={12} sm={6}>
         { (postCodeSearched) && (addressList) !== '' &&  
        <FormControl variant="outlined"  style = {{ width: '100%', height: 40, paddingLeft: 8 }}>
        <InputLabel  htmlFor="outlined-age-native-simple">Select Addresses</InputLabel>
        <Select
          native
          id="demo-simple-select-outlined"
          labelId="demo-simple-select-outlined-label"
          style = {useStyles.textFld}
          variant ="outlined"
          label="Select Addresses"
           onChange={updateAddress}
        > 
          {addressList.map(addressArray => <option key={addressArray} value={addressArray}>{addressArray}</option>) }
        </Select>
        </FormControl>}
         { errors && <Alert severity="error">
            <AlertTitle>Error: {errors}</AlertTitle>
            </Alert>}
        </Grid>
   
        <Grid item xs={12}>
          <TextField
            required
            id="address1"
            name="address1"
            label="Address line 1"
            onChange = { handleChange }
            value = {address1 || ''}
            variant="outlined"
            style = {useStyles.textFld}
            autoComplete="address-line1"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="address2"
            name="address2"
            label="Address line 2"
            onChange = { handleChange }
            variant="outlined"
            value = {address2 || ''}
            style = {useStyles.textFld}
            autoComplete="address-line2"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="city"
            name="city"
            label="City"
            value= {city || ''}
            variant="outlined"
            style = {useStyles.textFld}
            autoComplete="address-level2"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
           id="county" 
           name="county"  
           variant="outlined" 
           value= {county || ''}
           style = {useStyles.textFld}
           label="County" />
        </Grid>
                       
        <Grid item xs={12}>
         
         { (`${user}` === 'volunteer') && 
          <FormControlLabel
            control={<Checkbox color="secondary" style = {{ marginLeft: '5px' }} name="DBSchecked" value={DBSchecked} onChange = {handleChecked}/>}
            label="I have a valid DBS certificate"
          /> }  
        </Grid> 
        </Grid>
        <Grid container justify="center" spacing={3} direction="row">
        <Grid item xs={12} align="center">
        <Button variant = "contained" className = "btn btn-primary w-100" type="submit">Submit</Button>
        </Grid>
        </Grid>
        </form>
    </React.Fragment>   
  
)}
