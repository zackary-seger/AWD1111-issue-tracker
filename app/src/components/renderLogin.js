import React from 'react';

import Form from 'react-bootstrap/Form'; 
import Button from 'react-bootstrap/Button'; 
// import Col from 'react-bootstrap/Col'; 
// import Row from 'react-bootstrap/Row'; 
// import Container from 'react-bootstrap/Container';

import BugDataService from "../services/bugDataService" 

import { useHistory } from "react-router-dom";

let loginCreds;
let savedToken;
let x = 1;

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
    if (x !== 1) {
      this.focusInput.current.focus();
    } else {
      x++;
    }

    // this.emailInput.current.focus();
    // this.passwordInput.current.focus();

  }

  async loginUser(event, props, ref) { 

    event.preventDefault();

    // const formData = new FormData();

    // console.log('this.emailInput object: ' + JSON.stringify(this.emailInput));

    // formData.append('email', this.emailInput.current.value);
    // formData.append('password', this.passwordInput.current.value);

    // loginCreds = Object.fromEntries(formData.entries());

    // console.log('credentials object: ' + JSON.stringify(loginCreds));


    let emailTxt = this.emailInput.current.value;
    let passTxt = this.passwordInput.current.value;
    
    console.log('\n');
    console.log('emailTxt: ' + emailTxt + '  |  passTxt: ' + passTxt);
    console.log('\n');

    let bds = new BugDataService(emailTxt, passTxt); 

    bds.login().then( response => { 

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

        <Form className="mt-3 me-3" onSubmit={ this.loginUser }>

          <Form.Group className="mb-3 me-3" controlId="renderLogin.userCredentials">

            <Form.Label>Email address</Form.Label>
            <Form.Control className="" type="email" placeholder="name@example.com" controlId="emailInput" ref={this.emailInput} />

            <Form.Label>Password</Form.Label>
            <Form.Control className="" type="password" controlId="passwordInput" ref={this.passwordInput} />

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
