import * as React from "react";
import '../index.css';

import { FaSignInAlt } from "react-icons/fa";


import { Nav, Navbar, NavDropdown } from "react-bootstrap";
import { ReactComponent as Logo } from "../logo-blue-white.svg";


function RenderNavbar() {

  return (
    <div>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" className="ps-4 pe-4 me-2">
      <Navbar.Brand href="/" id="navTitle" className="me-5">
        <Logo
          alt="BoatBorrowers.com Logo, Black, Blue, & White"
          className="me-3 mb-2"
          id="navLogo"
        />
        boatborrowers.com
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">

          <Nav className="mr-auto"></Nav>
          <Nav>

            <Nav.Link className="pe-2 text-nowrap" href="/">Login  <FaSignInAlt className="ms-1"/></Nav.Link>
            <Nav.Link className="pe-2 text-nowrap" href="/user/list">List All Users</Nav.Link>
            <Nav.Link className="pe-2 text-nowrap" href="/bug/list">List All Bugs</Nav.Link>
            <Nav.Link className="pe-2 text-nowrap"href="/bug/:bugId">Find Bug By bugID</Nav.Link>

            <NavDropdown className="pe-1 text-nowrap" title="Update Bug" id="collapsible-nav-dropdown">

              <NavDropdown.Item href="#action/3.1">Update Existing Bug</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">Classify Bug</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Assign Bug</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.4">Close Bug</NavDropdown.Item>

              <NavDropdown.Divider />

              <NavDropdown.Item href="#action/3.5">Bug Test Case Options</NavDropdown.Item>

            </NavDropdown>

            <Nav.Link className="pe-2 text-nowrap" href="#deets">Create Bug</Nav.Link>
            <Nav.Link className="pe-2 text-nowrap" href="#memes">Register New User</Nav.Link>
            
          </Nav>
        </Navbar.Collapse>

        </Navbar>
    </div>
  );

}

export default RenderNavbar;
