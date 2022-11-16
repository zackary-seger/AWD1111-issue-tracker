import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import './index.css';

import * as React from "react";
import Switch from 'react-bootstrap/Switch'
import { Route } from "react-router";
import { Helmet } from 'react-helmet';

import bugList from "./components/bugList.js" 
import bugById from "./components/bugById.js"
import createBug from "./components/createBug.js" 
import LoginForm from "./components/renderLogin.js"
import RenderNavbar from './components/navbar';

const TITLE = 'BoatBorrowers.com • Login';

function App() {
  return (
    <div>

      <Helmet>
      <title>{ TITLE }</title>
      </Helmet>

      <RenderNavbar />

        <body id="container1" className='container-fluid'>
          <Switch> 

            <Route exact path = { ["/"] } component = { LoginForm } > 
            </Route>

            <Route exact path = { ["/bug/list"] } component = { bugList } > 
            </Route>

            <Route path = "/bug/:bugId/" component = { bugById } > 
            </Route> 

            <Route path = "/createBug" component = { createBug } >
            </Route> 

          </Switch>
        </body>

    </div>
  );
}

export default App;
