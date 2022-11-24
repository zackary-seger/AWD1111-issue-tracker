import React from 'react';
import Joi from "joi"
import Cookies from 'js-cookie';

import Form from 'react-bootstrap/Form'; 
import Button from 'react-bootstrap/Button'; 
import CreateValidator from './validate.js';
import '../index.css';

import BugDataService from "../services/bugDataService";
import RegisterForm from "./register.js";

import { FaSignInAlt } from "react-icons/fa";

let x = 1;
let isNewUserSave;

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
    this._IsNewUser = false;

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

  }

  async loginUser(event, props, ref) { 

    event.preventDefault();

    let emailTxt = this.emailInput.current.value;
    let passTxt = this.passwordInput.current.value;
    
    let joiObj = loginSchema.validate({email: emailTxt, password: passTxt});

    let bds = new BugDataService(joiObj.value['email'], joiObj.value['password']); 

    bds.login().then( response => { 
      return response;
    }).catch( e =>{ 
      console.log(e); 
    }) 

    this.state = { authToken: Cookies.get() }
    
  } 

  set_IsNewUser() {
    return this._IsNewUser = true
  }

  // Render HTML:

  render() {

    const validator = CreateValidator;
    let isNewUserBool = this._IsNewUser;
    console.log(`renderLogin isNewUser Prop Entry: ${isNewUserBool}`)
    
    return (
      <div>

      <body className=''>
        <h1 className="pt-3 ms-3">User Login  <FaSignInAlt id="signIn1" className="ms-2"/></h1>

        <Form className="mt-3 ms-3 me-3" onSubmit={ this.loginUser }>

          <Form.Group className="mb-3 me-3" controlId="renderLogin.userCredentials">

            <Form.Label className='font-weight-bold ps-1'>Email Address</Form.Label>
            <Form.Control onChange={ validator.updateEmail } className="mb-1" type="email" placeholder="name@example.com" controlId="emailInput" ref={ this.emailInput } />

            <Form.Label className="font-weight-bold mt-2 ps-1">Password</Form.Label>
            <Form.Control onChange={ validator.updatePassword } className="pb-2" type="password" controlId="passwordInput" id="passwordTxt" ref={ this.passwordInput } />

          </Form.Group>

          <a className='pb-2 ps-1' href='/#'>Forgot your password?</a>         
          <p className='d-block mb-0 mt-2 ps-1'>New to boatborrowers.com?</p>
          <a className='ms-2 mb-2 ps-1' onClick={e => {   

                                                          e.preventDefault(); 
                                                          console.log(this._IsNewUser); 
                                                          this.set_IsNewUser();
                                                          isNewUserSave = this._IsNewUser;
                                                          rf = new RegisterForm();
                                                          return <rf />
                                                          
                                                      }
                                                      } href='/#'>
            Register Here!
          </a> 

          <Form.Group className="mt-2 mb-3" controlId="renderLogin.loginButton">

            <Button 
              variant="primary" 
              type="submit"
              onClick={this.focusInput}
              className="mt-2 mb-4"
              id="loginBtn"
            >
              Login
            </Button> 
            
          </Form.Group>

        </Form>
      </body>
      </div>  
    );

  }
}

export { isNewUserSave };
export default LoginForm;
