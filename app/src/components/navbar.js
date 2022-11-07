import * as React from "react";

import { Nav, Navbar, NavDropdown } from "react-bootstrap";
import { ReactComponent as Logo } from "../logo.svg";


function RenderNavbar() {

  return (
    <div>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" className="ps-4 pe-4">
      <Navbar.Brand href="#home" className="me-5">
        <Logo
          alt=""
          width="30"
          height="30"
          className="d-inline-block align-top pe-2"
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
    </div>
  );

}

export default RenderNavbar;
