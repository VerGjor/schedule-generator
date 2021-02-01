import React from 'react';
import './App.css';
import '../../index.css';
import {
    BrowserRouter,
    Switch,
    Route,
    Redirect
} from "react-router-dom";
import Logo from "../../repository/images/logo.png";
import HomePage from "./HomePage/HomePage";
import GroupGenerator from "./HomePage/GroupGenerator/GroupGenerator";
import ScheduleGenerator from "./HomePage/ScheduleGenerator/ScheduleGenerator";

function App() {
    return (
        <div className="container-fluid rounded-lg background__back_style col-lg-12 m-3 border border-light mx-auto">
            <BrowserRouter className={"background_style"}>
                <h1 className={"text-center text-white"}><img src={Logo} alt={"logo"} sizes={'300px'}/></h1>
                <Switch>
                    <Redirect exact from={"/"} to={"/home"}  />
                    <Route exact path='/home' component={HomePage} />
                    <Route exact path="/generator/group" component={GroupGenerator} />
                    <Route exact path="/generator/schedule" component={ScheduleGenerator} />
                </Switch>
            </BrowserRouter>
        </div>
    );
}
export default App;
