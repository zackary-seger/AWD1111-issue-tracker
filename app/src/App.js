import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import * as React from "react";
import * as Link from 'react-router-dom'

import Container from 'react-bootstrap/Container';
import Switch from 'react-bootstrap/Switch'
import { Nav, Navbar, NavDropdown } from "react-bootstrap";
import { ReactComponent as Logo } from "./logo.svg";

import { Route } from "react-router";

import bugList from "./components/bugList.js" 
import bugById from "./components/bugById.js"
import createBug from "./components/createBug.js" 
import LoginForm from "./components/renderLogin.js"

function App() {
  return (
  <>

      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Navbar.Brand href="#home">
        <Logo
          alt=""
          width="30"
          height="30"
          className="d-inline-block align-top"
        />
        Bug Tracker v0.1
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">

          <Nav className="mr-auto"></Nav>
          <Nav>

            <Nav.Link href="/">Login</Nav.Link>
            <Nav.Link href="/user/list">List All Users</Nav.Link>
            <Nav.Link href="/bug/list">List All Bugs</Nav.Link>
            <Nav.Link href="/bug/:bugId">Find Bug By bugID</Nav.Link>

            <NavDropdown title="Update Bug" id="collapsible-nav-dropdown">

              <NavDropdown.Item href="#action/3.1">Update Existing Bug</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">Classify Bug</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Assign Bug</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.4">Close Bug</NavDropdown.Item>

              <NavDropdown.Divider />

              <NavDropdown.Item href="#action/3.5">Bug Test Case Options</NavDropdown.Item>

            </NavDropdown>

            <Nav.Link href="#deets">Create Bug</Nav.Link>
            <Nav.Link eventKey={2} href="#memes">Register New User</Nav.Link>
            
          </Nav>
          </Navbar.Collapse>

        </Navbar>
  

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

    </>


  );
}

export default App;
