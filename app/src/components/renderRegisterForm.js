import React, {useState, useCallback, useEffect } from 'react' 

import Form from 'react-bootstrap/Form'; 
import Button from 'react-bootstrap/Button'; 
import UserDataService from '../services/userDataService';
import LoginForm from './renderLogin';
import Joi from "joi"

import CreateValidator from './validate.js';

const registerSchema = Joi.object().keys({

  email: Joi.string().email({ tlds: { allow: false } , minDomainSegments: 2 }).trim().required(),
  password: Joi.string().trim().min(8).required().min(8).max(25)
                  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,'password'),
  firstName: Joi.string().min(1).trim().required(),
  lastName: Joi.string().min(1).trim().required()

});

let x = 1;

function RenderRF(...props) {

  const [isNewUser, setIsNewUser] = useState([]);
  const [isCancelled, setIsCancelled] = useState([]);
  const emailInputRef = React.createRef();
  const passwordInputRef = React.createRef();
  const firstNameInputRef = React.createRef();
  const lastNameInputRef = React.createRef();

  setIsNewUser(props.isNewUser);
  setIsCancelled(false);

  console.log(`isNewUser prop: ${isNewUser}`)

  const FocusInput = () => {

    // Explicitly focus the text input using the raw DOM API
    // Note: we're accessing "current" to get the DOM node
    if (x !== 1) {
      this.FocusInput.current.focus();
    } else {
      x++;
    }
  }

  const RegisterUser = async (event, props, ref) => { 

    event.preventDefault();

    let emailTxt = emailInputRef;
    let passTxt = passwordInputRef;
    let firstNameTxt = firstNameInputRef;
    let lastNameTxt = lastNameInputRef;

    const validator = CreateValidator;
    let joiObj = registerSchema.validate({email: emailTxt, password: passTxt, firstName: firstNameTxt, lastName: lastNameTxt});

    let uds = new UserDataService(joiObj.value['email'], joiObj.value['password'],  joiObj.value['firstName'], joiObj.value['lastName']); 

    uds.registerUser(uds).then( response => { 
      return response;
    }).catch( e =>{ 
      console.log(e); 
    }) 
    
  } 

  if (isNewUser) {

    return ( <body className='mb-2'>

                <h1 className="pt-3 ms-3">User Registration</h1>
            
                <Form className="mt-3 ms-3 me-3" onSubmit={ evt => {RegisterUser(evt)} }>
            
                  <Form.Group className="mb-3 me-3" controlId="renderLogin.userCredentials">
            
                    <Form.Label className='font-weight-bold ps-1'>Email Address</Form.Label>
                    <Form.Control className="mb-1" type="email" placeholder="name@example.com" controlId="emailInput" ref={ emailInputRef } />
            
                    <Form.Label className="font-weight-bold mt-2 ps-1">Password</Form.Label>
                    <Form.Control className="pb-2" type="password" controlId="passwordInput" id="passwordTxt" ref={ passwordInputRef } />
            
                    <Form.Label className="font-weight-bold mt-2 ps-1">First Name</Form.Label>
                    <Form.Control className="pb-2" type="text" controlId="firstNameInput" id="firstNameTxt" ref={ firstNameInputRef } />
            
                    <Form.Label className="font-weight-bold mt-2 ps-1">Last Name</Form.Label>
                    <Form.Control className="pb-2" type="text" controlId="lastNameInput" id="lastNameTxt" ref={ lastNameInputRef } />
            
                  </Form.Group>      
            
                  <Form.Group className="mb-3" controlId="renderLogin.loginButton">
            
                    <Button 
                      variant="primary" 
                      type="submit"
                      onClick={ FocusInput() }
                      className="d-inline-block mt-2 mb-4"
                      id="registerBtn"
                    >
                      Register
                    </Button> 

                    <Button 
                      variant="primary" 
                      onClick={ setIsCancelled(true) }
                      className="d-inline-block mt-2 mb-4"
                      id="cancelBtn"
                    >
                      Cancel
                    </Button> 
                    
                  </Form.Group>
            
                </Form>

    </body>

  )}

  if (isCancelled) {
    <LoginForm isNewUser={false} />
  }

}

export default RenderRF