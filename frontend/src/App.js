import React from "react";
import "./App.css";
import AppNavBar from "./components/structure/AppNavBar"
import Landing from "./components/landing/Landing"
import About from "./components/landing/About"
import Contact from "./components/landing/Contact"
import Footer from "./components/structure/Footer"
import SignIn from "./components/login/SignIn"
import RegistrationPage  from "./components/registrationPage/RegistrationPage"
import VolunteerSearchTask from "./components/volunteerTask/VolunteerSearchTask"
import AddTask from "./components/task/AddTask"
import { BrowserRouter as Router,  Route, Switch } from "react-router-dom"
import './App.css'

function App() {
    return (
        <Router>
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
                <Route path="/registrationPage/:user">
                    <RegistrationPage />
                </Route> 
                <Route path="/volunteerSearchTask">
                    <VolunteerSearchTask />
                </Route>
                <Route path="/tasks/add">
                    <AddTask />
                </Route>
                </Switch>
                </div>
                <Footer />
            </div>
        </Router>
    );

}

export default App;
