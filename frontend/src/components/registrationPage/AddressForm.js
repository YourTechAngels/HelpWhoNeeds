import React,{useState, useRef} from 'react';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from "@material-ui/core/Button";
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

export default function AddressForm(props) {

    const postcodeRef = useRef()
    const address1Ref = useRef()
    const address2Ref = useRef()
    const cityRef = useRef()
    const countyRef = useRef()
    const [county, setCounty] = useState("");
    const [city, setCity] = useState(""); 

    const handleClick= (e) => {
      e.preventDefault();
      const PostcodesJS = require("postcodes.js");
      const Postcodes = new PostcodesJS.Callbacks();
      console.log(postcodeRef.current.value)   
      Postcodes.lookup(postcodeRef.current.value, function(error, result) {
      console.log(result);
      setCounty(result.admin_county)
      setCity(result.parliamentary_constituency)
      console.log(county)
    });}

    return (
     
   <React.Fragment>     
           
      <Grid container spacing={3} >
        <Grid item xs={12} sm={6}> 
        {/* <Grid container  spacing={0} direction='row'>          */}
        <ButtonGroup>     
         <TextField
            required
            id="postcode"
            name="postcode"
            label="Post code"
            variant="outlined"
            inputRef = {postcodeRef}
            style = {useStyles.textFld}
            autoComplete=" postal-code"/>       
          <Grid item xs={12} sm={6}>            
            <Button variant="outlined" type='submit' onClick={handleClick}>Find Address</Button>
        </Grid></ButtonGroup>  </Grid> 
   
        <Grid item xs={12}>
          <TextField
            required
            id="address1"
            name="address1"
            inputRef = {address1Ref}
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
            inputRef = {address2Ref}
            variant="outlined"
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
            inputRef = {cityRef}
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
           inputRef = {countyRef}
           variant="outlined" 
           value= {county || ''}
           style = {useStyles.textFld}
           label="County" />
        </Grid>
        </Grid>
       
    </React.Fragment>   
  
)}