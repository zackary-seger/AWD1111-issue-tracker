import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import * as React from "react";
import * as Link from 'react-router-dom'

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav' 
import Navbar from 'react-bootstrap/Navbar'
import Switch from 'react-bootstrap/Switch'

import { Route } from "react-router";
import { bugArray } from './components/bugList.js';

import bugList from "./components/bugList.js" 
import bugById from "./components/bugById.js"
import createBug from "./components/createBug.js" 

function App() {
  return (
  <>

      <Navbar bg="primary" variant="dark">
        <Container>
          <Navbar.Brand>Bug Tracker</Navbar.Brand>
          <Nav className="mr-auto">
            <Nav.Link href="/bugList">
              Bug List
            </Nav.Link>
            <Nav.Link href="/bug/:bugId">
              Bug By Id
            </Nav.Link>
            <Nav.Link href="/createBug">
              Create Bug
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      <Switch> 

        <Route exact path = "/"> 
        </Route>

        <Route exact path = "/bugList" component = { bugList }> 
        </Route>

        <Route path = "/bug/:bugId/" component = { bugById } > 
        </Route> 

        <Route path = "/createBug" component = { createBug } >
        </Route> 

      </Switch>

    </>


  );
}

export default App;
