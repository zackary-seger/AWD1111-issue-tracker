import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import './index.css';

import * as React from "react";
import Switch from 'react-bootstrap/Switch';
import { Route } from "react-router";
import { Helmet } from 'react-helmet';

import bugList from "./components/bugList.js" 
import UserList from "./components/userList";
import LoginForm from "./components/renderLogin.js";
import CheckoutForm from "./components/paypalCheckout.js"
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
          <Switch className='mb-2'> 

            <Route exact path = { ["/"] } component = { LoginForm } > 
            </Route>

            <Route exact path = { ["/user/list"] } component = { UserList } > 
            </Route>

            <Route exact path = { ["/bug/list"] } component = { bugList } > 
            </Route>

            <Route exact path = { ["/register"] }       />
            <Route exact path = { ["/bug/:bugId"] }     />
            <Route exact path = { ["/user/:userId"] }   />
            
            <Route exact path = { ["/checkout"] } element = { <CheckoutForm /> }  />
            <Route exact path = { ["*"] }               />

          </Switch>
        </body>

    </div>
  );
}

export default App;
