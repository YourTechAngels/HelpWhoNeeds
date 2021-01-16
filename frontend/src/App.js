import React from "react";
import "./App.css";
import AppNavBar from "./components/structure/AppNavBar"
import Landing from "./components/landing/Landing"
import Legal from "./components/landing/Legal"
import Cookie from "./components/landing/Cookie"
import Support from "./components/landing/Support"
import TermConditions from "./components/landing/TermConditions"
import About from "./components/landing/About"
import Contact from "./components/landing/Contact"
import Footer from "./components/structure/Footer"
import SignIn from "./components/login/SignIn"
import SignUp from "./components/login/SignUp"
import Profile from "./components/login/Profile"
import ForgotPassword from "./components/login/ForgotPassword"
import RegistrationPage  from "./components/registrationPage/RegistrationPage"
import VolunteerSearchTask from "./components/volunteerTask/VolunteerSearchTask"
import AddTask from "./components/task/AddTask"
import VolunteerWelcome from "./components/volunteerTask/VolunteerWelcomePage"
import { BrowserRouter as Router,  Route, Switch } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import PrivateRoute from "./components/PrivateRoute"

function App() {
    
    return (
        
        <Router>
            <AuthProvider>
            <div className="App">
                <AppNavBar />
                <div className="AppContent">
                <Switch>
                <Route exact path="/helpwhoneeds/">
                    <Landing />
                </Route>
                <Route path="/about">
                    <About />
                </Route>
                <Route path="/contact">
                    <Contact />
                </Route>
                <Route path="/login/:userType">
                    <SignIn />
                </Route>  
                <Route path="/signup/:user">
                    <SignUp />
                </Route>  
                <Route path="/forgotpassword/:user">
                    <ForgotPassword />
                </Route>    
                <Route path="/legal">
                    <Legal />
                </Route>    
                <Route path="/support">
                    <Support />
                </Route>    
                <Route path="/cookie">
                    <Cookie />
                </Route>
                <Route path="/contact">
                    <Contact />
                </Route>    
                <Route path="/termconditions">
                    <TermConditions />
                </Route>    
                 
                <Route path="/requestee/tasks">
                    <AddTask />
                </Route>  
                <PrivateRoute path="/profile" component= {Profile} /> 
                <PrivateRoute path="/registrationpage/:user" component= {RegistrationPage} />
                <PrivateRoute path="/searchtask" component= {VolunteerSearchTask} />
                <PrivateRoute path="/mytask" component= {VolunteerWelcome} />
                <PrivateRoute path="/addtask" component= {AddTask} />
                </Switch>
                </div>
                <Footer />
            </div>
            </AuthProvider>
        </Router>
       
    );

}

export default App;
