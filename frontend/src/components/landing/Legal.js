import Grid from '@material-ui/core/Grid';


const Legal = () => (
  <div>

    <h2 align="center"> Legal</h2>

    <Grid container

      direction="row"
      spacing={5}
      justify="center" >


      <strong>Code of Business Conduct:</strong>
      <p>This sets out our values, responsibilities and obligations with regard to the handling of certain
ethical situations commonly faced by the company and its employees. Users of this app must be 18 or over</p>


      <p><strong>Modern Slavery Act</strong></p>

      <p>We are committed to respecting human rights and taking steps to eradicate modern slavery throughout our
      supply chain.</p>

      <p>PLEASE NOTE:  Your use of the subscription service and software is subject to the terms and conditions of
      the agreement you agreed to when you signed up to register/subscribe and by which you acquired a license
  for the software. </p>

      <p>Your data and GDPR -- </p> <br/>
      <p>   Intellectual property rights.</p>
    </Grid>

  </div>
);

export default Legal;
