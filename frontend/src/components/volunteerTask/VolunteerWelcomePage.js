import VolunteerSearchTask from "./VolunteerSearchTask";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";

const VolunteerWelcome = () => {
  return (
    <div>
      <VolunteerSearchTask myTask={true} />
      <Button
             variant="outlined"
             color="default"
        style={{ marginLeft: 16 }}
        component={Link}
        to={"/volunteerSearchTask"}
      >
        Search New Tasks
      </Button>
    </div>
  );
};

export default VolunteerWelcome;
