import React from "react";
import "./App.css";
import AppNavBar from "./components/structure/AppNavBar"
import Landing from "./components/landing/Landing"
import About from "./components/landing/About"
import Contact from "./components/landing/Contact"
import Footer from "./components/structure/Footer"
import SignIn from "./components/login/SignIn"
import SignUp from "./components/login/SignUp"
import RegistrationPage  from "./components/registrationPage/RegistrationPage"
import VolunteerSearchTask from "./components/volunteerTask/VolunteerSearchTask"
import VolunteerWelcome from "./components/volunteerTask/VolunteerWelcomePage"
import { BrowserRouter as Router,  Route, Switch } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import PrivateRoute from "./components/PrivateRoute"
//import firebase from "./firebase/app"

function App() {
    
    return (
        
        <Router>
            <AuthProvider>
            <div className="App">
                <AppNavBar />
                <div className="AppContent">
                <Switch>
                <Route exact path="/">
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
                <Route path="/signUp/:user">
                    <SignUp />
                </Route>     
                <Route path="/registrationPage/:user">
                    <RegistrationPage />
                </Route> 
                <Route path="/searchTask">
                    <VolunteerSearchTask />
                </Route>   
                <Route path="/myTask">
                    <VolunteerWelcome />
                </Route>           
                </Switch>
                </div>
                <Footer />
            </div>
            </AuthProvider>
        </Router>
       
    );

}

export default App;
