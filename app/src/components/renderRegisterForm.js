import React, {useState, useCallback, useEffect } from 'react' 

import Form from 'react-bootstrap/Form'; 
import Button from 'react-bootstrap/Button'; 
import * as ReactDOM from 'react-dom/client';
import UserDataService from '../services/userDataService';
import LoginForm from './renderLogin';
import Joi from "joi"
import { isNewUserSave } from './renderLogin';
import { z } from './register';

const registerSchema = Joi.object().keys({

  email: Joi.string().email({ tlds: { allow: false } , minDomainSegments: 2 }).trim().required(),
  password: Joi.string().trim().min(8).required().min(8).max(25)
                  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,'password'),
  firstName: Joi.string().min(1).trim().required(),
  lastName: Joi.string().min(1).trim().required()

});

let y = 0;
let x = 1;

let isCancelledSave = false;
let isRendered = false;

function RenderRF() {

  const [isNewUser, setIsNewUser] = useState(isNewUserSave);
  const [isCancelled, setIsCancelled] = useState(false);
  
  const emailInputRef = React.createRef();
  const passwordInputRef = React.createRef();
  const firstNameInputRef = React.createRef();
  const lastNameInputRef = React.createRef();
  
  console.log('\n');
  console.log(`isNewUser prop: ${isNewUser}`);
  console.log(`isRendered prop: ${isRendered}`);
  console.log(`isCancelled prop: ${isCancelled}`);
  console.log('\n');

  let FocusInput = () => {

      // ??? Explicitly focus the text input using the raw DOM API
      // Note: we're accessing "current" to get the DOM node.. ???

      if (x !== 1) {
        if (FocusInput.current) {
          FocusInput.current.focus();
        }
      } else {
        x++;
      }
  }
  FocusInput = FocusInput.bind(this);

  if ( z > 1 || ( isRendered === false && isCancelled === false )) {

    const body = ReactDOM.createRoot(document.getElementById('body'));

    if ( z > 1 ) {
      return body.render( 
    
        <body className='mb-2'>
  
        <h1 className="pt-3 ms-3">User Registration</h1>
  
        <Form className="mt-3 ms-3 me-3" onSubmit={ evt => {SubmitRegistration(evt)} }>
  
        <Form.Group className="me-3" controlId="renderLogin.userCredentials">
  
          <Form.Label className='font-weight-bold ps-1'>Email Address</Form.Label>
          <Form.Control className="mb-1" type="email" placeholder="name@example.com" controlId="emailInput" ref={ emailInputRef } />
  
          <Form.Label className="font-weight-bold mt-2 ps-1">Password</Form.Label>
          <Form.Control className="pb-2" type="password" controlId="passwordInput" id="passwordTxt" ref={ passwordInputRef } />
  
          <Form.Label className="font-weight-bold mt-2 ps-1">First Name</Form.Label>
          <Form.Control className="pb-2" type="text" controlId="firstNameInput" id="firstNameTxt" ref={ firstNameInputRef } />
  
          <Form.Label className="font-weight-bold mt-2 ps-1">Last Name</Form.Label>
          <Form.Control className="pb-2" type="text" controlId="lastNameInput" id="lastNameTxt" ref={ lastNameInputRef } />
  
        </Form.Group>      
  
        <Form.Group className="mb-2" controlId="renderLogin.loginButton">
  
          <Button 
            variant="primary" 
            type="submit"
            onClick={ this.FocusInput }
            className="d-inline-block me-2 registrationButtons"
            id="registerBtn"
          >
            Register
          </Button> 
  
          <Button 
            variant="primary"
            onClick={ () => { console.log('2nd Cancel.. Refreshing..') } } 
            href='/'
            className="d-inline-block mb-4 mt-4 registrationButtons"
            id="cancelBtn"
          >
            Cancel
          </Button> 
          
        </Form.Group>
  
      </Form>
  
        </body>
  
      );
    } else {

      return body.render( 
    
        <body className='mb-2'>
  
        <h1 className="pt-3 ms-3">User Registration</h1>
  
        <Form className="mt-3 ms-3 me-3" onSubmit={ evt => {SubmitRegistration(evt)} }>
  
        <Form.Group className="me-3" controlId="renderLogin.userCredentials">
  
          <Form.Label className='font-weight-bold ps-1'>Email Address</Form.Label>
          <Form.Control className="mb-1" type="email" placeholder="name@example.com" controlId="emailInput" ref={ emailInputRef } />
  
          <Form.Label className="font-weight-bold mt-2 ps-1">Password</Form.Label>
          <Form.Control className="pb-2" type="password" controlId="passwordInput" id="passwordTxt" ref={ passwordInputRef } />
  
          <Form.Label className="font-weight-bold mt-2 ps-1">First Name</Form.Label>
          <Form.Control className="pb-2" type="text" controlId="firstNameInput" id="firstNameTxt" ref={ firstNameInputRef } />
  
          <Form.Label className="font-weight-bold mt-2 ps-1">Last Name</Form.Label>
          <Form.Control className="pb-2" type="text" controlId="lastNameInput" id="lastNameTxt" ref={ lastNameInputRef } />
  
        </Form.Group>      
  
        <Form.Group className="mb-2" controlId="renderLogin.loginButton">
  
          <Button 
            variant="primary" 
            type="submit"
            onClick={ this.FocusInput }
            className="d-inline-block me-2 registrationButtons"
            id="registerBtn"
          >
            Register
          </Button> 
  
          <Button 
            variant="primary" 
            onClick={ () => { isRendered = true;   
                              if ( y++ === 0) {
                                  setIsNewUser(() => { return false; });
                                  const lf = new LoginForm();
                                  lf.reRender();
                              }       
                            }
                    }
            className="d-inline-block mb-4 mt-4 registrationButtons"
            id="cancelBtn"
          >
            Cancel
          </Button> 
          
        </Form.Group>
  
      </Form>
  
        </body>
  
      );
    }

  } 

  const SubmitRegistration = () => {

    let emailTxt = emailInputRef;
    let passTxt = passwordInputRef;
    let firstNameTxt = firstNameInputRef;
    let lastNameTxt = lastNameInputRef;

    let joiObj = registerSchema.validate({email: emailTxt, password: passTxt, firstName: firstNameTxt, lastName: lastNameTxt});

    let uds = new UserDataService(joiObj.value['email'], joiObj.value['password'],  joiObj.value['firstName'], joiObj.value['lastName']); 
    
    if (uds) {
      uds.RegisterUser(uds).then( response => { 
        return response;
      }).catch( e =>{ 
        console.log(e); 
      }) 
    }

  } 

  isCancelledSave = isCancelled;
}

export {isRendered, isCancelledSave}
export default RenderRF;