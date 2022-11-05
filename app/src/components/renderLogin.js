import React from 'react';
import Debug from 'debug';

import Form from 'react-bootstrap/Form'; 
import Button from 'react-bootstrap/Button'; 
// import Col from 'react-bootstrap/Col'; 
// import Row from 'react-bootstrap/Row'; 
// import Container from 'react-bootstrap/Container';

import BugDataService from "../services/bugList" 

import { useHistory } from "react-router-dom";

const debugMain = Debug("react:renderLogin");
const debugError = Debug("react:error");

let loginCreds;
let savedToken;
let x = 5;

const history = (useHistory);

class LoginForm extends React.Component {
  
  constructor(props) {
    
    super(props);

    this.loginUser = this.loginUser.bind(this);

    this.emailInput = React.createRef();
    this.passwordInput = React.createRef();

    this.focusInput = this.focusInput.bind(this);

  }

  focusInput() {

    // Explicitly focus the text input using the raw DOM API
    // Note: we're accessing "current" to get the DOM node

    this.emailInput.current.focus();
    this.passwordInput.current.focus();

  }

  loginUser(event, props, ref) { 

    event.preventDefault();

    const formData = new FormData();

    console.log(this.emailInput.current);

    formData.append('email', this.emailInput);
    formData.append('password', this.passwordInput);

    loginCreds = Object.fromEntries(formData.entries());
    
    console.log(loginCreds);

    const bds = new BugDataService(); 

    bds.login(loginCreds.emailInput, loginCreds.passwordInput).then( response => { 

      console.log(response.data); 
      savedToken = response.data;

    }).catch( e =>{ 
      console.log(e); 
    }) 


    if ( savedToken !== null && savedToken !== undefined ) {
      history("/bugList", { replace: true });
    } else {
      console.log({ error: 'Invalid Credentials. Please Try Again.. (' + x + ' attempts remaining)' });
      x--;
    }
    
  } 

  // Render HTML:
  
  render() {

    return (
      <div>

        <h1 className="mt-3">User Login</h1>

        <Form className="mt-3" onSubmit={ this.loginUser }>

          <Form.Group className="mb-3" controlId="renderLogin.userCredentials">

            <Form.Label>Email address</Form.Label>
            <Form.Control className="me-3" type="email" placeholder="name@example.com" controlId="emailInput" inputRef={this.emailInput} />

            <Form.Label>Password</Form.Label>
            <Form.Control className="me-3" type="password" controlId="passwordInput" inputRef={this.passwordInput} />

          </Form.Group>

          <Form.Group className="mb-3" controlId="renderLogin.loginButton">

            <Button 
              variant="primary" 
              type="submit"
              onClick={this.focusInput}
            >
              Login
            </Button> 
            
          </Form.Group>

        </Form>

      </div>  
    );
  }
}
 
export default LoginForm;
