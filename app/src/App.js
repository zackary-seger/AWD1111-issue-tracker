import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import * as React from "react";
import Switch from 'react-bootstrap/Switch'
import { Route } from "react-router";

import bugList from "./components/bugList.js" 
import bugById from "./components/bugById.js"
import createBug from "./components/createBug.js" 
import LoginForm from "./components/renderLogin.js"
import RenderNavbar from './components/navbar';

function App() {
  return (
    <div>

      <RenderNavbar />

      <title>BoatBorrowers.com 🔐</title>
  
      <Switch> 

        <Route exact path = { ["/"] } component = { LoginForm } > 
        </Route>

        <Route exact path = { ["/bugList"] } component = { bugList } > 
        </Route>

        <Route path = "/bug/:bugId/" component = { bugById } > 
        </Route> 

        <Route path = "/createBug" component = { createBug } >
        </Route> 

      </Switch>

    </div>
  );
}

export default App;
