import React, { useState } from "react"
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { Button } from "@material-ui/core"

const useStyles = {
  textFld: { width: '85%', minHeight:40, paddingLeft: 8 },
  button: {
    border: '4px',
    fontWeight: 'bold',
    marginLeft: 10,
    marginTop: '10px',
  },
  divContentWrapper: {
    textAlign: "center",
    minHeight: "100%",
    paddingLeft: "50px",
  }
};


const Contact = () => {
  const [status, setStatus] = useState("Submit");
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");
    const { name, email, message } = e.target.elements;
    let details = {
      name: name.value,
      email: email.value,
      message: message.value,
    };
    let response = await fetch("http://localhost:5000/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(details),
    });
    setStatus("Submit");
    let result = await response.json();
    alert(result.status);
  };
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <Grid container direction="row" justify="center" alignItems="center" spacing={10} >
          <Grid item xs={12}>
            <TextField
              required
              id="name"
              type="text"
              name="Name"
              label="Name"
              variant="outlined"
              inputProps={{ maxLength: 20 }}
              style={useStyles.textFld}             
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              id="email"
              type="text"
              name="Email"
              label="Email"
              variant="outlined"
              inputProps={{ maxLength: 20 }}
              style={useStyles.textFld}              
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              id="message"
              type="text"
              name="Message"
              label="Message"
              variant="outlined"
              inputProps={{ maxLength: 100 }}
              style={useStyles.textFld}             
              multiline
              rows={10}
            />

          </Grid>
        </Grid>

        <Grid container
          justify="left" alignItems="left" spacing={3} >
          <Grid item xs={12} >        
            <Button color="default" variant="outlined" type="submit">{status} </Button>
          </Grid>
        </Grid>


      </div>

    </form>


  );
};

export default Contact;