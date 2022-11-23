import '../index.css';

import React from 'react';
import Joi from "joi"
import Cookies from 'js-cookie';

import Form from 'react-bootstrap/Form'; 
import Button from 'react-bootstrap/Button'; 
import CreateValidator from './validate.js';
import UserDataService from "../services/userDataService";

import { FaSignInAlt } from "react-icons/fa";

let x = 1;

const registerSchema = Joi.object().keys({

  email: Joi.string().email({ tlds: { allow: false } , minDomainSegments: 2 }).trim().required(),
  password: Joi.string().trim().min(8).required().min(8).max(25)
                  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,'password'),
  firstName: Joi.string().min(1).trim().required(),
  lastName: Joi.string().min(1).trim().required()

});

const validationOptions = {
  abortEarly: false  // abort after the last validation error
  // allowUnknown: true, // allow unknown keys that will be ignored
  // stripUnknown: true  // remove unknown keys from the validated data
};

class RegisterForm extends React.Component {
  
  constructor(props) {
    
    super(props);

    this.registerUser = this.registerUser.bind(this);

    this.emailInput = React.createRef();
    this.passwordInput = React.createRef();
    this.firstNameInput = React.createRef();
    this.lastNameInput = React.createRef();

    this.validObj = null;

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

  async registerUser(event, props, ref) { 

    event.preventDefault();

    let emailTxt = this.emailInput.current.value;
    let passTxt = this.passwordInput.current.value;
    let firstNameTxt = this.firstNameInput.current.value;
    let lastNameTxt = this.lastNameInput.current.value;

    let userRegistrationObj = {email: emailTxt, password: passTxt, firstName: firstNameTxt, lastName: lastNameTxt};
    
    registerSchema.validate(userRegistrationObj, registerSchema, validationOptions, (err, data) => {
      if (err) {
        // Joi Error
        const JoiError = {
          status: 'failed',
          error: {
            original: err._object,
            // fetch only message and type from each error
            details: _.map(err.details, ({message, type}) => ({
              message: message.replace(/['"]/g, ''),
              type
            }))
          }
        };

        // Custom Error
        const CustomError = {
          status: 'failed',
          error: 'Invalid request data. Please review request and try again.'
        };

        // Send back the error response
        console.log(JoiError);
        console.log(CustomError);

      } else {
        // Replace userRegistrationObj with the data after Joi validation
        userRegistrationObj = data;
      }
    });

    userRegistrationObj.role = null;

    let uds = new UserDataService(userRegistrationObj); 

    uds.Register.then( response => { 
      return response;
    }).catch( e =>{ 
      console.log(e); 
    }) 

  } 
  

  // Render HTML:
  render() {

        return (
          <div>
    
          <body className=''>
  
            <h1 className="pt-3 ms-3">User Registration  <FaSignInAlt id="register1" className="ms-2"/></h1>
    
            <Form className="mt-3 ms-3 me-3" onSubmit={ this.registerUser }>
    
              <Form.Group className="mb-3 me-3" controlId="renderLogin.userCredentials">
    
                <Form.Label className='font-weight-bold ps-1'>Email Address</Form.Label>
                <Form.Control className="mb-1" type="email" placeholder="name@example.com" controlId="emailInput" ref={ this.emailInput } />
    
                <Form.Label className="font-weight-bold mt-2 ps-1">Password</Form.Label>
                <Form.Control className="pb-2" type="password" controlId="passwordInput" id="passwordTxt" ref={ this.passwordInput } />
    
                <Form.Label className="font-weight-bold mt-2 ps-1">First Name</Form.Label>
                <Form.Control className="pb-2" type="text" controlId="firstNameInput" id="firstNameTxt" ref={ this.firstNameInput } />
    
                <Form.Label className="font-weight-bold mt-2 ps-1">Last Name</Form.Label>
                <Form.Control className="pb-2" type="text" controlId="lastNameInput" id="lastNameTxt" ref={ this.lastNameInput } />
    
              </Form.Group>
    
              <a className='d-block pb-2 ps-1' href='/#'>Forgot your password?</a>           
    
              <Form.Group className="mb-3" controlId="renderLogin.loginButton">
    
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

 
export default RegisterForm;
