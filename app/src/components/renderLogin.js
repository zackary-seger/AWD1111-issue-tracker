import React from 'react';
import Joi from "joi"

import Form from 'react-bootstrap/Form'; 
import Button from 'react-bootstrap/Button'; 
// import Col from 'react-bootstrap/Col'; 
// import Row from 'react-bootstrap/Row'; 
// import Container from 'react-bootstrap/Container';
import CreateValidator from './validate.js'

import RenderNavbar from './navbar'
import BugDataService from "../services/bugDataService"
import { useHistory } from "react-router-dom";

let x = 1;

const history = (useHistory);

const loginSchema = Joi.object().keys({
  username: Joi.string().required(),
  password: Joi.string().min(8).required()
});

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
    
    let joiObj = loginSchema.validate({email: emailTxt, password: passTxt});

    console.log('\n');
    console.log('emailTxt: ' + joiObj.value['email'] + '  |  passTxt: ' + joiObj.value['password']);
    console.log('\n');

    let bds = new BugDataService(joiObj.value['email'], joiObj.value['password']); 

    let bdsResp = bds.login().then( response => { 

      console.log('response: ' + response); 
      return response;

    }).catch( e =>{ 
      console.log(e); 
    }) 

    console.log('response/savedToken: ' + bdsResp); 

    // if ( bdsResp !== null ) {
    //   history("/bugList", { replace: true });
    // } else {
    //   console.log({ error: 'Invalid Credentials. Please Try Again.. (' + x + ' attempts remaining)' });
    //   x--;
    // }
    
  } 
  

  // Render HTML:
  
  render() {

    const validator = CreateValidator; 
    // RenderNavbar(); // ??? Check this out.. ??? <----- Not doing anything??  

    return (
      <div>

        <h1 className="mt-3">User Login</h1>

        <Form className="mt-3 me-3" onSubmit={ this.loginUser }>

          <Form.Group className="mb-3 me-3" controlId="renderLogin.userCredentials">

            <Form.Label>Email address</Form.Label>
            <Form.Control onChange={ validator.updateEmail } className="" type="email" placeholder="name@example.com" controlId="emailInput" ref={ this.emailInput } />

            <Form.Label className="mt-2">Password</Form.Label>
            <Form.Control onChange={ validator.updatePassword } className="" type="password" controlId="passwordInput" ref={ this.passwordInput } />

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
