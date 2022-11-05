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

  }

  loginUser(event) { 

    event.preventDefault();

    const formData = new FormData();

    console.log(this.emailInput.current);

    formData.append('email', this.emailInput.current[0]);
    formData.append('password', this.passwordInput.current[0]);

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
            <Form.Control type="email" placeholder="name@example.com" controlId="emailInput" inputRef={(ref) => {this.emailInput.current = ref}} />

            <Form.Label>Password</Form.Label>
            <Form.Control type="password" controlId="passwordInput" inputRef={(ref) => {this.passwordInput.current = ref}} />

          </Form.Group>

          <Form.Group className="mb-3" controlId="renderLogin.loginButton">

            <Button 
              variant="primary" 
              type="submit"
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
