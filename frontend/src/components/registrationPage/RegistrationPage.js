import React,{useState} from 'react';
import TextField from '@material-ui/core/TextField';
import { useParams } from "react-router-dom";
import Grid from '@material-ui/core/Grid';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from "@material-ui/core/Button";
// import AddressForm from './AddressForm';
import { ButtonGroup } from '@material-ui/core';


const useStyles = {
  textFld: { width: '85%', height: 40, paddingLeft: 8 } , 
  button: {
    border: '4px',
    color: "default",
    fontWeight: 'bold',
    marginLeft: 10,
    marginTop: '10px',
  },
  
  };

  export default function RegistrationPage(props) {

    const initialInputState = { firstName : "" , lastName:"" , DateOfBirth:"", 
                                postcode:"", address1:"", address2:"", city:"" , county:"" }     
    const [formData, setFormData] = useState({initialInputState})
    const { firstName , lastName, DateOfBirth, postcode, address1, address2, city, county } = formData
    const [message, setMessage] = useState("")
    

    const handleChange= (e) => {
      setFormData({...formData,[e.target.name]: e.target.value});
    }

    const handleSubmit = (evt) => {
        evt.preventDefault();
        setMessage("Data has been saved successfully")
         
      console.log(formData)
      }

      const param = useParams();
      const user  = param.user;
                
   return (
     
   <React.Fragment>
     
      <h2 align="center"> Registration form</h2>
      { message && <Alert severity="success">
            <AlertTitle>{message}</AlertTitle>
            </Alert>}
      <Grid container justify="left"  alignItems="left">
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
            id="DateOfBirth"
            name="DateOfBirth"
            type= "date"
            InputLabelProps={{
              shrink: true,
            }}
            label="Date Of Birth"
            onChange = { handleChange }
            value= {DateOfBirth || ''}
            variant="outlined"
            style = {useStyles.textFld}
          />
        </Grid>
        
        <Grid item xs={12} sm={12}> 
        {/* <Grid container  spacing={0} direction='row'>          */}
        <ButtonGroup>     
         <TextField
            required
            id="postcode"
            name="postcode"
            label="Post code"
            variant="outlined"
            onChange = { handleChange }
            value= {postcode || ''}
            style = {useStyles.textFld}
            autoComplete=" postal-code"/>
            {/* // InputProps={{endAdornment:*/}
        
          <Grid item xs={12} sm={6}>            
            <Button variant="outlined" type='submit' onClick={() => { console.log('Find Address button clicked') }}>Find Address</Button>
        </Grid></ButtonGroup>  </Grid> 
   
        <Grid item xs={12}>
          <TextField
            required
            id="address1"
            name="address1"
            onChange = { handleChange }
            value= {address1 || ''}
            label="Address line 1"
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
            variant="outlined"
            onChange = { handleChange }
            value= {address2 || ''}
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
            onChange = { handleChange }
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
           onChange = { handleChange }
           value= {county || ''}
           style = {useStyles.textFld}
           label="County" />
        </Grid>
               
        <Grid item xs={12}>
         
         { (`${user}` === 'Volunteer') && 
          <FormControlLabel
            control={<Checkbox color="secondary" style = {{ marginLeft: '5px' }} name="dbsCheck" value="yes" />}
            label="I have a valid DBS certificate"
          /> }  

        </Grid>
        <Grid item xs={12} align="center">

        <Button variant = "contained"  className = "btn btn-primary w-100" type="submit">Submit</Button>
        </Grid>
        </Grid>
        </form>
    </React.Fragment>   
  
)}