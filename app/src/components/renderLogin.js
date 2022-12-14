import React from 'react';
import Joi from "joi"
import Cookies from 'js-cookie';
import * as ReactDOM from 'react-dom/client';

import Form from 'react-bootstrap/Form'; 
import Button from 'react-bootstrap/Button'; 
import CreateValidator from './validate.js';
import '../index.css';

import BugDataService from "../services/bugDataService";
import RegisterForm from "./register.js";

import { isCancelledSave } from './renderRegisterForm.js';

let x = 1;
let y = 0;
let isNewUserSave;
let rendered = true;

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
    this._IsRendered = 0;

    this.focusInput = this.focusInput.bind(this);

  }

  focusInput() {

    // Explicitly focus the text input using the raw DOM API
    // Note: we're accessing "current" to get the DOM node
    if (this.focusInput.current) {
      if (x !== 1) {
        this.focusInput.current.focus();
      } else {
        x++;
      }
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

  reRender() {

    if (rendered) {
      
      const validator = CreateValidator;

      const body = ReactDOM.createRoot(document.getElementById('body'));
      return body.render(
  
        <div>
  
        <body id='body' className=''>

          <h1 className="pt-3 ms-3">User Login </h1>

          <Form className="mt-3 ms-3 me-3" onSubmit={ this.loginUser }>

            <Form.Group className="mb-3 me-3" controlId="renderLogin.userCredentials">

              <Form.Label className='font-weight-bold ps-1'>Email Address</Form.Label>
              <Form.Control onChange={ validator.updateEmail } className="mb-1" type="email" placeholder="name@example.com" controlId="emailInput" ref={ this.emailInput } />

              <Form.Label className="font-weight-bold mt-2 ps-1">Password</Form.Label>
              <Form.Control onChange={ validator.updatePassword } className="pb-2" type="password" controlId="passwordInput" id="passwordTxt" ref={ this.passwordInput } />

            </Form.Group>

            <Form.Group className="mt-2 mb-3" controlId="renderLogin.loginButton">

              <Button 
                variant="primary" 
                type="submit"
                onClick={this.focusInput}
                className="mt-2"
                id="loginBtn"
              >
                Login
              </Button> 
              
            </Form.Group>

            <a className='pb-2 ps-1' href='/#'>Forgot your password?</a>         
            <p className='d-block mb-0 mt-2 ps-1'>New to boatborrowers.com?</p>
            <a className='d-inline-block mb-3 ms-2 ps-1' onClick={e => {   
                                                            y++;
                                                            e.preventDefault(); 
                                                            console.log(this._IsNewUser); 
                                                            this.set_IsNewUser();
                                                            isNewUserSave = this._IsNewUser;
                                                            let rf = new RegisterForm(isNewUserSave, y);                                                        
                                                            rf.renderConditionalUserRegistration();
                                                        }
                                                        } href='/#'>
              Register Here!
            </a> 


          </Form>
        </body>
        </div>  
      );

    }

  }


  // Render HTML:

  render() {

    const validator = CreateValidator;
    rendered = true;
    return (
      <div>

      <body id='body' className=''>

        <h1 className="pt-3 ms-3">User Login </h1>

        <Form className="mt-3 ms-3 me-3" onSubmit={ this.loginUser }>

          <Form.Group className="mb-3 me-3" controlId="renderLogin.userCredentials">

            <Form.Label className='font-weight-bold ps-1'>Email Address</Form.Label>
            <Form.Control onChange={ validator.updateEmail } className="mb-1" type="email" placeholder="name@example.com" controlId="emailInput" ref={ this.emailInput } />

            <Form.Label className="font-weight-bold mt-2 ps-1">Password</Form.Label>
            <Form.Control onChange={ validator.updatePassword } className="pb-2" type="password" controlId="passwordInput" id="passwordTxt" ref={ this.passwordInput } />

          </Form.Group>

          <Form.Group className="mt-2 mb-3" controlId="renderLogin.loginButton">

            <Button 
              variant="primary" 
              type="submit"
              onClick={this.focusInput}
              className="mt-2"
              id="loginBtn"
            >
              Login
            </Button> 
            
          </Form.Group>

          <a className='pb-2 ps-1' href='/#'>Forgot your password?</a>         
          <p className='d-block mb-0 mt-2 ps-1'>New to boatborrowers.com?</p>
          <a className='d-inline-block mb-3 ms-2 ps-1' onClick={e => {   
                                                          y++;
                                                          e.preventDefault(); 
                                                          console.log(this._IsNewUser); 
                                                          this.set_IsNewUser();
                                                          isNewUserSave = this._IsNewUser;
                                                          let rf = new RegisterForm(isNewUserSave, y);                                                        
                                                          rf.renderConditionalUserRegistration();
                                                      }
                                                      } href='/#'>
            Register Here!
          </a> 


        </Form>
      </body>
      </div>  
    );

  }


}

export { isNewUserSave };
export default LoginForm;
